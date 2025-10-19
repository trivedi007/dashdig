/**
 * Smart URL Routes - AI-powered slug generation
 */

const express = require('express');
const router = express.Router();
const { generateSmartSlug, clearCache, getCacheStats } = require('../services/aiUrlAnalyzer');

/**
 * POST /api/smart-url/generate
 * Generate a smart slug for a URL
 */
router.post('/generate', async (req, res) => {
  try {
    const { url } = req.body;

    // Validate URL
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required',
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid URL format',
      });
    }

    console.log('📨 Smart slug generation request:', url);

    // Generate smart slug
    const result = await generateSmartSlug(url);

    console.log('✅ Smart slug generated:', result);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('❌ Smart slug generation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate smart slug',
      message: error.message,
    });
  }
});

/**
 * POST /api/smart-url/batch
 * Generate smart slugs for multiple URLs
 */
router.post('/batch', async (req, res) => {
  try {
    const { urls } = req.body;

    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({
        success: false,
        error: 'URLs array is required',
      });
    }

    if (urls.length > 10) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 10 URLs per batch',
      });
    }

    console.log('📨 Batch smart slug generation:', urls.length, 'URLs');

    // Generate slugs in parallel
    const results = await Promise.all(
      urls.map(async url => {
        try {
          const result = await generateSmartSlug(url);
          return { url, ...result };
        } catch (error) {
          return {
            url,
            slug: 'Error',
            confidence: 'low',
            source: 'error',
            error: error.message,
          };
        }
      })
    );

    return res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('❌ Batch generation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate batch slugs',
    });
  }
});

/**
 * GET /api/smart-url/cache/stats
 * Get cache statistics
 */
router.get('/cache/stats', (req, res) => {
  try {
    const stats = getCacheStats();
    return res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('❌ Cache stats error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get cache stats',
    });
  }
});

/**
 * DELETE /api/smart-url/cache
 * Clear the cache
 */
router.delete('/cache', (req, res) => {
  try {
    const result = clearCache();
    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('❌ Cache clear error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to clear cache',
    });
  }
});

module.exports = router;

