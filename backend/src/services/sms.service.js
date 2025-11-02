/**
 * SMS Service using Twilio
 * Handles SMS sending for 2FA/OTP verification
 */

const twilio = require('twilio');
const SmsVerification = require('../models/SmsVerification');

class SmsService {
  constructor() {
    this.client = null;
    this.phoneNumber = null;
    this.isConfigured = false;
    this.initializeTwilio();
  }

  /**
   * Initialize Twilio client
   */
  initializeTwilio() {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      this.phoneNumber = process.env.TWILIO_PHONE_NUMBER;

      if (!accountSid || !authToken || !this.phoneNumber) {
        console.warn('⚠️  Twilio credentials not configured. SMS service will be disabled.');
        console.warn('   Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env');
        this.isConfigured = false;
        return;
      }

      this.client = twilio(accountSid, authToken);
      this.isConfigured = true;
      console.log('✅ Twilio SMS service initialized');

      // Validate credentials by fetching account info
      this.validateCredentials();
    } catch (error) {
      console.error('❌ Failed to initialize Twilio:', error.message);
      this.isConfigured = false;
    }
  }

  /**
   * Validate Twilio credentials
   */
  async validateCredentials() {
    try {
      await this.client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
      console.log('✅ Twilio credentials validated');
    } catch (error) {
      console.error('❌ Twilio credential validation failed:', error.message);
      this.isConfigured = false;
    }
  }

  /**
   * Generate 6-digit OTP code
   * @returns {string} 6-digit code
   */
  generateOtp() {
    // Generate random 6-digit number
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
  }

  /**
   * Format phone number to E.164 format
   * @param {string} phone - Phone number
   * @returns {string} Formatted phone number
   */
  formatPhoneNumber(phone) {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    
    // If doesn't start with country code, assume US (+1)
    if (!cleaned.startsWith('1') && cleaned.length === 10) {
      cleaned = '1' + cleaned;
    }
    
    // Add + prefix for E.164 format
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    
    return cleaned;
  }

  /**
   * Validate phone number format
   * @param {string} phone - Phone number
   * @returns {boolean}
   */
  isValidPhoneNumber(phone) {
    // Basic validation for E.164 format
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return e164Regex.test(phone);
  }

  /**
   * Send SMS verification code
   * @param {Object} options - SMS options
   * @param {string} options.phone - Phone number
   * @param {string} options.userId - User ID (optional)
   * @param {string} options.ipAddress - IP address (optional)
   * @returns {Promise<Object>} Result
   */
  async sendVerificationSms({ phone, userId = null, ipAddress = null }) {
    try {
      if (!this.isConfigured) {
        throw new Error('SMS service is not configured. Please set Twilio credentials in environment variables.');
      }

      // Format phone number
      const formattedPhone = this.formatPhoneNumber(phone);

      // Validate phone number
      if (!this.isValidPhoneNumber(formattedPhone)) {
        throw new Error('Invalid phone number format. Please use E.164 format (e.g., +1234567890)');
      }

      // Check rate limiting
      const rateLimitCheck = await SmsVerification.canResendSms(formattedPhone);
      if (!rateLimitCheck.canResend) {
        throw new Error(`Please wait ${rateLimitCheck.waitTime} seconds before requesting another code`);
      }

      // Generate OTP
      const code = this.generateOtp();

      // Create verification record
      const verification = new SmsVerification({
        phone: formattedPhone,
        code,
        userId,
        ipAddress,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
      });

      await verification.save();

      // Send SMS via Twilio
      const message = `Your DashDig verification code is: ${code}. Valid for 5 minutes.`;
      
      const twilioResponse = await this.client.messages.create({
        body: message,
        from: this.phoneNumber,
        to: formattedPhone
      });

      console.log(`✅ SMS sent to ${formattedPhone}: ${twilioResponse.sid}`);

      return {
        success: true,
        phone: formattedPhone,
        messageSid: twilioResponse.sid,
        expiresIn: 300, // 5 minutes in seconds
        message: 'Verification code sent successfully'
      };

    } catch (error) {
      console.error('Failed to send SMS:', error);
      
      // Handle Twilio-specific errors
      if (error.code) {
        throw new Error(`SMS sending failed: ${error.message} (Code: ${error.code})`);
      }
      
      throw error;
    }
  }

  /**
   * Verify SMS code
   * @param {Object} options - Verification options
   * @param {string} options.phone - Phone number
   * @param {string} options.code - Verification code
   * @returns {Promise<Object>} Result
   */
  async verifySmsCode({ phone, code }) {
    try {
      // Format phone number
      const formattedPhone = this.formatPhoneNumber(phone);

      // Find active verification
      const verification = await SmsVerification.findActiveVerification(formattedPhone);

      if (!verification) {
        throw new Error('No active verification found. Please request a new code.');
      }

      // Check if code is valid
      if (!verification.isValidCode(code)) {
        // Increment attempts
        await verification.incrementAttempts();

        const remainingAttempts = 3 - verification.attempts;
        
        if (remainingAttempts <= 0) {
          throw new Error('Maximum verification attempts reached. Please request a new code.');
        }

        throw new Error(`Invalid verification code. ${remainingAttempts} attempt(s) remaining.`);
      }

      // Mark as verified
      await verification.markAsVerified();

      // Clean up other unverified codes for this phone
      await SmsVerification.deleteMany({
        phone: formattedPhone,
        verified: false,
        _id: { $ne: verification._id }
      });

      return {
        success: true,
        verified: true,
        phone: formattedPhone,
        userId: verification.userId,
        message: 'Phone number verified successfully'
      };

    } catch (error) {
      console.error('SMS verification failed:', error);
      throw error;
    }
  }

  /**
   * Resend verification code
   * @param {Object} options - Resend options
   * @param {string} options.phone - Phone number
   * @param {string} options.userId - User ID (optional)
   * @param {string} options.ipAddress - IP address (optional)
   * @returns {Promise<Object>} Result
   */
  async resendVerificationSms(options) {
    try {
      const formattedPhone = this.formatPhoneNumber(options.phone);

      // Delete old unverified codes for this phone
      await SmsVerification.deleteMany({
        phone: formattedPhone,
        verified: false
      });

      // Send new code
      return await this.sendVerificationSms(options);

    } catch (error) {
      console.error('Failed to resend SMS:', error);
      throw error;
    }
  }

  /**
   * Handle Twilio webhook (for delivery status)
   * @param {Object} webhookData - Webhook data from Twilio
   * @returns {Promise<Object>} Result
   */
  async handleTwilioWebhook(webhookData) {
    try {
      const {
        MessageSid,
        MessageStatus,
        To,
        ErrorCode,
        ErrorMessage
      } = webhookData;

      console.log(`📱 Twilio webhook: ${MessageSid} - ${MessageStatus} (To: ${To})`);

      // You can store webhook data or take actions based on status
      const statusInfo = {
        messageSid: MessageSid,
        status: MessageStatus,
        to: To,
        errorCode: ErrorCode,
        errorMessage: ErrorMessage,
        timestamp: new Date()
      };

      // Handle different statuses
      switch (MessageStatus) {
        case 'delivered':
          console.log(`✅ SMS delivered successfully to ${To}`);
          break;
        case 'failed':
        case 'undelivered':
          console.error(`❌ SMS delivery failed to ${To}: ${ErrorMessage || 'Unknown error'}`);
          break;
        case 'sent':
          console.log(`📤 SMS sent to ${To}`);
          break;
        default:
          console.log(`📱 SMS status: ${MessageStatus}`);
      }

      return statusInfo;

    } catch (error) {
      console.error('Webhook handling error:', error);
      throw error;
    }
  }

  /**
   * Get SMS statistics
   * @returns {Promise<Object>} Statistics
   */
  async getStatistics() {
    try {
      const stats = await SmsVerification.getStatistics();
      
      return {
        ...stats,
        serviceConfigured: this.isConfigured,
        phoneNumber: this.phoneNumber ? `***${this.phoneNumber.slice(-4)}` : null
      };
    } catch (error) {
      console.error('Failed to get statistics:', error);
      throw error;
    }
  }

  /**
   * Cleanup expired verifications
   * @returns {Promise<Object>} Cleanup results
   */
  async cleanupExpired() {
    try {
      return await SmsVerification.cleanupExpired();
    } catch (error) {
      console.error('Cleanup failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
module.exports = new SmsService();

