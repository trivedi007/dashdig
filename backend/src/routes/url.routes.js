const express = require('express');
const router = express.Router();
const urlController = require('../controllers/url.controller');

// Create short URL
router.post('/', urlController.createShortUrl);

// Get all URLs (for testing)
router.get('/', urlController.getAllUrls);

module.exports = router;
