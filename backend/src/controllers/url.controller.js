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
      console.log('🚨 POST /api/urls - Creating short URL');
      console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
      console.log('👤 User:', req.user ? req.user.email || req.user._id : 'anonymous');
      
      const { url, keywords = [], customSlug, expiryClicks = 10, domain } = req.body;

      // Validate URL
      if (!url) {
        console.error('❌ Validation failed: URL is required');
        return res.status(400).json({ 
          success: false,
          error: 'URL is required' 
        });
      }

      try {
        new URL(url);
        console.log('✅ URL validation passed:', url);
      } catch (urlError) {
        console.error('❌ Validation failed: Invalid URL format:', urlError.message);
        return res.status(400).json({ 
          success: false,
          error: 'Invalid URL format' 
        });
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

      const userDomain = (domain && req.user) ? await domainService.getDomainForUser(req.user.id, domain) : null; 
      // Enhanced base URL logic with better fallbacks
      let baseUrl = 'https://dashdig.com'; // Default fallback
      
      if (userDomain) {
        baseUrl = `https://${userDomain.domain}`;
      } else if (process.env.BASE_URL) {
        baseUrl = process.env.BASE_URL;
      } else if (process.env.FRONTEND_URL) {
        baseUrl = process.env.FRONTEND_URL;
      } else if (process.env.NODE_ENV === 'production') {
        baseUrl = 'https://dashdig.com';
      } else {
        baseUrl = 'http://localhost:3000';
      }
      
      console.log('🔗 Base URL used:', baseUrl);
      
      const fullUrl = `${baseUrl}/${slug}`;
      const qrCode = await QRCode.toDataURL(fullUrl, {
        width: 500,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Handle userId for both authenticated and anonymous users
      let userId;
      if (req.user && (req.user._id || req.user.id)) {
        userId = req.user._id || req.user.id;
      } else {
        // For anonymous users, use null instead of creating random ObjectIds
        userId = null;
      }

      const urlDoc = new Url({
        shortCode: slug,
        originalUrl: url,
        userId: userId,
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
      console.log('✅ URL document saved to MongoDB:', urlDoc._id);

      const redis = getRedis();
      if (redis) {
        try {
          await redis.set(`url:${slug}`, JSON.stringify({
            originalUrl: url,
            metadata
          }), 'EX', 3600);
          console.log('✅ URL cached in Redis');
        } catch (error) {
          console.warn('⚠️ Redis cache failed:', error.message);
        }
      }

      console.log(`✅ Created short URL: ${fullUrl} → ${url}`);
      console.log('📊 Full response data:', {
        shortUrl: fullUrl,
        slug,
        hasQrCode: !!qrCode,
        hasMetadata: !!metadata.title,
        expiresAfter: expiryClicks ? expiryClicks + ' clicks' : 'Never'
      });

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
      console.error('❌ Create URL Error:', error);
      console.error('   Error type:', error.name);
      console.error('   Error message:', error.message);
      console.error('   Stack trace:', error.stack);
      
      res.status(500).json({ 
        success: false,
        error: 'Failed to create short URL',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
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
      // Check if user is authenticated
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Authentication required to view your URLs' });
      }

      const urls = await Url.find({ 
        isActive: true,
        userId: req.user.id 
      })
        .sort({ createdAt: -1 })
        .limit(20)
        .select('-qrCode');

      // Use same base URL logic as createShortUrl
      let baseUrl = 'https://dashdig.com'; // Default fallback
      
      if (process.env.BASE_URL) {
        baseUrl = process.env.BASE_URL;
      } else if (process.env.FRONTEND_URL) {
        baseUrl = process.env.FRONTEND_URL;
      } else if (process.env.NODE_ENV === 'production') {
        baseUrl = 'https://dashdig.com';
      } else {
        baseUrl = 'http://localhost:3000';
      }

      // Calculate total clicks across all URLs
      const totalClicks = urls.reduce((sum, u) => sum + (u.clicks.count || 0), 0);

      res.json({
        urls: urls.map(u => ({
          _id: u._id,
          shortCode: u.shortCode,
          shortUrl: `${baseUrl}/${u.shortCode}`,
          originalUrl: u.originalUrl,
          clicks: u.clicks.count,
          createdAt: u.createdAt
        })),
        totalClicks: totalClicks
      });
    } catch (error) {
      console.error('Get URLs Error:', error);
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