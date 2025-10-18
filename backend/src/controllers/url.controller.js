const Url = require('../models/Url');
const aiService = require('../services/ai.service');
const domainService = require('../services/domain.service');
const analyticsService = require('../services/analytics.service');
const QRCode = require('qrcode');
const { getRedis } = require('../config/redis');
const mongoose = require('mongoose');

const trackClick = async (shortCode, req = null) => {
  try {
    const normalizedCode = typeof shortCode === 'string'
      ? shortCode.toLowerCase().trim()
      : '';

    if (!normalizedCode) return;

    // Increment Redis counter for fast counting
    const redis = getRedis();
    if (redis) {
      try {
        await redis.incr(`url:clicks:${normalizedCode}`);
        // Add to trending URLs sorted set
        await redis.zadd('trending:urls', Date.now(), normalizedCode);
      } catch (error) {
        console.warn('Redis click tracking failed:', error.message);
      }
    }

    if (req) {
      // Full analytics tracking with details
      await analyticsService.trackClick(normalizedCode, req);
      
      // Also update URL document with click details
      const clickDetail = {
        timestamp: new Date(),
        ip: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent') || '',
        referrer: req.get('Referer') || req.get('Referrer') || 'direct'
      };
      
      await Url.findOneAndUpdate(
        { shortCode: normalizedCode },
        { 
          $inc: { 'clicks.total': 1, 'clicks.count': 1 },
          $set: { 'clicks.lastClickedAt': new Date() },
          $push: { 
            'clicks.details': {
              $each: [clickDetail],
              $slice: -100 // Keep only last 100 click details
            }
          }
        }
      );
    } else {
      // Simple click increment without details
      await Url.findOneAndUpdate(
        { shortCode: normalizedCode },
        { 
          $inc: { 'clicks.total': 1, 'clicks.count': 1 },
          $set: { 'clicks.lastClickedAt': new Date() }
        }
      );
    }
  } catch (error) {
    console.error('Click tracking error:', error);
  }
};

class UrlController {
  async createShortUrl(req, res) {
    try {
      const { url, keywords = [], customSlug, expiryClicks = 10, domain } = req.body;

      try {
        new URL(url);
      } catch {
        return res.status(400).json({ error: 'Invalid URL' });
      }

      // Fetch metadata for the URL
      let metadata = { title: '', description: '', image: '' };
      try {
        metadata = await aiService.fetchMetadata(url);
      } catch (error) {
        console.warn('Failed to fetch metadata:', error.message);
      }

      let slug = customSlug;
      if (!slug) {
        slug = await aiService.generateHumanReadableUrl(url, keywords);
        
        let attempts = 0;
        while (await Url.findOne({ shortCode: slug.toLowerCase() }) && attempts < 5) {
          slug = `${slug}.${Date.now().toString(36).slice(-2)}`;
          attempts++;
        }
      }

      slug = slug.toLowerCase().trim();

      const userDomain = domain ? await domainService.getDomainForUser(req.user.id, domain) : null;
      const baseUrl = userDomain ? `https://${userDomain.domain}` : (process.env.BASE_URL || process.env.FRONTEND_URL || 'https://dashdig.com');
      
      const fullUrl = `${baseUrl}/${slug}`;
      const qrCode = await QRCode.toDataURL(fullUrl, {
        width: 500,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      const urlDoc = new Url({
        shortCode: slug,
        originalUrl: url,
        userId: req.user._id || req.user.id,
        keywords,
        metadata,
        qrCode,
        domain: userDomain ? userDomain.domain : null,
        clicks: {
          total: 0,
          count: 0,
          limit: expiryClicks || null,
          details: []
        },
        expires: {
          at: null,
          afterClicks: expiryClicks || null
        },
        customizable: true
      });

      await urlDoc.save();

      const redis = getRedis();
      if (redis) {
        try {
          await redis.set(`url:${slug}`, JSON.stringify({
            originalUrl: url,
            metadata
          }), 'EX', 3600);
        } catch (error) {
          console.warn('Redis cache failed:', error.message);
        }
      }

      console.log(`✅ Created: ${fullUrl} → ${url}`);

      res.status(201).json({
        success: true,
        data: {
          shortUrl: fullUrl,
          slug,
          qrCode,
          metadata,
          expiresAfter: expiryClicks ? expiryClicks + ' clicks' : 'Never'
        }
      });

    } catch (error) {
      console.error('Create URL Error:', error);
      res.status(500).json({ error: 'Failed to create short URL' });
    }
  }

  async redirect(req, res) {
    try {
      const rawSlug = req.params.code || req.params.slug || req.params.shortCode || req.path.substring(1);
      const slug = rawSlug ? rawSlug.toLowerCase().trim() : '';
      
      console.log('==========================================');
      console.log('[SLUG LOOKUP] Received:', slug);
      console.log('[SLUG LOOKUP] Time:', new Date().toISOString());
      console.log('[SLUG LOOKUP] Raw params:', req.params);
      console.log('[SLUG LOOKUP] Request path:', req.path);
      
      if (!slug || slug.length === 0) {
        console.log('[SLUG LOOKUP] ERROR: Empty slug');
        return res.status(400).send('Invalid URL');
      }

      const redis = getRedis();
      
      if (redis) {
        try {
          const cached = await redis.get(`url:${slug}`);
          if (cached) {
            const data = JSON.parse(cached);
            
            const urlDoc = await Url.findOne({ shortCode: slug, isActive: true });
            if (!urlDoc || urlDoc.hasExpired()) {
              await redis.del(`url:${slug}`);
            } else {
              setImmediate(() => trackClick(slug, req));
              return res.redirect(301, data.originalUrl);
            }
          }
        } catch (error) {
          console.warn('Redis cache read failed:', error.message);
        }
      }

      const urlDoc = await Url.findOne({ 
        shortCode: slug, 
        isActive: true 
      });

      console.log('[SLUG LOOKUP] Found:', urlDoc ? 'YES' : 'NO');
      if (urlDoc) {
        console.log('[SLUG LOOKUP] Redirecting to:', urlDoc.originalUrl);
      } else {
        console.log('[SLUG LOOKUP] ERROR: Not in database:', slug);
      }

      if (!urlDoc) {
        return res.status(404).send('URL not found');
      }

      if (urlDoc.hasExpired()) {
        return res.status(410).send('This link has expired');
      }

      await trackClick(slug, req);

      if (redis) {
        try {
          await redis.setex(
            `url:${slug}`,
            3600,
            JSON.stringify({
              originalUrl: urlDoc.originalUrl,
              clicks: urlDoc.clicks.count + 1
            })
          );
        } catch (error) {
          console.warn('Redis cache update failed:', error.message);
        }
      }

      res.redirect(301, urlDoc.originalUrl);

    } catch (error) {
      console.error('Redirect Error:', error);
      res.status(500).send('Server error');
    }
  }

  async getAllUrls(req, res) {
    try {
      const urls = await Url.find({ 
        isActive: true,
        userId: req.user.id 
      })
        .sort({ createdAt: -1 })
        .limit(20)
        .select('-qrCode');

      res.json({
        success: true,
        count: urls.length,
        urls: urls.map(u => ({
          _id: u._id,
          shortCode: u.shortCode,
          shortUrl: `${process.env.BASE_URL || process.env.FRONTEND_URL || 'https://dashdig.com'}/${u.shortCode}`,
          originalUrl: u.originalUrl,
          clicks: u.clicks.count,
          createdAt: u.createdAt
        }))
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch URLs' });
    }
  }
}

const urlController = new UrlController();

module.exports = {
  createShortUrl: urlController.createShortUrl.bind(urlController),
  getAllUrls: urlController.getAllUrls.bind(urlController),
  redirect: urlController.redirect.bind(urlController),
  trackClick
};
