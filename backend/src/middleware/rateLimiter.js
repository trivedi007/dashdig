const { RateLimiterRedis } = require('rate-limiter-flexible');
const { getRedis } = require('../config/redis');

// Create a rate limiter using Redis
const createRateLimiter = () => {
  const redis = getRedis();
  
  if (redis) {
    return new RateLimiterRedis({
      storeClient: redis,
      keyPrefix: 'rate_limit',
      points: 5, // 5 requests
      duration: 3600, // per hour
      blockDuration: 3600, // block for 1 hour if limit exceeded
    });
  } else {
    // Fallback to memory-based rate limiting
    const { RateLimiterMemory } = require('rate-limiter-flexible');
    return new RateLimiterMemory({
      points: 5, // 5 requests
      duration: 3600 // per hour
    });
  }
};

const rateLimiter = createRateLimiter();

const rateLimitMiddleware = async (req, res, next) => {
  try {
    const key = req.ip || req.connection.remoteAddress;
    await rateLimiter.consume(key); // Consume a point for the request
    next(); // Proceed to the next middleware or route handler
  } catch (rejRes) {
    const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
    res.set('Retry-After', String(secs));
    res.status(429).json({
      error: 'Too many requests. Please try again later.',
      retryAfter: secs
    });
  }
};

module.exports = rateLimitMiddleware;
