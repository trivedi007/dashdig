const Url = require('../models/Url');
const aiService = require('../services/ai.service');
const domainService = require('../services/domain.service');
const analyticsService = require('../services/analytics.service');
const QRCode = require('qrcode');
const { getRedis } = require('../config/redis');

// Enhanced click tracking with analytics
const trackClick = async (shortCode, req = null) => {
  try {
    // Use enhanced analytics service if request object is available
    if (req) {
      await analyticsService.trackClick(shortCode, req);
    } else {
      // Fallback to simple tracking
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
    }

  } catch (error) {
    console.error('Click tracking error:', error);
  }
};

class UrlController {
  async createShortUrl(req, res) {
    try {
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🚀 CREATE SHORT URL REQUEST');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📥 Input URL:', req.body.url);
      console.log('🏷️  Keywords:', req.body.keywords);
      console.log('🔧 Custom Slug:', req.body.customSlug || 'none');
      console.log('👤 User ID:', req.user?.id || req.user?._id);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
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
        console.log('🎯 Generating AI slug...');
        shortCode = await aiService.generateHumanReadableUrl(url, keywords);
        console.log('✨ Initial slug generated:', shortCode);
        
        // Ensure uniqueness - add timestamp if exists
        const existing = await Url.findOne({ shortCode });
        if (existing) {
          console.log('⚠️  Slug already exists:', shortCode);
          console.log('   Existing URL:', existing.originalUrl);
          console.log('   New URL:', url);
          
          // Add random suffix to ensure uniqueness
          const timestamp = Date.now().toString(36).slice(-4);
          shortCode = `${shortCode}.${timestamp}`;
          console.log('🔄 New unique slug:', shortCode);
        } else {
          console.log('✅ Slug is unique, proceeding...');
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
        userId: req.user._id || req.user.id, // Use _id if available, otherwise id
        domain: userDomain ? userDomain.domain : null, // Store domain used
        clicks: {
          limit: expiryClicks || null // Set to null for unlimited clicks
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

      // === COMPREHENSIVE DEBUG LOGGING ===
      console.log('=== URL Resolution Debug ===');
      console.log('Timestamp:', new Date().toISOString());
      console.log('Request URL:', req.url);
      console.log('Request path:', req.path);
      console.log('Route params:', req.params);
      console.log('Extracted slug:', code);
      console.log('Querying database for slug:', code);
      console.log('===========================');

      // Enhanced logging for debugging
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔍 URL Resolution Request');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📥 Short Code:', code);
      console.log('🌐 Origin:', req.get('origin') || 'N/A');
      console.log('🔗 Referer:', req.get('referer') || 'N/A');
      console.log('🖥️  User-Agent:', req.get('user-agent')?.substring(0, 50) || 'N/A');
      
      // Extract database host from MONGODB_URI
      let dbHost = 'unknown';
      if (process.env.MONGODB_URI) {
        try {
          if (process.env.MONGODB_URI.includes('@')) {
            // MongoDB Atlas format: mongodb+srv://user:pass@host/db
            dbHost = process.env.MONGODB_URI.split('@')[1]?.split('/')[0] || 'unknown';
          } else if (process.env.MONGODB_URI.includes('://')) {
            // Local format: mongodb://localhost:27017/db
            const urlPart = process.env.MONGODB_URI.split('://')[1];
            dbHost = urlPart?.split('/')[0] || 'unknown';
          }
        } catch (e) {
          dbHost = 'parse-error';
        }
      }
      console.log('💾 Database:', dbHost);
      
      // Validate shortCode format
      if (!code || code.length === 0) {
        console.log('❌ Invalid: Empty short code');
        return res.status(400).send('❌ Invalid URL');
      }

      // Try cache first (if Redis is available)
      if (redis) {
        try {
          const cached = await redis.get(`url:${code}`);
          if (cached) {
            const data = JSON.parse(cached);
            console.log(`✨ Cache hit: ${code}`);
            
            // Validate cached data - check if URL is still active and not expired
            const urlDoc = await Url.findOne({ shortCode: code, isActive: true });
            if (!urlDoc || urlDoc.hasExpired()) {
              console.log('🔄 Cached URL is expired or inactive, clearing cache');
              await redis.del(`url:${code}`);
              console.log('💨 Cache cleared, querying database...');
              // Continue to database query below
            } else {
              console.log(`🎯 Redirecting to: ${data.originalUrl}`);
              
              // Track click with analytics async
              setImmediate(async () => {
                try {
                  await trackClick(code, req);
                } catch (error) {
                  console.error('Async click tracking error:', error);
                }
              });
              
              return res.redirect(301, data.originalUrl);
            }
          } else {
            console.log('💨 Cache miss, querying database...');
          }
        } catch (error) {
          console.warn('⚠️  Redis cache read failed:', error.message);
        }
      } else {
        console.log('⚠️  Redis not available, querying database...');
      }

      // Database lookup with detailed logging
      console.log('🔎 Querying database for:', { shortCode: code, isActive: true });
      const urlDoc = await Url.findOne({ 
        shortCode: code, 
        isActive: true 
      });

      // === DATABASE RESULT LOGGING ===
      console.log('=== Database Query Result ===');
      console.log('Database result:', urlDoc);
      console.log('Found URL:', urlDoc?.originalUrl);
      console.log('URL exists:', !!urlDoc);
      console.log('============================');

      if (!urlDoc) {
        // Enhanced 404 logging - check similar URLs
        console.log('❌ URL NOT FOUND in database');
        console.log('🔍 Attempting to find similar URLs...');
        
        const similarUrls = await Url.find({
          shortCode: new RegExp(code.replace(/\./g, '\\.'), 'i')
        }).limit(5).select('shortCode');
        
        if (similarUrls.length > 0) {
          console.log('📋 Similar URLs found:', similarUrls.map(u => u.shortCode));
        } else {
          console.log('📋 No similar URLs found');
        }
        
        // Count total URLs in database
        const totalUrls = await Url.countDocuments({ isActive: true });
        console.log('📊 Total active URLs in database:', totalUrls);
        
        return res.status(404).send('🔍 URL not found - The shortened URL you\'re looking for doesn\'t exist.');
      }

      console.log('✅ URL found in database');
      console.log('📋 Details:', {
        id: urlDoc._id,
        originalUrl: urlDoc.originalUrl.substring(0, 50) + '...',
        created: urlDoc.createdAt,
        clicks: urlDoc.clicks.count,
        limit: urlDoc.clicks.limit
      });

      // Check expiry
      if (urlDoc.hasExpired()) {
        console.log('⏰ URL has expired');
        console.log('📊 Click stats:', {
          current: urlDoc.clicks.count,
          limit: urlDoc.clicks.limit
        });
        return res.status(410).send('⏰ This link has expired - It has reached its click limit or expiration date.');
      }

      // Track and redirect with analytics
      console.log('📊 Tracking click...');
      await trackClick(code, req);

      // Update cache (if Redis is available)
      if (redis) {
        try {
          await redis.setex(
            `url:${code}`,
            3600,
            JSON.stringify({
              originalUrl: urlDoc.originalUrl,
              clicks: urlDoc.clicks.count + 1
            })
          );
          console.log('💾 Cache updated');
        } catch (error) {
          console.warn('⚠️  Redis cache update failed:', error.message);
        }
      }

      console.log(`🎯 Redirecting: ${code} → ${urlDoc.originalUrl}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      res.redirect(301, urlDoc.originalUrl);

    } catch (error) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('💥 Redirect Error:', error);
      console.error('Stack:', error.stack);
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      res.status(500).send('❌ Server error - Please try again later.');
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
  redirect: urlController.redirect.bind(urlController)
};
