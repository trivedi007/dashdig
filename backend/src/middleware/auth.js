const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Check for token in headers or cookies
    let token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token && req.cookies) {
      token = req.cookies.auth_token;
    }

    if (!token) {
      // Allow anonymous users for some endpoints
      req.user = null;
      return next();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id);
    
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    req.user = user;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    req.user = null;
    next();
  }
};

// Middleware that requires authentication
const requireAuth = async (req, res, next) => {
  await authMiddleware(req, res, () => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    next();
  });
};

module.exports = { authMiddleware, requireAuth };
