# 🚀 Next Steps - Subscription Implementation

## ✅ Completed

1. ✅ Created Stripe webhook endpoint (`/api/webhooks/stripe`)
2. ✅ Updated User model with subscription fields
3. ✅ Added plan limits system
4. ✅ Created Stripe checkout endpoint (`/api/checkout/session`)
5. ✅ Created comprehensive tests
6. ✅ Written complete documentation

## 📝 What You Need to Do

### 1. Add Environment Variables

Add these to your `.env` file:

```bash
# Stripe Webhook (REQUIRED)
STRIPE_WEBHOOK_SECRET=whsec_your_signing_secret_here

# Business Tier Price ID (optional, for future use)
STRIPE_PRICE_BUSINESS=price_1234567890abcdef
```

### 2. Create Webhook in Stripe Dashboard

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click **"Add endpoint"**
3. Enter URL: `https://your-domain.com/api/webhooks/stripe`
4. Select these events:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
5. Click "Add endpoint"
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add it to your `.env` as `STRIPE_WEBHOOK_SECRET`

### 3. Test Locally

```bash
# Install Stripe CLI (if not already installed)
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Start your backend server
cd backend
npm run dev

# In another terminal, forward webhooks
stripe listen --forward-to localhost:5000/api/webhooks/stripe

# In a third terminal, trigger test events
stripe trigger checkout.session.completed
stripe trigger invoice.payment_succeeded

# Or run the automated test
node tests/test-stripe-webhook.js
node tests/test-user-subscription.js
```

### 4. Deploy to Production

#### Update Railway Environment Variables:

1. Go to Railway dashboard
2. Add environment variables:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_production_secret_here
   STRIPE_PRICE_BUSINESS=price_production_id_here
   ```

#### Update Stripe Production Webhook:

1. Switch to **Live mode** in Stripe dashboard
2. Create new webhook endpoint with production URL
3. Select the same 5 events
4. Copy production webhook secret to Railway

### 5. Test Production

1. Create a real test subscription
2. Check webhook logs in Stripe dashboard
3. Verify user subscription updates in MongoDB
4. Monitor backend logs for any errors

## 🧪 Testing Checklist

Before marking complete:

- [ ] Environment variable `STRIPE_WEBHOOK_SECRET` is set
- [ ] Environment variable `FRONTEND_URL` is set
- [ ] All `STRIPE_PRICE_*` environment variables are set
- [ ] Webhook endpoint created in Stripe dashboard
- [ ] Test locally with Stripe CLI - webhooks work
- [ ] Run `node tests/test-stripe-webhook.js` - passes
- [ ] Run `node tests/test-user-subscription.js` - passes
- [ ] Run `node tests/test-checkout.js` - passes
- [ ] Test checkout session creation with JWT token
- [ ] Complete test checkout with test card (4242...)
- [ ] Check MongoDB - user has correct subscription fields
- [ ] Verify webhook triggers after checkout
- [ ] Deploy to production
- [ ] Update production webhook URL in Stripe
- [ ] Test real subscription flow end-to-end
- [ ] Verify webhook logs in Stripe show success

## 📚 Documentation Reference

| Document | Purpose |
|----------|---------|
| `STRIPE_WEBHOOK_IMPLEMENTATION.md` | Webhook implementation summary |
| `backend/docs/STRIPE_WEBHOOK_SETUP.md` | Detailed webhook setup guide |
| `docs/stripe-webhook-integration.md` | Quick webhook reference |
| `USER_SUBSCRIPTION_UPDATE_SUMMARY.md` | User model update summary |
| `docs/user-model-subscription-update.md` | Detailed user model guide |
| `NEXT_STEPS.md` | This file - action checklist |

## 🆘 Troubleshooting

### Webhook Issues

**Problem:** "Signature verification failed"
- Check `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- Ensure webhook route is before `express.json()` in `app.js`

**Problem:** "User not found"
- Verify `stripeCustomerId` is saved during user creation
- Check MongoDB for existing customer records

**Problem:** Webhook returns 500
- Check backend logs for detailed errors
- Ensure MongoDB connection is active

### Testing Issues

**Problem:** Can't connect to localhost
- Ensure backend server is running
- Check port is correct (default: 5000)

**Problem:** Stripe CLI not forwarding
- Run `stripe login` first
- Check firewall settings

## 🎯 Optional Enhancements

Once basic functionality is working, consider:

1. **Email Notifications**
   - Send email when payment fails
   - Send reminder before trial ends
   - Send receipt for successful payments

2. **Usage Analytics**
   - Dashboard showing current usage vs limits
   - Progress bars for monthly quotas
   - Alerts when approaching limits

3. **Plan Management**
   - Allow users to upgrade/downgrade plans
   - Display plan comparison table
   - Show billing history

4. **Webhook Logging**
   - Store webhook events in database
   - Create admin dashboard for webhook monitoring
   - Add retry logic for failed webhooks

## 📞 Support

If you run into issues:

1. Check the documentation files listed above
2. Review backend logs for `[STRIPE WEBHOOK]` messages
3. Check Stripe dashboard webhook delivery logs
4. Test with Stripe CLI locally first
5. Verify MongoDB user documents have correct structure

## ✅ Success Criteria

You'll know it's working when:

1. ✅ Stripe webhook endpoint returns 200 status
2. ✅ User subscription updates in MongoDB after Stripe events
3. ✅ Backend logs show successful webhook processing
4. ✅ Stripe dashboard shows successful webhook deliveries
5. ✅ Users can upgrade/downgrade plans
6. ✅ Plan limits are enforced correctly
7. ✅ Tests pass locally and in production

---

**Current Status:** Implementation Complete - Ready for Setup

**Your Action Required:** Complete steps 1-5 above

**Estimated Time:** 30-60 minutes for initial setup and testing
