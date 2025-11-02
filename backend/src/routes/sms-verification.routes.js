/**
 * SMS Verification Routes
 * Handles SMS-based 2FA endpoints
 */

const express = require('express');
const router = express.Router();
const smsVerificationController = require('../controllers/sms-verification.controller');

// Middleware imports (adjust paths based on your project structure)
// If you don't have these middleware, you'll need to create them or adjust the routes
let authMiddleware = null;
let adminMiddleware = null;

try {
  authMiddleware = require('../middleware/auth');
} catch (error) {
  console.warn('⚠️  Auth middleware not found. Some routes will be unprotected.');
  // Create a pass-through middleware
  authMiddleware = (req, res, next) => next();
}

try {
  adminMiddleware = require('../middleware/admin');
} catch (error) {
  console.warn('⚠️  Admin middleware not found. Admin routes will be unprotected.');
  // Create a pass-through middleware
  adminMiddleware = (req, res, next) => next();
}

// Rate limiting middleware for SMS endpoints
const createRateLimiter = () => {
  try {
    const rateLimit = require('express-rate-limit');
    
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // 5 requests per window
      message: {
        error: 'Too many SMS requests. Please try again later.',
        code: 'RATE_LIMIT_EXCEEDED'
      },
      standardHeaders: true,
      legacyHeaders: false
    });
  } catch (error) {
    console.warn('⚠️  express-rate-limit not installed. SMS endpoints will not have rate limiting.');
    return (req, res, next) => next();
  }
};

const smsRateLimiter = createRateLimiter();

/**
 * @route   POST /api/auth/sms/send
 * @desc    Send SMS verification code
 * @access  Public (with rate limiting)
 * @body    { phone: string }
 * @returns { success: boolean, message: string, data: { phone: string, expiresIn: number } }
 */
router.post(
  '/send',
  smsRateLimiter,
  smsVerificationController.sendVerificationCode
);

/**
 * @route   POST /api/auth/sms/verify
 * @desc    Verify SMS code
 * @access  Public
 * @body    { phone: string, code: string }
 * @returns { success: boolean, message: string, data: { verified: boolean, phone: string } }
 */
router.post(
  '/verify',
  smsVerificationController.verifyCode
);

/**
 * @route   POST /api/auth/sms/resend
 * @desc    Resend verification code
 * @access  Public (with rate limiting)
 * @body    { phone: string }
 * @returns { success: boolean, message: string, data: { phone: string, expiresIn: number } }
 */
router.post(
  '/resend',
  smsRateLimiter,
  smsVerificationController.resendVerificationCode
);

/**
 * @route   POST /api/auth/sms/webhook
 * @desc    Twilio webhook for SMS status updates
 * @access  Public (Twilio callbacks)
 * @body    Twilio webhook payload
 * @returns 200 OK
 */
router.post(
  '/webhook',
  smsVerificationController.handleWebhook
);

/**
 * @route   GET /api/auth/sms/stats
 * @desc    Get SMS verification statistics
 * @access  Admin only
 * @returns { success: boolean, data: object }
 */
router.get(
  '/stats',
  authMiddleware,
  adminMiddleware,
  smsVerificationController.getStatistics
);

/**
 * @route   POST /api/auth/sms/cleanup
 * @desc    Cleanup expired SMS verifications
 * @access  Admin only
 * @returns { success: boolean, message: string, data: object }
 */
router.post(
  '/cleanup',
  authMiddleware,
  adminMiddleware,
  smsVerificationController.cleanupExpired
);

module.exports = router;

