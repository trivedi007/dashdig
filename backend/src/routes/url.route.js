const express = require('express');
const router = express.Router();
const urlController = require('../controllers/url.controller');
const { requireAuth } = require('../middleware/auth');

// Create short URL (TEMPORARILY NO AUTH FOR TESTING)
router.post('/', urlController.createShortUrl);  // ✅ No auth temporarily

// Get all URLs (requires authentication)
router.get('/', requireAuth, urlController.getAllUrls);
