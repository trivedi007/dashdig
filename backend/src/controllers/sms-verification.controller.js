/**
 * SMS Verification Controller
 * Handles SMS-based 2FA endpoints
 */

const smsService = require('../services/sms.service');
const User = require('../models/User');

class SmsVerificationController {
  /**
   * Send SMS verification code
   * POST /api/auth/sms/send
   */
  async sendVerificationCode(req, res) {
    try {
      const { phone } = req.body;

      // Validate input
      if (!phone) {
        return res.status(400).json({
          error: 'Phone number is required',
          code: 'PHONE_REQUIRED'
        });
      }

      // Get user ID if authenticated
      const userId = req.userId || null;

      // Get IP address
      const ipAddress = req.ip || req.connection.remoteAddress;

      // Send SMS
      const result = await smsService.sendVerificationSms({
        phone,
        userId,
        ipAddress
      });

      res.json({
        success: true,
        message: result.message,
        data: {
          phone: result.phone,
          expiresIn: result.expiresIn
        }
      });

    } catch (error) {
      console.error('Send verification code error:', error);

      // Handle rate limiting error
      if (error.message.includes('wait')) {
        return res.status(429).json({
          error: error.message,
          code: 'RATE_LIMIT_EXCEEDED'
        });
      }

      // Handle invalid phone number
      if (error.message.includes('Invalid phone number')) {
        return res.status(400).json({
          error: error.message,
          code: 'INVALID_PHONE'
        });
      }

      // Handle Twilio errors
      if (error.message.includes('SMS sending failed')) {
        return res.status(503).json({
          error: 'SMS service temporarily unavailable. Please try again later.',
          code: 'SERVICE_UNAVAILABLE'
        });
      }

      res.status(500).json({
        error: error.message || 'Failed to send verification code',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  /**
   * Verify SMS code
   * POST /api/auth/sms/verify
   */
  async verifyCode(req, res) {
    try {
      const { phone, code } = req.body;

      // Validate input
      if (!phone || !code) {
        return res.status(400).json({
          error: 'Phone number and verification code are required',
          code: 'MISSING_PARAMETERS'
        });
      }

      // Validate code format (6 digits)
      if (!/^\d{6}$/.test(code)) {
        return res.status(400).json({
          error: 'Invalid code format. Code must be 6 digits.',
          code: 'INVALID_CODE_FORMAT'
        });
      }

      // Verify code
      const result = await smsService.verifySmsCode({
        phone,
        code
      });

      // If user is authenticated, update their phone verification status
      if (req.userId) {
        try {
          const user = await User.findById(req.userId);
          if (user) {
            user.phone = result.phone;
            user.isVerified = true;
            await user.save();
          }
        } catch (userError) {
          console.error('Failed to update user phone:', userError);
          // Don't fail the verification if user update fails
        }
      }

      res.json({
        success: true,
        message: result.message,
        data: {
          verified: result.verified,
          phone: result.phone
        }
      });

    } catch (error) {
      console.error('Verify code error:', error);

      // Handle specific errors
      if (error.message.includes('No active verification')) {
        return res.status(404).json({
          error: error.message,
          code: 'NO_VERIFICATION_FOUND'
        });
      }

      if (error.message.includes('Invalid verification code')) {
        return res.status(400).json({
          error: error.message,
          code: 'INVALID_CODE'
        });
      }

      if (error.message.includes('Maximum verification attempts')) {
        return res.status(429).json({
          error: error.message,
          code: 'MAX_ATTEMPTS_REACHED'
        });
      }

      res.status(500).json({
        error: error.message || 'Failed to verify code',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  /**
   * Resend verification code
   * POST /api/auth/sms/resend
   */
  async resendVerificationCode(req, res) {
    try {
      const { phone } = req.body;

      if (!phone) {
        return res.status(400).json({
          error: 'Phone number is required',
          code: 'PHONE_REQUIRED'
        });
      }

      const userId = req.userId || null;
      const ipAddress = req.ip || req.connection.remoteAddress;

      // Resend SMS
      const result = await smsService.resendVerificationSms({
        phone,
        userId,
        ipAddress
      });

      res.json({
        success: true,
        message: 'Verification code resent successfully',
        data: {
          phone: result.phone,
          expiresIn: result.expiresIn
        }
      });

    } catch (error) {
      console.error('Resend verification code error:', error);

      // Handle rate limiting
      if (error.message.includes('wait')) {
        return res.status(429).json({
          error: error.message,
          code: 'RATE_LIMIT_EXCEEDED'
        });
      }

      res.status(500).json({
        error: error.message || 'Failed to resend verification code',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  /**
   * Twilio webhook handler
   * POST /api/auth/sms/webhook
   */
  async handleWebhook(req, res) {
    try {
      // Twilio sends webhook data as form-encoded
      const webhookData = req.body;

      // Log webhook for debugging
      console.log('📱 Received Twilio webhook:', JSON.stringify(webhookData, null, 2));

      // Process webhook
      await smsService.handleTwilioWebhook(webhookData);

      // Twilio expects a 200 response
      res.status(200).send('OK');

    } catch (error) {
      console.error('Webhook handling error:', error);
      // Still return 200 to prevent Twilio retries
      res.status(200).send('OK');
    }
  }

  /**
   * Get SMS statistics (admin only)
   * GET /api/auth/sms/stats
   */
  async getStatistics(req, res) {
    try {
      const stats = await smsService.getStatistics();

      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Get statistics error:', error);
      res.status(500).json({
        error: error.message || 'Failed to get statistics',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  /**
   * Cleanup expired verifications (admin only)
   * POST /api/auth/sms/cleanup
   */
  async cleanupExpired(req, res) {
    try {
      const result = await smsService.cleanupExpired();

      res.json({
        success: true,
        message: 'Cleanup completed',
        data: result
      });

    } catch (error) {
      console.error('Cleanup error:', error);
      res.status(500).json({
        error: error.message || 'Failed to cleanup',
        code: 'INTERNAL_ERROR'
      });
    }
  }
}

module.exports = new SmsVerificationController();

