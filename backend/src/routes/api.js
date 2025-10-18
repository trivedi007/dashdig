const express = require('express');
const router = express.Router();

// Import route modules
const urlRoutes = require('./url-routes');
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

module.exports = router;
