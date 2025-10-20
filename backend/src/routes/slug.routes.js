const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const { detectPattern, getSupportedPatterns } = require('../services/urlPatternDetector');

/**
 * Check slug availability
 * GET /api/slug/check/:slug
 */
router.get('/check/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    console.log(`🔍 Checking slug availability: ${slug}`);
    
    // Check if slug exists in database
    const existingUrl = await Url.findOne({ shortCode: slug });
    
    if (existingUrl) {
      console.log(`❌ Slug taken: ${slug}`);
      
      // Generate suggestions
      const suggestions = await generateSlugSuggestions(slug);
      
      return res.json({
        available: false,
        slug,
        message: 'This slug is already taken',
        suggestions
      });
    }
    
    console.log(`✅ Slug available: ${slug}`);
    
    return res.json({
      available: true,
      slug,
      message: 'This slug is available'
    });
    
  } catch (error) {
    console.error('Error checking slug:', error);
    res.status(500).json({
      error: 'Failed to check slug availability',
      details: error.message
    });
  }
});

/**
 * Generate slug suggestions when original is taken
 */
async function generateSlugSuggestions(baseSlug) {
  const suggestions = [];
  
  // Try numbered variations (v2, v3, etc.)
  for (let i = 2; i <= 5; i++) {
    const variant = `${baseSlug}.${i}`;
    const exists = await Url.findOne({ shortCode: variant });
    
    if (!exists) {
      suggestions.push({
        slug: variant,
        type: 'numbered',
        available: true
      });
    }
    
    // Stop after finding 3 available suggestions
    if (suggestions.length >= 3) break;
  }
  
  // If still not enough, try shorter versions
  if (suggestions.length < 3) {
    const parts = baseSlug.split('.');
    
    if (parts.length > 2) {
      // Try removing last part
      const shorter = parts.slice(0, -1).join('.');
      const exists = await Url.findOne({ shortCode: shorter });
      
      if (!exists) {
        suggestions.push({
          slug: shorter,
          type: 'shorter',
          available: true
        });
      }
    }
  }
  
  // If still not enough, try adding date
  if (suggestions.length < 3) {
    const year = new Date().getFullYear();
    const withYear = `${baseSlug}.${year}`;
    const exists = await Url.findOne({ shortCode: withYear });
    
    if (!exists) {
      suggestions.push({
        slug: withYear,
        type: 'dated',
        available: true
      });
    }
  }
  
  return suggestions;
}

/**
 * Detect URL pattern and suggest slug
 * POST /api/slug/detect-pattern
 */
router.post('/detect-pattern', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        error: 'URL is required'
      });
    }
    
    console.log(`🔍 Detecting pattern for: ${url}`);
    
    const result = detectPattern(url);
    
    res.json(result);
    
  } catch (error) {
    console.error('Error detecting pattern:', error);
    res.status(500).json({
      error: 'Failed to detect URL pattern',
      details: error.message
    });
  }
});

/**
 * Get list of supported patterns
 * GET /api/slug/patterns
 */
router.get('/patterns', (req, res) => {
  try {
    const patterns = getSupportedPatterns();
    res.json({
      count: patterns.length,
      patterns
    });
  } catch (error) {
    console.error('Error fetching patterns:', error);
    res.status(500).json({
      error: 'Failed to fetch supported patterns',
      details: error.message
    });
  }
});

/**
 * Get slug statistics (most popular patterns, etc.)
 * GET /api/slug/stats
 */
router.get('/stats', async (req, res) => {
  try {
    // Get top 10 most clicked slugs
    const topSlugs = await Url.find()
      .sort({ clicks: -1 })
      .limit(10)
      .select('shortCode clicks originalUrl createdAt');
    
    // Get total slugs created
    const totalSlugs = await Url.countDocuments();
    
    // Get average slug length
    const allSlugs = await Url.find().select('shortCode');
    const avgLength = allSlugs.reduce((sum, url) => sum + url.shortCode.length, 0) / allSlugs.length;
    
    // Get most common patterns (by first word)
    const patternCounts = {};
    allSlugs.forEach(url => {
      const firstWord = url.shortCode.split('.')[0];
      patternCounts[firstWord] = (patternCounts[firstWord] || 0) + 1;
    });
    
    const topPatterns = Object.entries(patternCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([pattern, count]) => ({ pattern, count }));
    
    res.json({
      totalSlugs,
      avgSlugLength: Math.round(avgLength * 10) / 10,
      topSlugs,
      topPatterns
    });
    
  } catch (error) {
    console.error('Error fetching slug stats:', error);
    res.status(500).json({
      error: 'Failed to fetch slug statistics',
      details: error.message
    });
  }
});

module.exports = router;

