const aiService = require('../services/ai.service');
const contextBuilder = require('../services/context-builder.service');
const DASHDIG_BRAND = require('../config/branding');

/**
 * Generate multiple URL slug suggestions
 * POST /api/suggestions/generate
 */
const generateSuggestions = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { url, keywords = [], userId } = req.body;

    // Validate URL
    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'URL is required and must be a string'
      });
    }

    // Validate URL format
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid URL format'
      });
    }

    // Validate URL protocol (must be http or https)
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        success: false,
        error: 'URL must use http or https protocol'
      });
    }

    // Validate keywords
    if (!Array.isArray(keywords)) {
      return res.status(400).json({
        success: false,
        error: 'Keywords must be an array'
      });
    }

    if (keywords.length > 10) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 10 keywords allowed'
      });
    }

    // Validate each keyword
    const invalidKeywords = keywords.filter(
      kw => typeof kw !== 'string' || kw.length > 50 || kw.trim().length === 0
    );
    
    if (invalidKeywords.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Each keyword must be a non-empty string with max 50 characters'
      });
    }

    // Clean and normalize keywords
    const cleanKeywords = keywords
      .map(kw => kw.trim())
      .filter(kw => kw.length > 0);

    console.log(`📝 Generating suggestions for URL: ${url}`);
    if (cleanKeywords.length > 0) {
      console.log(`📝 Keywords: ${cleanKeywords.join(', ')}`);
    }
    if (userId) {
      console.log(`📝 User ID: ${userId}`);
    }

    // Extract UTM parameters from URL
    const utmParams = extractUtmParams(url);

    // Generate suggestions using AI service with rich context
    const suggestions = await aiService.generateMultipleSuggestions(url, {
      keywords: cleanKeywords,
      userId: userId || req.userId || req.user?._id?.toString() || null,
      utmParams: utmParams,
      count: 5
    });

    // Fetch metadata for response (if available)
    let pageTitle = '';
    try {
      const metadata = await aiService.fetchMetadata(url);
      pageTitle = metadata.title || '';
    } catch (error) {
      console.warn('⚠️  Could not fetch page metadata:', error.message);
    }

    // Calculate generation time
    const generationTime = ((Date.now() - startTime) / 1000).toFixed(2);

    // Build preview URLs using DASHDIG_BRAND.urls.website
    const baseUrl = DASHDIG_BRAND.urls.website.replace(/\/$/, '');
    const suggestionsWithPreview = suggestions.map(suggestion => ({
      ...suggestion,
      previewUrl: `${baseUrl}/${suggestion.slug}`
    }));

    console.log(`✅ Generated ${suggestions.length} suggestions in ${generationTime}s`);

    // Return formatted response
    res.json({
      success: true,
      message: 'Suggestions generated successfully',
      data: {
        suggestions: suggestionsWithPreview,
        metadata: {
          originalUrl: url,
          pageTitle: pageTitle,
          generationTime: parseFloat(generationTime),
          cached: false // AI service handles caching internally
        }
      }
    });

  } catch (error) {
    console.error('❌ Error generating suggestions:', error);
    
    const generationTime = ((Date.now() - startTime) / 1000).toFixed(2);
    
    res.status(500).json({
      success: false,
      error: 'Failed to generate suggestions',
      message: error.message,
      metadata: {
        generationTime: parseFloat(generationTime)
      }
    });
  }
};

/**
 * Extract UTM parameters from URL
 * @param {string} url - URL with query parameters
 * @returns {Object} UTM parameters object
 */
function extractUtmParams(url) {
  try {
    const urlObj = new URL(url);
    return {
      source: urlObj.searchParams.get('utm_source') || null,
      medium: urlObj.searchParams.get('utm_medium') || null,
      campaign: urlObj.searchParams.get('utm_campaign') || null,
      content: urlObj.searchParams.get('utm_content') || null,
      term: urlObj.searchParams.get('utm_term') || null
    };
  } catch (error) {
    return {};
  }
}

module.exports = {
  generateSuggestions
};

