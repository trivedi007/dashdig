# Stripe Checkout Endpoint

## Overview

The checkout endpoint creates Stripe checkout sessions for users to purchase subscriptions. It handles customer creation, session management, and redirects.

**Endpoint:** `POST /api/checkout/session`

## Authentication

**Required:** Yes - Uses JWT token authentication via `requireAuth` middleware

Pass JWT token in request header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Create Checkout Session

**POST** `/api/checkout/session`

Creates a Stripe checkout session for subscription purchase.

#### Request Body

```json
{
  "priceId": "price_1234567890abcdef"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `priceId` | string | Yes | Stripe price ID for the subscription plan |
| `userId` | string | No | User ID (optional, uses authenticated user) |

#### Response

**Success (200):**
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_test_1234567890abcdef",
    "sessionUrl": "https://checkout.stripe.com/c/pay/cs_test_...",
    "customerId": "cus_1234567890abcdef"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "error": "Price ID is required"
}
```

**Error (401):**
```json
{
  "success": false,
  "error": "User authentication required"
}
```

**Error (404):**
```json
{
  "success": false,
  "error": "User not found"
}
```

**Error (503):**
```json
{
  "success": false,
  "error": "Payment service unavailable. Please contact support."
}
```

#### Process Flow

1. **Authentication Check**
   - Validates JWT token
   - Gets user ID from `req.user` or request body

2. **User Lookup**
   - Finds user in MongoDB by ID
   - Returns 404 if user not found

3. **Stripe Customer Management**
   - Checks if user has existing `stripeCustomerId`
   - If not, creates new Stripe customer
   - Updates user record with new customer ID

4. **Checkout Session Creation**
   - Creates Stripe checkout session with:
     - Mode: `subscription`
     - Customer: User's Stripe customer ID
     - Line items: Specified price ID
     - Success URL: `https://dashdig.com/dashboard?session_id={CHECKOUT_SESSION_ID}`
     - Cancel URL: `https://dashdig.com/pricing`
     - Metadata: User ID and identifier
   - Enables promotion codes
   - Collects billing address automatically

5. **Return Session**
   - Returns session ID and URL to frontend
   - Frontend redirects user to Stripe checkout

### 2. Checkout Success

**GET** `/api/checkout/success?session_id={CHECKOUT_SESSION_ID}`

Retrieves checkout session details after successful payment.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `session_id` | string | Yes | Stripe checkout session ID from redirect |

#### Response

**Success (200):**
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_test_1234567890abcdef",
    "paymentStatus": "paid",
    "customerEmail": "user@example.com",
    "subscriptionId": "sub_1234567890abcdef"
  }
}
```

### 3. Get Configuration

**GET** `/api/checkout/config`

Returns Stripe configuration including publishable key and price IDs.

#### Response

```json
{
  "success": true,
  "data": {
    "publishableKey": "pk_test_1234567890abcdef",
    "prices": {
      "starter": "price_starter_123",
      "pro": "price_pro_123",
      "business": "price_business_123",
      "enterprise": "price_enterprise_123"
    }
  }
}
```

## Frontend Integration

### React Example

```javascript
import axios from 'axios';

async function handleSubscribe(priceId) {
  try {
    // Get JWT token from your auth system
    const token = localStorage.getItem('token');
    
    // Create checkout session
    const response = await axios.post(
      'https://api.dashdig.com/api/checkout/session',
      { priceId },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const { sessionUrl } = response.data.data;
    
    // Redirect to Stripe checkout
    window.location.href = sessionUrl;
    
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Failed to start checkout. Please try again.');
  }
}

// Usage
<button onClick={() => handleSubscribe('price_pro_123')}>
  Subscribe to Pro Plan
</button>
```

### Vanilla JavaScript Example

```javascript
async function createCheckoutSession(priceId) {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch('https://api.dashdig.com/api/checkout/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ priceId })
  });

  const data = await response.json();
  
  if (data.success) {
    // Redirect to Stripe checkout
    window.location.href = data.data.sessionUrl;
  } else {
    throw new Error(data.error);
  }
}
```

### Handle Success Redirect

After successful payment, Stripe redirects to:
```
https://dashdig.com/dashboard?session_id=cs_test_...
```

Your frontend should:

```javascript
// On dashboard page
const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('session_id');

if (sessionId) {
  // Optional: Verify session with backend
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(
    `https://api.dashdig.com/api/checkout/success?session_id=${sessionId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  const data = await response.json();
  
  if (data.success) {
    // Show success message
    alert('Subscription activated successfully!');
    
    // Refresh user data
    await fetchUserProfile();
  }
}
```

## Environment Variables

Required environment variables:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Price IDs (from Stripe dashboard)
STRIPE_PRICE_STARTER=price_1234567890abcdef
STRIPE_PRICE_PRO=price_1234567890abcdef
STRIPE_PRICE_BUSINESS=price_1234567890abcdef
STRIPE_PRICE_ENTERPRISE=price_1234567890abcdef

# Frontend URL (for redirects)
FRONTEND_URL=https://dashdig.com
```

## Security Features

✅ **JWT Authentication** - All endpoints require valid JWT token  
✅ **User Validation** - Verifies user exists in database  
✅ **Customer Isolation** - Each user has unique Stripe customer ID  
✅ **Metadata Tracking** - User ID stored in Stripe metadata  
✅ **Error Handling** - Graceful error messages  
✅ **CSRF Exemption** - Uses token auth instead of CSRF  

## Checkout Session Configuration

The checkout session is configured with:

| Setting | Value | Description |
|---------|-------|-------------|
| Mode | `subscription` | Creates recurring subscription |
| Success URL | `{FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}` | Redirect after success |
| Cancel URL | `{FRONTEND_URL}/pricing` | Redirect if cancelled |
| Allow Promotion Codes | `true` | Users can enter coupon codes |
| Billing Address Collection | `auto` | Collects address if needed |

## Testing

### Test with cURL

```bash
# Create checkout session
curl -X POST https://api.dashdig.com/api/checkout/session \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "priceId": "price_1234567890abcdef"
  }'

# Get configuration
curl https://api.dashdig.com/api/checkout/config

# Check session after redirect
curl "https://api.dashdig.com/api/checkout/success?session_id=cs_test_..." \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test with Stripe Test Cards

Use these test card numbers in Stripe checkout:

| Card | Result |
|------|--------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 9995` | Card declined |
| `4000 0025 0000 3155` | Requires authentication |

Any future expiry date and any 3-digit CVC will work.

## Common Issues

### "Payment service unavailable"

**Cause:** `STRIPE_SECRET_KEY` not set in environment

**Fix:** Add to your `.env` file:
```bash
STRIPE_SECRET_KEY=sk_test_your_key_here
```

### "User authentication required"

**Cause:** Missing or invalid JWT token

**Fix:** Ensure JWT token is passed in Authorization header:
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

### "User not found"

**Cause:** User ID doesn't exist in MongoDB

**Fix:** Verify user is properly created and authenticated

### "Invalid request: No such price"

**Cause:** Price ID doesn't exist in Stripe

**Fix:** 
1. Check price ID in Stripe dashboard
2. Verify environment variables are set correctly

## Flow Diagram

```
Frontend                    Backend                     Stripe
   |                          |                           |
   |-- POST /checkout/session -->                         |
   |     (priceId)            |                           |
   |                          |-- Find User in MongoDB    |
   |                          |                           |
   |                          |-- Create/Get Customer --->|
   |                          |                           |
   |                          |<-- Customer ID -----------|
   |                          |                           |
   |                          |-- Create Session -------->|
   |                          |                           |
   |                          |<-- Session URL -----------|
   |<-- Session URL ----------|                           |
   |                          |                           |
   |-- Redirect to Stripe ----------------------->        |
   |                          |                    Checkout Page
   |                          |                           |
   |<-- Success Redirect ---------------------------      |
   | (with session_id)        |                           |
   |                          |                           |
   |-- GET /checkout/success -->                          |
   |     (session_id)         |                           |
   |                          |-- Retrieve Session ------>|
   |                          |                           |
   |                          |<-- Session Details -------|
   |<-- Payment Status -------|                           |
   |                          |                           |
   | (Webhook triggers        |                           |
   |  subscription update)    |<-- webhook: checkout.session.completed
   |                          |                           |
   |                          |-- Update User in MongoDB  |
   |                          |   (subscription status)   |
```

## Related Documentation

- [Stripe Webhook Setup](./STRIPE_WEBHOOK_SETUP.md)
- [User Model Subscription Fields](./user-model-subscription-update.md)
- [Stripe API Documentation](https://stripe.com/docs/api/checkout/sessions/create)

## Support

For issues or questions:
1. Check backend logs for `[CHECKOUT]` messages
2. Verify environment variables are set
3. Test with Stripe test cards
4. Check Stripe dashboard for customer and session creation
