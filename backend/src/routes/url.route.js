// src/routes/url.route.js
const express = require('express');
const router = express.Router();
const { authMiddleware, requireAuth } = require('../middleware/auth');
const urlController = require('../controllers/url.controller');

// Allow URL creation with optional authentication
// This lets both logged-in and anonymous users create URLs
router.post('/', authMiddleware, urlController.createShortUrl);

// Get all URLs for authenticated user
router.get('/', requireAuth, urlController.getAllUrls);

module.exports = router;