const { RateLimiterRedis, RateLimiterMemory } = require('rate-limiter-flexible');
const { getRedis } = require('../config/redis');

// Create a rate limiter using Redis or fallback to memory
const createRateLimiter = (points, duration, keyPrefix = 'rate_limit') => {
  const redis = getRedis();
  
  if (redis) {
    return new RateLimiterRedis({
      storeClient: redis,
      keyPrefix,
      points,
      duration,
      blockDuration: duration,
    });
  } else {
    return new RateLimiterMemory({
      points,
      duration
    });
  }
};

// Different rate limiters for different endpoints
const limiters = {
  // General API limit: 100 requests per minute
  api: createRateLimiter(100, 60, 'rate:api'),
  
  // URL creation limit: 10 URLs per minute
  createUrl: createRateLimiter(10, 60, 'rate:create'),
  
  // Redirect limit: 30 requests per minute (per IP)
  redirect: createRateLimiter(30, 60, 'rate:redirect'),
  
  // Auth endpoints: 5 requests per hour (prevent brute force)
  auth: createRateLimiter(5, 3600, 'rate:auth'),
};

// Generic rate limit middleware factory
const createRateLimitMiddleware = (limiterType = 'api') => {
  return async (req, res, next) => {
    try {
      const key = req.ip || req.connection.remoteAddress || 'unknown';
      const limiter = limiters[limiterType] || limiters.api;
      
      await limiter.consume(key);
      next();
    } catch (rejRes) {
      const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
      res.set('Retry-After', String(secs));
      res.status(429).json({
        error: 'Too many requests. Please try again later.',
        retryAfter: secs,
        limit: limiterType
      });
    }
  };
};

// Export individual middleware for different endpoints
module.exports = {
  rateLimitMiddleware: createRateLimitMiddleware('api'),
  apiLimiter: createRateLimitMiddleware('api'),
  createUrlLimiter: createRateLimitMiddleware('createUrl'),
  redirectLimiter: createRateLimitMiddleware('redirect'),
  authLimiter: createRateLimitMiddleware('auth'),
};
