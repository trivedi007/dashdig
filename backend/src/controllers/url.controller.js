const Url = require('../models/Url');
const aiService = require('../services/ai.service');
const domainService = require('../services/domain.service');
const QRCode = require('qrcode');
const { getRedis } = require('../config/redis');

// Standalone function for tracking clicks
const trackClick = async (shortCode) => {
  try {
    const redis = getRedis();
    
    // Increment Redis counter (if available)
    if (redis) {
      try {
        await redis.incr(`clicks:${shortCode}`);
      } catch (error) {
        console.warn('Redis click tracking failed:', error.message);
      }
    }
    
    // Update database
    await Url.findOneAndUpdate(
      { shortCode },
      { 
        $inc: { 'clicks.count': 1 },
        $set: { 'clicks.lastClickedAt': new Date() }
      }
    );

  } catch (error) {
    console.error('Click tracking error:', error);
  }
};

class UrlController {
  async createShortUrl(req, res) {
    try {
      const { url, keywords = [], customSlug, expiryClicks = 10, domain } = req.body;

      // Validate URL
      try {
        new URL(url);
      } catch {
        return res.status(400).json({ error: 'Invalid URL' });
      }

      // Generate or use custom slug
      let shortCode = customSlug;
      
      if (!shortCode) {
        shortCode = await aiService.generateHumanReadableUrl(url, keywords);
        
        // Ensure uniqueness
        let attempts = 0;
        let baseCode = shortCode;
        while (await Url.findOne({ shortCode }) && attempts < 5) {
          shortCode = `${baseCode}.${attempts + 1}`;
          attempts++;
        }
      } else {
        // Check if custom slug exists
        const existing = await Url.findOne({ shortCode: customSlug });
        if (existing) {
          return res.status(400).json({ 
            error: 'This custom URL is already taken' 
          });
        }
      }

      // Get domain for URL generation
      const userDomain = await domainService.getDomainForUser(req.user.id, domain);
      const baseUrl = userDomain ? `https://${userDomain.domain}` : (process.env.BASE_URL || process.env.FRONTEND_URL || 'https://dashdig.com');
      
      // Generate QR Code
      const fullUrl = `${baseUrl}/${shortCode}`;
      const qrCode = await QRCode.toDataURL(fullUrl, {
        width: 400,
        margin: 2,
      });

      // Save to database
      const urlDoc = new Url({
        shortCode,
        originalUrl: url,
        keywords,
        qrCode,
        userId: req.user.id, // Associate with authenticated user
        domain: userDomain ? userDomain.domain : null, // Store domain used
        clicks: {
          limit: expiryClicks
        }
      });

      await urlDoc.save();

      // Cache for fast redirects (with fallback)
      const redis = getRedis();
      if (redis) {
        try {
          await redis.setex(
            `url:${shortCode}`, 
            3600, // 1 hour cache
            JSON.stringify({
              originalUrl: url,
              clicks: 0
            })
          );
        } catch (error) {
          console.warn('Redis cache failed:', error.message);
        }
      }

      console.log(`✅ Created: ${fullUrl} → ${url}`);

      res.status(201).json({
        success: true,
        shortUrl: fullUrl,
        shortCode,
        qrCode,
        originalUrl: url,
        domain: userDomain ? userDomain.domain : null,
        expiresAfter: `${expiryClicks} clicks`
      });

    } catch (error) {
      console.error('Create URL Error:', error);
      res.status(500).json({ 
        error: 'Failed to create short URL',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async redirect(req, res) {
    try {
      const { code } = req.params;
      const redis = getRedis();

      // Try cache first (if Redis is available)
      if (redis) {
        try {
          const cached = await redis.get(`url:${code}`);
          if (cached) {
            const data = JSON.parse(cached);
            console.log(`✨ Cache hit: ${code}`);
            
            // Track click async
            setImmediate(async () => {
              try {
                await trackClick(code);
              } catch (error) {
                console.error('Async click tracking error:', error);
              }
            });
            
            return res.redirect(301, data.originalUrl);
          }
        } catch (error) {
          console.warn('Redis cache read failed:', error.message);
        }
      }

      // Database lookup
      const urlDoc = await Url.findOne({ 
        shortCode: code, 
        isActive: true 
      });

      if (!urlDoc) {
        return res.status(404).send('🔍 URL not found');
      }

      // Check expiry
      if (urlDoc.hasExpired()) {
        return res.status(410).send('⏰ This link has expired');
      }

      // Track and redirect
      await trackClick(code);

      // Update cache (if Redis is available)
      if (redis) {
        try {
          await redis.setex(
            `url:${code}`,
            3600,
            JSON.stringify({
              originalUrl: urlDoc.originalUrl,
              clicks: urlDoc.clicks.count
            })
          );
        } catch (error) {
          console.warn('Redis cache update failed:', error.message);
        }
      }

      console.log(`🔄 Redirect: ${code} → ${urlDoc.originalUrl}`);
      res.redirect(301, urlDoc.originalUrl);

    } catch (error) {
      console.error('Redirect Error:', error);
      res.status(500).send('Server error');
    }
  }


  async getAllUrls(req, res) {
    try {
      // Only return URLs for the authenticated user
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

module.exports = new UrlController();
