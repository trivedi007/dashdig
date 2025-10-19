const express = require('express');
const router = express.Router();
const { authMiddleware, requireAuth } = require('../middleware/auth');
const urlController = require('../controllers/url.controller');

console.log('🚨 URL ROUTES LOADED - authMiddleware type:', typeof authMiddleware);
console.log('🚨 URL ROUTES LOADED - requireAuth type:', typeof requireAuth);

// Allow URL creation with optional authentication
router.post('/', (req, res, next) => {
  console.log('🚨 POST /api/urls HIT - req.user:', req.user);
  console.log('🚨 POST /api/urls HIT - headers:', req.headers);
  next();
}, authMiddleware, urlController.createShortUrl);

// Get all URLs for authenticated user
router.get('/', requireAuth, urlController.getAllUrls);

module.exports = router;
