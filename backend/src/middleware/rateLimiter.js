const { RateLimiterMemory } = require('rate-limiter-flexible');

// Create a rate limiter for email verification requests
const rateLimiter = new RateLimiterMemory({
  points: 5, // 5 requests
  duration: 3600 // per hour
});

const rateLimitMiddleware = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip); // Consume a point for the request
    next(); // Proceed to the next middleware or route handler
  } catch (rejRes) {
    res.status(429).json({
      error: 'Too many requests. Please try again later.'
    });
  }
};

module.exports = rateLimitMiddleware;
