/**
 * Email Verification Controller
 * Handles email verification endpoints
 */

const User = require('../models/User');
const emailService = require('../services/email.service');

class EmailVerificationController {
  /**
   * Register new user and send verification email
   * POST /api/auth/register
   */
  async register(req, res) {
    try {
      const { email, name, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          error: 'Email and password are required'
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'Invalid email address'
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        // If user exists but not verified, allow resend
        if (!existingUser.emailVerified) {
          return res.status(400).json({
            error: 'Email already registered but not verified. Please check your inbox or request a new verification email.',
            code: 'EMAIL_NOT_VERIFIED'
          });
        }
        return res.status(400).json({
          error: 'Email already registered'
        });
      }

      // Create new user
      const user = new User({
        email: email.toLowerCase(),
        identifier: email.toLowerCase(),
        profile: {
          name: name || email.split('@')[0]
        },
        emailVerified: false
      });

      // Generate verification token
      const token = user.generateVerificationToken();
      
      // Record email sent
      user.recordVerificationEmailSent();
      
      // Save user
      await user.save();

      // Send verification email
      try {
        await emailService.sendVerificationEmail({
          email: user.email,
          name: user.profile.name,
          token
        });
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Don't fail registration if email fails
        // User can request resend
      }

      res.status(201).json({
        success: true,
        message: 'Registration successful! Please check your email to verify your account.',
        data: {
          email: user.email,
          emailVerified: user.emailVerified,
          expiresIn: '24 hours'
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        error: error.message || 'Registration failed'
      });
    }
  }

  /**
   * Verify email with token
   * GET /api/auth/verify/:token
   */
  async verifyEmail(req, res) {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({
          error: 'Verification token is required'
        });
      }

      // Find user by verification token
      const user = await User.findOne({ 
        verificationToken: token,
        verificationTokenExpires: { $gt: new Date() }
      });

      if (!user) {
        return res.status(400).json({
          error: 'Invalid or expired verification token',
          code: 'INVALID_TOKEN'
        });
      }

      // Verify token using timing-safe comparison
      if (!user.isValidVerificationToken(token)) {
        return res.status(400).json({
          error: 'Invalid verification token',
          code: 'INVALID_TOKEN'
        });
      }

      // Check if already verified
      if (user.emailVerified) {
        return res.status(200).json({
          success: true,
          message: 'Email already verified',
          alreadyVerified: true
        });
      }

      // Update user verification status
      user.emailVerified = true;
      user.isVerified = true;
      user.verificationToken = null;
      user.verificationTokenExpires = null;
      user.verificationEmailSentCount = 0;

      await user.save();

      // Send welcome email (non-blocking)
      emailService.sendWelcomeEmail({
        email: user.email,
        name: user.profile.name
      }).catch(err => console.error('Failed to send welcome email:', err));

      res.json({
        success: true,
        message: 'Email verified successfully! You can now log in to your account.',
        data: {
          email: user.email,
          emailVerified: true
        }
      });

    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({
        error: error.message || 'Failed to verify email'
      });
    }
  }

  /**
   * Resend verification email
   * POST /api/auth/resend-verification
   */
  async resendVerification(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          error: 'Email is required'
        });
      }

      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        // Don't reveal if email exists or not (security)
        return res.json({
          success: true,
          message: 'If the email exists and is not verified, a verification email has been sent.'
        });
      }

      // Check if already verified
      if (user.emailVerified) {
        return res.status(400).json({
          error: 'Email is already verified',
          code: 'ALREADY_VERIFIED'
        });
      }

      // Check rate limiting
      if (!user.canSendVerificationEmail()) {
        const timeUntilReset = new Date(user.lastVerificationEmailSent.getTime() + 60 * 60 * 1000);
        const minutesLeft = Math.ceil((timeUntilReset - new Date()) / (60 * 1000));
        
        return res.status(429).json({
          error: `Too many verification emails sent. Please try again in ${minutesLeft} minutes.`,
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: minutesLeft * 60 // seconds
        });
      }

      // Generate new verification token
      const token = user.generateVerificationToken();
      
      // Record email sent
      user.recordVerificationEmailSent();
      
      // Save user
      await user.save();

      // Send verification email
      try {
        await emailService.sendVerificationEmail({
          email: user.email,
          name: user.profile.name,
          token
        });

        res.json({
          success: true,
          message: 'Verification email sent! Please check your inbox.',
          data: {
            email: user.email,
            expiresIn: '24 hours',
            remainingAttempts: 3 - user.verificationEmailSentCount
          }
        });
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        res.status(500).json({
          error: 'Failed to send verification email. Please try again later.'
        });
      }

    } catch (error) {
      console.error('Resend verification error:', error);
      res.status(500).json({
        error: error.message || 'Failed to resend verification email'
      });
    }
  }

  /**
   * Check verification status
   * GET /api/auth/verification-status/:email
   */
  async checkVerificationStatus(req, res) {
    try {
      const { email } = req.params;

      const user = await User.findOne({ email: email.toLowerCase() })
        .select('email emailVerified verificationTokenExpires');

      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        });
      }

      const hasExpiredToken = user.verificationTokenExpires && 
                             user.verificationTokenExpires < new Date();

      res.json({
        success: true,
        data: {
          email: user.email,
          emailVerified: user.emailVerified,
          tokenExpired: hasExpiredToken,
          canResend: !user.emailVerified
        }
      });

    } catch (error) {
      console.error('Check verification status error:', error);
      res.status(500).json({
        error: error.message || 'Failed to check verification status'
      });
    }
  }
}

module.exports = new EmailVerificationController();

