const User = require('../models/User');

class ApiKeyController {
  /**
   * Get user's API key (or generate if doesn't exist)
   * GET /api/api-keys
   */
  async getApiKey(req, res) {
    try {
      const userId = req.user._id || req.user.id;
      
      console.log('🔑 Getting API key for user:', userId);

      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Get or create API key
      const apiKey = user.getOrCreateApiKey();
      
      // Save if new key was generated
      if (!user.settings?.apiKey) {
        await user.save();
        console.log('✅ Generated new API key for user:', userId);
      } else {
        console.log('✅ Returning existing API key for user:', userId);
      }

      res.json({
        success: true,
        data: {
          apiKey: apiKey,
          createdAt: user.createdAt,
          type: apiKey.startsWith('ddig_test_') ? 'test' : 'live'
        }
      });

    } catch (error) {
      console.error('❌ Get API key error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get API key',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Regenerate user's API key
   * POST /api/api-keys/regenerate
   */
  async regenerateApiKey(req, res) {
    try {
      const userId = req.user._id || req.user.id;
      const { isTest } = req.body;
      
      console.log('🔄 Regenerating API key for user:', userId);

      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Generate new API key
      const apiKey = user.generateApiKey(isTest);
      await user.save();

      console.log('✅ API key regenerated for user:', userId);

      res.json({
        success: true,
        message: 'API key regenerated successfully',
        data: {
          apiKey: apiKey,
          regeneratedAt: new Date(),
          type: apiKey.startsWith('ddig_test_') ? 'test' : 'live'
        }
      });

    } catch (error) {
      console.error('❌ Regenerate API key error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to regenerate API key',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Delete user's API key
   * DELETE /api/api-keys
   */
  async deleteApiKey(req, res) {
    try {
      const userId = req.user._id || req.user.id;

      console.log('🗑️  Deleting API key for user:', userId);

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Delete API key
      if (user.settings) {
        user.settings.apiKey = null;
        await user.save();
      }

      console.log('✅ API key deleted for user:', userId);

      res.json({
        success: true,
        message: 'API key deleted successfully'
      });

    } catch (error) {
      console.error('❌ Delete API key error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete API key',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // ============================================
  // PUBLIC API V1 KEY MANAGEMENT
  // ============================================

  /**
   * Create a new API key for v1
   * POST /api/api-keys/v1
   */
  async createApiKeyV1(req, res) {
    try {
      const userId = req.user._id || req.user.id;
      const { name, permissions } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          error: 'API key name is required'
        });
      }

      console.log('🔑 Creating API v1 key for user:', userId);

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Create new API key
      const result = await user.createApiKeyV1(name, permissions);

      console.log('✅ API v1 key created for user:', userId);

      res.json({
        success: true,
        message: 'API key created successfully. Save this key - it will not be shown again.',
        data: {
          id: result.keyId,
          name,
          apiKey: result.apiKey,
          keyPrefix: result.keyPrefix,
          permissions: permissions || ['links:read', 'links:write', 'stats:read', 'domains:read']
        }
      });

    } catch (error) {
      console.error('❌ Create API v1 key error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create API key',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * List all API keys for v1
   * GET /api/api-keys/v1
   */
  async listApiKeysV1(req, res) {
    try {
      const userId = req.user._id || req.user.id;

      console.log('🔑 Listing API v1 keys for user:', userId);

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const keys = user.getApiKeysInfo();

      res.json({
        success: true,
        data: keys
      });

    } catch (error) {
      console.error('❌ List API v1 keys error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to list API keys',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Revoke an API key
   * DELETE /api/api-keys/v1/:keyId
   */
  async revokeApiKeyV1(req, res) {
    try {
      const userId = req.user._id || req.user.id;
      const { keyId } = req.params;

      console.log('🗑️  Revoking API v1 key:', keyId, 'for user:', userId);

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const success = await user.revokeApiKey(keyId);

      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'API key not found'
        });
      }

      console.log('✅ API v1 key revoked for user:', userId);

      res.json({
        success: true,
        message: 'API key revoked successfully'
      });

    } catch (error) {
      console.error('❌ Revoke API v1 key error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to revoke API key',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get API usage stats
   * GET /api/api-keys/v1/usage
   */
  async getApiUsage(req, res) {
    try {
      const userId = req.user._id || req.user.id;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const rateLimit = user.getApiRateLimit();

      res.json({
        success: true,
        data: {
          plan: user.subscription.plan,
          limit: rateLimit.limit,
          window: rateLimit.window,
          remainingInCurrentHour: rateLimit.limit // This would need Redis integration for real-time data
        }
      });

    } catch (error) {
      console.error('❌ Get API usage error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get API usage',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new ApiKeyController();

