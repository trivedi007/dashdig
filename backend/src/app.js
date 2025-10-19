const express = require('express');
const cors = require('cors');
const path = require('path');
const Url = require('./models/Url');

const app = express();

// Trust proxy for Railway
app.set('trust proxy', 1);

app.use((req, res, next) => { console.log('🌍', req.method, req.path); next(); });
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// ============================================
// ROUTES - ORDER MATTERS!
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Try to load API routes (if they exist)
try {
  const apiRoutes = require('./routes/api');
  app.use('/api', apiRoutes);
  console.log('✅ API routes loaded');
} catch (e) {
  console.log('⚠️  API routes not found, skipping');
}

// Smart URL routes (AI-powered slug generation)
try {
  const smartUrlRoutes = require('./routes/smartUrl.routes');
  app.use('/api/smart-url', smartUrlRoutes);
  console.log('✅ Smart URL routes loaded');
} catch (e) {
  console.log('⚠️  Smart URL routes not found, skipping');
}

// Public demo endpoint (no auth required)
app.post('/demo-url', async (req, res) => {
  try {
    const { url, keywords = [] } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Generate contextual slug
    const aiService = require('./services/ai.service');
    let slug = await aiService.generateHumanReadableUrl(url, keywords);
    
    // Ensure uniqueness
    const existing = await Url.findOne({ shortCode: slug });
    if (existing) {
      const timestamp = Date.now().toString(36).slice(-4);
      slug = `${slug}.${timestamp}`;
    }
    
    // Create URL document
    const urlDoc = new Url({
      shortCode: slug,
      originalUrl: url,
      keywords,
      userId: null, // Demo URLs have no user
      clicks: {
        count: 0,
        limit: null // Unlimited clicks for demo
      },
      isActive: true
    });
    
    await urlDoc.save();
    
    // Generate QR code
    const QRCode = require('qrcode');
    
    // Enhanced base URL logic with better fallbacks
    let baseUrl = 'https://dashdig-backend-production.up.railway.app'; // Default fallback
    
    if (process.env.BASE_URL) {
      baseUrl = process.env.BASE_URL;
    } else if (process.env.FRONTEND_URL) {
      baseUrl = process.env.FRONTEND_URL;
    } else if (process.env.NODE_ENV === 'production') {
      baseUrl = 'https://dashdig-backend-production.up.railway.app';
    } else {
      baseUrl = 'http://localhost:5001';
    }
    
    console.log('🔗 Demo URL Base URL used:', baseUrl);
    const fullUrl = `${baseUrl}/${slug}`;
    const qrCode = await QRCode.toDataURL(fullUrl);
    
    res.json({
      success: true,
      data: {
        shortUrl: fullUrl,
        slug: slug,
        qrCode: qrCode,
        expiresAfter: 'Never (Demo)'
      }
    });
    
  } catch (error) {
    console.error('Demo URL creation error:', error);
    res.status(500).json({ error: 'Failed to create demo URL' });
  }
});

// Try to load Auth routes (if they exist)
try {
  const authRoutes = require('./routes/auth');
  app.use('/auth', authRoutes);
  console.log('✅ Auth routes loaded');
} catch (e) {
  console.log('⚠️  Auth routes not found, skipping');
}

// Dashboard
app.get('/dashboard', (req, res) => {
  const dashboardPath = path.join(__dirname, '../public/dashboard.html');
  res.sendFile(dashboardPath, (err) => {
    if (err) {
      console.error('Dashboard file not found:', err);
      res.status(404).send('Dashboard not found');
    }
  });
});

// ============================================
// SLUG ROUTE - MUST BE AFTER SPECIFIC ROUTES!
// ============================================
// ============================================
// SLUG ROUTE - MUST BE AFTER SPECIFIC ROUTES!
// ============================================
app.get('/:slug', async (req, res) => {
  const slug = req.params.slug;
  
  // Enhanced logging
  console.log('==========================================');
  console.log('[SLUG LOOKUP] Received:', slug);
  console.log('[SLUG LOOKUP] Time:', new Date().toISOString());
  console.log('[SLUG LOOKUP] IP:', req.ip);
  
  try {
    // Query database - TRY shortCode FIRST!
    console.log('[SLUG LOOKUP] Querying database...');
    
    let record = await Url.findOne({ shortCode: slug }); // ✅ CORRECT FIELD!
    console.log('[SLUG LOOKUP] Tried "shortCode" field:', record ? 'FOUND' : 'not found');
    
    if (!record) {
      // Fallback to other field names if needed
      record = await Url.findOne({ slug: slug });
      console.log('[SLUG LOOKUP] Tried "slug" field:', record ? 'FOUND' : 'not found');
    }
    
    if (!record) {
      record = await Url.findOne({ short_id: slug });
      console.log('[SLUG LOOKUP] Tried "short_id" field:', record ? 'FOUND' : 'not found');
    }
    
    console.log('[SLUG LOOKUP] Final result:', record ? 'FOUND' : 'NOT FOUND');
    
    if (!record) {
      console.log('[SLUG LOOKUP] ❌ ERROR: No record found in database');
      console.log('==========================================');
      return res.status(404).send('URL not found - No database record exists for this short link');
    }
    
    console.log('[SLUG LOOKUP] ✅ Record found!');
    console.log('[SLUG LOOKUP] Record ID:', record._id);
    console.log('[SLUG LOOKUP] Original URL:', record.originalUrl);
    console.log('[SLUG LOOKUP] Current clicks:', record.clicks?.count || 0);
    
    // Increment click counter
    try {
      await Url.updateOne(
        { _id: record._id },
        { $inc: { 'clicks.count': 1 }, $set: { 'clicks.lastClickedAt': new Date() } }
      );
      console.log('[SLUG LOOKUP] ✅ Click counter incremented');
    } catch (updateError) {
      console.error('[SLUG LOOKUP] ⚠️  Failed to increment clicks:', updateError.message);
    }
    
    console.log('[SLUG LOOKUP] 🚀 Redirecting to:', record.originalUrl);
    console.log('==========================================');
    
    return res.redirect(301, record.originalUrl);
    
  } catch (error) {
    console.error('[SLUG LOOKUP] ❌ Database error:', error.message);
    console.log('==========================================');
    return res.status(500).send('Server error - Database query failed');
  }
});

// ============================================
// 404 HANDLER - MUST BE LAST!
// ============================================
app.use((req, res) => {
  console.log('[404] Path not found:', req.path);
  res.status(404).send('Page not found');
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[ERROR] Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
