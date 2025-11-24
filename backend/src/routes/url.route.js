const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const qrService = require('../services/qrService');
const { authenticateToken } = require('../middleware/auth');

console.log('✅ URL ROUTES LOADED');

/**
 * GET /api/urls - Get user's URLs (requires authentication)
 * Returns list of URLs owned by the authenticated user
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('📋 GET /api/urls - Fetching user URLs');

    // Find URLs owned by the authenticated user
    const urls = await Url.find({ 
      userId: req.userId,
      isActive: true 
    })
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
 * GET /api/urls/:shortCode - Get specific URL details (public read, auth for ownership check)
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
      qrCodeDataUrl: url.qrCode?.dataUrl || null,
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
 * POST /api/urls - Create a new short URL (requires authentication)
 * Creates a shortened URL with optional custom slug
 */
router.post('/', authenticateToken, async (req, res) => {
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

    // Generate QR code automatically with default settings
    let qrCodeData = null;
    try {
      const qrCodeDataUrl = await qrService.generateQRCode(shortUrl, {
        size: 300,
        foregroundColor: '#000000',
        backgroundColor: '#FFFFFF',
        format: 'png'
      });
      
      qrCodeData = {
        dataUrl: qrCodeDataUrl,
        generated: new Date(),
        customizations: {
          foregroundColor: '#000000',
          backgroundColor: '#FFFFFF',
          size: 300
        }
      };
    } catch (error) {
      console.log('⚠️ QR code generation failed:', error.message);
    }

    // Create URL document (userId is required from authenticated user)
    const urlDoc = new Url({
      shortCode: slug,
      originalUrl: url,
      userId: req.userId, // Required - from authenticated token
      clicks: {
        count: 0
      },
      qrCode: qrCodeData,
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
        qrCode: qrCodeData,
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
 * DELETE /api/urls/:shortCode - Delete a URL (requires authentication)
 * Soft delete by setting isActive to false
 */
router.delete('/:shortCode', authenticateToken, async (req, res) => {
  try {
    const { shortCode } = req.params;

    console.log('🗑️ DELETE /api/urls/:shortCode - Deleting URL:', shortCode);

    // Find the URL
    const url = await Url.findOne({ shortCode: shortCode });

    if (!url) {
      console.log('❌ URL not found:', shortCode);
      return res.status(404).json({
        success: false,
        error: { code: 'URL_NOT_FOUND', message: 'URL not found' }
      });
    }

    // CRITICAL: Verify user owns this URL
    if (!url.userId || !url.userId.equals(req.userId)) {
      console.log('❌ Unauthorized delete attempt:', shortCode);
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You do not have permission to delete this URL' }
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
 * PUT /api/urls/:shortCode - Update a URL (requires authentication)
 * Update URL details like originalUrl or metadata
 */
router.put('/:shortCode', authenticateToken, async (req, res) => {
  try {
    const { shortCode } = req.params;
    const { originalUrl, metadata } = req.body;

    console.log('✏️ PUT /api/urls/:shortCode - Updating URL:', shortCode);

    const url = await Url.findOne({ shortCode: shortCode });

    if (!url) {
      console.log('❌ URL not found:', shortCode);
      return res.status(404).json({
        success: false,
        error: { code: 'URL_NOT_FOUND', message: 'URL not found' }
      });
    }

    // CRITICAL: Verify user owns this URL
    if (!url.userId || !url.userId.equals(req.userId)) {
      console.log('❌ Unauthorized update attempt:', shortCode);
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You do not have permission to update this URL' }
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
