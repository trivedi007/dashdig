const Url = require('../models/Url');
const Domain = require('../models/Domain');
const Analytics = require('../models/Analytics');
const QRCode = require('qrcode');
const { body, param, query, validationResult } = require('express-validator');

/**
 * API v1 Controller
 * Handles all public API v1 endpoints with standardized response format
 */
class ApiV1Controller {

  /**
   * POST /api/v1/links - Create a new short URL
   */
  async createLink(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request parameters',
            details: errors.array()
          }
        });
      }

      const { originalUrl, customSlug, tags, expiresAt } = req.body;
      const userId = req.user._id;

      // Validate URL format
      try {
        new URL(originalUrl);
      } catch {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_URL',
            message: 'Invalid URL format. Please provide a valid URL.'
          }
        });
      }

      // Check if user can create more URLs
      if (!req.user.canCreateUrl()) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'QUOTA_EXCEEDED',
            message: `You have reached your monthly URL creation limit for the ${req.user.subscription.plan} plan.`
          }
        });
      }

      // Generate or use custom slug
      let shortCode = customSlug;

      if (!shortCode) {
        // Generate AI-powered slug
        const aiService = require('../services/ai.service');
        shortCode = await aiService.generateHumanReadableUrl(originalUrl, tags || []);
      }

      // Ensure uniqueness
      const existing = await Url.findOne({ shortCode: shortCode.toLowerCase() });
      if (existing) {
        if (customSlug) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'SLUG_TAKEN',
              message: 'This custom slug is already in use. Please choose a different one.'
            }
          });
        }
        // Add timestamp to make it unique
        const timestamp = Date.now().toString(36).slice(-4);
        shortCode = `${shortCode}-${timestamp}`;
      }

      // Create URL document
      const urlDoc = new Url({
        shortCode: shortCode.toLowerCase(),
        originalUrl,
        userId,
        keywords: tags || [],
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: true,
        clicks: {
          total: 0,
          count: 0
        }
      });

      await urlDoc.save();

      // Update user usage
      req.user.usage.urlsCreated += 1;
      req.user.usage.currentMonth.urls += 1;
      await req.user.save();

      // Generate short URL
      const baseUrl = process.env.BASE_URL || 'https://dashdig.com';
      const shortUrl = `${baseUrl}/${shortCode}`;

      // Generate QR code
      const qrCode = await QRCode.toDataURL(shortUrl);

      res.status(201).json({
        success: true,
        data: {
          id: urlDoc._id,
          shortUrl,
          shortCode,
          originalUrl,
          qrCode,
          tags: tags || [],
          expiresAt: urlDoc.expiresAt,
          createdAt: urlDoc.createdAt,
          clicks: 0
        }
      });

    } catch (error) {
      console.error('Create link error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create short link. Please try again.'
        }
      });
    }
  }

  /**
   * GET /api/v1/links - List user's URLs with pagination
   */
  async listLinks(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 20, 100); // Max 100
      const sortBy = req.query.sortBy || 'createdAt';
      const order = req.query.order === 'asc' ? 1 : -1;

      const skip = (page - 1) * limit;
      const userId = req.user._id;

      // Build query
      const query = { userId, isActive: true };

      // Get total count
      const total = await Url.countDocuments(query);

      // Get URLs
      const urls = await Url.find(query)
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit)
        .select('-__v');

      // Format response
      const baseUrl = process.env.BASE_URL || 'https://dashdig.com';
      const data = urls.map(url => ({
        id: url._id,
        shortUrl: `${baseUrl}/${url.shortCode}`,
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        tags: url.keywords || [],
        clicks: url.clicks.total || 0,
        expiresAt: url.expiresAt,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt
      }));

      res.json({
        success: true,
        data,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasMore: skip + limit < total
        }
      });

    } catch (error) {
      console.error('List links error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve links.'
        }
      });
    }
  }

  /**
   * GET /api/v1/links/:id - Get URL details
   */
  async getLink(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const url = await Url.findOne({ _id: id, userId });

      if (!url) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'URL_NOT_FOUND',
            message: 'Short link not found.'
          }
        });
      }

      const baseUrl = process.env.BASE_URL || 'https://dashdig.com';

      res.json({
        success: true,
        data: {
          id: url._id,
          shortUrl: `${baseUrl}/${url.shortCode}`,
          shortCode: url.shortCode,
          originalUrl: url.originalUrl,
          tags: url.keywords || [],
          clicks: url.clicks.total || 0,
          expiresAt: url.expiresAt,
          isActive: url.isActive,
          createdAt: url.createdAt,
          updatedAt: url.updatedAt,
          metadata: url.metadata
        }
      });

    } catch (error) {
      console.error('Get link error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve link details.'
        }
      });
    }
  }

  /**
   * PATCH /api/v1/links/:id - Update URL
   */
  async updateLink(req, res) {
    try {
      const { id } = req.params;
      const { originalUrl, tags, expiresAt } = req.body;
      const userId = req.user._id;

      const url = await Url.findOne({ _id: id, userId });

      if (!url) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'URL_NOT_FOUND',
            message: 'Short link not found.'
          }
        });
      }

      // Update fields
      if (originalUrl) {
        try {
          new URL(originalUrl);
          url.originalUrl = originalUrl;
        } catch {
          return res.status(400).json({
            success: false,
            error: {
              code: 'INVALID_URL',
              message: 'Invalid URL format.'
            }
          });
        }
      }

      if (tags !== undefined) {
        url.keywords = tags;
      }

      if (expiresAt !== undefined) {
        url.expiresAt = expiresAt ? new Date(expiresAt) : null;
      }

      await url.save();

      const baseUrl = process.env.BASE_URL || 'https://dashdig.com';

      res.json({
        success: true,
        data: {
          id: url._id,
          shortUrl: `${baseUrl}/${url.shortCode}`,
          shortCode: url.shortCode,
          originalUrl: url.originalUrl,
          tags: url.keywords || [],
          clicks: url.clicks.total || 0,
          expiresAt: url.expiresAt,
          updatedAt: url.updatedAt
        }
      });

    } catch (error) {
      console.error('Update link error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update link.'
        }
      });
    }
  }

  /**
   * DELETE /api/v1/links/:id - Soft delete URL
   */
  async deleteLink(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const url = await Url.findOne({ _id: id, userId });

      if (!url) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'URL_NOT_FOUND',
            message: 'Short link not found.'
          }
        });
      }

      // Soft delete
      url.isActive = false;
      await url.save();

      res.json({
        success: true,
        message: 'Link deleted successfully.'
      });

    } catch (error) {
      console.error('Delete link error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete link.'
        }
      });
    }
  }

  /**
   * GET /api/v1/links/:id/stats - Get analytics for URL
   */
  async getLinkStats(req, res) {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.query;
      const userId = req.user._id;

      const url = await Url.findOne({ _id: id, userId });

      if (!url) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'URL_NOT_FOUND',
            message: 'Short link not found.'
          }
        });
      }

      // Build analytics query
      const analyticsQuery = { shortCode: url.shortCode };

      if (startDate || endDate) {
        analyticsQuery.timestamp = {};
        if (startDate) analyticsQuery.timestamp.$gte = new Date(startDate);
        if (endDate) analyticsQuery.timestamp.$lte = new Date(endDate);
      }

      // Get analytics data
      const analytics = await Analytics.find(analyticsQuery).sort({ timestamp: -1 });

      // Aggregate stats
      const stats = {
        totalClicks: url.clicks.total || 0,
        clicksInPeriod: analytics.length,
        lastClickedAt: url.clicks.lastClickedAt,
        browsers: {},
        devices: {},
        countries: {},
        referrers: {}
      };

      // Process analytics
      analytics.forEach(event => {
        if (event.browser) {
          stats.browsers[event.browser] = (stats.browsers[event.browser] || 0) + 1;
        }
        if (event.device) {
          stats.devices[event.device] = (stats.devices[event.device] || 0) + 1;
        }
        if (event.country) {
          stats.countries[event.country] = (stats.countries[event.country] || 0) + 1;
        }
        if (event.referrer) {
          stats.referrers[event.referrer] = (stats.referrers[event.referrer] || 0) + 1;
        }
      });

      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Get link stats error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve link statistics.'
        }
      });
    }
  }

  /**
   * GET /api/v1/domains - List custom domains
   */
  async listDomains(req, res) {
    try {
      const userId = req.user._id;

      const domains = await Domain.find({ userId })
        .select('-__v -verificationToken')
        .sort({ createdAt: -1 });

      const data = domains.map(domain => ({
        id: domain._id,
        domain: domain.domain,
        status: domain.status,
        sslEnabled: domain.sslEnabled,
        isDefault: domain.isDefault,
        verifiedAt: domain.verifiedAt,
        createdAt: domain.createdAt
      }));

      res.json({
        success: true,
        data
      });

    } catch (error) {
      console.error('List domains error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve domains.'
        }
      });
    }
  }
}

// Validation rules
const createLinkValidation = [
  body('originalUrl').notEmpty().withMessage('originalUrl is required'),
  body('customSlug').optional().isString().matches(/^[a-z0-9-]+$/i).withMessage('Custom slug can only contain letters, numbers, and hyphens'),
  body('tags').optional().isArray().withMessage('tags must be an array'),
  body('expiresAt').optional().isISO8601().withMessage('expiresAt must be a valid ISO 8601 date')
];

const updateLinkValidation = [
  body('originalUrl').optional().isString().withMessage('originalUrl must be a string'),
  body('tags').optional().isArray().withMessage('tags must be an array'),
  body('expiresAt').optional().isISO8601().withMessage('expiresAt must be a valid ISO 8601 date')
];

const listLinksValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
  query('sortBy').optional().isIn(['createdAt', 'updatedAt', 'clicks']).withMessage('sortBy must be one of: createdAt, updatedAt, clicks'),
  query('order').optional().isIn(['asc', 'desc']).withMessage('order must be asc or desc')
];

const getLinkStatsValidation = [
  query('startDate').optional().isISO8601().withMessage('startDate must be a valid ISO 8601 date'),
  query('endDate').optional().isISO8601().withMessage('endDate must be a valid ISO 8601 date')
];

module.exports = {
  controller: new ApiV1Controller(),
  validation: {
    createLink: createLinkValidation,
    updateLink: updateLinkValidation,
    listLinks: listLinksValidation,
    getLinkStats: getLinkStatsValidation
  }
};
