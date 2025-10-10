const express = require('express');
const router = express.Router();
const urlController = require('../controllers/url.controller');
const auth = require('../middleware/auth');

// Create short URL (requires authentication)
router.post('/', auth, urlController.createShortUrl);

// Get all URLs (requires authentication)
router.get('/', auth, urlController.getAllUrls);

module.exports = router;
