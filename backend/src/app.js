const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const { getRedis } = require('./config/redis');
const paymentRoutes = require('./routes/payment');

// Import routes
const authRoutes = require('./routes/auth');
const urlRoutes = require('./routes/url.routes');

const app = express();

// Trust proxy for Railway deployment
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// Updated CORS configuration to handle multiple origins
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Allow localhost on any port
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5000',
      'https://dashdig.com',
      'https://www.dashdig.com',
      process.env.FRONTEND_URL
    ];
    
    // Allow localhost, Vercel preview/production domains, and configured frontend URL
    if (allowedOrigins.indexOf(origin) !== -1 || 
        origin.includes('localhost') || 
        origin.endsWith('.vercel.app') ||
        origin.includes('dashdig')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Rate limiting with Redis
const redis = getRedis();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  store: redis ? new RedisStore({
    client: redis,
    prefix: 'rate:',
  }) : undefined // Fallback to in-memory if Redis unavailable
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    service: 'Dashdig API'
  });
});

// Test AI slug generation (temporary endpoint)
app.post('/test-slug', async (req, res) => {
  try {
    const aiService = require('./services/ai.service');
    const { url, keywords = [] } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL required' });
    }

    const slug = await aiService.generateHumanReadableUrl(url, keywords);
    res.json({
      originalUrl: url,
      generatedSlug: slug,
      keywords: keywords
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Demo URL creation (no auth required)
app.post('/demo-url', async (req, res) => {
  try {
    const aiService = require('./services/ai.service');
    const Url = require('./models/Url');
    const { url, keywords = [] } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL required' });
    }

    console.log('🎯 Demo URL creation for:', url);

    // Generate contextual slug
    let shortCode = await aiService.generateHumanReadableUrl(url, keywords);
    console.log('✨ Generated slug:', shortCode);
    
    // Ensure uniqueness
    const existing = await Url.findOne({ shortCode });
    if (existing) {
      const timestamp = Date.now().toString(36).slice(-4);
      shortCode = `${shortCode}.${timestamp}`;
      console.log('🔄 Made unique:', shortCode);
    }

    // Create URL document
    const urlDoc = new Url({
      shortCode,
      originalUrl: url,
      keywords,
      userId: null, // Demo URLs have no user
      clicks: {
        count: 0,
        limit: null // Unlimited clicks for demo
      }
    });

    await urlDoc.save();
    console.log('✅ Demo URL created:', shortCode);

    res.json({
      shortCode,
      originalUrl: url,
      shortUrl: `https://dashdig.com/${shortCode}`,
      message: 'Demo URL created successfully'
    });
  } catch (error) {
    console.error('❌ Demo URL creation failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test authentication endpoint (temporary - for immediate access)
app.post('/test-auth', async (req, res) => {
  try {
    const authService = require('./services/auth.service');
    const { email = 'trivedi.narendra@gmail.com' } = req.body;

    const result = await authService.sendMagicLink(email, 'email');
    
    // Get the magic link from console logs (this is a hack for immediate access)
    res.json({
      success: true,
      message: 'Check Railway logs for magic link and code',
      email: email,
      instructions: 'Look at Railway deployment logs for the magic link and verification code',
      directAccess: 'Copy the magic link from logs and paste in browser'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Demo URL creation endpoint (no auth required)
app.post('/demo-url', async (req, res) => {
  try {
    const aiService = require('./services/ai.service');
    const Url = require('./models/Url');
    const { url, keywords = [] } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL required' });
    }

    console.log('🎯 Demo URL creation for:', url);

    // Generate contextual slug
    let shortCode = await aiService.generateHumanReadableUrl(url, keywords);
    console.log('✨ Generated slug:', shortCode);
    
    // Ensure uniqueness
    const existing = await Url.findOne({ shortCode });
    if (existing) {
      const timestamp = Date.now().toString(36).slice(-4);
      shortCode = `${shortCode}.${timestamp}`;
      console.log('🔄 Made unique:', shortCode);
    }

    // Create URL document
    const urlDoc = new Url({
      shortCode,
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
    console.log('✅ Demo URL created:', shortCode);

    res.json({
      shortCode,
      originalUrl: url,
      shortUrl: `https://dashdig.com/${shortCode}`,
      message: 'Demo URL created successfully'
    });
  } catch (error) {
    console.error('❌ Demo URL creation failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Bypass authentication for testing (TEMPORARY)
app.post('/bypass-auth', async (req, res) => {
  try {
    const jwt = require('jsonwebtoken');
    const User = require('./models/User');
    
    const email = req.body.email || 'trivedi.narendra@gmail.com';
    const identifier = req.body.identifier || email;
    
    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        identifier: identifier, // Use provided identifier
        isEmailVerified: true,
        lastLoginAt: new Date()
      });
      await user.save();
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        isEmailVerified: true 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      message: 'Authentication bypass successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      },
      instructions: 'Use this token in localStorage.setItem("token", token) to access dashboard'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);  // Added auth routes
app.use('/api/urls', urlRoutes);
app.use('/api/analytics', require('./routes/analytics.routes')); // Added analytics routes
app.use('/api/domains', require('./routes/domain.routes')); // Added domain routes

// Payment/Stripe
app.use('/api/payment', paymentRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Dashdig API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      urls: '/api/urls',
      analytics: '/api/analytics',
      domains: '/api/domains'
    }
  });
});

// Demo URL creation endpoint (for landing page demo)
app.post('/demo-url', async (req, res) => {
  try {
    const aiService = require('./services/ai.service');
    const Url = require('./models/Url');
    const { url, keywords = [] } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL required' });
    }

    console.log('🎯 Demo URL creation for:', url);

    // Generate contextual slug
    let shortCode = await aiService.generateHumanReadableUrl(url, keywords);
    console.log('✨ Generated slug:', shortCode);
    
    // Ensure uniqueness
    const existing = await Url.findOne({ shortCode });
    if (existing) {
      const timestamp = Date.now().toString(36).slice(-4);
      shortCode = `${shortCode}.${timestamp}`;
      console.log('🔄 Made unique:', shortCode);
    }

    // Create URL document with demo user
    const urlDoc = new Url({
      shortCode,
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
    console.log('✅ Demo URL created:', shortCode);

    res.json({
      shortCode,
      originalUrl: url,
      shortUrl: `https://dashdig.com/${shortCode}`,
      message: 'Demo URL created successfully'
    });
  } catch (error) {
    console.error('❌ Demo URL creation failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// URL Redirect Handler (This is the magic!)
app.get('/:code', require('./controllers/url.controller').redirect);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


module.exports = app;
