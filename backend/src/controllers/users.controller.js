const User = require('../models/User');

/**
 * Get user preferences
 * GET /api/users/preferences
 */
const getPreferences = async (req, res) => {
  try {
    const user = req.user;
    
    // Ensure naming profile is initialized
    user.initializeNamingProfile();
    
    const preferences = {
      industry: user.namingProfile.industry || 'other',
      brandVoice: user.namingProfile.preferences.brandVoice || 'professional',
      preferredStyle: user.namingProfile.preferences.preferredStyle || 'auto',
      preferredLength: user.namingProfile.preferences.preferredLength || 'medium',
      avoidWords: user.namingProfile.preferences.avoidWords || [],
      mustInclude: user.namingProfile.preferences.mustInclude || [],
    };

    const detectedPattern = {
      structure: user.namingProfile.detectedPattern?.structure || null,
      avgWordCount: user.namingProfile.detectedPattern?.avgWordCount || 0,
      separator: user.namingProfile.detectedPattern?.separator || '.',
      capitalization: user.namingProfile.detectedPattern?.capitalization || 'TitleCase',
      includesBrand: user.namingProfile.detectedPattern?.includesBrand || false,
      includesYear: user.namingProfile.detectedPattern?.includesYear || false,
      usesCTA: user.namingProfile.detectedPattern?.usesCTA || false,
      confidence: user.namingProfile.detectedPattern?.confidence || 0,
    };

    res.json({
      success: true,
      preferences,
      detectedPattern,
    });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch preferences',
      message: error.message,
    });
  }
};

/**
 * Update user preferences
 * PUT /api/users/preferences
 */
const updatePreferences = async (req, res) => {
  try {
    const user = req.user;
    const {
      industry,
      brandVoice,
      preferredStyle,
      preferredLength,
      avoidWords,
      mustInclude,
    } = req.body;

    // Validate industry
    const validIndustries = [
      'ecommerce',
      'saas',
      'media',
      'marketing_agency',
      'nonprofit',
      'education',
      'real_estate',
      'finance',
      'other',
    ];
    if (industry && !validIndustries.includes(industry)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid industry value',
      });
    }

    // Validate brand voice
    const validBrandVoices = ['casual', 'professional', 'technical', 'playful'];
    if (brandVoice && !validBrandVoices.includes(brandVoice)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid brand voice value',
      });
    }

    // Validate preferred style
    const validStyles = [
      'brand_focused',
      'product_focused',
      'feature_focused',
      'benefit_focused',
      'action_focused',
      'auto',
    ];
    if (preferredStyle && !validStyles.includes(preferredStyle)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid preferred style value',
      });
    }

    // Validate preferred length
    const validLengths = ['short', 'medium', 'long'];
    if (preferredLength && !validLengths.includes(preferredLength)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid preferred length value',
      });
    }

    // Validate avoidWords and mustInclude are arrays
    if (avoidWords !== undefined && !Array.isArray(avoidWords)) {
      return res.status(400).json({
        success: false,
        error: 'avoidWords must be an array',
      });
    }

    if (mustInclude !== undefined && !Array.isArray(mustInclude)) {
      return res.status(400).json({
        success: false,
        error: 'mustInclude must be an array',
      });
    }

    // Ensure naming profile is initialized
    user.initializeNamingProfile();

    // Update preferences
    if (industry !== undefined) {
      user.namingProfile.industry = industry;
    }
    if (brandVoice !== undefined) {
      user.namingProfile.preferences.brandVoice = brandVoice;
    }
    if (preferredStyle !== undefined) {
      user.namingProfile.preferences.preferredStyle = preferredStyle;
    }
    if (preferredLength !== undefined) {
      user.namingProfile.preferences.preferredLength = preferredLength;
    }
    if (avoidWords !== undefined) {
      // Sanitize: trim, lowercase, remove empty strings
      user.namingProfile.preferences.avoidWords = avoidWords
        .map((word) => word.trim().toLowerCase())
        .filter((word) => word.length > 0);
    }
    if (mustInclude !== undefined) {
      // Sanitize: trim, remove empty strings (keep original case)
      user.namingProfile.preferences.mustInclude = mustInclude
        .map((word) => word.trim())
        .filter((word) => word.length > 0);
    }

    await user.save();

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: {
        industry: user.namingProfile.industry,
        brandVoice: user.namingProfile.preferences.brandVoice,
        preferredStyle: user.namingProfile.preferences.preferredStyle,
        preferredLength: user.namingProfile.preferences.preferredLength,
        avoidWords: user.namingProfile.preferences.avoidWords,
        mustInclude: user.namingProfile.preferences.mustInclude,
      },
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update preferences',
      message: error.message,
    });
  }
};

/**
 * Reset detected pattern
 * POST /api/users/preferences/reset-pattern
 */
const resetPattern = async (req, res) => {
  try {
    const user = req.user;

    // Ensure naming profile is initialized
    user.initializeNamingProfile();

    // Reset detected pattern
    user.namingProfile.detectedPattern = {
      structure: null,
      avgWordCount: 0,
      separator: '.',
      capitalization: 'TitleCase',
      includesBrand: false,
      includesYear: false,
      usesCTA: false,
      confidence: 0,
    };

    // Clear examples (optional - you might want to keep them)
    // user.namingProfile.examples = [];
    user.namingProfile.patternLastUpdated = new Date();

    await user.save();

    res.json({
      success: true,
      message: 'Pattern reset successfully',
    });
  } catch (error) {
    console.error('Error resetting pattern:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset pattern',
      message: error.message,
    });
  }
};

module.exports = {
  getPreferences,
  updatePreferences,
  resetPattern,
};













