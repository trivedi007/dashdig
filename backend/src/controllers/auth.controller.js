const authService = require('../services/auth.service');

class AuthController {
  async verifyEmail(req, res) {
    try {
      const { token } = req.params;

      // Find user by verification token
      const user = await User.findOne({ verificationToken: token });
      if (!user) {
        return res.status(400).json({
          error: 'Invalid or expired verification token'
        });
      }

      // Update user's verification status
      user.isVerified = true;
      user.verificationToken = null; // Clear the token after verification
      await user.save();

      res.json({
        success: true,
        message: 'Email verified successfully!'
      });
    } catch (error) {
      console.error('Verify email error:', error);
      res.status(500).json({
        error: error.message || 'Failed to verify email'
      });
    }
  }
  async requestMagicLink(req, res) {
    try {
      const { identifier } = req.body;

      if (!identifier) {
        return res.status(400).json({
          error: 'Email or phone number required'
        });
      }

      // Basic validation
      const isEmail = identifier.includes('@');
      if (isEmail) {
        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(identifier)) {
          return res.status(400).json({
            error: 'Invalid email address'
          });
        }
      } else {
        // Simple phone validation (US format)
        const phoneRegex = /^\+?1?\d{10}$/;
        const cleaned = identifier.replace(/\D/g, '');
        if (!phoneRegex.test(cleaned)) {
          return res.status(400).json({
            error: 'Invalid phone number'
          });
        }
      }

      const result = await authService.sendMagicLink(identifier);
      
      res.json(result);

    } catch (error) {
      console.error('Request magic link error:', error);
      res.status(500).json({
        error: error.message || 'Failed to send verification link'
      });
    }
  }

  async verifyMagicLink(req, res) {
    try {
      const { token, code } = req.body;

      if (!token) {
        return res.status(400).json({
          error: 'Verification token required'
        });
      }

      const result = await authService.verifyToken(token, code);
      
      // Set cookie for web sessions
      res.cookie('auth_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.json({
        success: true,
        ...result
      });

    } catch (error) {
      console.error('Verify magic link error:', error);
      res.status(401).json({
        error: error.message || 'Verification failed'
      });
    }
  }

  async getCurrentUser(req, res) {
    try {
      // User is attached by auth middleware
      res.json({
        success: true,
        user: authService.sanitizeUser(req.user)
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch user'
      });
    }
  }

  async logout(req, res) {
    res.clearCookie('auth_token');
    res.json({ success: true, message: 'Logged out successfully' });
  }
}

module.exports = new AuthController();
