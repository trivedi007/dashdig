const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const jwt = require('jsonwebtoken');
const { getRedis } = require('../config/redis');
const User = require('../models/User');
const suggestionsController = require('../controllers/suggestions.controller');

console.log('✅ Suggestions routes loaded');

// Create Redis store for rate limiting
const createStore = (prefix) => {
  const redis = getRedis();
  if (redis) {
    return new RedisStore({
      sendCommand: (...args) => {
        return redis.call(...args);
      },
      prefix: `rl:suggestions:${prefix}:`
    });
  }
  return undefined; // Use memory store (default)
};

// Rate limiter for anonymous users (10 requests per minute)
const anonymousLimiter = rateLimit({
  store: createStore('anonymous'),
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: {
    success: false,
    error: 'Rate limit exceeded. Please wait 60 seconds.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Rate limit by IP for anonymous users
    return `anon:${req.ip}`;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Please wait 60 seconds.',
      retryAfter: 60
    });
  }
});

// Rate limiter for authenticated users (30 requests per minute)
const authenticatedLimiter = rateLimit({
  store: createStore('authenticated'),
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: {
    success: false,
    error: 'Rate limit exceeded. Please wait 60 seconds.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Rate limit by user ID for authenticated users
    const userId = req.userId || req.user?._id || req.body?.userId || 'unknown';
    return `auth:${userId}`;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Please wait 60 seconds.',
      retryAfter: 60
    });
  }
});

// Middleware to select appropriate rate limiter based on authentication
const selectRateLimiter = async (req, res, next) => {
  // First, check authentication status
  // We'll manually check for token without blocking if missing
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (token) {
      // Try to verify token and set user
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.userId || decoded.id);
        
        if (user && user.isActive) {
          req.user = user;
          req.userId = user._id;
        }
      } catch (error) {
        // Token invalid or expired, treat as anonymous
      }
    }
  } catch (error) {
    // Error checking auth, treat as anonymous
  }
  
  // Select appropriate limiter based on authentication status
  if (req.user || req.userId) {
    return authenticatedLimiter(req, res, next);
  } else {
    return anonymousLimiter(req, res, next);
  }
};

/**
 * POST /api/suggestions/generate
 * Generate multiple URL slug suggestions
 * 
 * Request Body:
 * {
 *   "url": "https://www.amazon.com/dp/B08N5WRWNW...",
 *   "keywords": ["echo", "smart speaker"],  // optional
 *   "userId": "user_123"  // optional, for personalization later
 * }
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "message": "Suggestions generated successfully",
 *   "data": {
 *     "suggestions": [...],
 *     "metadata": {...}
 *   }
 * }
 */
router.post('/generate', selectRateLimiter, suggestionsController.generateSuggestions);

module.exports = router;

