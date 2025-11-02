# SMS Verification - Quick Start Guide

Get SMS verification running in under 5 minutes! ⚡

## 🚀 Step 1: Install Twilio (30 seconds)

```bash
npm install twilio
```

## 🔑 Step 2: Get Twilio Credentials (2 minutes)

1. Sign up at https://www.twilio.com/try-twilio (free trial)
2. Get a phone number from the Console
3. Copy your **Account SID** and **Auth Token**

## ⚙️ Step 3: Configure Environment (30 seconds)

Add to your `.env` file:

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

## 🔌 Step 4: Add to Your App (1 minute)

Add these 3 lines to your `app.js` or `server.js`:

```javascript
// Add this with your other route imports
const smsRoutes = require('./src/routes/sms-verification.routes');

// Add this with your other route registrations
app.use('/api/auth/sms', smsRoutes);

// Add this after MongoDB connects (inside the .then() block)
const smsCleanupService = require('./src/services/sms-cleanup.service');
smsCleanupService.start();
```

### Complete Example

```javascript
// app.js or server.js
const express = require('express');
const mongoose = require('mongoose');
const smsRoutes = require('./src/routes/sms-verification.routes');
const smsCleanupService = require('./src/services/sms-cleanup.service');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth/sms', smsRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    
    // Start SMS cleanup service
    smsCleanupService.start();
  })
  .catch(err => console.error('MongoDB error:', err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

## 🧪 Step 5: Test It! (1 minute)

### Option A: Use the test script

```bash
node src/test/test-sms-verification.js +1234567890
```

### Option B: Test with cURL

```bash
# Send SMS
curl -X POST http://localhost:3000/api/auth/sms/send \
  -H "Content-Type: application/json" \
  -d '{"phone":"+1234567890"}'

# You'll receive an SMS, then verify:
curl -X POST http://localhost:3000/api/auth/sms/verify \
  -H "Content-Type: application/json" \
  -d '{"phone":"+1234567890","code":"123456"}'
```

## ✅ Done!

Your SMS verification is now live! 🎉

## 📱 Frontend Example

```javascript
// Send verification code
const response = await fetch('/api/auth/sms/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phone: '+1234567890' })
});

// Verify code
const verify = await fetch('/api/auth/sms/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    phone: '+1234567890', 
    code: '123456' 
  })
});
```

## 🚨 Common Issues

### "SMS service is not configured"
→ Check your `.env` file has all 3 Twilio variables

### "Invalid phone number format"
→ Use E.164 format: `+1234567890` (include country code)

### SMS not received
→ For trial accounts, verify the phone number in Twilio Console first

### "Please wait X seconds before requesting another code"
→ Wait 60 seconds between SMS to the same number (this is rate limiting)

## 📚 Need More Help?

- **Full Documentation**: See `SMS_VERIFICATION_README.md`
- **Integration Guide**: See `SMS_INTEGRATION_GUIDE.md`
- **Environment Setup**: See `ENV_EXAMPLE.md`
- **Complete Summary**: See `SMS_VERIFICATION_COMPLETE.md`

## 🎯 API Endpoints

- `POST /api/auth/sms/send` - Send verification code
- `POST /api/auth/sms/verify` - Verify code
- `POST /api/auth/sms/resend` - Resend code
- `GET /api/auth/sms/stats` - Get statistics (admin)

## 💡 Pro Tips

1. **Trial Account Limits**: Can only send to verified numbers
2. **Cost**: ~$0.0075 per SMS (US), check pricing for other countries
3. **Rate Limits**: 1 SMS per minute per phone, 5 requests per 15 min per IP
4. **Code Expiration**: Codes expire after 5 minutes
5. **Cleanup**: Old codes are automatically cleaned up every 30 minutes

## 🚀 Next Steps

1. **Frontend Integration**: Add phone verification to your UI
2. **User Model**: Link verified phones to user accounts
3. **2FA**: Use for two-factor authentication
4. **Webhooks**: Set up delivery status tracking
5. **Production**: Upgrade Twilio account for production use

---

That's it! You now have SMS verification up and running! 🎉

