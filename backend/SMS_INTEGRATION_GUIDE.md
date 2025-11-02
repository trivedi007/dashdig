# SMS Verification Integration Guide

Step-by-step guide to integrate SMS verification into your DashDig application.

## 🚀 Quick Start (5 minutes)

### Step 1: Install Twilio

```bash
npm install twilio
```

### Step 2: Configure Environment

Add to `.env`:

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

### Step 3: Register Routes

In your `app.js` or `server.js`:

```javascript
const smsRoutes = require('./routes/sms-verification.routes');
const smsCleanupService = require('./services/sms-cleanup.service');

// Register routes
app.use('/api/auth/sms', smsRoutes);

// Start cleanup service
smsCleanupService.start();
```

### Step 4: Test

```bash
node src/test/test-sms-verification.js +1234567890
```

## 📋 Detailed Integration Steps

### 1. Backend Setup

#### A. Install Dependencies

```bash
npm install twilio express-rate-limit
```

#### B. Create Model

File already created: `src/models/SmsVerification.js`

#### C. Create Service

File already created: `src/services/sms.service.js`

#### D. Create Controller

File already created: `src/controllers/sms-verification.controller.js`

#### E. Create Routes

File already created: `src/routes/sms-verification.routes.js`

#### F. Register in App

```javascript
// app.js or server.js
const express = require('express');
const mongoose = require('mongoose');
const smsVerificationRoutes = require('./routes/sms-verification.routes');
const smsCleanupService = require('./services/sms-cleanup.service');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SMS verification routes
app.use('/api/auth/sms', smsVerificationRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    
    // Start cleanup service after DB connection
    smsCleanupService.start();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 2. Frontend Integration

#### A. Registration Flow with Phone Verification

```javascript
// 1. Register user
async function registerUser(userData) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
}

// 2. Send SMS verification
async function sendPhoneVerification(phone) {
  const response = await fetch('/api/auth/sms/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  });
  return response.json();
}

// 3. Verify code
async function verifyPhone(phone, code) {
  const response = await fetch('/api/auth/sms/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, code })
  });
  return response.json();
}

// Complete registration flow
async function completeRegistration(email, password, phone) {
  // Step 1: Register
  const user = await registerUser({ email, password });
  
  // Step 2: Send SMS
  await sendPhoneVerification(phone);
  
  // Step 3: User enters code (from UI)
  // ...
  
  // Step 4: Verify
  const verified = await verifyPhone(phone, userEnteredCode);
  
  if (verified.success) {
    console.log('Registration complete!');
  }
}
```

#### B. React Hook for SMS Verification

```javascript
import { useState, useCallback } from 'react';

export function useSmsVerification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [codeSent, setCodeSent] = useState(false);

  const sendCode = useCallback(async (phone) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send code');
      }
      
      setCodeSent(true);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyCode = useCallback(async (phone, code) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/sms/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resendCode = useCallback(async (phone) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/sms/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend code');
      }
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    codeSent,
    sendCode,
    verifyCode,
    resendCode
  };
}
```

#### C. React Component Example

```jsx
import React, { useState } from 'react';
import { useSmsVerification } from './useSmsVerification';

function PhoneVerificationForm({ onVerified }) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'code'
  const [countdown, setCountdown] = useState(0);
  
  const { loading, error, sendCode, verifyCode, resendCode } = useSmsVerification();

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      await sendCode(phone);
      setStep('code');
      startCountdown();
    } catch (err) {
      console.error('Send failed:', err);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const result = await verifyCode(phone, code);
      if (result.success) {
        onVerified(phone);
      }
    } catch (err) {
      console.error('Verification failed:', err);
    }
  };

  const handleResend = async () => {
    try {
      await resendCode(phone);
      startCountdown();
    } catch (err) {
      console.error('Resend failed:', err);
    }
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="phone-verification">
      {step === 'phone' ? (
        <form onSubmit={handleSendCode}>
          <h2>Verify Phone Number</h2>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (234) 567-8900"
            disabled={loading}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode}>
          <h2>Enter Verification Code</h2>
          <p>Code sent to {phone}</p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            maxLength={6}
            disabled={loading}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
          <div>
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0 || loading}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
            </button>
            <button
              type="button"
              onClick={() => setStep('phone')}
              disabled={loading}
            >
              Change Number
            </button>
          </div>
        </form>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default PhoneVerificationForm;
```

### 3. User Model Integration

If you want to store verified phone numbers in your User model:

```javascript
// Add to User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Add phone verification fields
  phone: { type: String, default: null },
  phoneVerified: { type: Boolean, default: false },
  phoneVerifiedAt: { type: Date, default: null },
  
  // ... other fields
});

// Add method to update phone verification
userSchema.methods.verifyPhone = function(phone) {
  this.phone = phone;
  this.phoneVerified = true;
  this.phoneVerifiedAt = new Date();
  return this.save();
};
```

Update the SMS verification controller:

```javascript
// In sms-verification.controller.js, after successful verification
if (req.userId) {
  const user = await User.findById(req.userId);
  if (user) {
    await user.verifyPhone(result.phone);
  }
}
```

### 4. Middleware Integration

Create middleware to require phone verification:

```javascript
// middleware/requirePhoneVerification.js
module.exports = async function requirePhoneVerification(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!user.phoneVerified) {
      return res.status(403).json({
        error: 'Phone verification required',
        code: 'PHONE_NOT_VERIFIED'
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
```

Use in routes:

```javascript
const requirePhoneVerification = require('./middleware/requirePhoneVerification');

// Protect sensitive routes
app.post('/api/shorten', 
  authenticate, 
  requirePhoneVerification, 
  shortenController.create
);
```

### 5. 2FA Implementation

Use SMS as a second factor for login:

```javascript
// Login flow with SMS 2FA

// Step 1: Login with email/password
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Verify credentials
  const user = await User.findOne({ email });
  if (!user || !await user.comparePassword(password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // If user has 2FA enabled, send SMS
  if (user.twoFactorEnabled && user.phone) {
    await smsService.sendVerificationSms({
      phone: user.phone,
      userId: user._id
    });
    
    return res.json({
      success: true,
      requiresTwoFactor: true,
      message: 'Verification code sent to your phone'
    });
  }
  
  // Otherwise, issue token directly
  const token = generateToken(user);
  res.json({ success: true, token });
});

// Step 2: Verify 2FA code
app.post('/api/auth/verify-2fa', async (req, res) => {
  const { phone, code } = req.body;
  
  try {
    const result = await smsService.verifySmsCode({ phone, code });
    
    // Find user by phone
    const user = await User.findOne({ phone: result.phone });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Issue token
    const token = generateToken(user);
    res.json({ success: true, token });
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

## 🔧 Configuration Options

### Customizing Rate Limits

```javascript
// In routes/sms-verification.routes.js
const smsRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                   // 5 requests
  message: 'Too many SMS requests. Please try again later.'
});
```

### Customizing Code Expiration

```javascript
// In models/SmsVerification.js
expiresAt: {
  type: Date,
  default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes instead of 5
}
```

### Customizing Cleanup Interval

```javascript
// When starting the service
smsCleanupService.start(60 * 60 * 1000); // Run every 1 hour instead of 30 min
```

### Custom SMS Template

```javascript
// In services/sms.service.js
const message = `[DashDig] Your verification code is ${code}. Expires in 5 minutes. Never share this code.`;
```

## 🧪 Testing

### Unit Tests

```javascript
// test/sms-verification.test.js
const smsService = require('../services/sms.service');
const SmsVerification = require('../models/SmsVerification');

describe('SMS Verification', () => {
  it('should generate 6-digit OTP', () => {
    const code = smsService.generateOtp();
    expect(code).toMatch(/^\d{6}$/);
  });

  it('should format phone numbers', () => {
    const formatted = smsService.formatPhoneNumber('1234567890');
    expect(formatted).toBe('+11234567890');
  });

  it('should enforce rate limiting', async () => {
    const phone = '+1234567890';
    
    // Send first SMS
    await smsService.sendVerificationSms({ phone });
    
    // Try to send again immediately
    await expect(
      smsService.sendVerificationSms({ phone })
    ).rejects.toThrow('wait');
  });
});
```

### Integration Tests

```javascript
// test/sms-api.test.js
const request = require('supertest');
const app = require('../app');

describe('SMS API', () => {
  it('should send verification code', async () => {
    const response = await request(app)
      .post('/api/auth/sms/send')
      .send({ phone: '+1234567890' })
      .expect(200);
    
    expect(response.body.success).toBe(true);
  });

  it('should reject invalid phone format', async () => {
    const response = await request(app)
      .post('/api/auth/sms/send')
      .send({ phone: 'invalid' })
      .expect(400);
  });
});
```

## 📊 Monitoring & Analytics

### Track Verification Rates

```javascript
// Add analytics to your verification controller
async function trackVerification(userId, success) {
  await Analytics.create({
    event: 'phone_verification',
    userId,
    success,
    timestamp: new Date()
  });
}
```

### Monitor Costs

```javascript
// services/sms-analytics.service.js
class SmsAnalytics {
  async getTodayCost() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const count = await SmsVerification.countDocuments({
      createdAt: { $gte: today }
    });
    
    const costPerSms = 0.0075; // US SMS cost
    return count * costPerSms;
  }
}
```

## 🚨 Error Handling

### Graceful Fallbacks

```javascript
// If Twilio is down, fall back to email verification
app.post('/api/auth/verify-contact', async (req, res) => {
  const { type, contact } = req.body; // type: 'sms' or 'email'
  
  try {
    if (type === 'sms') {
      await smsService.sendVerificationSms({ phone: contact });
    } else {
      await emailService.sendVerificationEmail(contact);
    }
    
    res.json({ success: true });
  } catch (error) {
    // If SMS fails, suggest email
    if (type === 'sms') {
      return res.status(503).json({
        error: 'SMS service unavailable',
        suggestion: 'Please try email verification'
      });
    }
    
    res.status(500).json({ error: error.message });
  }
});
```

## 📱 Mobile App Integration

### React Native Example

```javascript
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';

export default function PhoneVerification() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('phone');

  const sendCode = async () => {
    const response = await fetch('https://api.dashdig.com/api/auth/sms/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    
    if (response.ok) {
      setStep('verify');
    }
  };

  const verifyCode = async () => {
    const response = await fetch('https://api.dashdig.com/api/auth/sms/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code })
    });
    
    const data = await response.json();
    if (data.success) {
      // Navigate to next screen
    }
  };

  return (
    <View>
      {step === 'phone' ? (
        <>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="+1234567890"
            keyboardType="phone-pad"
          />
          <Button title="Send Code" onPress={sendCode} />
        </>
      ) : (
        <>
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="123456"
            keyboardType="number-pad"
            maxLength={6}
          />
          <Button title="Verify" onPress={verifyCode} />
        </>
      )}
    </View>
  );
}
```

## 🎉 You're Done!

Your SMS verification system is now fully integrated. Next steps:

1. Test thoroughly in development
2. Set up Twilio production account
3. Configure webhook URL
4. Monitor costs and delivery rates
5. Implement proper error handling
6. Add analytics and logging

For more details, see:
- [SMS_VERIFICATION_README.md](./SMS_VERIFICATION_README.md)
- [ENV_EXAMPLE.md](./ENV_EXAMPLE.md)

