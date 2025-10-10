const express = require('express');
const router = express.Router();
const urlController = require('../controllers/url.controller.js');

// POST /api/urls - Create short URL
router.post('/', urlController.createShortUrl);

// GET /api/urls - Get all URLs (for testing)
router.get('/', urlController.getAllUrls);

module.exports = router;