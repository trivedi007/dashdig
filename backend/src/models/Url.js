const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  shortCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true
  },
  originalUrl: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null,
    index: true
  },
  domain: {
    type: String,
    index: true,
    default: null
  },
  keywords: [String],
  metadata: {
    title: String,
    description: String,
    image: String
  },
  qrCode: {
    dataUrl: String,
    generated: Date,
    customizations: {
      foregroundColor: { type: String, default: '#000000' },
      backgroundColor: { type: String, default: '#FFFFFF' },
      size: { type: Number, default: 300 }
    }
  },
  clicks: {
    total: { type: Number, default: 0 },
    count: { type: Number, default: 0 }, // Alias for compatibility
    limit: { type: Number, default: null },
    lastClickedAt: Date,
    details: [{
      timestamp: Date,
      ip: String,
      userAgent: String,
      referrer: String
    }]
  },
  expires: {
    at: Date,
    afterClicks: { type: Number, default: null }
  },
  expiresAt: Date, // Keep for backward compatibility
  customizable: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for compatibility - sync clicks.total and clicks.count
urlSchema.pre('save', function(next) {
  if (this.clicks.count !== undefined) {
    this.clicks.total = this.clicks.count;
  }
  next();
});

// Check if expired
urlSchema.methods.hasExpired = function() {
  // Check click-based expiry
  if (this.expires && this.expires.afterClicks !== null && 
      this.clicks.total >= this.expires.afterClicks) {
    return true;
  }
  
  // Fallback to old click limit check for compatibility
  if (this.clicks.limit !== null && this.clicks.limit > 0 && 
      this.clicks.total >= this.clicks.limit) {
    return true;
  }
  
  // Check time-based expiry
  if (this.expires && this.expires.at && new Date() > this.expires.at) {
    return true;
  }
  
  // Fallback to old expiresAt check for compatibility
  if (this.expiresAt && new Date() > this.expiresAt) {
    return true;
  }
  
  return false;
};

module.exports = mongoose.model('Url', urlSchema);
