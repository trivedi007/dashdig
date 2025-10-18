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

// Try to load API routes (if they exist)
try {
  const apiRoutes = require('./routes/api');
  app.use('/api', apiRoutes);
  console.log('✅ API routes loaded');
} catch (e) {
  console.log('⚠️  API routes not found, skipping');
}

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
app.get('/:slug', async (req, res) => {
  const slug = req.params.slug;
  
  // Enhanced logging
  console.log('==========================================');
  console.log('[SLUG LOOKUP] Received:', slug);
  console.log('[SLUG LOOKUP] Time:', new Date().toISOString());
  console.log('[SLUG LOOKUP] IP:', req.ip);
  console.log('[SLUG LOOKUP] Path:', req.path);
  console.log('[SLUG LOOKUP] Headers:', JSON.stringify(req.headers, null, 2));
  
  try {
    // Query database - try multiple possible field names
    console.log('[SLUG LOOKUP] Querying database...');
    
    let record = await Url.findOne({ slug: slug });
    console.log('[SLUG LOOKUP] Tried "slug" field:', record ? 'FOUND' : 'not found');
    
    if (!record) {
      record = await Url.findOne({ short_id: slug });
      console.log('[SLUG LOOKUP] Tried "short_id" field:', record ? 'FOUND' : 'not found');
    }
    
    if (!record) {
      record = await Url.findOne({ shortCode: slug });
      console.log('[SLUG LOOKUP] Tried "shortCode" field:', record ? 'FOUND' : 'not found');
    }
    
    if (!record) {
      record = await Url.findOne({ alias: slug });
      console.log('[SLUG LOOKUP] Tried "alias" field:', record ? 'FOUND' : 'not found');
    }
    
    console.log('[SLUG LOOKUP] Final result:', record ? 'FOUND' : 'NOT FOUND');
    
    if (!record) {
      console.log('[SLUG LOOKUP] ❌ ERROR: No record found in database');
      console.log('[SLUG LOOKUP] Searched for:', slug);
      console.log('[SLUG LOOKUP] Tried fields: slug, short_id, shortCode, alias');
      console.log('==========================================');
      return res.status(404).send('URL not found - No database record exists for this short link');
    }
    
    console.log('[SLUG LOOKUP] ✅ Record found!');
    console.log('[SLUG LOOKUP] Record ID:', record._id);
    console.log('[SLUG LOOKUP] Original URL:', record.originalUrl);
    console.log('[SLUG LOOKUP] Current clicks:', record.clicks || 0);
    
    // Increment click counter
    try {
      await Url.updateOne(
        { _id: record._id },
        { $inc: { clicks: 1 } }
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
    console.error('[SLUG LOOKUP] Error stack:', error.stack);
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
