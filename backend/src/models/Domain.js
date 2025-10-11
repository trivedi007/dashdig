const mongoose = require('mongoose');

const domainSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'failed', 'expired'],
    default: 'pending'
  },
  verificationMethod: {
    type: String,
    enum: ['dns', 'file', 'meta'],
    default: 'dns'
  },
  verificationToken: {
    type: String,
    required: true
  },
  dnsRecords: [{
    type: {
      type: String,
      enum: ['TXT', 'CNAME'],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }],
  sslEnabled: {
    type: Boolean,
    default: false
  },
  sslStatus: {
    type: String,
    enum: ['pending', 'active', 'failed', 'expired'],
    default: 'pending'
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'business'],
    default: 'free'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  verifiedAt: {
    type: Date
  },
  lastCheckedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
domainSchema.index({ userId: 1 });
domainSchema.index({ domain: 1 });
domainSchema.index({ status: 1 });
domainSchema.index({ verificationToken: 1 });

// Ensure only one default domain per user
domainSchema.index({ userId: 1, isDefault: 1 }, { 
  unique: true, 
  partialFilterExpression: { isDefault: true } 
});

module.exports = mongoose.model('Domain', domainSchema);
