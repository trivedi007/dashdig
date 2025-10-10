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
    required: true,
    index: true
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
  if (this.clicks.limit && this.clicks.count >= this.clicks.limit) {
    return true;
  }
  if (this.expiresAt && new Date() > this.expiresAt) {
    return true;
  }
  return false;
};

module.exports = mongoose.model('Url', urlSchema);
