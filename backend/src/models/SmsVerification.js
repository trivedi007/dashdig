/**
 * SMS Verification Model
 * Stores SMS verification codes (OTP) for 2FA
 */

const mongoose = require('mongoose');

const smsVerificationSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  code: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true, // Index for TTL and cleanup
    default: () => new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3
  },
  verified: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  ipAddress: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Compound index for efficient lookups
smsVerificationSchema.index({ phone: 1, verified: 1 });
smsVerificationSchema.index({ phone: 1, expiresAt: 1 });

// TTL index to automatically delete expired documents after 1 hour
smsVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 3600 });

/**
 * Check if code is valid and not expired
 * @param {string} code - The code to verify
 * @returns {boolean}
 */
smsVerificationSchema.methods.isValidCode = function(code) {
  // Check if already verified
  if (this.verified) {
    return false;
  }
  
  // Check if expired
  if (new Date() > this.expiresAt) {
    return false;
  }
  
  // Check max attempts
  if (this.attempts >= 3) {
    return false;
  }
  
  // Compare codes (string comparison is safe for numeric codes)
  return this.code === code;
};

/**
 * Increment verification attempts
 */
smsVerificationSchema.methods.incrementAttempts = function() {
  this.attempts += 1;
  return this.save();
};

/**
 * Mark as verified
 */
smsVerificationSchema.methods.markAsVerified = function() {
  this.verified = true;
  this.verifiedAt = new Date();
  return this.save();
};

/**
 * Check if SMS can be resent (rate limiting)
 * @param {string} phone - Phone number
 * @returns {Promise<Object>} { canResend: boolean, waitTime: number }
 */
smsVerificationSchema.statics.canResendSms = async function(phone) {
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  
  const recentSms = await this.findOne({
    phone,
    sentAt: { $gt: oneMinuteAgo }
  }).sort({ sentAt: -1 });
  
  if (!recentSms) {
    return { canResend: true, waitTime: 0 };
  }
  
  const timeSinceSent = Date.now() - recentSms.sentAt.getTime();
  const waitTime = 60 - Math.floor(timeSinceSent / 1000);
  
  return {
    canResend: waitTime <= 0,
    waitTime: Math.max(0, waitTime)
  };
};

/**
 * Find active verification for phone number
 * @param {string} phone - Phone number
 * @returns {Promise<Object>} Verification document
 */
smsVerificationSchema.statics.findActiveVerification = function(phone) {
  return this.findOne({
    phone,
    verified: false,
    expiresAt: { $gt: new Date() },
    attempts: { $lt: 3 }
  }).sort({ createdAt: -1 });
};

/**
 * Cleanup expired and old verifications
 * @returns {Promise<Object>} Cleanup results
 */
smsVerificationSchema.statics.cleanupExpired = async function() {
  const now = new Date();
  
  // Delete expired verifications
  const expiredResult = await this.deleteMany({
    expiresAt: { $lt: now }
  });
  
  // Delete verified verifications older than 24 hours
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const oldVerifiedResult = await this.deleteMany({
    verified: true,
    verifiedAt: { $lt: oneDayAgo }
  });
  
  return {
    expiredDeleted: expiredResult.deletedCount,
    oldVerifiedDeleted: oldVerifiedResult.deletedCount,
    total: expiredResult.deletedCount + oldVerifiedResult.deletedCount
  };
};

/**
 * Get statistics
 * @returns {Promise<Object>} Statistics
 */
smsVerificationSchema.statics.getStatistics = async function() {
  const now = new Date();
  
  const total = await this.countDocuments();
  const active = await this.countDocuments({
    verified: false,
    expiresAt: { $gt: now },
    attempts: { $lt: 3 }
  });
  const verified = await this.countDocuments({ verified: true });
  const expired = await this.countDocuments({ expiresAt: { $lt: now } });
  const maxAttempts = await this.countDocuments({ attempts: { $gte: 3 } });
  
  return {
    total,
    active,
    verified,
    expired,
    maxAttempts
  };
};

module.exports = mongoose.model('SmsVerification', smsVerificationSchema);

