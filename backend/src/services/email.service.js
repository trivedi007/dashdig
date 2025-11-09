/**
 * Email Service for Dashdig
 * Handles all email sending including verification emails
 * Updated with "Humanize and Shortenize URLs" branding
 */

const nodemailer = require('nodemailer');
const DASHDIG_BRAND = require('../config/branding');

class EmailService {
  constructor() {
    this.transporter = null;
    this.from = process.env.EMAIL_FROM || 'noreply@dashdig.com';
    this.initializeTransporter();
  }

  /**
   * Initialize Nodemailer transporter with SMTP configuration
   */
  initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        tls: {
          // Do not fail on invalid certs
          rejectUnauthorized: process.env.NODE_ENV === 'production'
        }
      });

      // Verify connection configuration
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('❌ SMTP connection failed:', error.message);
        } else {
          console.log('✅ SMTP server is ready to send emails');
        }
      });
    } catch (error) {
      console.error('Failed to initialize email transporter:', error);
      throw error;
    }
  }

  /**
   * Send verification email to user
   * @param {Object} options - Email options
   * @param {string} options.email - Recipient email
   * @param {string} options.name - Recipient name
   * @param {string} options.token - Verification token
   * @returns {Promise<Object>} Email send result
   */
  async sendVerificationEmail({ email, name, token }) {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized');
      }

      const verificationUrl = `${process.env.FRONTEND_URL || 'https://dashdig.com'}/verify-email?token=${token}`;
      const baseUrl = process.env.FRONTEND_URL || 'https://dashdig.com';
      
      // Generate email templates
      const htmlContent = this.generateVerificationEmailHTML(name, verificationUrl, baseUrl);
      const textContent = this.generateVerificationEmailText(name, verificationUrl);

      const mailOptions = {
        from: `"Dashdig" <${this.from}>`,
        to: email,
        subject: DASHDIG_BRAND.messaging.email.verification.subject,
        text: textContent,
        html: htmlContent,
        headers: {
          'X-Entity-Ref-ID': token.substring(0, 16),
          'X-Brand': DASHDIG_BRAND.name,
          'X-Powered-By': DASHDIG_BRAND.fullName
        }
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      console.log('✅ Verification email sent:', info.messageId);
      
      return {
        success: true,
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected
      };
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw new Error(`Failed to send verification email: ${error.message}`);
    }
  }

  /**
   * Generate HTML version of verification email
   * @private
   */
  generateVerificationEmailHTML(name, verificationUrl, baseUrl) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - Dashdig</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f4f7fa;
      color: #333333;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, ${DASHDIG_BRAND.colors.primary} 0%, ${DASHDIG_BRAND.colors.deep} 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #ffffff;
      text-decoration: none;
      letter-spacing: -0.5px;
    }
    .tagline {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.95);
      font-style: italic;
      margin-top: 8px;
    }
    .content {
      padding: 40px 30px;
    }
    h1 {
      color: #333333;
      font-size: 24px;
      margin-top: 0;
      margin-bottom: 20px;
      font-weight: 600;
    }
    p {
      line-height: 1.6;
      color: #555555;
      margin-bottom: 20px;
      font-size: 16px;
    }
    .cta-button {
      display: inline-block;
      padding: 16px 40px;
      background: linear-gradient(135deg, ${DASHDIG_BRAND.colors.primary} 0%, ${DASHDIG_BRAND.colors.deep} 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      transition: transform 0.2s;
    }
    .cta-button:hover {
      transform: translateY(-2px);
    }
    .expiration-notice {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 12px 16px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .expiration-notice p {
      margin: 0;
      color: #856404;
      font-size: 14px;
    }
    .alternative-link {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      word-break: break-all;
    }
    .alternative-link p {
      margin: 0 0 8px 0;
      font-size: 13px;
      color: #666666;
    }
    .alternative-link a {
      color: #667eea;
      font-size: 12px;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      color: #888888;
      font-size: 13px;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
    .footer-links {
      margin: 15px 0;
    }
    .footer-links a {
      margin: 0 10px;
    }
    .security-notice {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      font-size: 13px;
      color: #666666;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 30px 20px;
      }
      h1 {
        font-size: 20px;
      }
      .cta-button {
        display: block;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <a href="${baseUrl}" class="logo">Dashdig ${DASHDIG_BRAND.icon}</a>
      <p class="tagline">${DASHDIG_BRAND.tagline}</p>
    </div>
    
    <!-- Content -->
    <div class="content">
      <h1>${DASHDIG_BRAND.messaging.email.verification.title}${name ? `, ${name}` : ''}! 🎉</h1>
      
      <p>
        ${DASHDIG_BRAND.messaging.email.welcome.greeting}
      </p>
      <p>
        ${DASHDIG_BRAND.messaging.email.welcome.body}
      </p>
      
      <p>
        To get started, please verify your email address by clicking the button below:
      </p>
      
      <div style="text-align: center;">
        <a href="${verificationUrl}" class="cta-button">
          Verify Email Address
        </a>
      </div>
      
      <div class="expiration-notice">
        <p>
          ⏰ <strong>Important:</strong> This verification link will expire in 24 hours.
        </p>
      </div>
      
      <div class="alternative-link">
        <p><strong>Button not working?</strong></p>
        <p>Copy and paste this link into your browser:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
      </div>
      
      <div class="security-notice">
        <p>
          🔒 <strong>Security Notice:</strong> If you didn't create a Dashdig account, 
          you can safely ignore this email. Your email address will not be used without verification.
        </p>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p><strong>${DASHDIG_BRAND.name}</strong> - ${DASHDIG_BRAND.tagline} ${DASHDIG_BRAND.icon}</p>
      
      <div class="footer-links">
        <a href="${DASHDIG_BRAND.urls.docs}">Documentation</a> |
        <a href="${DASHDIG_BRAND.urls.support}">Support</a> |
        <a href="${baseUrl}/privacy">Privacy Policy</a>
      </div>
      
      <p style="margin-top: 15px;">
        © ${new Date().getFullYear()} ${DASHDIG_BRAND.name}. All rights reserved.
      </p>
      
      <p style="font-size: 11px; color: #aaaaaa; margin-top: 10px;">
        This is an automated email. Please do not reply to this message.
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Generate plain text version of verification email
   * @private
   */
  generateVerificationEmailText(name, verificationUrl) {
    return `
${DASHDIG_BRAND.messaging.email.verification.title}${name ? `, ${name}` : ''}!

${DASHDIG_BRAND.messaging.email.welcome.greeting}

${DASHDIG_BRAND.messaging.email.welcome.body}

To get started, please verify your email address by clicking the link below:

${verificationUrl}

⏰ IMPORTANT: This verification link will expire in 24 hours.

If the link doesn't work, copy and paste it directly into your browser.

🔒 Security Notice: If you didn't create a Dashdig account, you can safely ignore this email. Your email address will not be used without verification.

---
${DASHDIG_BRAND.name} - ${DASHDIG_BRAND.tagline} ${DASHDIG_BRAND.icon}
© ${new Date().getFullYear()} ${DASHDIG_BRAND.name}. All rights reserved.

This is an automated email. Please do not reply to this message.
    `.trim();
  }

  /**
   * Send password reset email
   * @param {Object} options - Email options
   */
  async sendPasswordResetEmail({ email, name, token }) {
    try {
      const resetUrl = `${process.env.FRONTEND_URL || 'https://dashdig.com'}/reset-password?token=${token}`;
      
      const mailOptions = {
        from: `"Dashdig" <${this.from}>`,
        to: email,
        subject: 'Reset your Dashdig password',
        html: `
          <h1>Password Reset Request</h1>
          <p>Hi ${name || 'there'},</p>
          <p>You requested to reset your password. Click the link below to set a new password:</p>
          <p><a href="${resetUrl}">Reset Password</a></p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw error;
    }
  }

  /**
   * Send welcome email after verification
   * @param {Object} options - Email options
   */
  async sendWelcomeEmail({ email, name }) {
    try {
      const dashboardUrl = `${process.env.FRONTEND_URL || 'https://dashdig.com'}/dashboard`;
      
      const mailOptions = {
        from: `"Dashdig" <${this.from}>`,
        to: email,
        subject: DASHDIG_BRAND.messaging.email.welcome.subject,
        html: `
          <h1>${DASHDIG_BRAND.messaging.email.welcome.greeting}, ${name || 'there'}!</h1>
          <p>${DASHDIG_BRAND.messaging.email.welcome.body}</p>
          <p>You can now:</p>
          <ul>
            <li>Create shortened URLs with custom slugs</li>
            <li>Track analytics and clicks</li>
            <li>Manage your links from the dashboard</li>
          </ul>
          <p><a href="${dashboardUrl}">Go to Dashboard</a></p>
          <p>Happy shortening!</p>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't throw - welcome email is not critical
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
module.exports = new EmailService();

