const express = require('express');
const router = express.Router();

console.log('🔥 Starting to load route modules...');

// Import route modules
try {
  const urlRoutes = require('./url.route');
  console.log('✅ URL routes loaded');
  router.use('/urls', urlRoutes);
} catch (error) {
  console.error('❌ Failed to load URL routes:', error.message);
}

const authRoutes = require('./auth');
const analyticsRoutes = require('./analytics.routes');
const domainRoutes = require('./domain.routes');
const paymentRoutes = require('./payment');

// Mount routes
router.use('/auth', authRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/domains', domainRoutes);
router.use('/payment', paymentRoutes);

console.log('🔥 All routes mounted');

module.exports = router;
