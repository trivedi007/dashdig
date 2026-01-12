# Stripe Webhook Integration

## Quick Start

A comprehensive Stripe webhook endpoint has been created at `/api/webhooks/stripe` to handle subscription lifecycle events.

## File Created

📄 **`backend/src/routes/stripe-webhook.js`** - Main webhook handler

## What It Does

Automatically updates user subscription status in MongoDB when these events occur:

| Event | Description | Actions |
|-------|-------------|---------|
| `checkout.session.completed` | New subscription created | Links subscription to user, updates plan & status |
| `customer.subscription.updated` | Plan or status changed | Updates subscription details |
| `customer.subscription.deleted` | Subscription cancelled | Downgrades to free plan |
| `invoice.payment_succeeded` | Payment successful | Activates subscription, extends period |
| `invoice.payment_failed` | Payment failed | Marks as past_due, logs for follow-up |

## Setup Required

### 1. Create Webhook in Stripe Dashboard

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. Enter URL: `https://your-domain.com/api/webhooks/stripe`
4. Select the 5 events listed above
5. Copy the **signing secret** (starts with `whsec_`)

### 2. Add Environment Variable

Add to your `.env` file:

```bash
STRIPE_WEBHOOK_SECRET=whsec_your_signing_secret_here
```

Also add these for Railway/production:
```bash
STRIPE_PRICE_STARTER=price_1234... # Your Starter plan price ID
STRIPE_PRICE_PRO=price_1234...     # Your Pro plan price ID  
STRIPE_PRICE_ENTERPRISE=price_1234... # Your Enterprise plan price ID
```

### 3. Test Locally with Stripe CLI

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:5000/api/webhooks/stripe

# In another terminal, trigger test events
stripe trigger checkout.session.completed
stripe trigger invoice.payment_succeeded
stripe trigger invoice.payment_failed
```

## Integration Details

### Middleware Configuration

The webhook uses `express.raw()` middleware instead of `express.json()` because Stripe requires the raw request body for signature verification.

✅ **Correctly configured in `app.js`:**
- Webhook route registered BEFORE `express.json()`
- CSRF protection skipped for webhook endpoint
- Raw body preserved for signature verification

### Database Updates

When webhook events are received, the User model is updated:

```javascript
user.subscription = {
  plan: 'starter' | 'pro' | 'enterprise' | 'free',
  status: 'active' | 'trialing' | 'past_due' | 'canceled',
  stripeCustomerId: 'cus_...',
  stripeSubscriptionId: 'sub_...',
  currentPeriodEnd: Date,
  trialEndsAt: Date
}
```

### Security

- ✅ Signature verification using `STRIPE_WEBHOOK_SECRET`
- ✅ Raw body parsing for crypto validation
- ✅ Error handling prevents crashes
- ✅ Comprehensive logging for debugging
- ✅ Returns 200 even on errors (prevents Stripe retries)

## Testing Checklist

- [ ] Environment variable `STRIPE_WEBHOOK_SECRET` is set
- [ ] Webhook endpoint returns 200 status
- [ ] Signature verification passes
- [ ] User subscription updates in MongoDB
- [ ] Logs show successful event processing
- [ ] Stripe dashboard shows successful deliveries

## Monitoring

Check webhook deliveries in Stripe Dashboard:
1. Go to Developers > Webhooks
2. Click on your endpoint
3. View recent events and responses

Expected successful response:
```json
{
  "success": true,
  "received": true,
  "eventType": "invoice.payment_succeeded"
}
```

## Common Issues

### "Signature verification failed"
- Check `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- Verify webhook route is before `express.json()` in app.js

### "User not found"
- Ensure Stripe customer is linked to user account
- Check `stripeCustomerId` is saved during checkout

### "Stripe not configured"
- Verify `STRIPE_SECRET_KEY` environment variable is set

## Production Deployment

For Railway deployment:

1. Add environment variables in Railway dashboard
2. Update Stripe webhook URL to production domain
3. Use production webhook secret (not test secret)
4. Test with real Stripe checkout flow

## Documentation

Full setup guide: `/backend/docs/STRIPE_WEBHOOK_SETUP.md`

## Next Steps

1. ✅ Webhook endpoint created
2. ✅ Registered in app.js
3. ⏳ Set `STRIPE_WEBHOOK_SECRET` in environment
4. ⏳ Create webhook in Stripe dashboard
5. ⏳ Test with Stripe CLI
6. ⏳ Deploy to production
7. 🔮 TODO: Add email notifications for failed payments
8. 🔮 TODO: Add webhook event audit log table

## Support

Questions? Check:
- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- Backend logs: Look for `[STRIPE WEBHOOK]` messages
- Stripe dashboard: Webhook delivery logs
