#!/usr/bin/env node

/**
 * Stripe Webhook Test Script
 * 
 * Tests the webhook endpoint with simulated Stripe events
 * Run: node tests/test-stripe-webhook.js
 */

require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const WEBHOOK_URL = `${BASE_URL}/api/webhooks/stripe`;
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, ...args) {
  console.log(color, ...args, colors.reset);
}

/**
 * Generate Stripe signature for webhook testing
 */
function generateStripeSignature(payload, secret) {
  const timestamp = Math.floor(Date.now() / 1000);
  const signedPayload = `${timestamp}.${payload}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');
  
  return `t=${timestamp},v1=${signature}`;
}

/**
 * Send test webhook event
 */
async function sendWebhook(eventType, eventData) {
  log(colors.cyan, `\n📤 Testing: ${eventType}`);
  
  const event = {
    id: `evt_test_${Date.now()}`,
    object: 'event',
    type: eventType,
    created: Math.floor(Date.now() / 1000),
    data: {
      object: eventData
    }
  };

  const payload = JSON.stringify(event);
  const signature = generateStripeSignature(payload, WEBHOOK_SECRET);

  try {
    const response = await axios.post(WEBHOOK_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': signature,
      },
    });

    if (response.status === 200) {
      log(colors.green, '✅ Success:', response.data);
    } else {
      log(colors.red, '❌ Unexpected status:', response.status);
    }
  } catch (error) {
    if (error.response) {
      log(colors.red, '❌ Error:', error.response.status, error.response.data);
    } else {
      log(colors.red, '❌ Network error:', error.message);
    }
  }
}

/**
 * Test scenarios
 */
async function runTests() {
  log(colors.blue, '\n🚀 Starting Stripe Webhook Tests');
  log(colors.blue, '================================\n');
  
  if (!WEBHOOK_SECRET) {
    log(colors.red, '❌ STRIPE_WEBHOOK_SECRET not set in environment!');
    log(colors.yellow, 'Set it in your .env file: STRIPE_WEBHOOK_SECRET=whsec_...');
    process.exit(1);
  }

  log(colors.blue, 'Webhook URL:', WEBHOOK_URL);
  log(colors.blue, 'Secret configured:', WEBHOOK_SECRET.substring(0, 12) + '...');

  // Test 1: Checkout Session Completed
  await sendWebhook('checkout.session.completed', {
    id: 'cs_test_123',
    object: 'checkout.session',
    customer: 'cus_test_123',
    subscription: 'sub_test_123',
    payment_status: 'paid',
  });

  // Test 2: Subscription Updated
  await sendWebhook('customer.subscription.updated', {
    id: 'sub_test_123',
    object: 'subscription',
    customer: 'cus_test_123',
    status: 'active',
    current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
    items: {
      data: [{
        price: {
          id: process.env.STRIPE_PRICE_PRO || 'price_test_pro'
        }
      }]
    }
  });

  // Test 3: Payment Succeeded
  await sendWebhook('invoice.payment_succeeded', {
    id: 'in_test_123',
    object: 'invoice',
    customer: 'cus_test_123',
    subscription: 'sub_test_123',
    amount_paid: 2900,
    currency: 'usd',
    status: 'paid',
  });

  // Test 4: Payment Failed
  await sendWebhook('invoice.payment_failed', {
    id: 'in_test_456',
    object: 'invoice',
    customer: 'cus_test_123',
    subscription: 'sub_test_123',
    amount_due: 2900,
    currency: 'usd',
    status: 'open',
  });

  // Test 5: Subscription Deleted
  await sendWebhook('customer.subscription.deleted', {
    id: 'sub_test_123',
    object: 'subscription',
    customer: 'cus_test_123',
    status: 'canceled',
    ended_at: Math.floor(Date.now() / 1000),
  });

  log(colors.blue, '\n================================');
  log(colors.blue, '✅ All tests completed!\n');
  
  log(colors.yellow, '💡 Tips:');
  log(colors.reset, '  - Check backend logs for detailed output');
  log(colors.reset, '  - Verify MongoDB for subscription updates');
  log(colors.reset, '  - Use Stripe CLI for real event testing:');
  log(colors.cyan, '    stripe listen --forward-to localhost:5000/api/webhooks/stripe\n');
}

// Run tests
runTests().catch(error => {
  log(colors.red, '❌ Test suite failed:', error.message);
  process.exit(1);
});
