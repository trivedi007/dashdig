const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const QRCode = require('qrcode');

// Middleware to extract API key (simple version)
const authenticateApiKey = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // For demo purposes, accept any API key
  // In production, validate against database
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Missing or invalid API key' 
    });
  }
  
  const apiKey = authHeader.replace('Bearer ', '');
  
  // TODO: Validate API key against database
  // For now, accept any non-empty key
  if (!apiKey) {
    return res.status(401).json({ 
      error: 'Invalid API key' 
    });
  }
  
  req.apiKey = apiKey;
  next();
};

// POST /api/shorten - Shorten a URL
router.post('/shorten', authenticateApiKey, async (req, res) => {
  try {
    const { url, customSlug, expiresAt } = req.body;
    
    // Validate URL
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }
    
    // Generate or use custom slug
    let slug = customSlug;
    
    if (!slug) {
      // Generate AI slug
      const aiService = require('../services/ai.service');
      slug = await aiService.generateHumanReadableUrl(url, []);
    }
    
    // Ensure slug is unique
    const existing = await Url.findOne({ shortCode: slug });
    if (existing) {
      if (customSlug) {
        return res.status(400).json({ 
          error: 'Custom slug already in use' 
        });
      }
      // Add timestamp to make it unique
      const timestamp = Date.now().toString(36).slice(-4);
      slug = `${slug}.${timestamp}`;
    }
    
    // Create URL document
    const urlDoc = new Url({
      shortCode: slug,
      originalUrl: url,
      userId: null, // TODO: Get from API key
      clicks: {
        count: 0,
        limit: null
      },
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: true
    });
    
    await urlDoc.save();
    
    // Generate short URL
    const baseUrl = process.env.BASE_URL || 
                    process.env.FRONTEND_URL || 
                    'https://dashdig.com';
    
    const normalizedBase = (process.env.SHORT_URL_BASE || baseUrl).replace(/\/$/, '');
    const shortUrl = `${normalizedBase}/${slug}`;
    
    // Generate QR code
    const qrCode = await QRCode.toDataURL(shortUrl);
    
    res.json({
      shortUrl: shortUrl,
      shortCode: slug,
      originalUrl: url,
      qrCode: qrCode,
      createdAt: urlDoc.createdAt,
      expiresAt: urlDoc.expiresAt
    });
    
  } catch (error) {
    console.error('Shorten URL error:', error);
    res.status(500).json({ 
      error: 'Failed to shorten URL',
      message: error.message 
    });
  }
});

// POST /api/analytics - Track analytics events
router.post('/analytics', authenticateApiKey, async (req, res) => {
  try {
    const { shortCode, event, data } = req.body;
    
    if (!shortCode || !event) {
      return res.status(400).json({ 
        error: 'shortCode and event are required' 
      });
    }
    
    // TODO: Store analytics event
    // For now, just acknowledge
    console.log('Analytics event:', { shortCode, event, data });
    
    res.json({ success: true });
    
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ 
      error: 'Failed to track analytics' 
    });
  }
});

module.exports = router;
