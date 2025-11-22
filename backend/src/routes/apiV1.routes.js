const express = require('express');
const router = express.Router();
const { apiKeyAuth, requirePermission } = require('../middleware/apiKeyAuth');
const { apiRateLimiter } = require('../middleware/apiRateLimiter');
const { controller, validation } = require('../controllers/apiV1.controller');

// Apply API key authentication and rate limiting to all v1 routes
router.use(apiKeyAuth);
router.use(apiRateLimiter);

/**
 * Links endpoints
 */

// POST /api/v1/links - Create a new short URL
router.post('/links',
  requirePermission('links:write'),
  validation.createLink,
  controller.createLink.bind(controller)
);

// GET /api/v1/links - List user's URLs
router.get('/links',
  requirePermission('links:read'),
  validation.listLinks,
  controller.listLinks.bind(controller)
);

// GET /api/v1/links/:id - Get URL details
router.get('/links/:id',
  requirePermission('links:read'),
  controller.getLink.bind(controller)
);

// PATCH /api/v1/links/:id - Update URL
router.patch('/links/:id',
  requirePermission('links:write'),
  validation.updateLink,
  controller.updateLink.bind(controller)
);

// DELETE /api/v1/links/:id - Soft delete URL
router.delete('/links/:id',
  requirePermission('links:write'),
  controller.deleteLink.bind(controller)
);

// GET /api/v1/links/:id/stats - Get analytics
router.get('/links/:id/stats',
  requirePermission('stats:read'),
  validation.getLinkStats,
  controller.getLinkStats.bind(controller)
);

/**
 * Domains endpoint
 */

// GET /api/v1/domains - List custom domains
router.get('/domains',
  requirePermission('domains:read'),
  controller.listDomains.bind(controller)
);

// API info endpoint (no auth required)
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      version: '1.0.0',
      name: 'Dashdig Public API',
      documentation: 'https://dashdig.com/docs',
      endpoints: {
        links: '/api/v1/links',
        domains: '/api/v1/domains'
      }
    }
  });
});

module.exports = router;
