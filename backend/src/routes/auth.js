const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth');
const { authLimiter, apiLimiter } = require('../middleware/rateLimiter');

// Apply rate limiting to authentication endpoints
router.post('/magic-link', authLimiter, authController.requestMagicLink);
router.get('/verify/:token', apiLimiter, authController.verifyEmail);
router.post('/verify', authLimiter, authController.verifyMagicLink);

// SMS authentication routes
try {
  const smsAuthRoutes = require('./smsAuth.routes');
  router.use('/sms', smsAuthRoutes);
  console.log('✅ SMS auth routes loaded');
} catch (e) {
  console.log('⚠️  SMS auth routes not found, skipping');
}

// Protected routes
router.get('/me', requireAuth, authController.getCurrentUser);
router.post('/logout', authController.logout);

module.exports = router;
