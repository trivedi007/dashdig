console.log('Loading payment routes...');
const express = require('express');
const router = express.Router();
const paymentService = require('../services/payment.service');
const { requireAuth } = require('../middleware/auth');
const Stripe = require('stripe');  // Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);  // Stripe

// Get Stripe publishable key
router.get('/config', (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  });
});

// Create setup intent for collecting payment method
router.post('/setup-intent', requireAuth, async (req, res) => {
  try {
    const result = await paymentService.createSetupIntent(req.user._id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Attach payment method and start trial
router.post('/attach-payment-method', requireAuth, async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    
    // Attach payment method
    await paymentService.attachPaymentMethod(req.user._id, paymentMethodId);
    
    // Start trial subscription
    const subscription = await paymentService.createTrialSubscription(req.user._id, 'pro');
    
    res.json({ 
      success: true, 
      subscription,
      message: 'Payment method added! Your 7-day trial has started.' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel subscription
router.post('/cancel', requireAuth, async (req, res) => {
  try {
    const result = await paymentService.cancelSubscription(req.user._id);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    await paymentService.handleWebhook(event);
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

module.exports = router;
