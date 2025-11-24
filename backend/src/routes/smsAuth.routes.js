/**
 * SMS Authentication Routes
 * Handles SMS-based login authentication
 */

const express = require('express');
const router = express.Router();
const smsAuthService = require('../services/smsAuth.service');
const { smsLimiter, authLimiter } = require('../middleware/rateLimiter');

/**
 * POST /api/auth/sms/send-code
 * Send SMS verification code (with rate limiting)
 */
router.post('/send-code', smsLimiter, async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Validate phone number
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required'
      });
    }

    // Validate E.164 format
    if (!smsAuthService.isValidPhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid phone number (E.164 format: +1234567890)'
      });
    }

    // Check rate limit
    const rateLimit = await smsAuthService.checkRateLimit(phoneNumber);
    if (!rateLimit.allowed) {
      const minutes = Math.ceil(rateLimit.resetIn / 60);
      return res.status(429).json({
        success: false,
        error: `Too many attempts. Try again in ${minutes} minute(s).`,
        resetIn: rateLimit.resetIn
      });
    }

    // Generate code
    const code = smsAuthService.generateCode();

    // Store in Redis
    await smsAuthService.storeCode(phoneNumber, code);

    // Send SMS
    const message = `Your Dashdig code is: ${code}. Valid for 10 minutes.`;
    await smsAuthService.sendSMS(phoneNumber, message);

    console.log(`✅ SMS code sent to ${phoneNumber}`);

    res.json({
      success: true,
      message: 'Code sent',
      expiresIn: 600 // 10 minutes
    });

  } catch (error) {
    console.error('❌ Error sending SMS code:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send code. Check your connection.'
    });
  }
});

/**
 * POST /api/auth/sms/verify-code
 * Verify SMS code and login (with rate limiting)
 */
router.post('/verify-code', authLimiter, async (req, res) => {
  try {
    const { phoneNumber, code } = req.body;

    // Validate inputs
    if (!phoneNumber || !code) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and code are required'
      });
    }

    // Validate phone number format
    if (!smsAuthService.isValidPhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid phone number'
      });
    }

    // Validate code format (6 digits)
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({
        success: false,
        error: 'Code must be 6 digits'
      });
    }

    // Verify code
    const isValid = await smsAuthService.verifyCode(phoneNumber, code);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired code. Please try again.'
      });
    }

    // Find or create user
    const user = await smsAuthService.findOrCreateUser(phoneNumber);

    // Generate JWT token
    const token = smsAuthService.generateToken(user);

    console.log(`✅ User authenticated via SMS: ${phoneNumber}`);

    res.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        phoneNumber: user.phone,
        identifier: user.identifier
      }
    });

  } catch (error) {
    console.error('❌ Error verifying SMS code:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to verify code'
    });
  }
});

module.exports = router;

