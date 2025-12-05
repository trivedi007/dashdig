const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { requireAuth } = require('../middleware/auth');

console.log('✅ Users routes loaded');

/**
 * GET /api/users/preferences
 * Get current user's URL naming preferences
 */
router.get('/preferences', requireAuth, usersController.getPreferences);

/**
 * PUT /api/users/preferences
 * Update user's URL naming preferences
 */
router.put('/preferences', requireAuth, usersController.updatePreferences);

/**
 * POST /api/users/preferences/reset-pattern
 * Reset detected pattern (clear pattern analysis)
 */
router.post('/preferences/reset-pattern', requireAuth, usersController.resetPattern);

module.exports = router;









