const express = require('express');
const cors = require('cors');
const path = require('path');
const Url = require('./models/Url');

const app = express();

// Trust proxy for Railway
app.set('trust proxy', 1);

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

// API routes
app.use('/api', require('./routes/api'));

// Auth routes (if they exist)
try {
  app.use('/auth', require('./routes/auth'));
} catch (e) {
  console.log('⚠️  Auth routes not found, skipping');
}

// Dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

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
    // Query database - try multiple field names
    let record = await Url.findOne({ slug: slug });
    
    if (!record) {
      record = await Url.findOne({ short_id: slug });
    }
    
    if (!record) {
      record = await Url.findOne({ shortCode: slug });
    }
    
    console.log('[SLUG LOOKUP] Database result:', record ? 'FOUND' : 'NOT FOUND');
    
    if (!record) {
      console.log('[SLUG LOOKUP] ERROR: No record in database for:', slug);
      return res.status(404).send('URL not found');
    }
    
    console.log('[SLUG LOOKUP] Found record ID:', record._id);
    console.log('[SLUG LOOKUP] Original URL:', record.originalUrl);
    console.log('[SLUG LOOKUP] Current clicks:', record.clicks || 0);
    
    // Increment click counter
    try {
      await Url.updateOne(
        { _id: record._id },
        { $inc: { clicks: 1 } }
      );
      console.log('[SLUG LOOKUP] Click counter incremented');
    } catch (updateError) {
      console.error('[SLUG LOOKUP] Failed to increment clicks:', updateError);
    }
    
    console.log('[SLUG LOOKUP] Redirecting to:', record.originalUrl);
    console.log('==========================================');
    
    return res.redirect(301, record.originalUrl);
    
  } catch (error) {
    console.error('[SLUG LOOKUP] Database error:', error);
    console.error('[SLUG LOOKUP] Error stack:', error.stack);
    return res.status(500).send('Server error');
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
  console.error('[ERROR]', err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
