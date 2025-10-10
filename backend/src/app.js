const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const paymentRoutes = require('./routes/payment');

// Import routes
const authRoutes = require('./routes/auth');
const urlRoutes = require('./routes/url.routes');

const app = express();

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

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, please try again later.'
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    service: 'SmartLink API'
  });
});

// API Routes
app.use('/api/auth', authRoutes);  // Added auth routes
app.use('/api/urls', urlRoutes);

// Payment/Stripe
app.use('/api/payment', paymentRoutes);

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
