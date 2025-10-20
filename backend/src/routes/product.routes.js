/**
 * Product URL Parsing Routes
 * Enhanced smart URL generation with web scraping
 */

const express = require('express');
const router = express.Router();
const { parseProductUrl } = require('../services/productUrlParser');

/**
 * Parse product URL and generate smart slug
 * POST /api/product/parse
 */
router.post('/parse', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        error: 'URL is required'
      });
    }
    
    console.log(`📦 Parsing product URL: ${url}`);
    
    const result = await parseProductUrl(url);
    
    res.json({
      success: true,
      ...result
    });
    
  } catch (error) {
    console.error('Error parsing product URL:', error);
    res.status(500).json({
      error: 'Failed to parse product URL',
      details: error.message
    });
  }
});

/**
 * Batch parse multiple URLs
 * POST /api/product/parse-batch
 */
router.post('/parse-batch', async (req, res) => {
  try {
    const { urls } = req.body;
    
    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({
        error: 'URLs array is required'
      });
    }
    
    console.log(`📦 Batch parsing ${urls.length} URLs`);
    
    const results = await Promise.all(
      urls.map(url => parseProductUrl(url).catch(err => ({
        url,
        error: err.message
      })))
    );
    
    res.json({
      success: true,
      count: results.length,
      results
    });
    
  } catch (error) {
    console.error('Error batch parsing:', error);
    res.status(500).json({
      error: 'Failed to batch parse URLs',
      details: error.message
    });
  }
});

module.exports = router;

