# Stripe Webhook Setup Guide

## Overview

The Stripe webhook endpoint handles subscription lifecycle events automatically, updating user subscription status in MongoDB when payments succeed, fail, or subscriptions change.

**Endpoint:** `POST /api/webhooks/stripe`

## 🔧 Environment Variables Required

Add these to your `.env` file and Railway/production environment:

```bash
# Already configured (don't change these)
STRIPE_SECRET_KEY=sk_test_... (or sk_live_... for production)
STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_... for production)

# NEW - Need to create in Stripe Dashboard
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional - Map Stripe price IDs to plans
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_ENTERPRISE=price_...
```

## 📋 Setup Steps

### 1. Create Webhook Endpoint in Stripe Dashboard

1. Go to [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/test/webhooks)

2. Click **"Add endpoint"**

3. Enter your endpoint URL:
   ```
   Production: https://your-domain.com/api/webhooks/stripe
   Development: Use Stripe CLI (see below)
   ```

4. Select events to listen to:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`

5. Click **"Add endpoint"**

6. Copy the **Signing secret** (starts with `whsec_`)

7. Add it to your environment:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
   ```

### 2. Testing Locally with Stripe CLI

For local development, use the Stripe CLI to forward webhook events:

#### Install Stripe CLI

**macOS:**
```bash
brew install stripe/stripe-cli/stripe
```

**Windows:**
```bash
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

**Linux:**
```bash
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.0/stripe_1.19.0_linux_x86_64.tar.gz
tar -xvf stripe_1.19.0_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin
```

#### Login and Forward Webhooks

```bash
# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:5000/api/webhooks/stripe
```

The CLI will output a webhook signing secret like:
```
> Ready! Your webhook signing secret is whsec_1234567890abcdef...
```

Add this to your `.env`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef...
```

#### Trigger Test Events

```bash
# Test a successful payment
stripe trigger checkout.session.completed

# Test a subscription update
stripe trigger customer.subscription.updated

# Test a failed payment
stripe trigger invoice.payment_failed
```

### 3. Verify Webhook is Working

Check your backend logs for:

```
✅ Stripe webhook routes loaded
[STRIPE WEBHOOK] ✅ Signature verified
[STRIPE WEBHOOK] Event type: invoice.payment_succeeded
[STRIPE WEBHOOK] ✅ Payment succeeded, subscription active until: ...
```

## 📊 Monitored Events

### `checkout.session.completed`
**Triggered:** Customer completes checkout for a new subscription

**Actions:**
- Links subscription to user account
- Updates subscription plan and status
- Sets trial end date (if applicable)

### `customer.subscription.updated`
**Triggered:** Subscription changes (plan upgrade/downgrade, status change)

**Actions:**
- Updates subscription plan
- Updates subscription status
- Updates current period end date

### `customer.subscription.deleted`
**Triggered:** Subscription is cancelled

**Actions:**
- Downgrades user to free plan
- Sets status to "canceled"
- Preserves Stripe customer ID for re-subscription

### `invoice.payment_succeeded`
**Triggered:** Successful payment (including renewals)

**Actions:**
- Sets subscription status to "active"
- Updates current period end date
- Logs successful payment amount

### `invoice.payment_failed`
**Triggered:** Payment fails (expired card, insufficient funds, etc.)

**Actions:**
- Sets subscription status to "past_due"
- Logs failed payment for follow-up
- *TODO: Send email notification to user*

## 🔍 Debugging

### Check Webhook Logs in Stripe

1. Go to [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click on your webhook endpoint
3. View event history with response codes

### Common Issues

#### ❌ "Webhook signature verification failed"

**Cause:** Wrong `STRIPE_WEBHOOK_SECRET` or middleware ordering issue

**Fix:**
1. Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
2. Ensure webhook route is registered BEFORE `express.json()` in `app.js`
3. Check that raw body is being passed (don't use body parsers before webhook)

#### ❌ "User not found for customer"

**Cause:** Stripe customer ID not linked to user account

**Fix:**
1. Ensure user creation process saves `stripeCustomerId`
2. Check that checkout session includes customer metadata
3. Verify customer exists in MongoDB:
   ```javascript
   db.users.findOne({ "subscription.stripeCustomerId": "cus_..." })
   ```

#### ❌ Status code 500 in Stripe dashboard

**Cause:** Server error processing webhook

**Fix:**
1. Check backend logs for error details
2. Verify MongoDB connection is active
3. Check User model schema matches webhook expectations

### Enable Debug Logging

Add to your `.env`:
```bash
DEBUG=stripe:*
```

Or add detailed logging in webhook handler:
```javascript
console.log('[DEBUG] Full event object:', JSON.stringify(event, null, 2));
```

## 🚀 Production Deployment

### Railway Deployment

1. Add environment variable in Railway dashboard:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_production_secret
   ```

2. Update Stripe webhook endpoint to production URL:
   ```
   https://your-railway-domain.up.railway.app/api/webhooks/stripe
   ```

3. Test with Stripe CLI in production mode:
   ```bash
   stripe listen --forward-to https://your-railway-domain.up.railway.app/api/webhooks/stripe --live
   ```

### Verify Production Webhook

1. Create a test subscription in production mode
2. Check Stripe dashboard for successful webhook deliveries
3. Verify user subscription updates in MongoDB
4. Monitor backend logs for any errors

## 🔐 Security Best Practices

1. **Never skip signature verification** - Always verify `stripe-signature` header
2. **Use webhook secrets** - Different secrets for test/production
3. **Return 200 quickly** - Acknowledge receipt, then process async if needed
4. **Idempotency** - Handle duplicate events gracefully (Stripe may retry)
5. **Validate metadata** - Check that customer/subscription IDs are valid
6. **Log everything** - Keep audit trail of all webhook events

## 📝 Example Webhook Event Flow

```
User upgrades from Starter to Pro plan:

1. User clicks "Upgrade" in frontend
2. Frontend creates Stripe checkout session
3. User completes payment on Stripe
4. Stripe sends webhook: checkout.session.completed
   ↓
5. Backend receives webhook
6. Verifies signature ✓
7. Finds user by stripeCustomerId
8. Updates user.subscription.plan = "pro"
9. Updates user.subscription.status = "active"
10. Saves user to MongoDB ✓
11. Returns 200 to Stripe ✓

Result: User instantly has Pro features!
```

## 🆘 Support

If webhooks are not working:

1. Check [Stripe Webhook Logs](https://dashboard.stripe.com/test/webhooks)
2. Review backend logs for errors
3. Test with Stripe CLI locally
4. Verify environment variables are set correctly
5. Check MongoDB user documents for correct subscription data

## 📚 Additional Resources

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Testing Webhooks Guide](https://stripe.com/docs/webhooks/test)
- [Webhook Best Practices](https://stripe.com/docs/webhooks/best-practices)
