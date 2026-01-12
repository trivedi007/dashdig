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
  phoneVerified: {
    type: Boolean,
    default: false
  },
  identifier: {
    type: String,
    required: true,
    unique: true
  },
  googleId: { 
    type: String, 
    sparse: true, // Allows null and unique only when present
    unique: true 
  },
  provider: { 
    type: String, 
    enum: ['email', 'phone', 'google', 'magic-link'],
    default: 'email' 
  },
  profile: {
    name: String,
    company: String,
    avatar: String
  },
  subscription: {
    plan: {
      type: String,
      enum: ['trial', 'free', 'starter', 'pro', 'business', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'trialing'],
      default: 'active'
    },
    trialEndsAt: {
      type: Date,
      default: () => new Date(+new Date() + 7*24*60*60*1000) // 7 days
    },
    currentPeriodEnd: Date,
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    paymentMethodId: String,
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false
    },
    planLimits: {
      urlsPerMonth: {
        type: Number,
        default: 25 // Free tier default
      },
      clicksTracked: {
        type: Number,
        default: 1000 // Free tier default
      },
      analyticsRetention: {
        type: Number,
        default: 7 // Days - Free tier default
      },
      aiModel: {
        type: String,
        enum: ['haiku', 'sonnet', 'opus'],
        default: 'haiku' // Free tier default
      }
    }
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
  lastVerificationEmailSent: { type: Date, default: null },
  
  // Naming preferences and pattern detection
  namingProfile: {
    // Detected patterns from user's history
    detectedPattern: {
      structure: String, // e.g., "Brand.Product.Feature.CTA"
      avgWordCount: { type: Number, default: 0 },
      separator: { type: String, default: '.' },
      capitalization: { 
        type: String, 
        enum: ['TitleCase', 'lowercase', 'UPPERCASE'], 
        default: 'TitleCase' 
      },
      includesBrand: { type: Boolean, default: true },
      includesYear: { type: Boolean, default: false },
      usesCTA: { type: Boolean, default: false },
      confidence: { type: Number, min: 0, max: 1, default: 0 }
    },
    
    // User's explicit preferences
    preferences: {
      preferredStyle: { 
        type: String, 
        enum: ['brand_focused', 'product_focused', 'feature_focused', 'benefit_focused', 'action_focused', 'auto'],
        default: 'auto'
      },
      preferredLength: {
        type: String,
        enum: ['short', 'medium', 'long'], // 2-3 words, 4-5 words, 6+ words
        default: 'medium'
      },
      avoidWords: [String], // Words to never include
      mustInclude: [String], // Words to always try to include
      brandVoice: {
        type: String,
        enum: ['casual', 'professional', 'technical', 'playful'],
        default: 'professional'
      }
    },
    
    // Historical examples for pattern learning
    examples: [{
      slug: String,
      originalUrl: String,
      wasSelected: { type: Boolean, default: true }, // Did user pick this vs custom
      createdAt: { type: Date, default: Date.now }
    }],
    
    // Industry for template suggestions
    industry: {
      type: String,
      enum: ['ecommerce', 'saas', 'media', 'marketing_agency', 'nonprofit', 'education', 'real_estate', 'finance', 'other'],
      default: 'other'
    },
    
    // Analytics
    urlsAnalyzed: { type: Number, default: 0 },
    patternLastUpdated: Date
  },
  
  // Profile completion tracking
  profileComplete: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ 'subscription.stripeCustomerId': 1 });
userSchema.index({ 'apiKeys.hashedKey': 1 });
userSchema.index({ 'namingProfile.preferences.preferredStyle': 1 });
userSchema.index({ 'namingProfile.industry': 1 });
userSchema.index({ 'namingProfile.patternLastUpdated': 1 });

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
  // Use planLimits if available, otherwise fall back to defaults
  if (this.subscription.planLimits && this.subscription.planLimits.urlsPerMonth) {
    const limit = this.subscription.planLimits.urlsPerMonth;
    // Infinity for unlimited plans
    if (limit === -1) return true;
    return this.usage.currentMonth.urls < limit;
  }
  
  // Fallback to hardcoded limits for backwards compatibility
  const limits = {
    trial: 10,
    free: 25,
    starter: 250,
    pro: Infinity,
    business: 1000,
    enterprise: Infinity
  };

  const limit = limits[this.subscription.plan] || 25;
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
    business: { limit: 2500, window: 3600 }, // 2500 req/hr
    enterprise: { limit: 5000, window: 3600 } // 5000 req/hr
  };

  return limits[this.subscription.plan] || limits.free;
};

/**
 * Get plan limits with defaults
 * @returns {{urlsPerMonth: number, clicksTracked: number, analyticsRetention: number, aiModel: string}}
 */
userSchema.methods.getPlanLimits = function() {
  // Return custom plan limits if set
  if (this.subscription.planLimits) {
    return {
      urlsPerMonth: this.subscription.planLimits.urlsPerMonth || 25,
      clicksTracked: this.subscription.planLimits.clicksTracked || 1000,
      analyticsRetention: this.subscription.planLimits.analyticsRetention || 7,
      aiModel: this.subscription.planLimits.aiModel || 'haiku'
    };
  }

  // Default limits based on plan
  const defaultLimits = {
    trial: { urlsPerMonth: 10, clicksTracked: 500, analyticsRetention: 7, aiModel: 'haiku' },
    free: { urlsPerMonth: 25, clicksTracked: 1000, analyticsRetention: 7, aiModel: 'haiku' },
    starter: { urlsPerMonth: 250, clicksTracked: 10000, analyticsRetention: 30, aiModel: 'haiku' },
    pro: { urlsPerMonth: -1, clicksTracked: -1, analyticsRetention: 90, aiModel: 'sonnet' }, // -1 = unlimited
    business: { urlsPerMonth: -1, clicksTracked: -1, analyticsRetention: 180, aiModel: 'sonnet' },
    enterprise: { urlsPerMonth: -1, clicksTracked: -1, analyticsRetention: 365, aiModel: 'opus' }
  };

  return defaultLimits[this.subscription.plan] || defaultLimits.free;
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

// ============================================
// NAMING PROFILE METHODS
// ============================================

/**
 * Initialize naming profile with defaults if not exists
 */
userSchema.methods.initializeNamingProfile = function() {
  if (!this.namingProfile) {
    this.namingProfile = {
      detectedPattern: {
        confidence: 0,
        separator: '.',
        capitalization: 'TitleCase',
        includesBrand: true,
        includesYear: false,
        usesCTA: false,
        avgWordCount: 0
      },
      preferences: {
        preferredStyle: 'auto',
        preferredLength: 'medium',
        avoidWords: [],
        mustInclude: [],
        brandVoice: 'professional'
      },
      examples: [],
      industry: 'other',
      urlsAnalyzed: 0
    };
  }
  return this;
};

/**
 * Add an example to the naming profile
 * @param {string} slug - The slug that was used
 * @param {string} originalUrl - The original URL
 * @param {boolean} wasSelected - Whether user selected this vs custom
 */
userSchema.methods.addNamingExample = function(slug, originalUrl, wasSelected = true) {
  this.initializeNamingProfile();
  
  if (!this.namingProfile.examples) {
    this.namingProfile.examples = [];
  }
  
  // Add example (keep last 100)
  this.namingProfile.examples.push({
    slug,
    originalUrl,
    wasSelected,
    createdAt: new Date()
  });
  
  // Keep only last 100 examples
  if (this.namingProfile.examples.length > 100) {
    this.namingProfile.examples = this.namingProfile.examples.slice(-100);
  }
  
  this.namingProfile.urlsAnalyzed = (this.namingProfile.urlsAnalyzed || 0) + 1;
  this.namingProfile.patternLastUpdated = new Date();
  
  return this;
};

/**
 * Update detected pattern based on examples
 * This should be called periodically or after enough examples are collected
 */
userSchema.methods.updateDetectedPattern = function() {
  this.initializeNamingProfile();
  
  if (!this.namingProfile.examples || this.namingProfile.examples.length === 0) {
    return this;
  }
  
  const examples = this.namingProfile.examples.filter(e => e.wasSelected);
  if (examples.length < 3) {
    // Need at least 3 examples to detect pattern
    this.namingProfile.detectedPattern.confidence = 0;
    return this;
  }
  
  // Analyze patterns
  const slugs = examples.map(e => e.slug);
  const wordCounts = slugs.map(slug => slug.split(/[.\-_]/).length);
  const avgWordCount = wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length;
  
  // Detect separator
  const separators = { '.': 0, '-': 0, '_': 0 };
  slugs.forEach(slug => {
    if (slug.includes('.')) separators['.']++;
    if (slug.includes('-')) separators['-']++;
    if (slug.includes('_')) separators['_']++;
  });
  const mostCommonSeparator = Object.keys(separators).reduce((a, b) => 
    separators[a] > separators[b] ? a : b
  );
  
  // Detect capitalization
  const titleCaseCount = slugs.filter(s => /^[A-Z]/.test(s.split(/[.\-_]/)[0])).length;
  const lowercaseCount = slugs.filter(s => /^[a-z]/.test(s.split(/[.\-_]/)[0])).length;
  const capitalization = titleCaseCount > lowercaseCount ? 'TitleCase' : 'lowercase';
  
  // Detect common patterns
  const includesBrand = slugs.some(s => {
    const words = s.split(/[.\-_]/);
    return words.length > 0 && /^[A-Z]/.test(words[0]);
  });
  
  const includesYear = slugs.some(s => /\b(20\d{2}|19\d{2})\b/.test(s));
  const usesCTA = slugs.some(s => {
    const ctaWords = ['buy', 'deal', 'sale', 'now', 'shop', 'get', 'today'];
    return ctaWords.some(word => s.toLowerCase().includes(word));
  });
  
  // Calculate confidence based on consistency
  const consistency = Math.min(examples.length / 10, 1); // Max confidence at 10+ examples
  const confidence = Math.min(consistency * 0.9, 0.95); // Cap at 95%
  
  // Update detected pattern
  this.namingProfile.detectedPattern = {
    avgWordCount: Math.round(avgWordCount * 10) / 10,
    separator: mostCommonSeparator,
    capitalization,
    includesBrand,
    includesYear,
    usesCTA,
    confidence,
    structure: this._inferStructure(slugs)
  };
  
  this.namingProfile.patternLastUpdated = new Date();
  
  return this;
};

/**
 * Infer structure pattern from slugs
 * @private
 */
userSchema.methods._inferStructure = function(slugs) {
  // Simple structure inference
  const avgWords = slugs.reduce((sum, s) => sum + s.split(/[.\-_]/).length, 0) / slugs.length;
  
  if (avgWords <= 3) {
    return 'Brand.Product';
  } else if (avgWords <= 5) {
    return 'Brand.Product.Feature';
  } else {
    return 'Brand.Product.Feature.CTA';
  }
};

/**
 * Get preferred style for AI generation
 * Returns 'auto' if user wants auto-detection, otherwise returns the preferred style
 */
userSchema.methods.getPreferredStyle = function() {
  this.initializeNamingProfile();
  
  if (this.namingProfile.preferences.preferredStyle === 'auto') {
    // Use detected pattern if confidence is high enough
    if (this.namingProfile.detectedPattern.confidence > 0.7) {
      // Map detected pattern to style
      if (this.namingProfile.detectedPattern.includesBrand) {
        return 'brand_focused';
      }
      if (this.namingProfile.detectedPattern.usesCTA) {
        return 'action_focused';
      }
      return 'product_focused';
    }
    return 'auto'; // Let AI decide
  }
  
  return this.namingProfile.preferences.preferredStyle;
};

/**
 * Check if profile is complete
 */
userSchema.methods.checkProfileComplete = function() {
  this.initializeNamingProfile();
  
  const hasPreferences = this.namingProfile.preferences.preferredStyle !== 'auto' ||
                        this.namingProfile.preferences.preferredLength !== 'medium' ||
                        (this.namingProfile.preferences.avoidWords && this.namingProfile.preferences.avoidWords.length > 0) ||
                        (this.namingProfile.preferences.mustInclude && this.namingProfile.preferences.mustInclude.length > 0);
  
  const hasIndustry = this.namingProfile.industry !== 'other';
  const hasPattern = this.namingProfile.detectedPattern.confidence > 0.5;
  
  this.profileComplete = hasPreferences || hasIndustry || hasPattern;
  
  return this.profileComplete;
};

module.exports = mongoose.model('User', userSchema);
