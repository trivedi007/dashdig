const { getRedis } = require('../config/redis');

// Cache middleware for API responses
const cacheMiddleware = (duration = 60) => {
  return async (req, res, next) => {
    const redis = getRedis();
    
    if (!redis) {
      return next(); // Skip caching if Redis is not available
    }

    const key = `cache:${req.originalUrl}`;
    
    try {
      const cached = await redis.get(key);
      if (cached) {
        console.log(`📦 Cache hit: ${req.originalUrl}`);
        return res.json(JSON.parse(cached));
      }
    } catch (error) {
      console.error('Cache read error:', error);
    }

    // Store original send method
    const originalSend = res.json;
    
    res.json = function(data) {
      // Cache the response asynchronously
      if (redis) {
        redis.setex(key, duration, JSON.stringify(data))
          .catch(error => console.error('Cache write error:', error));
      }
      originalSend.call(this, data);
    };

    next();
  };
};

// Cache for URL redirects (longer duration)
const urlCacheMiddleware = async (req, res, next) => {
  const redis = getRedis();
  
  if (!redis) {
    return next();
  }

  const { code } = req.params;
  const slug = typeof code === 'string' ? code.toLowerCase().trim() : '';

  if (!slug) {
    return next();
  }

  const key = `url:${slug}`;
  
  try {
    const cached = await redis.get(key);
    if (cached) {
      console.log(`⚡ URL cache hit: ${slug}`);
      const data = JSON.parse(cached);
      
      // Track click asynchronously
      setImmediate(async () => {
        try {
          const { trackClick } = require('../controllers/url.controller');
          await trackClick(slug, req);
        } catch (error) {
          console.error('Async click tracking error:', error);
        }
      });
      
      return res.redirect(301, data.originalUrl);
    }
  } catch (error) {
    console.error('URL cache read error:', error);
  }

  next();
};

module.exports = { cacheMiddleware, urlCacheMiddleware };
