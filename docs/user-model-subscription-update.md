# User Model Subscription Update - Complete

## ✅ Summary

The User model has been updated with enhanced subscription fields and plan limits to support tiered subscription plans with granular control over features.

## 🔧 Changes Made

### 1. Updated User Model Schema

**File:** `backend/src/models/User.js`

#### Added Fields:

1. **`cancelAtPeriodEnd`** (Boolean)
   - Indicates if subscription will cancel at end of current period
   - Default: `false`

2. **`planLimits`** (Object) - NEW
   - **`urlsPerMonth`** (Number): Monthly URL creation limit
     - Default: `25` (Free tier)
     - Use `-1` for unlimited
   
   - **`clicksTracked`** (Number): Click tracking limit
     - Default: `1000` (Free tier)
     - Use `-1` for unlimited
   
   - **`analyticsRetention`** (Number): Analytics data retention in days
     - Default: `7` (Free tier)
   
   - **`aiModel`** (String): AI model tier
     - Enum: `['haiku', 'sonnet', 'opus']`
     - Default: `'haiku'` (Free tier)

#### Updated Fields:

- **`plan`**: Added `'business'` tier to enum
  - Now: `['trial', 'free', 'starter', 'pro', 'business', 'enterprise']`
  - Default changed: `'trial'` → `'free'`

- **`status`**: Default changed
  - From: `'trialing'`
  - To: `'active'`

### 2. Enhanced User Methods

#### New Method: `getPlanLimits()`

Returns plan limits with proper defaults based on subscription tier:

```javascript
user.getPlanLimits()
// Returns: { urlsPerMonth, clicksTracked, analyticsRetention, aiModel }
```

**Default Limits by Plan:**

| Plan | URLs/Month | Clicks Tracked | Analytics Retention | AI Model |
|------|------------|----------------|---------------------|----------|
| Trial | 10 | 500 | 7 days | haiku |
| Free | 25 | 1,000 | 7 days | haiku |
| Starter | 250 | 10,000 | 30 days | haiku |
| Pro | Unlimited* | Unlimited* | 90 days | sonnet |
| Business | Unlimited* | Unlimited* | 180 days | sonnet |
| Enterprise | Unlimited* | Unlimited* | 365 days | opus |

*Unlimited = `-1`

#### Updated Method: `canCreateUrl()`

Now uses `planLimits.urlsPerMonth` instead of hardcoded values:

```javascript
user.canCreateUrl()
// Checks against user.subscription.planLimits.urlsPerMonth
```

Features:
- ✅ Uses custom plan limits if set
- ✅ Falls back to plan-based defaults
- ✅ Handles unlimited plans (`-1`)
- ✅ Backwards compatible

#### Updated Method: `getApiRateLimit()`

Added support for new `business` tier:

```javascript
user.getApiRateLimit()
// Returns: { limit: 2500, window: 3600 } for business tier
```

**Rate Limits:**
- Trial: 50 req/hr
- Free: 100 req/hr
- Starter: 500 req/hr
- Pro: 1,000 req/hr
- **Business: 2,500 req/hr** ← NEW
- Enterprise: 5,000 req/hr

### 3. Updated Stripe Webhook Handler

**File:** `backend/src/routes/stripe-webhook.js`

#### Added Function: `getPlanLimits(plan)`

Returns appropriate plan limits for each subscription tier.

#### Updated Event Handlers:

**`handleCheckoutSessionCompleted`:**
- ✅ Sets `cancelAtPeriodEnd` from Stripe
- ✅ Automatically sets `planLimits` based on plan

**`handleSubscriptionUpdated`:**
- ✅ Updates `cancelAtPeriodEnd` 
- ✅ Updates `planLimits` when plan changes

**`handleSubscriptionDeleted`:**
- ✅ Resets to free tier limits
- ✅ Sets `cancelAtPeriodEnd` to `false`

**`mapPriceIdToPlan`:**
- ✅ Added `STRIPE_PRICE_BUSINESS` mapping

## 📊 Subscription Schema Structure

```javascript
{
  subscription: {
    // Stripe Integration
    stripeCustomerId: "cus_...",
    stripeSubscriptionId: "sub_...",
    paymentMethodId: "pm_...",
    
    // Plan Details
    plan: "free",                    // enum: trial, free, starter, pro, business, enterprise
    status: "active",                // enum: active, canceled, past_due, trialing
    
    // Dates
    trialEndsAt: Date,
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: false,        // NEW
    
    // Feature Limits - NEW
    planLimits: {
      urlsPerMonth: 25,              // -1 for unlimited
      clicksTracked: 1000,           // -1 for unlimited
      analyticsRetention: 7,         // days
      aiModel: "haiku"               // haiku, sonnet, or opus
    }
  }
}
```

## 🚀 Usage Examples

### Check URL Creation Limit

```javascript
const user = await User.findById(userId);

if (user.canCreateUrl()) {
  // User can create more URLs
} else {
  const limits = user.getPlanLimits();
  console.log(`Monthly limit reached: ${limits.urlsPerMonth} URLs`);
}
```

### Get Plan Features

```javascript
const user = await User.findById(userId);
const limits = user.getPlanLimits();

console.log(`Plan: ${user.subscription.plan}`);
console.log(`URLs per month: ${limits.urlsPerMonth === -1 ? 'Unlimited' : limits.urlsPerMonth}`);
console.log(`Analytics retention: ${limits.analyticsRetention} days`);
console.log(`AI Model: ${limits.aiModel}`);
```

### Check Analytics Retention

```javascript
const user = await User.findById(userId);
const limits = user.getPlanLimits();
const retentionDays = limits.analyticsRetention;

// Delete analytics older than retention period
const cutoffDate = new Date();
cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
```

### Select AI Model Based on Plan

```javascript
const user = await User.findById(userId);
const limits = user.getPlanLimits();

let aiModel;
switch (limits.aiModel) {
  case 'opus':
    aiModel = 'claude-3-opus-20240229';
    break;
  case 'sonnet':
    aiModel = 'claude-3-sonnet-20240229';
    break;
  case 'haiku':
  default:
    aiModel = 'claude-3-haiku-20240307';
}
```

## 🔄 Migration Notes

### Existing Users

Users with existing subscriptions will:
- ✅ Keep their current plan and status
- ✅ Get default `planLimits` based on their plan (via `getPlanLimits()`)
- ✅ Have `cancelAtPeriodEnd` set to `false` by default

No database migration required! The new fields have defaults and the `getPlanLimits()` method provides backwards compatibility.

### Testing New Users

```javascript
// Create new user with free plan
const user = new User({
  email: 'test@example.com',
  identifier: 'test@example.com'
});
// subscription.plan defaults to 'free'
// subscription.status defaults to 'active'
// subscription.planLimits defaults to free tier limits

await user.save();
```

## 📝 Environment Variables

Add to your `.env` file:

```bash
# Existing
STRIPE_PRICE_STARTER=price_1234567890abcdef
STRIPE_PRICE_PRO=price_1234567890abcdef
STRIPE_PRICE_ENTERPRISE=price_1234567890abcdef

# NEW - Business tier
STRIPE_PRICE_BUSINESS=price_1234567890abcdef
```

## 🧪 Testing Checklist

- [ ] Create new user → Verify free tier limits are set
- [ ] Upgrade user to Pro → Verify unlimited URLs (-1)
- [ ] Check `user.canCreateUrl()` → Works with planLimits
- [ ] Get `user.getPlanLimits()` → Returns correct limits
- [ ] Trigger webhook → planLimits are set automatically
- [ ] Cancel subscription → Downgrades to free tier limits
- [ ] Check API rate limits → Business tier gets 2500 req/hr

## 🎯 Plan Comparison Matrix

| Feature | Free | Starter | Pro | Business | Enterprise |
|---------|------|---------|-----|----------|------------|
| **URLs/Month** | 25 | 250 | ∞ | ∞ | ∞ |
| **Clicks Tracked** | 1K | 10K | ∞ | ∞ | ∞ |
| **Analytics** | 7 days | 30 days | 90 days | 180 days | 365 days |
| **AI Model** | Haiku | Haiku | Sonnet | Sonnet | Opus |
| **API Calls** | 100/hr | 500/hr | 1K/hr | 2.5K/hr | 5K/hr |
| **Support** | Community | Email | Priority | Dedicated | White Glove |

## 📚 Related Files

- `backend/src/models/User.js` - User model with subscription schema
- `backend/src/routes/stripe-webhook.js` - Webhook handler with plan limits
- `backend/src/services/payment.service.js` - Payment service (if needed)

## ✅ Changes Summary

**Modified Files:** 2
- ✅ `backend/src/models/User.js`
- ✅ `backend/src/routes/stripe-webhook.js`

**New Fields:** 2
- ✅ `subscription.cancelAtPeriodEnd`
- ✅ `subscription.planLimits` (with 4 sub-fields)

**New Methods:** 1
- ✅ `getPlanLimits()`

**Updated Methods:** 3
- ✅ `canCreateUrl()`
- ✅ `getApiRateLimit()`
- ✅ Webhook event handlers

**New Plan Tier:** 1
- ✅ `business` plan added

---

**Status:** ✅ Complete - Ready to Use

**Updated:** January 11, 2026
