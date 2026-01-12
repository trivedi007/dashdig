const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const User = require('../models/User');

// Initialize Stripe
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} else {
  console.warn('⚠️  STRIPE_SECRET_KEY not configured. Webhook endpoint will not function.');
}

/**
 * Stripe Webhook Endpoint
 * 
 * This endpoint handles subscription lifecycle events from Stripe.
 * IMPORTANT: This route uses express.raw() middleware, NOT express.json()
 * 
 * Required Environment Variables:
 * - STRIPE_SECRET_KEY: Your Stripe secret key
 * - STRIPE_WEBHOOK_SECRET: Webhook signing secret from Stripe dashboard
 * 
 * Handled Events:
 * - checkout.session.completed: New subscription created
 * - customer.subscription.updated: Plan changes or status updates
 * - customer.subscription.deleted: Subscription cancelled
 * - invoice.payment_succeeded: Successful payment/renewal
 * - invoice.payment_failed: Failed payment
 */
router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // Early validation
    if (!stripe) {
      console.error('[STRIPE WEBHOOK] ❌ Stripe not configured');
      return res.status(503).json({ 
        success: false,
        error: 'Stripe service unavailable' 
      });
    }

    if (!webhookSecret) {
      console.error('[STRIPE WEBHOOK] ❌ STRIPE_WEBHOOK_SECRET not configured');
      return res.status(500).json({ 
        success: false,
        error: 'Webhook secret not configured' 
      });
    }

    if (!sig) {
      console.error('[STRIPE WEBHOOK] ❌ Missing stripe-signature header');
      return res.status(400).json({ 
        success: false,
        error: 'Missing signature' 
      });
    }

    let event;

    // Verify webhook signature
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      console.log('[STRIPE WEBHOOK] ✅ Signature verified');
      console.log('[STRIPE WEBHOOK] Event type:', event.type);
      console.log('[STRIPE WEBHOOK] Event ID:', event.id);
    } catch (err) {
      console.error('[STRIPE WEBHOOK] ❌ Signature verification failed:', err.message);
      return res.status(400).json({ 
        success: false,
        error: `Webhook signature verification failed: ${err.message}` 
      });
    }

    // Handle the event
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await handleCheckoutSessionCompleted(event.data.object);
          break;

        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event.data.object);
          break;

        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object);
          break;

        case 'invoice.payment_succeeded':
          await handlePaymentSucceeded(event.data.object);
          break;

        case 'invoice.payment_failed':
          await handlePaymentFailed(event.data.object);
          break;

        default:
          console.log('[STRIPE WEBHOOK] ℹ️  Unhandled event type:', event.type);
      }

      // Always return 200 to acknowledge receipt
      return res.status(200).json({ 
        success: true,
        received: true,
        eventType: event.type 
      });

    } catch (error) {
      console.error('[STRIPE WEBHOOK] ❌ Error processing event:', error);
      console.error('[STRIPE WEBHOOK] Event type:', event.type);
      console.error('[STRIPE WEBHOOK] Error details:', error.message);
      console.error('[STRIPE WEBHOOK] Stack trace:', error.stack);
      
      // Still return 200 to prevent Stripe from retrying
      // Log the error for manual investigation
      return res.status(200).json({ 
        success: false,
        received: true,
        error: error.message,
        eventType: event.type
      });
    }
  }
);

/**
 * Handle checkout.session.completed
 * Triggered when a customer completes the checkout process
 */
async function handleCheckoutSessionCompleted(session) {
  console.log('[STRIPE WEBHOOK] 📦 Processing checkout.session.completed');
  console.log('[STRIPE WEBHOOK] Session ID:', session.id);
  console.log('[STRIPE WEBHOOK] Customer:', session.customer);
  console.log('[STRIPE WEBHOOK] Subscription:', session.subscription);

  try {
    const customerId = session.customer;
    const subscriptionId = session.subscription;

    if (!customerId) {
      console.error('[STRIPE WEBHOOK] ❌ No customer ID in session');
      return;
    }

    // Find user by Stripe customer ID
    const user = await User.findOne({ 
      'subscription.stripeCustomerId': customerId 
    });

    if (!user) {
      console.error('[STRIPE WEBHOOK] ❌ User not found for customer:', customerId);
      return;
    }

    console.log('[STRIPE WEBHOOK] Found user:', user._id);

    // Get subscription details from Stripe
    if (subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      // Determine plan from price ID
      const priceId = subscription.items.data[0]?.price.id;
      const plan = mapPriceIdToPlan(priceId);

      // Update user subscription
      user.subscription.stripeSubscriptionId = subscriptionId;
      user.subscription.plan = plan;
      user.subscription.status = subscription.status;
      user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
      user.subscription.cancelAtPeriodEnd = subscription.cancel_at_period_end || false;

      if (subscription.trial_end) {
        user.subscription.trialEndsAt = new Date(subscription.trial_end * 1000);
      }

      // Set plan limits based on subscription tier
      user.subscription.planLimits = getPlanLimits(plan);

      await user.save();

      console.log('[STRIPE WEBHOOK] ✅ User subscription updated');
      console.log('[STRIPE WEBHOOK] Plan:', plan);
      console.log('[STRIPE WEBHOOK] Status:', subscription.status);
    } else {
      console.warn('[STRIPE WEBHOOK] ⚠️  No subscription ID in session');
    }
  } catch (error) {
    console.error('[STRIPE WEBHOOK] ❌ Error in handleCheckoutSessionCompleted:', error);
    throw error;
  }
}

/**
 * Handle customer.subscription.updated
 * Triggered when a subscription changes (plan change, status change, etc.)
 */
async function handleSubscriptionUpdated(subscription) {
  console.log('[STRIPE WEBHOOK] 🔄 Processing customer.subscription.updated');
  console.log('[STRIPE WEBHOOK] Subscription ID:', subscription.id);
  console.log('[STRIPE WEBHOOK] Status:', subscription.status);
  console.log('[STRIPE WEBHOOK] Customer:', subscription.customer);

  try {
    // Find user by subscription ID or customer ID
    let user = await User.findOne({ 
      'subscription.stripeSubscriptionId': subscription.id 
    });

    if (!user) {
      // Fallback: try to find by customer ID
      user = await User.findOne({ 
        'subscription.stripeCustomerId': subscription.customer 
      });
    }

    if (!user) {
      console.error('[STRIPE WEBHOOK] ❌ User not found for subscription:', subscription.id);
      return;
    }

    console.log('[STRIPE WEBHOOK] Found user:', user._id);

    // Determine plan from price ID
    const priceId = subscription.items.data[0]?.price.id;
    const plan = mapPriceIdToPlan(priceId);

    // Update subscription details
    user.subscription.stripeSubscriptionId = subscription.id;
    user.subscription.stripeCustomerId = subscription.customer;
    user.subscription.plan = plan;
    user.subscription.status = subscription.status;
    user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    user.subscription.cancelAtPeriodEnd = subscription.cancel_at_period_end || false;

    if (subscription.trial_end) {
      user.subscription.trialEndsAt = new Date(subscription.trial_end * 1000);
    }

    // Update plan limits based on new subscription tier
    user.subscription.planLimits = getPlanLimits(plan);

    await user.save();

    console.log('[STRIPE WEBHOOK] ✅ Subscription updated');
    console.log('[STRIPE WEBHOOK] New plan:', plan);
    console.log('[STRIPE WEBHOOK] New status:', subscription.status);
  } catch (error) {
    console.error('[STRIPE WEBHOOK] ❌ Error in handleSubscriptionUpdated:', error);
    throw error;
  }
}

/**
 * Handle customer.subscription.deleted
 * Triggered when a subscription is cancelled
 */
async function handleSubscriptionDeleted(subscription) {
  console.log('[STRIPE WEBHOOK] 🗑️  Processing customer.subscription.deleted');
  console.log('[STRIPE WEBHOOK] Subscription ID:', subscription.id);
  console.log('[STRIPE WEBHOOK] Customer:', subscription.customer);

  try {
    // Find user by subscription ID
    const user = await User.findOne({ 
      'subscription.stripeSubscriptionId': subscription.id 
    });

    if (!user) {
      console.error('[STRIPE WEBHOOK] ❌ User not found for subscription:', subscription.id);
      return;
    }

    console.log('[STRIPE WEBHOOK] Found user:', user._id);

    // Downgrade to free plan
    user.subscription.plan = 'free';
    user.subscription.status = 'canceled';
    user.subscription.currentPeriodEnd = new Date();
    user.subscription.cancelAtPeriodEnd = false;
    
    // Set free tier limits
    user.subscription.planLimits = getPlanLimits('free');
    
    // Keep stripeCustomerId for potential resubscription
    // Clear subscription ID
    user.subscription.stripeSubscriptionId = null;

    await user.save();

    console.log('[STRIPE WEBHOOK] ✅ Subscription cancelled, user downgraded to free plan');
  } catch (error) {
    console.error('[STRIPE WEBHOOK] ❌ Error in handleSubscriptionDeleted:', error);
    throw error;
  }
}

/**
 * Handle invoice.payment_succeeded
 * Triggered when a payment succeeds (including renewals)
 */
async function handlePaymentSucceeded(invoice) {
  console.log('[STRIPE WEBHOOK] 💳 Processing invoice.payment_succeeded');
  console.log('[STRIPE WEBHOOK] Invoice ID:', invoice.id);
  console.log('[STRIPE WEBHOOK] Customer:', invoice.customer);
  console.log('[STRIPE WEBHOOK] Subscription:', invoice.subscription);
  console.log('[STRIPE WEBHOOK] Amount paid:', invoice.amount_paid / 100, invoice.currency.toUpperCase());

  try {
    // Find user by customer ID
    const user = await User.findOne({ 
      'subscription.stripeCustomerId': invoice.customer 
    });

    if (!user) {
      console.error('[STRIPE WEBHOOK] ❌ User not found for customer:', invoice.customer);
      return;
    }

    console.log('[STRIPE WEBHOOK] Found user:', user._id);

    // If this is a subscription renewal, ensure status is active
    if (invoice.subscription) {
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
      
      user.subscription.status = 'active';
      user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
      
      await user.save();

      console.log('[STRIPE WEBHOOK] ✅ Payment succeeded, subscription active until:', 
        user.subscription.currentPeriodEnd);
    } else {
      console.log('[STRIPE WEBHOOK] ℹ️  Payment for one-time invoice (not a subscription)');
    }

    // TODO: Send payment receipt email
    // await sendPaymentReceiptEmail(user, invoice);

  } catch (error) {
    console.error('[STRIPE WEBHOOK] ❌ Error in handlePaymentSucceeded:', error);
    throw error;
  }
}

/**
 * Handle invoice.payment_failed
 * Triggered when a payment fails
 */
async function handlePaymentFailed(invoice) {
  console.log('[STRIPE WEBHOOK] ⚠️  Processing invoice.payment_failed');
  console.log('[STRIPE WEBHOOK] Invoice ID:', invoice.id);
  console.log('[STRIPE WEBHOOK] Customer:', invoice.customer);
  console.log('[STRIPE WEBHOOK] Subscription:', invoice.subscription);
  console.log('[STRIPE WEBHOOK] Amount due:', invoice.amount_due / 100, invoice.currency.toUpperCase());

  try {
    // Find user by customer ID
    const user = await User.findOne({ 
      'subscription.stripeCustomerId': invoice.customer 
    });

    if (!user) {
      console.error('[STRIPE WEBHOOK] ❌ User not found for customer:', invoice.customer);
      return;
    }

    console.log('[STRIPE WEBHOOK] Found user:', user._id);

    // Update subscription status to past_due
    if (invoice.subscription) {
      user.subscription.status = 'past_due';
      await user.save();

      console.log('[STRIPE WEBHOOK] ⚠️  Subscription marked as past_due');
      
      // TODO: Send payment failed email
      // await sendPaymentFailedEmail(user, invoice);
    }

  } catch (error) {
    console.error('[STRIPE WEBHOOK] ❌ Error in handlePaymentFailed:', error);
    throw error;
  }
}

/**
 * Map Stripe price ID to subscription plan
 * You'll need to update these with your actual Stripe price IDs
 */
function mapPriceIdToPlan(priceId) {
  const priceMap = {
    // TODO: Replace with your actual Stripe price IDs
    [process.env.STRIPE_PRICE_STARTER]: 'starter',
    [process.env.STRIPE_PRICE_PRO]: 'pro',
    [process.env.STRIPE_PRICE_BUSINESS]: 'business',
    [process.env.STRIPE_PRICE_ENTERPRISE]: 'enterprise',
    // Add more price IDs as needed
  };

  return priceMap[priceId] || 'free';
}

/**
 * Get plan limits based on subscription tier
 * @param {string} plan - Subscription plan name
 * @returns {object} Plan limits
 */
function getPlanLimits(plan) {
  const limits = {
    trial: { 
      urlsPerMonth: 10, 
      clicksTracked: 500, 
      analyticsRetention: 7, 
      aiModel: 'haiku' 
    },
    free: { 
      urlsPerMonth: 25, 
      clicksTracked: 1000, 
      analyticsRetention: 7, 
      aiModel: 'haiku' 
    },
    starter: { 
      urlsPerMonth: 250, 
      clicksTracked: 10000, 
      analyticsRetention: 30, 
      aiModel: 'haiku' 
    },
    pro: { 
      urlsPerMonth: -1,  // -1 = unlimited
      clicksTracked: -1, 
      analyticsRetention: 90, 
      aiModel: 'sonnet' 
    },
    business: { 
      urlsPerMonth: -1, 
      clicksTracked: -1, 
      analyticsRetention: 180, 
      aiModel: 'sonnet' 
    },
    enterprise: { 
      urlsPerMonth: -1, 
      clicksTracked: -1, 
      analyticsRetention: 365, 
      aiModel: 'opus' 
    }
  };

  return limits[plan] || limits.free;
}

module.exports = router;
