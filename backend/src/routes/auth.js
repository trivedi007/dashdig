const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth');
const rateLimitMiddleware = require('../middleware/rateLimiter');

router.post('/magic-link', authController.requestMagicLink);
router.get('/verify/:token', authController.verifyEmail);
router.post('/verify', rateLimitMiddleware, authController.verifyMagicLink);
router.post('/verify', authController.verifyMagicLink);

// Protected routes
router.get('/me', requireAuth, authController.getCurrentUser);
router.post('/logout', authController.logout);

module.exports = router;
