const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const { getRedis } = require('../config/redis');

class AuthService {
  async sendVerificationEmail(user) {
    // Set expiration for the verification token (24 hours)
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    const token = user.generateVerificationToken();
    await user.save(); // Save the user with the new verification token

    const verificationLink = `${process.env.FRONTEND_URL}/verify/${token}`;
    await this.sendEmail(user.email, verificationLink, null); // Send the verification email without a code
  }
  constructor() {
    // Initialize email transporter with Resend
    if (process.env.RESEND_API_KEY) {
      this.emailTransporter = nodemailer.createTransport({
        host: 'smtp.resend.com',
        port: 587,
        secure: false,
        auth: {
          user: 'resend',
          pass: process.env.RESEND_API_KEY
        }
      });
      console.log('📧 Email service initialized with Resend');
    } else {
      // Fallback to console logging
      this.emailTransporter = null;
      console.log('📧 Email service initialized (fallback to console - no RESEND_API_KEY found)');
    }
  }

  async sendMagicLink(identifier) {
    try {
      const redis = getRedis();
      
      // Check rate limiting (with fallback)
      if (redis) {
        const attempts = await redis.get(`auth:attempts:${identifier}`);
        if (attempts && parseInt(attempts) >= 5) {
          throw new Error('Too many attempts. Please try again later.');
        }
      }

      // Generate secure token and code
      const token = crypto.randomBytes(32).toString('hex');
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store in Redis with 10-minute expiry (with fallback to in-memory)
      const tokenData = {
        identifier,
        code,
        attempts: 0,
        createdAt: new Date()
      };
      
      if (redis) {
        await redis.setex(
          `auth:token:${token}`,
          600,
          JSON.stringify(tokenData)
        );
        
        // Track attempts
        await redis.incr(`auth:attempts:${identifier}`);
        await redis.expire(`auth:attempts:${identifier}`, 3600); // 1 hour
      } else {
        // Fallback to in-memory storage (for development/testing)
        console.warn('⚠️ Redis unavailable - using in-memory token storage (not production ready)');
        this.inMemoryTokens = this.inMemoryTokens || new Map();
        this.inMemoryTokens.set(token, { ...tokenData, expires: Date.now() + 600000 });
        
        // Clean up expired tokens
        for (const [key, value] of this.inMemoryTokens.entries()) {
          if (value.expires < Date.now()) {
            this.inMemoryTokens.delete(key);
          }
        }
      }

      const magicLink = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`;
      
      // Determine if email or phone
      const isEmail = identifier.includes('@');
      
      if (isEmail) {
        // Send email
        await this.sendEmail(identifier, magicLink, code);
      } else {
        // For MVP, we'll just log the code
        console.log(`SMS to ${identifier}: Your code is ${code}`);
        // In production, use Twilio:
        // await this.sendSMS(identifier, magicLink, code);
      }

      return {
        success: true,
        message: isEmail ? 
          'Check your email for the magic link!' : 
          'Check your phone for the verification code!',
        method: isEmail ? 'email' : 'sms'
      };

    } catch (error) {
      console.error('Send magic link error:', error);
      throw error;
    }
  }

  async sendEmail(email, magicLink, code) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: #ffffff;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 32px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #3B82F6;
          }
          .button {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 24px 0;
          }
          .code-box {
            background: #F3F4F6;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
            margin: 24px 0;
          }
          .code {
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #1F2937;
          }
          .footer {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #E5E7EB;
            text-align: center;
            color: #6B7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🔗 SmartLink</div>
            <p>Transform URLs into memorable links</p>
          </div>
          
          <h2>Welcome back! 👋</h2>
          <p>Click the button below to instantly sign in to your account:</p>
          
          <div style="text-align: center;">
            <a href="${magicLink}" class="button">Sign In to SmartLink</a>
          </div>
          
          <div style="text-align: center; color: #6B7280;">
            <p>Or enter this code on the verification page:</p>
          </div>
          
          <div class="code-box">
            <div class="code">${code}</div>
          </div>
          
          <div class="footer">
            <p>This link will expire in 10 minutes for your security.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <p style="margin-top: 16px;">
              Need help? Contact us at support@smartlink.ai
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      if (this.emailTransporter) {
        const info = await this.emailTransporter.sendMail({
          from: `"Dashdig" <${process.env.EMAIL_FROM || 'hello@dashdig.com'}>`,
          to: email,
          subject: '🔐 Your Dashdig Sign-in Link',
          html,
          text: `Sign in to Dashdig:\n\n${magicLink}\n\nOr use code: ${code}\n\nThis link expires in 10 minutes.`
        });
        
        console.log('📧 Email sent successfully to:', email);
      } else {
        throw new Error('Email service not configured');
      }
    } catch (error) {
      // Fallback to console logging for development/testing
      console.log('\n=====================================');
      console.log('📧 EMAIL SERVICE ERROR - LOGGING TO CONSOLE');
      console.log('=====================================');
      console.log(`TO: ${email}`);
      console.log(`MAGIC LINK: ${magicLink}`);
      console.log(`VERIFICATION CODE: ${code}`);
      console.log('=====================================\n');
      console.log('Copy the link above and paste in browser, or use the code');
      console.log('=====================================\n');
      
      // Don't throw the error - let the flow continue for development
    }
  }

  async verifyToken(token, code = null) {
    try {
      const redis = getRedis();
      let tokenData;
      
      if (redis) {
        // Get token data from Redis
        const key = `auth:token:${token}`;
        const data = await redis.get(key);
        if (!data) {
          throw new Error('Invalid or expired link');
        }
        tokenData = JSON.parse(data);
        
        // Verify code if provided
        if (code) {
          if (tokenData.code !== code) {
            tokenData.attempts++;
            
            if (tokenData.attempts >= 3) {
              await redis.del(key);
              throw new Error('Too many failed attempts');
            }
            
            await redis.setex(key, 300, JSON.stringify(tokenData));
            throw new Error('Invalid verification code');
          }
        }
      } else {
        // Fallback to in-memory storage
        if (!this.inMemoryTokens || !this.inMemoryTokens.has(token)) {
          throw new Error('Invalid or expired link');
        }
        
        const storedData = this.inMemoryTokens.get(token);
        if (storedData.expires < Date.now()) {
          this.inMemoryTokens.delete(token);
          throw new Error('Invalid or expired link');
        }
        
        tokenData = storedData;
        
        // Verify code if provided
        if (code) {
          if (tokenData.code !== code) {
            tokenData.attempts++;
            
            if (tokenData.attempts >= 3) {
              this.inMemoryTokens.delete(token);
              throw new Error('Too many failed attempts');
            }
            
            this.inMemoryTokens.set(token, tokenData);
            throw new Error('Invalid verification code');
          }
        }
      }

      // Find or create user
      let user = await User.findOne({ identifier: tokenData.identifier });
      
      if (!user) {
        // New user - create account
        user = new User({
          identifier: tokenData.identifier,
          email: tokenData.identifier.includes('@') ? tokenData.identifier : undefined,
          phone: !tokenData.identifier.includes('@') ? tokenData.identifier : undefined,
          isVerified: true,
          lastLogin: new Date()
        });
        
        await user.save();
      } else {
        // Existing user - update last login
        user.lastLogin = new Date();
        user.isVerified = true;
        await user.save();
      }

      // Generate JWT
      const jwtToken = this.generateJWT(user);
      
      // Clean up token storage
      if (redis) {
        await redis.del(`auth:token:${token}`);
        await redis.del(`auth:attempts:${tokenData.identifier}`);
      } else {
        this.inMemoryTokens.delete(token);
      }

      return {
        user: this.sanitizeUser(user),
        token: jwtToken,
        isNewUser: !user.lastLogin || user.lastLogin.getTime() === user.createdAt.getTime()
      };

    } catch (error) {
      console.error('Verify token error:', error);
      throw error;
    }
  }

  generateJWT(user) {
    return jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        phone: user.phone,
        plan: user.subscription.plan
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '30d',
        issuer: 'smartlink'
      }
    );
  }

  verifyJWT(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  sanitizeUser(user) {
    return {
      id: user._id,
      email: user.email,
      phone: user.phone,
      profile: user.profile,
      subscription: user.subscription,
      usage: user.usage,
      settings: {
        defaultExpiry: user.settings?.defaultExpiry,
        emailNotifications: user.settings?.emailNotifications,
        weeklyReport: user.settings?.weeklyReport
        // Don't send API key to frontend
      },
      isVerified: user.isVerified
    };
  }
}

module.exports = new AuthService();
