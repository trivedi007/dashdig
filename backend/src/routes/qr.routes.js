const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const qrService = require('../services/qrService');

console.log('✅ QR ROUTES LOADED');

/**
 * POST /api/qr/generate - Generate customized QR code
 * Request body: { urlId, size, foregroundColor, backgroundColor, format }
 */
router.post('/generate', async (req, res) => {
  try {
    const { urlId, size, foregroundColor, backgroundColor, format } = req.body;

    console.log('🎨 POST /api/qr/generate - Generating customized QR code');

    // Validate required fields
    if (!urlId) {
      return res.status(400).json({
        success: false,
        error: 'urlId is required'
      });
    }

    // Find the URL
    const url = await Url.findById(urlId);

    if (!url) {
      return res.status(404).json({
        success: false,
        error: 'URL not found'
      });
    }

    // TODO: Validate user owns the URL (when auth is implemented)
    // if (req.user && url.userId && url.userId.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({
    //     success: false,
    //     error: 'Unauthorized'
    //   });
    // }

    // Calculate base URL
    const baseUrl = process.env.BASE_URL || 
                    process.env.FRONTEND_URL || 
                    'https://dashdig.com';
    const shortUrl = `${baseUrl}/${url.shortCode}`;

    // Generate customized QR code
    const qrOptions = {
      size: size || 300,
      foregroundColor: foregroundColor || '#000000',
      backgroundColor: backgroundColor || '#FFFFFF',
      format: format || 'png'
    };

    const qrCodeDataUrl = await qrService.generateQRCode(shortUrl, qrOptions);

    // Update URL document with customized QR code
    url.qrCode = {
      dataUrl: qrCodeDataUrl,
      generated: new Date(),
      customizations: {
        foregroundColor: qrOptions.foregroundColor,
        backgroundColor: qrOptions.backgroundColor,
        size: qrOptions.size
      }
    };

    await url.save();

    console.log('✅ QR code generated and saved');

    res.json({
      success: true,
      data: {
        qrCode: qrCodeDataUrl,
        format: qrOptions.format,
        size: qrOptions.size,
        foregroundColor: qrOptions.foregroundColor,
        backgroundColor: qrOptions.backgroundColor
      }
    });

  } catch (error) {
    console.error('❌ Error generating QR code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate QR code',
      message: error.message
    });
  }
});

/**
 * GET /api/qr/download/:urlId - Download QR code as file
 * Query params: ?format=png or ?format=svg
 */
router.get('/download/:urlId', async (req, res) => {
  try {
    const { urlId } = req.params;
    const format = req.query.format || 'png';

    console.log(`📥 GET /api/qr/download/:urlId - Downloading QR code (${format})`);

    // Find the URL
    const url = await Url.findById(urlId);

    if (!url) {
      return res.status(404).json({
        success: false,
        error: 'URL not found'
      });
    }

    // TODO: Validate user owns the URL (when auth is implemented)
    // if (req.user && url.userId && url.userId.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({
    //     success: false,
    //     error: 'Unauthorized'
    //   });
    // }

    // Calculate base URL
    const baseUrl = process.env.BASE_URL || 
                    process.env.FRONTEND_URL || 
                    'https://dashdig.com';
    const shortUrl = `${baseUrl}/${url.shortCode}`;

    // Get customization options from URL document or use defaults
    const customizations = url.qrCode?.customizations || {
      foregroundColor: '#000000',
      backgroundColor: '#FFFFFF',
      size: 300
    };

    if (format === 'svg') {
      // Generate SVG string
      const svgString = await qrService.generateQRCode(shortUrl, {
        size: customizations.size,
        foregroundColor: customizations.foregroundColor,
        backgroundColor: customizations.backgroundColor,
        format: 'svg'
      });

      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Content-Disposition', `attachment; filename="dashdig-${url.shortCode}.svg"`);
      res.send(svgString);
    } else {
      // Generate PNG buffer
      const buffer = await qrService.generateQRCodeBuffer(shortUrl, {
        size: customizations.size,
        foregroundColor: customizations.foregroundColor,
        backgroundColor: customizations.backgroundColor
      });

      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `attachment; filename="dashdig-${url.shortCode}.png"`);
      res.send(buffer);
    }

    console.log('✅ QR code downloaded');

  } catch (error) {
    console.error('❌ Error downloading QR code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to download QR code',
      message: error.message
    });
  }
});

module.exports = router;

