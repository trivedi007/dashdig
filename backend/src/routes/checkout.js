const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

// Initialize Stripe
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} else {
  console.warn('⚠️  STRIPE_SECRET_KEY not configured. Checkout endpoint will not function.');
}

/**
 * POST /api/checkout/session
 * 
 * Create a Stripe checkout session for subscription purchase
 * 
 * @body {string} priceId - Stripe price ID (e.g., price_1234567890abcdef)
 * @body {string} userId - User ID (optional, uses req.user from auth middleware)
 * 
 * @returns {object} { sessionId, sessionUrl, customerId }
 */
router.post('/session', requireAuth, async (req, res) => {
  try {
    console.log('[CHECKOUT] Creating checkout session...');
    
    // Validate Stripe is configured
    if (!stripe) {
      console.error('[CHECKOUT] ❌ Stripe not configured');
      return res.status(503).json({
        success: false,
        error: 'Payment service unavailable. Please contact support.'
      });
    }

    // Get price ID from request body
    const { priceId } = req.body;
    
    if (!priceId) {
      console.error('[CHECKOUT] ❌ Missing priceId');
      return res.status(400).json({
        success: false,
        error: 'Price ID is required'
      });
    }

    // Get user ID from authenticated request or request body
    const userId = req.user?._id || req.body.userId;
    
    if (!userId) {
      console.error('[CHECKOUT] ❌ Missing userId');
      return res.status(401).json({
        success: false,
        error: 'User authentication required'
      });
    }

    console.log('[CHECKOUT] User ID:', userId);
    console.log('[CHECKOUT] Price ID:', priceId);

    // 1. Look up user in MongoDB
    const user = await User.findById(userId);
    
    if (!user) {
      console.error('[CHECKOUT] ❌ User not found:', userId);
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    console.log('[CHECKOUT] Found user:', user.email || user.phone || user.identifier);

    // 2. Create or retrieve Stripe customer
    let customerId = user.subscription?.stripeCustomerId;

    if (!customerId) {
      console.log('[CHECKOUT] Creating new Stripe customer...');
      
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user._id.toString(),
          identifier: user.identifier
        }
      });

      customerId = customer.id;
      console.log('[CHECKOUT] ✅ Created Stripe customer:', customerId);

      // Update user record with new customer ID
      if (!user.subscription) {
        user.subscription = {};
      }
      user.subscription.stripeCustomerId = customerId;
      await user.save();
      
      console.log('[CHECKOUT] ✅ Updated user with Stripe customer ID');
    } else {
      console.log('[CHECKOUT] Using existing Stripe customer:', customerId);
    }

    // 3. Create Stripe checkout session
    const baseUrl = process.env.FRONTEND_URL || 'https://dashdig.com';
    
    const sessionParams = {
      mode: 'subscription',
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      metadata: {
        userId: user._id.toString(),
        userEmail: user.email || '',
        userIdentifier: user.identifier
      },
      // Allow promotion codes
      allow_promotion_codes: true,
      // Collect billing address
      billing_address_collection: 'auto',
      // Configure subscription behavior
      subscription_data: {
        metadata: {
          userId: user._id.toString()
        }
      }
    };

    console.log('[CHECKOUT] Creating session with params:', {
      mode: sessionParams.mode,
      customer: customerId,
      priceId,
      successUrl: sessionParams.success_url,
      cancelUrl: sessionParams.cancel_url
    });

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log('[CHECKOUT] ✅ Checkout session created:', session.id);
    console.log('[CHECKOUT] Session URL:', session.url);

    // 4. Return session details
    return res.json({
      success: true,
      data: {
        sessionId: session.id,
        sessionUrl: session.url,
        customerId: customerId
      }
    });

  } catch (error) {
    console.error('[CHECKOUT] ❌ Error creating checkout session:', error);
    console.error('[CHECKOUT] Error details:', error.message);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({
        success: false,
        error: `Invalid request: ${error.message}`
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to create checkout session. Please try again.'
    });
  }
});

/**
 * GET /api/checkout/success
 * 
 * Handle successful checkout (optional - called from frontend after redirect)
 * 
 * @query {string} session_id - Stripe checkout session ID
 */
router.get('/success', requireAuth, async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required'
      });
    }

    if (!stripe) {
      return res.status(503).json({
        success: false,
        error: 'Payment service unavailable'
      });
    }

    console.log('[CHECKOUT SUCCESS] Retrieving session:', session_id);

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(session_id);

    console.log('[CHECKOUT SUCCESS] Session status:', session.payment_status);
    console.log('[CHECKOUT SUCCESS] Subscription:', session.subscription);

    return res.json({
      success: true,
      data: {
        sessionId: session.id,
        paymentStatus: session.payment_status,
        customerEmail: session.customer_email,
        subscriptionId: session.subscription
      }
    });

  } catch (error) {
    console.error('[CHECKOUT SUCCESS] ❌ Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve checkout session'
    });
  }
});

/**
 * GET /api/checkout/config
 * 
 * Get Stripe configuration (publishable key, price IDs)
 */
router.get('/config', (req, res) => {
  try {
    const config = {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      prices: {
        starter: process.env.STRIPE_PRICE_STARTER,
        pro: process.env.STRIPE_PRICE_PRO,
        business: process.env.STRIPE_PRICE_BUSINESS,
        enterprise: process.env.STRIPE_PRICE_ENTERPRISE
      }
    };

    return res.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('[CHECKOUT CONFIG] ❌ Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve configuration'
    });
  }
});

module.exports = router;
