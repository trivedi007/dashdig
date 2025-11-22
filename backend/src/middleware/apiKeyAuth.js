const User = require('../models/User');

/**
 * API Key Authentication Middleware for Public API v1
 * Validates X-API-Key header and attaches user to request
 */
const apiKeyAuth = async (req, res, next) => {
  try {
    // Extract API key from header
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'MISSING_API_KEY',
          message: 'API key is required. Please provide an API key in the X-API-Key header.'
        }
      });
    }

    // Validate API key
    const result = await User.validateApiKey(apiKey);

    if (!result) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_API_KEY',
          message: 'Invalid API key. Please check your API key and try again.'
        }
      });
    }

    // Attach user and API key info to request
    req.user = result.user;
    req.apiKeyId = result.keyId;
    req.apiPermissions = result.permissions;

    next();
  } catch (error) {
    console.error('API key auth error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error during authentication.'
      }
    });
  }
};

/**
 * Check if the API key has a specific permission
 * @param {string} permission - Permission to check (e.g., 'links:write')
 */
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.apiPermissions || !req.apiPermissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: `This API key does not have the required permission: ${permission}`
        }
      });
    }
    next();
  };
};

module.exports = { apiKeyAuth, requirePermission };
