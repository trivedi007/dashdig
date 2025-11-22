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
    apiKey: String // @deprecated - use apiKeys array instead
  },
  // API keys for public API v1
  apiKeys: [{
    name: { type: String, required: true },
    hashedKey: { type: String, required: true },
    keyPrefix: { type: String, required: true }, // For display: "dk_live_****abc123"
    permissions: {
      type: [String],
      default: ['links:read', 'links:write', 'stats:read', 'domains:read']
    },
    lastUsed: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
  }],
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
userSchema.index({ 'apiKeys.hashedKey': 1 });

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

// ============================================
// PUBLIC API V1 KEY MANAGEMENT
// ============================================

/**
 * Create a new API key for public API v1
 * Format: dk_live_[32 random characters]
 * @param {string} name - Name/description for this API key
 * @param {Array<string>} permissions - Permissions for this key
 * @returns {Promise<{apiKey: string, keyId: string}>}
 */
userSchema.methods.createApiKeyV1 = async function(name, permissions = null) {
  const bcrypt = require('bcryptjs');

  // Generate API key: dk_live_ + 32 random chars
  const randomPart = crypto.randomBytes(16).toString('hex'); // 32 hex chars
  const apiKey = `dk_live_${randomPart}`;

  // Hash the key for storage
  const hashedKey = await bcrypt.hash(apiKey, 10);

  // Create key prefix for display (first 8 and last 4 chars)
  const keyPrefix = `${apiKey.substring(0, 11)}****${apiKey.substring(apiKey.length - 4)}`;

  // Add to apiKeys array
  if (!this.apiKeys) {
    this.apiKeys = [];
  }

  this.apiKeys.push({
    name,
    hashedKey,
    keyPrefix,
    permissions: permissions || ['links:read', 'links:write', 'stats:read', 'domains:read'],
    createdAt: new Date(),
    isActive: true
  });

  await this.save();

  // Return the plain API key (only time it's shown) and the key ID
  const keyId = this.apiKeys[this.apiKeys.length - 1]._id.toString();

  return { apiKey, keyId, keyPrefix };
};

/**
 * Validate an API key and return the user
 * @param {string} apiKey - The API key to validate
 * @returns {Promise<{user: User, keyId: string}|null>}
 */
userSchema.statics.validateApiKey = async function(apiKey) {
  const bcrypt = require('bcryptjs');

  if (!apiKey || !apiKey.startsWith('dk_live_')) {
    return null;
  }

  // Find all users with active API keys
  const users = await this.find({
    'apiKeys.isActive': true,
    isActive: true
  });

  // Check each user's API keys
  for (const user of users) {
    for (const key of user.apiKeys) {
      if (!key.isActive) continue;

      const isValid = await bcrypt.compare(apiKey, key.hashedKey);
      if (isValid) {
        // Update last used timestamp
        key.lastUsed = new Date();
        await user.save();

        return { user, keyId: key._id.toString(), permissions: key.permissions };
      }
    }
  }

  return null;
};

/**
 * Revoke an API key
 * @param {string} keyId - The ID of the key to revoke
 * @returns {boolean}
 */
userSchema.methods.revokeApiKey = async function(keyId) {
  const key = this.apiKeys.id(keyId);
  if (!key) {
    return false;
  }

  key.isActive = false;
  await this.save();
  return true;
};

/**
 * Get rate limit for this user based on subscription tier
 * @returns {{limit: number, window: number}}
 */
userSchema.methods.getApiRateLimit = function() {
  const limits = {
    trial: { limit: 50, window: 3600 },      // 50 req/hr
    free: { limit: 100, window: 3600 },      // 100 req/hr
    starter: { limit: 500, window: 3600 },   // 500 req/hr
    pro: { limit: 1000, window: 3600 },      // 1000 req/hr
    enterprise: { limit: 5000, window: 3600 } // 5000 req/hr
  };

  return limits[this.subscription.plan] || limits.free;
};

/**
 * Get all active API keys (without hashed values)
 * @returns {Array}
 */
userSchema.methods.getApiKeysInfo = function() {
  if (!this.apiKeys) return [];

  return this.apiKeys
    .filter(key => key.isActive)
    .map(key => ({
      id: key._id.toString(),
      name: key.name,
      keyPrefix: key.keyPrefix,
      permissions: key.permissions,
      lastUsed: key.lastUsed,
      createdAt: key.createdAt
    }));
};

module.exports = mongoose.model('User', userSchema);
