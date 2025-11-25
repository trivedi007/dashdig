const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const Url = require('./models/Url');
const DASHDIG_BRAND = require('./config/branding');

const app = express();

// Trust proxy for Railway
app.set('trust proxy', 1);

// Security headers with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://dashdig.com", "https://dashdig-production.up.railway.app"],
    },
  },
  crossOriginEmbedderPolicy: false, // Required for some embeds
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Additional security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

app.use((req, res, next) => { console.log('🌍', req.method, req.path); next(); });

// Branding headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', DASHDIG_BRAND.fullName);
  res.setHeader('X-Brand', DASHDIG_BRAND.name);
  res.setHeader('X-Brand-Tagline', DASHDIG_BRAND.tagline);
  next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Apply general API rate limiting
const { apiLimiter } = require('./middleware/rateLimiter');
app.use('/api/', apiLimiter);

// CSRF protection for non-API routes (API uses token auth)
const csrfProtection = csrf({ 
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});

// CSRF token endpoint for frontend (must be before conditional CSRF)
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Apply CSRF to web routes only (not API routes that use token/API key authentication)
app.use((req, res, next) => {
  // Skip CSRF for API routes that use token/API key authentication
  if (req.path.startsWith('/api/v1/') || 
      req.path.startsWith('/api/auth/') || 
      req.path.startsWith('/api/urls') ||
      req.path.startsWith('/api/qr') ||
      req.path.startsWith('/api/analytics') ||
      req.path === '/api/csrf-token' ||
      req.path === '/health' ||
      req.path === '/openapi.yaml') {
    return next();
  }
  // Apply CSRF to other routes
  csrfProtection(req, res, next);
});

// CSRF error handler
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ 
      success: false, 
      error: { code: 'INVALID_CSRF_TOKEN', message: 'Invalid or missing CSRF token' }
    });
  }
  next(err);
});

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

// Serve OpenAPI specification
app.get('/openapi.yaml', (req, res) => {
  res.sendFile(path.join(__dirname, '../openapi.yaml'));
});

// Try to load API routes (if they exist)
try {
  const apiRoutes = require('./routes/api');
  app.use('/api', apiRoutes);
  console.log('✅ API routes loaded');
} catch (e) {
  console.log('⚠️  API routes not found, skipping');
}

// API v1 routes (public API with API key authentication)
try {
  const apiV1Routes = require('./routes/apiV1.routes');
  app.use('/api/v1', apiV1Routes);
  console.log('✅ API v1 routes loaded');
} catch (e) {
  console.log('⚠️  API v1 routes not found, skipping');
}

// URL routes (create and manage shortened URLs)
try {
  const urlRoutes = require('./routes/url.route');
  app.use('/api/urls', urlRoutes);
  console.log('✅ URL routes loaded');
} catch (e) {
  console.log('⚠️  URL routes not found, skipping');
}

// Analytics routes
try {
  const analyticsRoutes = require('./routes/analytics.routes');
  app.use('/api/analytics', analyticsRoutes);
  console.log('✅ Analytics routes loaded');
} catch (e) {
  console.log('⚠️  Analytics routes not found, skipping');
}

// API Key routes
try {
  const apiKeyRoutes = require('./routes/apiKey.routes');
  app.use('/api/api-keys', apiKeyRoutes);
  console.log('✅ API key routes loaded');
} catch (e) {
  console.log('⚠️  API key routes not found, skipping');
}

// Smart URL routes (AI-powered slug generation)
try {
  const smartUrlRoutes = require('./routes/smartUrl.routes');
  app.use('/api/smart-url', smartUrlRoutes);
  console.log('✅ Smart URL routes loaded');
} catch (e) {
  console.log('⚠️  Smart URL routes not found, skipping');
}

// Slug availability and pattern detection routes
try {
  const slugRoutes = require('./routes/slug.routes');
  app.use('/api/slug', slugRoutes);
  console.log('✅ Slug routes loaded');
} catch (e) {
  console.log('⚠️  Slug routes not found, skipping');
}

// Product URL parsing routes (with web scraping)
try {
  const productRoutes = require('./routes/product.routes');
  app.use('/api/product', productRoutes);
  console.log('✅ Product routes loaded');
} catch (e) {
  console.log('⚠️  Product routes not found, skipping');
}

// QR code routes
try {
  const qrRoutes = require('./routes/qr.routes');
  app.use('/api/qr', qrRoutes);
  console.log('✅ QR routes loaded');
} catch (e) {
  console.log('⚠️  QR routes not found, skipping');
}

// Suggestions routes (AI-powered URL slug suggestions)
try {
  const suggestionsRoutes = require('./routes/suggestions.routes');
  app.use('/api/suggestions', suggestionsRoutes);
  console.log('✅ Suggestions routes loaded');
} catch (e) {
  console.log('⚠️  Suggestions routes not found, skipping');
}

// Feedback routes (suggestion feedback and analytics)
try {
  const feedbackRoutes = require('./routes/feedback.routes');
  app.use('/api/suggestions', feedbackRoutes);
  console.log('✅ Feedback routes loaded');
} catch (e) {
  console.log('⚠️  Feedback routes not found, skipping');
}

// Public demo endpoint (no auth required)
app.post('/demo-url', async (req, res) => {
  const { triggerPatternAnalysis } = require('./jobs/pattern-detection.job');
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
      
      // Trigger pattern analysis if user is authenticated (demo URLs have userId: null)
      if (urlDoc.userId) {
        try {
          triggerPatternAnalysis(urlDoc.userId.toString(), urlDoc._id.toString());
        } catch (error) {
          // Non-blocking
        }
      }
      
      // Generate QR code
    const QRCode = require('qrcode');
    
    // Enhanced base URL logic with better fallbacks
    let baseUrl = 'https://dashdig.com'; // Default fallback
    
    if (process.env.BASE_URL) {
      baseUrl = process.env.BASE_URL;
    } else if (process.env.FRONTEND_URL) {
      baseUrl = process.env.FRONTEND_URL;
    } else if (process.env.NODE_ENV === 'production') {
      baseUrl = 'https://dashdig-backend-production.up.railway.app';
    } else {
      baseUrl = 'http://localhost:5001';
    }
    
    const normalizedBase = (process.env.SHORT_URL_BASE || baseUrl).replace(/\/$/, '');
    console.log('🔗 Demo URL Base URL used:', normalizedBase);
    const fullUrl = `${normalizedBase}/${slug}`;
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
  app.use('/api/auth', authRoutes); // Also register under /api/auth for consistency
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
// RESERVED PATHS - DO NOT TREAT AS SHORT URLS
// ============================================
// List of paths that should NOT be treated as short URL slugs
// These are frontend pages served by Vercel
const RESERVED_PATHS = [
  'terms',
  'privacy', 
  'docs',
  'api',
  'health',
  'auth',
  'admin',
  'dashboard',
  'login',
  'signup',
  'signin',
  'register',
  'settings',
  'profile',
  'about',
  'contact',
  'pricing',
  'features',
  'blog',
  'help',
  'support',
  'legal',
  'cookies',
  'faq',
  'guide',
  'tutorial',
  'documentation',
  'onboarding',
  'verify',
  'reset-password',
  'forgot-password',
  'sitemap.xml',
  'robots.txt',
  'favicon.ico',
  '_next',
  'static',
  'public',
  'assets',
  'images',
  'css',
  'js'
];

// Middleware to check if path is reserved
// This MUST come before the catch-all /:slug route
app.use((req, res, next) => {
  const path = req.path.slice(1).split('/')[0].toLowerCase(); // Get first segment
  
  if (RESERVED_PATHS.includes(path)) {
    // This is a reserved path - don't treat as short URL
    // Return 404 so Railway passes request to Vercel
    console.log(`[RESERVED PATH] Skipping slug lookup for: ${path}`);
    return res.status(404).send('Page not found');
  }
  
  next();
});

// ============================================
// SLUG ROUTE - MUST BE AFTER SPECIFIC ROUTES!
// ============================================
app.get('/:slug', async (req, res) => {
  const slug = req.params.slug;
  const slugLower = slug.toLowerCase(); // Convert to lowercase for case-insensitive lookup
  
  // Enhanced logging
  console.log('==========================================');
  console.log('[SLUG LOOKUP] Received:', slug);
  console.log('[SLUG LOOKUP] Lowercase:', slugLower);
  console.log('[SLUG LOOKUP] Time:', new Date().toISOString());
  console.log('[SLUG LOOKUP] IP:', req.ip);
  
  try {
    // Query database - TRY shortCode FIRST!
    // Use lowercase version because schema has lowercase: true
    console.log('[SLUG LOOKUP] Querying database...');
    
    let record = await Url.findOne({ shortCode: slugLower }); // ✅ Use lowercase version!
    console.log('[SLUG LOOKUP] Tried "shortCode" field (lowercase):', record ? 'FOUND' : 'not found');
    
    if (!record) {
      // Fallback to other field names if needed (also lowercase)
      record = await Url.findOne({ slug: slugLower });
      console.log('[SLUG LOOKUP] Tried "slug" field (lowercase):', record ? 'FOUND' : 'not found');
    }
    
    if (!record) {
      record = await Url.findOne({ short_id: slugLower });
      console.log('[SLUG LOOKUP] Tried "short_id" field (lowercase):', record ? 'FOUND' : 'not found');
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
    console.log('[SLUG LOOKUP] Is active:', record.isActive);
    
    // Check if URL is inactive
    if (!record.isActive) {
      console.log('[SLUG LOOKUP] ❌ ERROR: URL is inactive');
      console.log('==========================================');
      return res.status(410).send('This shortened URL has been deactivated');
    }
    
    // Check if URL has expired (using model method)
    if (typeof record.hasExpired === 'function' && record.hasExpired()) {
      console.log('[SLUG LOOKUP] ❌ ERROR: URL has expired');
      console.log('==========================================');
      return res.status(410).send('This shortened URL has expired');
    }
    
    // Increment click counter
    try {
      await Url.updateOne(
        { _id: record._id },
        { 
          $inc: { 
            'clicks.count': 1,
            'clicks.total': 1  // Also increment total
          }, 
          $set: { 'clicks.lastClickedAt': new Date() } 
        }
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
