const express = require('express');
const router = express.Router();
const { submitFeedback, getAnalytics } = require('../controllers/feedback.controller');
const { apiLimiter } = require('../middleware/rateLimiter');

console.log('✅ Feedback routes loaded');

/**
 * POST /api/suggestions/feedback
 * Submit feedback on a suggestion
 * 
 * Request Body:
 * {
 *   "suggestionId": "sugg_abc123",
 *   "vote": "up" | "down" | "selected",
 *   "originalUrl": "https://amazon.com/...",
 *   "allSuggestions": [...],
 *   "userId": "user_123",  // optional
 *   "sessionId": "sess_xyz",  // optional
 *   "metadata": {
 *     "pageTitle": "Echo Dot...",
 *     "generationTime": 1.2
 *   }
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Feedback recorded"
 * }
 */
router.post('/feedback', apiLimiter, submitFeedback);

/**
 * GET /api/suggestions/analytics
 * Get analytics on suggestion feedback
 * 
 * Query Parameters:
 * - startDate: ISO date string (optional)
 * - endDate: ISO date string (optional)
 * - style: Filter by style (optional)
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "totalFeedback": 1234,
 *     "byStyle": {
 *       "brand_focused": { "up": 450, "down": 50, "selected": 200, "rate": 0.80 },
 *       ...
 *     },
 *     "averageConfidenceBySelection": 0.87,
 *     "topPerformingPatterns": [...],
 *     "overallStats": {...}
 *   }
 * }
 */
router.get('/analytics', apiLimiter, getAnalytics);

module.exports = router;

