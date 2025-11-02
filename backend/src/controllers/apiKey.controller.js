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
}

module.exports = new ApiKeyController();

