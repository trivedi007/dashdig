const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    sparse: true, // Allows null for phone users
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    unique: true,
    sparse: true
  },
  identifier: {
    type: String,
    required: true,
    unique: true
  },
  profile: {
    name: String,
    company: String,
    avatar: String
  },
  subscription: {
    plan: {
      type: String,
      enum: ['trial', 'free', 'starter', 'pro', 'enterprise'],
      default: 'trial'
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'trialing'],
      default: 'trialing'
    },
    trialEndsAt: {
      type: Date,
      default: () => new Date(+new Date() + 7*24*60*60*1000) // 7 days
    },
    currentPeriodEnd: Date,
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    paymentMethodId: String
  },
  usage: {
    urlsCreated: { type: Number, default: 0 },
    totalClicks: { type: Number, default: 0 },
    currentMonth: {
      urls: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      resetAt: Date
    }
  },
  settings: {
    defaultExpiry: { type: Number, default: null },
    emailNotifications: { type: Boolean, default: true },
    weeklyReport: { type: Boolean, default: true },
    apiKey: String
  },
  lastLogin: Date,
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },
  verificationTokenExpires: { type: Date, default: null },
  verificationEmailSentCount: { type: Number, default: 0 },
  lastVerificationEmailSent: { type: Date, default: null }
}, {
  timestamps: true
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ 'subscription.stripeCustomerId': 1 });

// Pre-save hook to set identifier
userSchema.pre('save', function(next) {
  if (!this.identifier) {
    this.identifier = this.email || this.phone;
  }
  next();
});

// Check if trial has expired
userSchema.methods.hasTrialExpired = function() {
  return this.subscription.plan === 'trial' && 
         new Date() > this.subscription.trialEndsAt;
};

// Check usage limits
userSchema.methods.canCreateUrl = function() {
  const limits = {
    trial: 10,
    free: 25,
    starter: 250,
    pro: Infinity,
    enterprise: Infinity
  };

  const limit = limits[this.subscription.plan];
  return this.usage.currentMonth.urls < limit;
};

/**
 * Generate a secure verification token with expiration
 * @returns {string} The generated token
 */
userSchema.methods.generateVerificationToken = function() {
  // Generate 32 bytes random token (256 bits)
  const token = crypto.randomBytes(32).toString('hex');
  
  // Set token and expiration (24 hours from now)
  this.verificationToken = token;
  this.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  return token;
};

/**
 * Check if user can receive verification email (rate limiting)
 * Max 3 emails per hour
 * @returns {boolean}
 */
userSchema.methods.canSendVerificationEmail = function() {
  if (!this.lastVerificationEmailSent) {
    return true;
  }
  
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  // Reset counter if last email was sent more than an hour ago
  if (this.lastVerificationEmailSent < oneHourAgo) {
    this.verificationEmailSentCount = 0;
    return true;
  }
  
  // Check if under limit
  return this.verificationEmailSentCount < 3;
};

/**
 * Record verification email sent
 */
userSchema.methods.recordVerificationEmailSent = function() {
  this.verificationEmailSentCount = (this.verificationEmailSentCount || 0) + 1;
  this.lastVerificationEmailSent = new Date();
};

/**
 * Verify if token is valid and not expired
 * @param {string} token - Token to verify
 * @returns {boolean}
 */
userSchema.methods.isValidVerificationToken = function(token) {
  // Timing-safe comparison
  if (!this.verificationToken || !token) {
    return false;
  }
  
  // Check expiration
  if (this.verificationTokenExpires && this.verificationTokenExpires < new Date()) {
    return false;
  }
  
  // Use crypto.timingSafeEqual for timing-safe comparison
  const tokenBuffer = Buffer.from(token);
  const storedTokenBuffer = Buffer.from(this.verificationToken);
  
  if (tokenBuffer.length !== storedTokenBuffer.length) {
    return false;
  }
  
  try {
    return crypto.timingSafeEqual(tokenBuffer, storedTokenBuffer);
  } catch (error) {
    return false;
  }
};

/**
 * Generate a secure API key for the user
 * Format: ddig_live_[40 random characters] or ddig_test_[40 random characters]
 * @param {boolean} isTest - Whether to generate a test key
 * @returns {string} The generated API key
 */
userSchema.methods.generateApiKey = function(isTest = false) {
  const prefix = isTest ? 'ddig_test_' : 'ddig_live_';
  const randomBytes = crypto.randomBytes(30).toString('hex'); // 60 hex chars
  const apiKey = prefix + randomBytes.substring(0, 40); // Total: prefix + 40 chars
  
  if (!this.settings) {
    this.settings = {};
  }
  this.settings.apiKey = apiKey;
  
  return apiKey;
};

/**
 * Get or generate API key for the user
 * @returns {string} The user's API key
 */
userSchema.methods.getOrCreateApiKey = function() {
  if (this.settings?.apiKey) {
    return this.settings.apiKey;
  }
  
  const isTest = process.env.NODE_ENV !== 'production';
  return this.generateApiKey(isTest);
};

module.exports = mongoose.model('User', userSchema);
