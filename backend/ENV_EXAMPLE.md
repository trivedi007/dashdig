# Environment Variables for Email & SMS Verification

## Required SMTP Configuration

Add these variables to your `.env` file:

```bash
# Email Configuration (SMTP)
# Choose one of the providers below

# === Gmail (Recommended for testing) ===
# 1. Enable 2FA on your Google account
# 2. Generate App Password: https://myaccount.google.com/apppasswords
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
EMAIL_FROM=noreply@dashdig.com

# === SendGrid ===
# SMTP_HOST=smtp.sendgrid.net
# SMTP_PORT=587
# SMTP_USER=apikey
# SMTP_PASS=your-sendgrid-api-key
# EMAIL_FROM=noreply@dashdig.com

# === AWS SES ===
# SMTP_HOST=email-smtp.us-east-1.amazonaws.com
# SMTP_PORT=587
# SMTP_USER=your-ses-smtp-username
# SMTP_PASS=your-ses-smtp-password
# EMAIL_FROM=noreply@dashdig.com

# === Mailgun ===
# SMTP_HOST=smtp.mailgun.org
# SMTP_PORT=587
# SMTP_USER=postmaster@your-domain.mailgun.org
# SMTP_PASS=your-mailgun-password
# EMAIL_FROM=noreply@dashdig.com

# === Mailtrap (for testing only) ===
# SMTP_HOST=smtp.mailtrap.io
# SMTP_PORT=2525
# SMTP_USER=your-mailtrap-username
# SMTP_PASS=your-mailtrap-password
# EMAIL_FROM=noreply@dashdig.com

# Frontend URL (for verification links)
FRONTEND_URL=https://dashdig.com

# Token Settings (optional - defaults shown)
VERIFICATION_TOKEN_EXPIRY_HOURS=24
MAX_VERIFICATION_EMAILS_PER_HOUR=3
TOKEN_CLEANUP_ENABLED=true
TOKEN_CLEANUP_INTERVAL_HOURS=1

# === Twilio SMS Configuration (for SMS 2FA) ===
# Sign up at: https://www.twilio.com/console
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

## Setup Instructions

### 1. Gmail Setup (Easiest for Development)

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to App Passwords: https://myaccount.google.com/apppasswords
4. Select "Mail" and "Other (Custom name)"
5. Name it "DashDig Backend"
6. Copy the 16-character password
7. Add to `.env`:
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=youremail@gmail.com
   SMTP_PASS=abcd efgh ijkl mnop
   EMAIL_FROM=noreply@dashdig.com
   ```

### 2. SendGrid Setup (Production Recommended)

1. Create account at https://sendgrid.com
2. Create API key with "Mail Send" permissions
3. Add to `.env`:
   ```bash
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   EMAIL_FROM=noreply@dashdig.com
   ```

### 3. AWS SES Setup (Scalable Production)

1. Set up AWS SES in your region
2. Verify your sending domain
3. Create SMTP credentials
4. Add to `.env`:
   ```bash
   SMTP_HOST=email-smtp.us-east-1.amazonaws.com
   SMTP_PORT=587
   SMTP_USER=your-smtp-username
   SMTP_PASS=your-smtp-password
   EMAIL_FROM=noreply@dashdig.com
   ```

### 4. Twilio SMS Setup (for 2FA)

1. Create account at https://www.twilio.com/try-twilio
2. Get a phone number from the Twilio Console
3. Find your Account SID and Auth Token at: https://www.twilio.com/console
4. Add to `.env`:
   ```bash
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your-auth-token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

**Important Notes:**
- Twilio trial accounts can only send to verified phone numbers
- Trial account messages include "Sent from your Twilio trial account"
- Upgrade to a paid account for production use
- SMS costs vary by country (typically $0.0075 per SMS in US)
- Set up webhook URL for delivery status: `https://your-domain.com/api/auth/sms/webhook`

## Testing Your Configuration

### Email Verification Test

Run the email test script:

```bash
node src/test/test-email.js
```

Or test via API:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

### SMS Verification Test

Run the SMS test script:

```bash
node src/test/test-sms-verification.js +1234567890
```

Or test via API:

```bash
# Send SMS
curl -X POST http://localhost:3000/api/auth/sms/send \
  -H "Content-Type: application/json" \
  -d '{"phone":"+1234567890"}'

# Verify code
curl -X POST http://localhost:3000/api/auth/sms/verify \
  -H "Content-Type: application/json" \
  -d '{"phone":"+1234567890","code":"123456"}'
```

## Security Notes

### Email Security
- **Never commit `.env` file** to version control
- Use different SMTP credentials for dev/staging/production
- Rotate SMTP passwords regularly
- Use App Passwords (not your actual password) for Gmail
- Consider using a dedicated email service (SendGrid, AWS SES) for production
- Monitor your email sending quota

### SMS Security
- Store Twilio credentials securely (use environment variables, never commit)
- Use different Twilio accounts for dev/staging/production
- Monitor SMS usage and costs at Twilio Console
- Set up spending limits in Twilio to prevent unexpected charges
- Use Twilio's Verify API for production (more secure than custom implementation)
- Implement IP-based rate limiting to prevent abuse
- Log all SMS attempts for security auditing

## Rate Limits

The system implements rate limiting:

### Email Verification
- **Registration**: 5 attempts per 15 minutes per IP
- **Resend Verification**: 3 emails per hour per email address
- **Verification**: 10 attempts per 15 minutes per IP

### SMS Verification
- **Send SMS**: 1 SMS per minute per phone number
- **Send SMS (Global)**: 5 requests per 15 minutes per IP
- **Verify Code**: Max 3 attempts per verification
- **Code Expiration**: 5 minutes

## Troubleshooting

### Email Issues

**"Email transporter not initialized"**
- Check that SMTP_* variables are set in `.env`
- Verify SMTP_HOST and SMTP_PORT are correct

**"Authentication failed"**
- For Gmail: Make sure you're using App Password, not regular password
- For SendGrid: Ensure API key has "Mail Send" permission
- Check SMTP_USER and SMTP_PASS are correct

**"Connection timeout"**
- Check if your hosting provider blocks SMTP ports
- Try port 465 with SMTP_SECURE=true
- Check firewall settings

**Emails go to spam**
- Set up SPF, DKIM, and DMARC records for your domain
- Use a verified sending domain
- Avoid spam trigger words in email content

### SMS Issues

**"SMS service is not configured"**
- Verify TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER are set in `.env`
- Check credentials at https://www.twilio.com/console

**"Invalid phone number format"**
- Use E.164 format: +[country code][number] (e.g., +1234567890)
- System auto-formats US numbers, but explicit country code is recommended

**SMS not received**
- Check phone number is correct and can receive SMS
- For trial accounts: verify the phone number in Twilio Console
- Check Twilio logs at https://www.twilio.com/console/sms/logs
- Verify webhook is configured correctly

**"Rate limit exceeded"**
- Wait 60 seconds between SMS to the same number
- Use resend endpoint instead of send for retry attempts

**"Please wait X seconds before requesting another code"**
- This is normal rate limiting behavior (1 SMS per minute per phone)
- Wait for the indicated time before trying again

**High SMS costs**
- Monitor usage at Twilio Console
- Set up spending limits to prevent unexpected charges
- Consider using Twilio Verify API (more cost-effective at scale)
- SMS to international numbers costs more (check Twilio pricing)

