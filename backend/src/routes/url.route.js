const express = require('express');
const router = express.Router();
const urlController = require('../controllers/url.controller');
const { requireAuth } = require('../middleware/auth');

console.log('🔥 URL ROUTES MODULE LOADED - NO AUTH ON POST');

// Create short URL (NO AUTH for testing)
router.post('/', urlController.createShortUrl);

// Get all URLs (requires authentication)
router.get('/', requireAuth, urlController.getAllUrls);

module.exports = router;  // ✅ Export the router, not the controller
