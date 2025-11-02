# Email Verification Integration Guide

## Quick Integration Steps

### Step 1: Add Routes to app.js

Add these lines to `src/app.js` after existing route imports:

```javascript
// Email verification routes
try {
  const emailVerificationRoutes = require('./routes/email-verification.routes');
  app.use('/api/auth', emailVerificationRoutes);
  console.log('✅ Email verification routes loaded');
} catch (e) {
  console.log('⚠️  Email verification routes not found');
}
```

**Full context** - add around line 60-70, after other routes:

```javascript
// ... existing routes ...

// Email verification routes (NEW)
try {
  const emailVerificationRoutes = require('./routes/email-verification.routes');
  app.use('/api/auth', emailVerificationRoutes);
  console.log('✅ Email verification routes loaded');
} catch (e) {
  console.log('⚠️  Email verification routes not found, skipping');
}

// ... rest of routes ...
```

---

### Step 2: Start Token Cleanup Service

Add to `src/server.js` at the end of the file, before `app.listen()`:

```javascript
// Start token cleanup service
const tokenCleanupService = require('./services/token-cleanup.service');
tokenCleanupService.start();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  tokenCleanupService.stop();
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  tokenCleanupService.stop();
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});
```

---

### Step 3: Configure Environment Variables

Add to your `.env` file:

```bash
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@dashdig.com
FRONTEND_URL=https://dashdig.com
```

---

### Step 4: Test the Integration

```bash
# Start the server
npm run dev

# In another terminal, test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'

# Check the email inbox for verification email

# Test verification (use token from email)
curl http://localhost:3000/api/auth/verify/TOKEN_HERE
```

---

## Complete Integration Example

### src/app.js (Add these sections)

```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Existing routes...
try {
  const apiRoutes = require('./routes/api');
  app.use('/api', apiRoutes);
  console.log('✅ API routes loaded');
} catch (e) {
  console.log('⚠️  API routes not found, skipping');
}

// Email verification routes (NEW)
try {
  const emailVerificationRoutes = require('./routes/email-verification.routes');
  app.use('/api/auth', emailVerificationRoutes);
  console.log('✅ Email verification routes loaded');
} catch (e) {
  console.log('⚠️  Email verification routes not found, skipping');
}

// Other routes...
// (auth routes, URL routes, etc.)

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
```

### src/server.js (Add cleanup service)

```javascript
const app = require('./app');
const mongoose = require('mongoose');
const tokenCleanupService = require('./services/token-cleanup.service');

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dashdig')
  .then(() => {
    console.log('✅ MongoDB connected');
    
    // Start token cleanup service
    tokenCleanupService.start();
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // Graceful shutdown
    const shutdown = (signal) => {
      console.log(`${signal} signal received: closing HTTP server`);
      
      // Stop cleanup service
      tokenCleanupService.stop();
      
      // Close HTTP server
      server.close(() => {
        console.log('HTTP server closed');
        
        // Close MongoDB connection
        mongoose.connection.close(false, () => {
          console.log('MongoDB connection closed');
          process.exit(0);
        });
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
```

---

## Frontend Integration

### Verification Page Example

Create a page at `/verify-email` in your frontend:

```javascript
// React example
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }
    
    // Verify token
    fetch(`${API_URL}/api/auth/verify/${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus('success');
          setMessage(data.message);
          // Redirect to login after 3 seconds
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.error);
        }
      })
      .catch(err => {
        setStatus('error');
        setMessage('Verification failed. Please try again.');
      });
  }, [searchParams]);
  
  return (
    <div className="verify-email-page">
      {status === 'verifying' && <p>Verifying your email...</p>}
      {status === 'success' && (
        <div>
          <h1>✅ Email Verified!</h1>
          <p>{message}</p>
          <p>Redirecting to login...</p>
        </div>
      )}
      {status === 'error' && (
        <div>
          <h1>❌ Verification Failed</h1>
          <p>{message}</p>
          <button onClick={() => window.location.href = '/resend-verification'}>
            Resend Verification Email
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## Middleware for Protected Routes

Add email verification check to protected routes:

```javascript
// middleware/requireVerifiedEmail.js
const User = require('../models/User');

async function requireVerifiedEmail(req, res, next) {
  try {
    // Assumes user ID is in req.userId (from auth middleware)
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    if (!user.emailVerified) {
      return res.status(403).json({
        error: 'Please verify your email address to use this feature',
        code: 'EMAIL_NOT_VERIFIED',
        email: user.email
      });
    }
    
    next();
  } catch (error) {
    console.error('Email verification check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { requireVerifiedEmail };
```

**Usage:**

```javascript
const { requireAuth } = require('./middleware/auth');
const { requireVerifiedEmail } = require('./middleware/requireVerifiedEmail');

// Protect route with both auth and email verification
router.post('/api/urls/shorten', 
  requireAuth, 
  requireVerifiedEmail, 
  urlController.shortenUrl
);
```

---

## Testing Checklist

- [ ] Server starts without errors
- [ ] Email verification routes load successfully
- [ ] Token cleanup service starts
- [ ] Registration endpoint works
- [ ] Verification email is sent
- [ ] Email contains valid verification link
- [ ] Verification endpoint works
- [ ] Resend verification works
- [ ] Rate limiting works (test 4+ emails)
- [ ] Expired tokens are cleaned up
- [ ] Frontend verification page works
- [ ] Protected routes require verification

---

## Troubleshooting

### Routes Not Loading

**Error:** "Email verification routes not found"

**Fix:** Check file paths are correct:
```javascript
require('./routes/email-verification.routes')  // ✅ Correct
require('./routes/emailVerification.routes')  // ❌ Wrong filename
```

### Cleanup Service Not Starting

**Error:** "Cannot find module 'token-cleanup.service'"

**Fix:** Check file exists at `src/services/token-cleanup.service.js`

### Emails Not Sending

**Check:**
1. SMTP credentials in `.env`
2. Email service logs in console
3. Run test: `node src/test/test-email-verification.js`

---

## Next Steps

After integration:

1. **Test in Development** - Use test email addresses
2. **Set Up Production SMTP** - SendGrid, AWS SES, etc.
3. **Configure DNS** - SPF, DKIM, DMARC records
4. **Monitor Email Delivery** - Track bounces and failures
5. **Add Email Analytics** - Track open rates, clicks
6. **Customize Email Template** - Add your branding

---

## Support

- **Documentation:** `EMAIL_VERIFICATION_README.md`
- **SMTP Setup:** `ENV_EXAMPLE.md`
- **Test Suite:** `src/test/test-email-verification.js`

---

<div align="center">

**Integration Complete! 🎉**

*Your email verification system is ready to use*

</div>

