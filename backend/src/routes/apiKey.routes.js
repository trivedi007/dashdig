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

// ============================================
// PUBLIC API V1 KEY MANAGEMENT ROUTES
// ============================================

/**
 * POST /api/api-keys/v1 - Create a new API key for v1
 */
router.post('/v1', apiKeyController.createApiKeyV1);

/**
 * GET /api/api-keys/v1 - List all API keys for v1
 */
router.get('/v1', apiKeyController.listApiKeysV1);

/**
 * DELETE /api/api-keys/v1/:keyId - Revoke an API key
 */
router.delete('/v1/:keyId', apiKeyController.revokeApiKeyV1);

/**
 * GET /api/api-keys/v1/usage - Get API usage stats
 */
router.get('/v1/usage', apiKeyController.getApiUsage);

module.exports = router;

