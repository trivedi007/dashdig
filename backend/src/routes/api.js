const express = require('express');
const router = express.Router();

console.log('🔥 Starting to load route modules...');

// Import route modules - NO TRY/CATCH so errors show
const urlRoutes = require('./url.route');
console.log('✅ URL routes loaded successfully');

const authRoutes = require('./auth');
const analyticsRoutes = require('./analytics.routes');
const domainRoutes = require('./domain.routes');
const paymentRoutes = require('./payment');

// Mount routes
router.use('/urls', urlRoutes);
router.use('/auth', authRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/domains', domainRoutes);
router.use('/payment', paymentRoutes);

console.log('🔥 All routes mounted successfully');

module.exports = router;
