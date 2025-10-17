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
    required: false,  // Changed to false to allow demo URLs with null userId
    default: null,    // Explicit default for demo URLs
    index: true
  },
  domain: {
    type: String,
    index: true,
    default: null
  },
  title: String,
  description: String,
  keywords: [String],
  qrCode: String,
  clicks: {
    count: { type: Number, default: 0 },
    limit: { type: Number, default: 10 },
    lastClickedAt: Date
  },
  expiresAt: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Check if expired
urlSchema.methods.hasExpired = function() {
  // Only check click limit if it's set and not null
  if (this.clicks.limit && this.clicks.limit > 0 && this.clicks.count >= this.clicks.limit) {
    return true;
  }
  if (this.expiresAt && new Date() > this.expiresAt) {
    return true;
  }
  return false;
};

module.exports = mongoose.model('Url', urlSchema);
