/**
 * Email Verification Routes
 * Handles all email verification endpoints
 */

const express = require('express');
const router = express.Router();
const emailVerificationController = require('../controllers/email-verification.controller');
const rateLimit = require('express-rate-limit');

// Rate limiter for registration (5 attempts per 15 minutes)
const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    error: 'Too many registration attempts. Please try again later.',
    retryAfter: 900 // seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for verification email resend (3 attempts per hour)
const resendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    error: 'Too many verification email requests. Please try again later.',
    retryAfter: 3600 // seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use email from body as the key for rate limiting
    return req.body.email || req.ip;
  }
});

// Rate limiter for verification endpoint (10 attempts per 15 minutes)
const verificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    error: 'Too many verification attempts. Please try again later.',
    retryAfter: 900 // seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @route   POST /api/auth/register
 * @desc    Register new user and send verification email
 * @access  Public
 */
router.post('/register', registrationLimiter, emailVerificationController.register);

/**
 * @route   GET /api/auth/verify/:token
 * @desc    Verify email with token
 * @access  Public
 */
router.get('/verify/:token', verificationLimiter, emailVerificationController.verifyEmail);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend verification email
 * @access  Public
 */
router.post('/resend-verification', resendLimiter, emailVerificationController.resendVerification);

/**
 * @route   GET /api/auth/verification-status/:email
 * @desc    Check verification status for an email
 * @access  Public
 */
router.get('/verification-status/:email', emailVerificationController.checkVerificationStatus);

module.exports = router;

