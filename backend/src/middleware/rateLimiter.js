const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const { getRedis } = require('../config/redis');

// Create Redis store if available, otherwise use memory
const createStore = (prefix) => {
  const redis = getRedis();
  if (redis) {
    // ioredis compatibility - use sendCommand wrapper
    return new RedisStore({
      sendCommand: (...args) => {
        return redis.call(...args);
      },
      prefix: `rl:${prefix}:`
    });
  }
  return undefined; // Use memory store (default)
};

// Strict limiter for authentication (prevent brute force)
const authLimiter = rateLimit({
  store: createStore('auth'),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: { 
    success: false, 
    error: { 
      code: 'RATE_LIMIT_EXCEEDED', 
      message: 'Too many login attempts. Please try again in 15 minutes.' 
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Rate limit by IP + phone/email to prevent distributed attacks
    const identifier = req.body?.email || req.body?.phoneNumber || req.body?.identifier || '';
    return `${req.ip}-${identifier}`;
  }
});

// SMS sending limiter (prevent SMS bombing)
const smsLimiter = rateLimit({
  store: createStore('sms'),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 SMS per hour per phone number
  message: { 
    success: false, 
    error: { 
      code: 'SMS_RATE_LIMIT', 
      message: 'Too many SMS requests. Please try again in 1 hour.' 
    }
  },
  keyGenerator: (req) => req.body?.phoneNumber || req.ip
});

// General API limiter
const apiLimiter = rateLimit({
  store: createStore('api'),
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: { 
    success: false, 
    error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' }
  }
});

// Password reset limiter
const passwordResetLimiter = rateLimit({
  store: createStore('reset'),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 reset attempts per hour
  message: { 
    success: false, 
    error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many reset attempts' }
  }
});

// Legacy rate limiters using rate-limiter-flexible (for backward compatibility)
const { RateLimiterRedis, RateLimiterMemory } = require('rate-limiter-flexible');

// Create a rate limiter using Redis or fallback to memory
const createRateLimiter = (points, duration, keyPrefix = 'rate_limit') => {
  const redisClient = getRedis();
  
  if (redisClient) {
    return new RateLimiterRedis({
      storeClient: redisClient,
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

// Different rate limiters for different endpoints (legacy)
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

// Generic rate limit middleware factory (legacy)
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

// Export both new and legacy middleware
module.exports = {
  // New express-rate-limit based middleware
  authLimiter,
  smsLimiter,
  apiLimiter,
  passwordResetLimiter,
  // Legacy middleware for backward compatibility
  rateLimitMiddleware: createRateLimitMiddleware('api'),
  createUrlLimiter: createRateLimitMiddleware('createUrl'),
  redirectLimiter: createRateLimitMiddleware('redirect'),
};
