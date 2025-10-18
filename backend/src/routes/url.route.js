const express = require('express');
const router = express.Router();
const urlController = require('../controllers/url.controller');
const { requireAuth } = require('../middleware/auth');

// Create short URL (requires authentication)
router.post('/', requireAuth, urlController.createShortUrl);

// Get all URLs (requires authentication)
router.get('/', requireAuth, urlController.getAllUrls);

module.exports = router;
