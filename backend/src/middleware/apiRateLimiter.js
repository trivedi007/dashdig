const { RateLimiterRedis, RateLimiterMemory } = require('rate-limiter-flexible');
const { getRedis } = require('../config/redis');

/**
 * Tier-based rate limiting for API v1
 * Uses user's subscription plan to determine rate limits
 */
const apiRateLimiter = async (req, res, next) => {
  try {
    // User should be attached by apiKeyAuth middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required for rate limiting.'
        }
      });
    }

    // Get user's rate limit based on subscription tier
    const rateLimit = req.user.getApiRateLimit();
    const userId = req.user._id.toString();

    // Create rate limiter for this user
    const redis = getRedis();
    let rateLimiter;

    if (redis) {
      rateLimiter = new RateLimiterRedis({
        storeClient: redis,
        keyPrefix: 'api_v1_rate',
        points: rateLimit.limit,
        duration: rateLimit.window,
        blockDuration: 0 // Don't block, just reject
      });
    } else {
      rateLimiter = new RateLimiterMemory({
        points: rateLimit.limit,
        duration: rateLimit.window
      });
    }

    try {
      // Consume 1 point for this request
      const rateLimiterRes = await rateLimiter.consume(userId, 1);

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', rateLimit.limit);
      res.setHeader('X-RateLimit-Remaining', rateLimiterRes.remainingPoints);
      res.setHeader('X-RateLimit-Reset', new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString());

      next();
    } catch (rateLimiterRes) {
      // Rate limit exceeded
      const resetDate = new Date(Date.now() + rateLimiterRes.msBeforeNext);

      res.setHeader('X-RateLimit-Limit', rateLimit.limit);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', resetDate.toISOString());
      res.setHeader('Retry-After', Math.ceil(rateLimiterRes.msBeforeNext / 1000));

      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Rate limit exceeded. You can make ${rateLimit.limit} requests per hour on your ${req.user.subscription.plan} plan.`,
          resetAt: resetDate.toISOString(),
          limit: rateLimit.limit,
          retryAfter: Math.ceil(rateLimiterRes.msBeforeNext / 1000)
        }
      });
    }
  } catch (error) {
    console.error('Rate limiter error:', error);
    // On error, allow request to proceed (fail open)
    next();
  }
};

module.exports = { apiRateLimiter };
