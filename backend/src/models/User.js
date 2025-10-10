const mongoose = require('mongoose');

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
verificationToken: { type: String, default: null }
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

userSchema.methods.generateVerificationToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.verificationToken = token;
  return token;
}
