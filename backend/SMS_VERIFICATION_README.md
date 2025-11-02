# SMS Verification System (2FA)

Complete SMS-based Two-Factor Authentication for DashDig using Twilio.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Usage Examples](#usage-examples)
- [Security Features](#security-features)
- [Testing](#testing)
- [Webhook Setup](#webhook-setup)
- [Production Checklist](#production-checklist)

## 🎯 Overview

This SMS verification system provides secure phone number verification using Twilio. It generates 6-digit OTP codes, handles rate limiting, and includes comprehensive error handling.

### Key Stats
- **Code Length**: 6 digits (100,000 - 999,999)
- **Expiration**: 5 minutes
- **Rate Limit**: 1 SMS per minute per phone number
- **Max Attempts**: 3 verification attempts per code
- **Auto Cleanup**: Expired tokens cleaned every 30 minutes

## ✨ Features

### Core Features
- ✅ 6-digit OTP generation
- ✅ SMS delivery via Twilio
- ✅ Phone number validation (E.164 format)
- ✅ Token expiration (5 minutes)
- ✅ Rate limiting (1 SMS/minute per phone)
- ✅ Max verification attempts (3 attempts)
- ✅ Resend functionality
- ✅ Automatic cleanup of expired codes

### Security Features
- 🔒 Secure random code generation
- 🔒 Timing-safe comparisons
- 🔒 Rate limiting per phone number
- 🔒 Global rate limiting per IP
- 🔒 Max attempt protection
- 🔒 Automatic code expiration
- 🔒 IP address logging

### Additional Features
- 📊 Statistics and monitoring
- 🪝 Twilio webhook support
- 🧹 Automatic cleanup service
- 📱 Phone number auto-formatting
- 🌍 International number support

## 🏗️ Architecture

### Components

```
src/
├── models/
│   └── SmsVerification.js          # MongoDB schema for SMS codes
├── services/
│   ├── sms.service.js              # SMS sending & verification logic
│   └── sms-cleanup.service.js      # Automatic cleanup service
├── controllers/
│   └── sms-verification.controller.js  # API endpoint handlers
└── routes/
    └── sms-verification.routes.js  # Route definitions
```

### Data Flow

1. **Send SMS Request** → Validate phone → Check rate limit → Generate OTP → Save to DB → Send via Twilio
2. **Verify Code** → Find verification → Validate code → Increment attempts → Mark verified → Clean up
3. **Cleanup Service** → Runs every 30 min → Delete expired → Delete old verified

## 📦 Installation

### 1. Install Dependencies

```bash
npm install twilio
# or
yarn add twilio
```

### 2. Set Environment Variables

Add to your `.env` file:

```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# MongoDB (if not already set)
MONGODB_URI=mongodb://localhost:27017/dashdig
```

### 3. Get Twilio Credentials

1. Sign up at https://www.twilio.com/try-twilio
2. Get a phone number from Twilio Console
3. Find credentials at https://www.twilio.com/console

## ⚙️ Configuration

### Twilio Setup

#### Trial Account
- Free credits included
- Can only send to verified phone numbers
- Messages include "Sent from your Twilio trial account"
- Perfect for development

#### Production Account
- Requires payment method
- Can send to any number
- No trial message prefix
- Set up spending limits to control costs

### Phone Number Formats

The system accepts various formats and auto-converts to E.164:

```javascript
// Input formats (all converted to E.164)
"1234567890"      → "+11234567890"
"+1234567890"     → "+1234567890"
"(123) 456-7890"  → "+11234567890"

// E.164 format (preferred)
"+1234567890"     → US number
"+447911123456"   → UK number
"+919876543210"   → India number
```

## 🚀 API Endpoints

### 1. Send Verification SMS

```http
POST /api/auth/sms/send
Content-Type: application/json

{
  "phone": "+1234567890"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Verification code sent successfully",
  "data": {
    "phone": "+1234567890",
    "expiresIn": 300
  }
}
```

**Error Responses**:
- `400` - Invalid phone number
- `429` - Rate limit exceeded
- `503` - SMS service unavailable

### 2. Verify Code

```http
POST /api/auth/sms/verify
Content-Type: application/json

{
  "phone": "+1234567890",
  "code": "123456"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Phone number verified successfully",
  "data": {
    "verified": true,
    "phone": "+1234567890"
  }
}
```

**Error Responses**:
- `400` - Invalid code or format
- `404` - No active verification found
- `429` - Max attempts reached

### 3. Resend Code

```http
POST /api/auth/sms/resend
Content-Type: application/json

{
  "phone": "+1234567890"
}
```

### 4. Twilio Webhook

```http
POST /api/auth/sms/webhook
Content-Type: application/x-www-form-urlencoded

[Twilio webhook payload]
```

### 5. Statistics (Admin)

```http
GET /api/auth/sms/stats
Authorization: Bearer <admin-token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "total": 150,
    "active": 5,
    "verified": 120,
    "expired": 20,
    "maxAttempts": 5,
    "serviceConfigured": true
  }
}
```

### 6. Cleanup (Admin)

```http
POST /api/auth/sms/cleanup
Authorization: Bearer <admin-token>
```

## 💻 Usage Examples

### Backend Integration

```javascript
// In your app.js or server.js
const smsVerificationRoutes = require('./routes/sms-verification.routes');
const smsCleanupService = require('./services/sms-cleanup.service');

// Register routes
app.use('/api/auth/sms', smsVerificationRoutes);

// Start cleanup service (runs every 30 minutes)
smsCleanupService.start();
```

### Frontend - Send Code

```javascript
async function sendVerificationCode(phone) {
  try {
    const response = await fetch('/api/auth/sms/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('SMS sent! Check your phone.');
      return true;
    }
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return false;
  }
}
```

### Frontend - Verify Code

```javascript
async function verifyCode(phone, code) {
  try {
    const response = await fetch('/api/auth/sms/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code })
    });
    
    const data = await response.json();
    
    if (data.success && data.data.verified) {
      console.log('Phone verified successfully!');
      return true;
    }
  } catch (error) {
    console.error('Verification failed:', error);
    return false;
  }
}
```

### React Component Example

```jsx
import { useState } from 'react';

function PhoneVerification() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'verify'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendCode = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStep('verify');
      } else {
        setError(data.error || 'Failed to send code');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/sms/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Phone verified! Redirect or update state
        console.log('Verified!');
      } else {
        setError(data.error || 'Invalid code');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {step === 'phone' ? (
        <div>
          <h2>Verify Phone Number</h2>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1234567890"
          />
          <button onClick={sendCode} disabled={loading}>
            {loading ? 'Sending...' : 'Send Code'}
          </button>
        </div>
      ) : (
        <div>
          <h2>Enter Verification Code</h2>
          <p>Code sent to {phone}</p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            maxLength={6}
          />
          <button onClick={verifyCode} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
          <button onClick={() => setStep('phone')}>
            Change Number
          </button>
        </div>
      )}
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}
```

## 🔒 Security Features

### Rate Limiting

1. **Per Phone Number**: 1 SMS per minute
2. **Per IP Address**: 5 requests per 15 minutes
3. **Max Attempts**: 3 verification attempts per code

### Code Security

- **Random Generation**: Using `Math.random()` for 6-digit codes
- **Expiration**: Codes expire after 5 minutes
- **Single Use**: Codes deleted after successful verification
- **No Reuse**: Old codes invalidated when new one is sent

### Database Security

- **TTL Index**: Automatic deletion after 1 hour
- **IP Logging**: Track requests for security auditing
- **Attempt Tracking**: Monitor failed verification attempts

### Production Recommendations

1. **Use HTTPS**: Always use SSL/TLS in production
2. **Rate Limiting**: Implement IP-based rate limiting
3. **Monitor Costs**: Set up Twilio spending alerts
4. **Webhook Security**: Validate Twilio signatures
5. **Audit Logs**: Log all SMS attempts
6. **Backup Verification**: Offer alternative verification methods

## 🧪 Testing

### Manual Testing

```bash
# Run test script
node src/test/test-sms-verification.js +1234567890
```

The script will:
1. Send verification code
2. Wait for your input
3. Verify the code
4. Test rate limiting
5. Test invalid codes
6. Show statistics

### API Testing with cURL

```bash
# 1. Send SMS
curl -X POST http://localhost:3000/api/auth/sms/send \
  -H "Content-Type: application/json" \
  -d '{"phone":"+1234567890"}'

# 2. Verify code
curl -X POST http://localhost:3000/api/auth/sms/verify \
  -H "Content-Type: application/json" \
  -d '{"phone":"+1234567890","code":"123456"}'

# 3. Get statistics (requires admin token)
curl -X GET http://localhost:3000/api/auth/sms/stats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Testing Checklist

- [ ] Send SMS to valid number
- [ ] Verify with correct code
- [ ] Verify with incorrect code
- [ ] Test expiration (wait 5 minutes)
- [ ] Test max attempts (try 4+ times)
- [ ] Test rate limiting (send 2 SMS quickly)
- [ ] Test invalid phone format
- [ ] Test resend functionality
- [ ] Test webhook delivery
- [ ] Test cleanup service

## 🪝 Webhook Setup

Twilio can send delivery status updates to your server.

### 1. Configure Webhook URL

In Twilio Console:
1. Go to Phone Numbers → Active Numbers
2. Select your number
3. Under "Messaging", set "A MESSAGE COMES IN" webhook to:
   ```
   https://your-domain.com/api/auth/sms/webhook
   ```
4. Method: `POST`

### 2. Webhook Events

The system logs these events:
- `sent` - SMS sent to carrier
- `delivered` - SMS delivered to phone
- `failed` - Delivery failed
- `undelivered` - Could not deliver

### 3. Testing Webhooks Locally

Use ngrok to test webhooks on localhost:

```bash
# Install ngrok
npm install -g ngrok

# Start your server
npm start

# In another terminal, start ngrok
ngrok http 3000

# Use the ngrok URL in Twilio webhook settings
https://abc123.ngrok.io/api/auth/sms/webhook
```

## ✅ Production Checklist

### Before Launch

- [ ] **Twilio Account**
  - [ ] Upgrade from trial to paid account
  - [ ] Set up billing with spending limits
  - [ ] Purchase dedicated phone number
  - [ ] Configure webhook URL

- [ ] **Security**
  - [ ] Use HTTPS for all endpoints
  - [ ] Implement IP-based rate limiting
  - [ ] Set up monitoring and alerts
  - [ ] Review Twilio security settings
  - [ ] Enable two-factor auth on Twilio account

- [ ] **Environment**
  - [ ] Set production environment variables
  - [ ] Use different Twilio account for prod
  - [ ] Configure proper error handling
  - [ ] Set up logging (Winston, etc.)

- [ ] **Testing**
  - [ ] Test with real phone numbers
  - [ ] Test international numbers
  - [ ] Load test SMS sending
  - [ ] Test webhook reliability
  - [ ] Test cleanup service

- [ ] **Monitoring**
  - [ ] Set up Twilio usage alerts
  - [ ] Monitor SMS delivery rates
  - [ ] Track verification success rates
  - [ ] Set up error notifications

- [ ] **Compliance**
  - [ ] Review SMS compliance guidelines
  - [ ] Add opt-out instructions (for marketing SMS)
  - [ ] Follow local regulations (GDPR, etc.)
  - [ ] Implement data retention policy

### Cost Optimization

1. **Use Twilio Verify API**: More cost-effective at scale
2. **Implement Voice Fallback**: Some users prefer voice OTP
3. **Cache Verification Status**: Avoid unnecessary DB queries
4. **Set Spending Limits**: Prevent unexpected charges
5. **Monitor Fraud**: Watch for suspicious patterns

## 📊 Monitoring

### Key Metrics to Track

1. **SMS Delivery Rate**: % of SMS successfully delivered
2. **Verification Success Rate**: % of users who complete verification
3. **Average Time to Verify**: How long users take to enter code
4. **Failed Attempts**: Number of failed verification attempts
5. **Cost Per Verification**: Total SMS cost / successful verifications

### Twilio Console

Monitor at https://www.twilio.com/console:
- SMS logs
- Delivery status
- Usage and costs
- Error messages
- Webhook logs

## 🐛 Common Issues

See [ENV_EXAMPLE.md](./ENV_EXAMPLE.md) for detailed troubleshooting.

## 📚 Additional Resources

- [Twilio SMS Documentation](https://www.twilio.com/docs/sms)
- [Twilio Node.js SDK](https://www.twilio.com/docs/libraries/node)
- [E.164 Phone Number Format](https://en.wikipedia.org/wiki/E.164)
- [Twilio Pricing](https://www.twilio.com/sms/pricing)
- [Twilio Verify API](https://www.twilio.com/docs/verify/api) (recommended for production)

## 📄 License

This implementation is part of the DashDig URL Shortener project.

---

**Need Help?**
- Check [ENV_EXAMPLE.md](./ENV_EXAMPLE.md) for configuration issues
- Review [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for integration steps
- Contact support or check Twilio documentation

