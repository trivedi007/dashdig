const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const QRCode = require('qrcode');

console.log('✅ URL ROUTES LOADED');

/**
 * GET /api/urls - Get all URLs
 * Returns list of all URLs in the database
 * No authentication required (for now)
 */
router.get('/', async (req, res) => {
  try {
    console.log('📋 GET /api/urls - Fetching all URLs');

    // Find all active URLs
    const urls = await Url.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(100)
      .select('shortCode originalUrl clicks createdAt updatedAt metadata')
      .lean();

    console.log(`✅ Found ${urls.length} URLs`);

    // Calculate base URL
    const baseUrl = process.env.BASE_URL || 
                    process.env.FRONTEND_URL || 
                    'https://dashdig.com';

    // Format URLs for response
    const formattedUrls = urls.map(url => ({
      _id: url._id,
      shortCode: url.shortCode,
      shortUrl: `${baseUrl}/${url.shortCode}`,
      originalUrl: url.originalUrl,
      clicks: url.clicks?.count || url.clicks || 0,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
      metadata: url.metadata
    }));

    res.json({
      success: true,
      data: formattedUrls,
      count: formattedUrls.length
    });

  } catch (error) {
    console.error('❌ Error fetching URLs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch URLs',
      message: error.message
    });
  }
});

/**
 * GET /api/urls/:shortCode - Get specific URL details
 * Returns full URL object with analytics
 */
router.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    
    console.log('🔍 GET /api/urls/:shortCode - Fetching URL:', shortCode);

    const url = await Url.findOne({
      shortCode: shortCode,
      isActive: true
    }).lean();

    if (!url) {
      console.log('❌ URL not found:', shortCode);
      return res.status(404).json({
        success: false,
        error: 'URL not found'
      });
    }

    console.log('✅ URL found:', url.shortCode);

    // Calculate base URL
    const baseUrl = process.env.BASE_URL || 
                    process.env.FRONTEND_URL || 
                    'https://dashdig.com';

    // Format response
    const formattedUrl = {
      _id: url._id,
      shortCode: url.shortCode,
      shortUrl: `${baseUrl}/${url.shortCode}`,
      originalUrl: url.originalUrl,
      clicks: url.clicks?.count || url.clicks || 0,
      totalClicks: url.clicks?.total || url.clicks?.count || url.clicks || 0,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
      metadata: url.metadata,
      keywords: url.keywords,
      qrCode: url.qrCode,
      expiresAt: url.expiresAt || url.expires?.at || null,
      isActive: url.isActive
    };

    res.json({
      success: true,
      data: formattedUrl
    });

  } catch (error) {
    console.error('❌ Error fetching URL:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch URL details',
      message: error.message
    });
  }
});

/**
 * POST /api/urls - Create a new short URL
 * Creates a shortened URL with optional custom slug
 */
router.post('/', async (req, res) => {
  try {
    const { url, customSlug, keywords } = req.body;

    console.log('➕ POST /api/urls - Creating new URL:', url);

    // Validate URL
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required'
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        success: false,
        error: 'Invalid URL format'
      });
    }

    // Generate or use custom slug
    let slug = customSlug;
    
    if (!slug) {
      // Generate AI slug if available
      try {
        const aiService = require('../services/ai.service');
        slug = await aiService.generateHumanReadableUrl(url, keywords || []);
      } catch (error) {
        console.log('⚠️ AI slug generation failed, using random:', error.message);
        // Fallback to random slug
        slug = Math.random().toString(36).substring(2, 8);
      }
    }

    // Ensure slug is unique
    const existing = await Url.findOne({ shortCode: slug });
    if (existing) {
      if (customSlug) {
        return res.status(400).json({
          success: false,
          error: 'Custom slug already in use'
        });
      }
      // Add timestamp to make it unique
      const timestamp = Date.now().toString(36).slice(-4);
      slug = `${slug}.${timestamp}`;
    }

    // Calculate base URL
    const baseUrl = process.env.BASE_URL || 
                    process.env.FRONTEND_URL || 
                    'https://dashdig.com';

    const shortUrl = `${baseUrl}/${slug}`;

    // Generate QR code
    let qrCode = null;
    try {
      qrCode = await QRCode.toDataURL(shortUrl);
    } catch (error) {
      console.log('⚠️ QR code generation failed:', error.message);
    }

    // Create URL document
    const urlDoc = new Url({
      shortCode: slug,
      originalUrl: url,
      userId: req.user?._id || req.user?.id || null,
      clicks: {
        count: 0
      },
      qrCode: qrCode,
      keywords: keywords || [],
      isActive: true
    });

    await urlDoc.save();

    console.log('✅ URL created:', slug);

    res.json({
      success: true,
      data: {
        _id: urlDoc._id,
        shortCode: slug,
        shortUrl: shortUrl,
        originalUrl: url,
        clicks: 0,
        qrCode: qrCode,
        createdAt: urlDoc.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Error creating URL:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create short URL',
      message: error.message
    });
  }
});

/**
 * DELETE /api/urls/:shortCode - Delete a URL
 * Soft delete by setting isActive to false
 */
router.delete('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    console.log('🗑️ DELETE /api/urls/:shortCode - Deleting URL:', shortCode);

    // Find the URL
    const url = await Url.findOne({ shortCode: shortCode });

    if (!url) {
      console.log('❌ URL not found:', shortCode);
      return res.status(404).json({
        success: false,
        error: 'URL not found'
      });
    }

    // Soft delete by setting isActive to false
    url.isActive = false;
    await url.save();

    console.log('✅ URL deleted:', shortCode);

    res.json({
      success: true,
      message: 'URL deleted successfully',
      data: {
        shortCode: shortCode,
        deletedAt: new Date()
      }
    });

  } catch (error) {
    console.error('❌ Error deleting URL:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete URL',
      message: error.message
    });
  }
});

/**
 * PUT /api/urls/:shortCode - Update a URL
 * Update URL details like originalUrl or metadata
 */
router.put('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const { originalUrl, metadata } = req.body;

    console.log('✏️ PUT /api/urls/:shortCode - Updating URL:', shortCode);

    const url = await Url.findOne({ shortCode: shortCode });

    if (!url) {
      console.log('❌ URL not found:', shortCode);
      return res.status(404).json({
        success: false,
        error: 'URL not found'
      });
    }

    // Update fields
    if (originalUrl) {
      // Validate URL format
      try {
        new URL(originalUrl);
        url.originalUrl = originalUrl;
      } catch {
        return res.status(400).json({
          success: false,
          error: 'Invalid URL format'
        });
      }
    }

    if (metadata) {
      url.metadata = { ...url.metadata, ...metadata };
    }

    url.updatedAt = new Date();
    await url.save();

    console.log('✅ URL updated:', shortCode);

    // Calculate base URL
    const baseUrl = process.env.BASE_URL || 
                    process.env.FRONTEND_URL || 
                    'https://dashdig.com';

    res.json({
      success: true,
      message: 'URL updated successfully',
      data: {
        _id: url._id,
        shortCode: url.shortCode,
        shortUrl: `${baseUrl}/${url.shortCode}`,
        originalUrl: url.originalUrl,
        clicks: url.clicks?.count || url.clicks || 0,
        metadata: url.metadata,
        updatedAt: url.updatedAt
      }
    });

  } catch (error) {
    console.error('❌ Error updating URL:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update URL',
      message: error.message
    });
  }
});

module.exports = router;
