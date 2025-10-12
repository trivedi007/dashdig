const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { requireAuth } = require('../middleware/auth');

// All analytics routes require authentication
router.use(requireAuth);

// Get analytics summary for a specific URL
router.get('/url/:urlId', analyticsController.getUrlAnalytics);

// Get time series data for a URL
router.get('/url/:urlId/timeseries', analyticsController.getTimeSeries);

// Get detailed click logs for a URL
router.get('/url/:urlId/clicks', analyticsController.getClickLogs);

// Export analytics data
router.get('/url/:urlId/export', analyticsController.exportAnalytics);

// Get user's analytics overview (all URLs)
router.get('/overview', analyticsController.getUserAnalyticsOverview);

// Get real-time analytics (last 24 hours)
router.get('/realtime', analyticsController.getRealTimeAnalytics);

module.exports = router;
