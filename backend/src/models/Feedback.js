const mongoose = require('mongoose');
const crypto = require('crypto');

const feedbackSchema = new mongoose.Schema({
  suggestionId: {
    type: String,
    required: true,
    index: true
  },
  vote: {
    type: String,
    enum: ['up', 'down', 'selected'],
    required: true,
    index: true
  },
  originalUrl: {
    type: String,
    required: true,
    index: true
  },
  suggestion: {
    slug: {
      type: String,
      required: true
    },
    style: {
      type: String,
      required: true,
      enum: ['brand_focused', 'product_focused', 'feature_focused', 'benefit_focused', 'action_focused'],
      index: true
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    },
    reasoning: String
  },
  allSuggestions: [{
    id: String,
    slug: String,
    style: {
      type: String,
      enum: ['brand_focused', 'product_focused', 'feature_focused', 'benefit_focused', 'action_focused']
    },
    confidence: Number
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  sessionId: {
    type: String,
    index: true
  },
  metadata: {
    pageTitle: String,
    generationTime: Number,
    userAgent: String,
    ipHash: String // Hashed IP for privacy
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Compound indexes for analytics queries
feedbackSchema.index({ 'suggestion.style': 1, vote: 1 });
feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ userId: 1, createdAt: -1 });
feedbackSchema.index({ sessionId: 1, createdAt: -1 });

// Static method to hash IP address
feedbackSchema.statics.hashIP = function(ip) {
  if (!ip) return null;
  return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
};

// Instance method to get vote rate
feedbackSchema.methods.toJSON = function() {
  const obj = this.toObject();
  // Don't expose IP hash in JSON responses
  if (obj.metadata && obj.metadata.ipHash) {
    delete obj.metadata.ipHash;
  }
  return obj;
};

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;

