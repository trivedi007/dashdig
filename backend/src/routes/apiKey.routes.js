const express = require('express');
const router = express.Router();
const apiKeyController = require('../controllers/apiKey.controller');
const { requireAuth } = require('../middleware/auth');

// All API key routes require authentication
router.use(requireAuth);

/**
 * GET /api/api-keys - Get user's API key (or generate if doesn't exist)
 */
router.get('/', apiKeyController.getApiKey);

/**
 * POST /api/api-keys/regenerate - Regenerate API key
 * Body: { isTest: boolean } (optional)
 */
router.post('/regenerate', apiKeyController.regenerateApiKey);

/**
 * DELETE /api/api-keys - Delete API key
 */
router.delete('/', apiKeyController.deleteApiKey);

module.exports = router;

