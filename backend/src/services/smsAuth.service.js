/**
 * SMS Authentication Service
 * Handles SMS-based authentication using Twilio and Redis
 */

const twilio = require('twilio');
const { getRedis } = require('../config/redis');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

class SmsAuthService {
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
        console.warn('⚠️  Twilio credentials not configured for SMS auth.');
        this.isConfigured = false;
        return;
      }

      this.client = twilio(accountSid, authToken);
      this.isConfigured = true;
      console.log('✅ Twilio SMS Auth service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Twilio:', error.message);
      this.isConfigured = false;
    }
  }

  /**
   * Generate 6-digit verification code
   * @returns {string} 6-digit code
   */
  generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Validate E.164 phone number format
   * @param {string} phoneNumber - Phone number to validate
   * @returns {boolean}
   */
  isValidPhoneNumber(phoneNumber) {
    // E.164 format: +[country code][number], max 15 digits total
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return e164Regex.test(phoneNumber);
  }

  /**
   * Store verification code in Redis
   * @param {string} phoneNumber - Phone number (E.164 format)
   * @param {string} code - 6-digit code
   * @returns {Promise<void>}
   */
  async storeCode(phoneNumber, code) {
    const redis = getRedis();
    if (!redis) {
      throw new Error('Redis is not available');
    }

    const key = `sms:${phoneNumber}`;
    const expiry = 600; // 10 minutes in seconds

    await redis.setex(key, expiry, code);
  }

  /**
   * Verify code from Redis
   * @param {string} phoneNumber - Phone number (E.164 format)
   * @param {string} code - Code to verify
   * @returns {Promise<boolean>}
   */
  async verifyCode(phoneNumber, code) {
    const redis = getRedis();
    if (!redis) {
      throw new Error('Redis is not available');
    }

    const key = `sms:${phoneNumber}`;
    const storedCode = await redis.get(key);

    if (!storedCode) {
      return false; // Code expired or doesn't exist
    }

    if (storedCode === code) {
      // Delete code after successful verification
      await redis.del(key);
      return true;
    }

    return false;
  }

  /**
   * Check rate limit for phone number
   * @param {string} phoneNumber - Phone number (E.164 format)
   * @returns {Promise<{allowed: boolean, remaining: number, resetIn: number}>}
   */
  async checkRateLimit(phoneNumber) {
    const redis = getRedis();
    if (!redis) {
      // If Redis unavailable, allow but log warning
      console.warn('⚠️  Redis unavailable, skipping rate limit check');
      return { allowed: true, remaining: 3, resetIn: 3600 };
    }

    const key = `sms-ratelimit:${phoneNumber}`;
    const current = await redis.get(key);
    const limit = 3; // 3 SMS per hour
    const window = 3600; // 1 hour in seconds

    if (!current) {
      // First request, set counter
      await redis.setex(key, window, '1');
      return { allowed: true, remaining: limit - 1, resetIn: window };
    }

    const count = parseInt(current, 10);
    if (count >= limit) {
      const ttl = await redis.ttl(key);
      return { allowed: false, remaining: 0, resetIn: ttl };
    }

    // Increment counter
    await redis.incr(key);
    const ttl = await redis.ttl(key);
    return { allowed: true, remaining: limit - count - 1, resetIn: ttl };
  }

  /**
   * Send SMS via Twilio
   * @param {string} phoneNumber - Phone number (E.164 format)
   * @param {string} message - Message to send
   * @returns {Promise<Object>}
   */
  async sendSMS(phoneNumber, message) {
    if (!this.isConfigured) {
      throw new Error('SMS service is not configured');
    }

    try {
      const twilioResponse = await this.client.messages.create({
        body: message,
        from: this.phoneNumber,
        to: phoneNumber
      });

      console.log(`✅ SMS sent to ${phoneNumber}: ${twilioResponse.sid}`);
      return {
        success: true,
        messageSid: twilioResponse.sid
      };
    } catch (error) {
      console.error('Failed to send SMS:', error);
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }

  /**
   * Find or create user by phone number
   * @param {string} phoneNumber - Phone number (E.164 format)
   * @returns {Promise<User>}
   */
  async findOrCreateUser(phoneNumber) {
    let user = await User.findOne({ phone: phoneNumber });

    if (!user) {
      // Create new user
      user = new User({
        phone: phoneNumber,
        identifier: phoneNumber,
        phoneVerified: true,
        isVerified: true,
        isActive: true
      });
      await user.save();
      console.log(`✅ Created new user for phone: ${phoneNumber}`);
    } else {
      // Update existing user
      user.phoneVerified = true;
      user.isVerified = true;
      user.lastLogin = new Date();
      await user.save();
    }

    return user;
  }

  /**
   * Generate JWT token for user
   * @param {User} user - User object
   * @returns {string} JWT token
   */
  generateToken(user) {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    return jwt.sign(
      {
        userId: user._id.toString(),
        identifier: user.identifier,
        phone: user.phone
      },
      secret,
      { expiresIn: '30d' }
    );
  }
}

module.exports = new SmsAuthService();

