# SMS Verification - Deployment Checklist

Use this checklist to ensure your SMS verification system is properly configured and deployed.

## 📋 Pre-Deployment Checklist

### 1. Dependencies ✅

- [ ] Install Twilio package
  ```bash
  npm install twilio
  ```

- [ ] Install rate limiting (optional)
  ```bash
  npm install express-rate-limit
  ```

- [ ] Verify package.json includes dependencies
  ```json
  {
    "dependencies": {
      "twilio": "^5.0.0",
      "express-rate-limit": "^7.0.0"
    }
  }
  ```

### 2. Twilio Account Setup ✅

- [ ] Create Twilio account at https://www.twilio.com/try-twilio
- [ ] Get a phone number from Twilio Console
- [ ] Copy Account SID from Twilio Console
- [ ] Copy Auth Token from Twilio Console
- [ ] For production: Upgrade from trial account
- [ ] Set up spending limits in Twilio Console

### 3. Environment Configuration ✅

- [ ] Create or update `.env` file
  ```bash
  TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  TWILIO_AUTH_TOKEN=your-auth-token
  TWILIO_PHONE_NUMBER=+1234567890
  MONGODB_URI=mongodb://localhost:27017/dashdig
  NODE_ENV=development
  ```

- [ ] Verify `.env` is in `.gitignore`
- [ ] Test environment variables load correctly

### 4. Code Integration ✅

- [ ] Add routes to `app.js` or `server.js`
  ```javascript
  const smsRoutes = require('./src/routes/sms-verification.routes');
  app.use('/api/auth/sms', smsRoutes);
  ```

- [ ] Start cleanup service after MongoDB connection
  ```javascript
  const smsCleanupService = require('./src/services/sms-cleanup.service');
  mongoose.connect(process.env.MONGODB_URI).then(() => {
    smsCleanupService.start();
  });
  ```

- [ ] Verify no syntax errors
  ```bash
  node --check src/app.js
  ```

### 5. Database Setup ✅

- [ ] MongoDB is running
- [ ] Database connection string is correct
- [ ] Test MongoDB connection
  ```bash
  mongo $MONGODB_URI --eval "db.version()"
  ```

- [ ] Indexes will be created automatically on first use

### 6. Local Testing ✅

- [ ] Run test script with your phone
  ```bash
  node src/test/test-sms-verification.js +YOUR_PHONE
  ```

- [ ] Test all endpoints via cURL or Postman
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

- [ ] Test rate limiting (send multiple SMS quickly)
- [ ] Test with invalid phone numbers
- [ ] Test with wrong codes
- [ ] Test code expiration (wait 5+ minutes)
- [ ] Test max attempts (try 4+ wrong codes)
- [ ] Test resend functionality
- [ ] Verify cleanup service is running
  ```bash
  # Check logs for: "SMS cleanup service started"
  ```

### 7. Frontend Integration ✅

- [ ] Create phone verification UI component
- [ ] Test send SMS from frontend
- [ ] Test verify code from frontend
- [ ] Test resend functionality
- [ ] Handle all error states
- [ ] Add loading states
- [ ] Add countdown timer for resend
- [ ] Test on mobile devices

### 8. Security Verification ✅

- [ ] Environment variables not committed
- [ ] HTTPS enabled (production)
- [ ] Rate limiting working correctly
- [ ] CORS configured properly
- [ ] Sensitive data not logged
- [ ] Twilio credentials secure
- [ ] Database indexes created
- [ ] Input validation working

## 🚀 Production Deployment

### 1. Twilio Production Setup ✅

- [ ] Upgrade to paid Twilio account
- [ ] Purchase dedicated phone number
- [ ] Remove trial limitations
- [ ] Set up spending alerts
  - Daily limit
  - Monthly limit
  - Notification email
- [ ] Configure webhook URL for SMS status
  ```
  https://your-domain.com/api/auth/sms/webhook
  ```
- [ ] Test webhook with ngrok first
- [ ] Verify webhook receives status updates

### 2. Environment Setup ✅

- [ ] Set production environment variables
  ```bash
  NODE_ENV=production
  TWILIO_ACCOUNT_SID=<production-sid>
  TWILIO_AUTH_TOKEN=<production-token>
  TWILIO_PHONE_NUMBER=<production-number>
  MONGODB_URI=<production-mongodb>
  ```

- [ ] Use different Twilio account for production
- [ ] Use environment secrets (not plain text)
- [ ] Configure server for HTTPS
- [ ] Set proper CORS origins

### 3. Monitoring Setup ✅

- [ ] Set up application logging
  ```javascript
  // Use Winston or similar
  const winston = require('winston');
  ```

- [ ] Monitor Twilio Console for:
  - SMS delivery rates
  - Failed messages
  - Costs per day
  - Error codes

- [ ] Set up alerts for:
  - High SMS volume (potential abuse)
  - Failed delivery rate > 5%
  - Daily cost exceeds budget
  - System errors

- [ ] Create monitoring dashboard for:
  - SMS sent per hour/day
  - Verification success rate
  - Average time to verify
  - Top error codes

### 4. Performance Optimization ✅

- [ ] Database indexes verified
  ```bash
  # In MongoDB shell
  db.smsverifications.getIndexes()
  ```

- [ ] Connection pooling configured
- [ ] Response times < 500ms
- [ ] Cleanup service running smoothly
- [ ] No memory leaks (use monitoring)

### 5. Load Testing ✅

- [ ] Test with concurrent requests
  ```bash
  # Use Apache Bench or similar
  ab -n 100 -c 10 http://your-domain.com/api/auth/sms/send
  ```

- [ ] Verify rate limiting under load
- [ ] Check database performance
- [ ] Monitor memory usage
- [ ] Test SMS delivery at scale

### 6. Disaster Recovery ✅

- [ ] Database backups configured
- [ ] Backup environment variables
- [ ] Document recovery procedures
- [ ] Have fallback phone provider plan
- [ ] Create runbook for common issues

### 7. Compliance & Legal ✅

- [ ] Review SMS compliance guidelines
- [ ] Add privacy policy for SMS
- [ ] Get user consent for SMS
- [ ] Include opt-out instructions (if marketing)
- [ ] Follow local regulations (GDPR, etc.)
- [ ] Document data retention policy
- [ ] Set up data deletion process

## ✅ Post-Deployment Verification

### Day 1 ✅

- [ ] Monitor first 24 hours closely
- [ ] Check error logs every hour
- [ ] Verify SMS delivery rates
- [ ] Monitor costs in Twilio Console
- [ ] Test from different countries
- [ ] Verify webhook is receiving updates
- [ ] Check cleanup service logs

### Week 1 ✅

- [ ] Review weekly metrics
  - Total SMS sent
  - Verification success rate
  - Average cost per verification
  - Error rates by type

- [ ] Analyze user feedback
- [ ] Check for abuse patterns
- [ ] Review cost vs. budget
- [ ] Optimize if needed

### Month 1 ✅

- [ ] Full system review
- [ ] Performance analysis
- [ ] Cost optimization review
- [ ] Consider Twilio Verify API if at scale
- [ ] Update documentation if needed
- [ ] Security audit
- [ ] Backup testing

## 🐛 Troubleshooting

### Common Issues

**SMS not received:**
```bash
# Check Twilio logs
https://www.twilio.com/console/sms/logs

# Verify phone format
curl -X POST http://localhost:3000/api/auth/sms/send \
  -H "Content-Type: application/json" \
  -d '{"phone":"+1234567890"}' -v
```

**Rate limiting too strict:**
```javascript
// Adjust in routes/sms-verification.routes.js
const smsRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10 // Increase from 5
});
```

**Cleanup not running:**
```bash
# Check logs for startup message
# Manually trigger cleanup
curl -X POST http://localhost:3000/api/auth/sms/cleanup \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**High costs:**
```javascript
// Monitor in Twilio Console
// Set alerts in Settings > Usage Triggers
// Consider switching to Twilio Verify API
```

## 📊 Success Metrics

Track these KPIs after deployment:

| Metric | Target | Actual |
|--------|--------|--------|
| SMS Delivery Rate | > 95% | ___ |
| Verification Success Rate | > 85% | ___ |
| Average Time to Verify | < 2 min | ___ |
| Failed Attempts Rate | < 10% | ___ |
| Cost per Verification | < $0.01 | ___ |
| API Response Time | < 500ms | ___ |

## 📝 Deployment Sign-Off

### Development Environment
- [ ] All tests passing
- [ ] Code reviewed
- [ ] Documentation complete
- Deployed by: ________________
- Date: ________________

### Staging Environment
- [ ] Integration tests passing
- [ ] Load tests passing
- [ ] Security scan passed
- Deployed by: ________________
- Date: ________________

### Production Environment
- [ ] All pre-deployment checks complete
- [ ] Monitoring configured
- [ ] Rollback plan ready
- Deployed by: ________________
- Date: ________________

## 🆘 Emergency Contacts

```
Twilio Support: https://support.twilio.com
Twilio Status: https://status.twilio.com
Emergency Phone: (415) 814-8510

Internal:
- DevOps Lead: ________________
- Backend Lead: ________________
- Security Team: ________________
```

## 📚 Quick Reference

**Documentation:**
- [SMS_QUICK_START.md](./SMS_QUICK_START.md) - 5-minute setup
- [SMS_VERIFICATION_README.md](./SMS_VERIFICATION_README.md) - Full docs
- [SMS_INTEGRATION_GUIDE.md](./SMS_INTEGRATION_GUIDE.md) - Integration
- [ENV_EXAMPLE.md](./ENV_EXAMPLE.md) - Configuration

**Test Script:**
```bash
node src/test/test-sms-verification.js +1234567890
```

**Restart Services:**
```bash
# Restart app
pm2 restart dashdig-backend

# Restart cleanup service
# (automatically restarts with app)
```

---

## ✅ Final Checklist

Before marking as complete:

- [ ] All pre-deployment items checked
- [ ] All production deployment items checked
- [ ] Post-deployment verification scheduled
- [ ] Team trained on new system
- [ ] Documentation accessible to team
- [ ] Rollback plan documented and tested

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete

---

**Deployment Date:** ________________  
**Deployed By:** ________________  
**Version:** 1.0.0  
**Next Review:** ________________

