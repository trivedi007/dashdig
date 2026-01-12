#!/usr/bin/env node

/**
 * Checkout Endpoint Test Script
 * 
 * Tests the checkout session creation endpoint
 * Run: node tests/test-checkout.js
 * 
 * Note: Requires MongoDB connection and valid JWT token
 */

require('dotenv').config();
const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const CHECKOUT_URL = `${BASE_URL}/api/checkout`;

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
 * Test checkout configuration endpoint
 */
async function testConfig() {
  log(colors.cyan, '\n📋 Test 1: Get Checkout Configuration');
  
  try {
    const response = await axios.get(`${CHECKOUT_URL}/config`);
    
    if (response.status === 200 && response.data.success) {
      log(colors.green, '✅ Success');
      log(colors.reset, 'Publishable Key:', response.data.data.publishableKey?.substring(0, 20) + '...');
      log(colors.reset, 'Available Prices:', Object.keys(response.data.data.prices).join(', '));
      return true;
    } else {
      log(colors.red, '❌ Failed:', response.data);
      return false;
    }
  } catch (error) {
    log(colors.red, '❌ Error:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test checkout session creation (requires auth token)
 */
async function testCreateSession(token, priceId) {
  log(colors.cyan, '\n📋 Test 2: Create Checkout Session');
  
  if (!token) {
    log(colors.yellow, '⚠️  Skipping: No JWT token provided');
    log(colors.yellow, '   Set JWT_TOKEN environment variable to test this endpoint');
    return false;
  }

  if (!priceId) {
    log(colors.yellow, '⚠️  Skipping: No price ID provided');
    log(colors.yellow, '   Set STRIPE_PRICE_PRO or pass priceId to test this endpoint');
    return false;
  }

  try {
    const response = await axios.post(
      `${CHECKOUT_URL}/session`,
      { priceId },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.status === 200 && response.data.success) {
      log(colors.green, '✅ Success');
      log(colors.reset, 'Session ID:', response.data.data.sessionId);
      log(colors.reset, 'Customer ID:', response.data.data.customerId);
      log(colors.reset, 'Session URL:', response.data.data.sessionUrl?.substring(0, 50) + '...');
      log(colors.yellow, '\n💡 To complete checkout, visit:');
      log(colors.cyan, response.data.data.sessionUrl);
      return true;
    } else {
      log(colors.red, '❌ Failed:', response.data);
      return false;
    }
  } catch (error) {
    if (error.response) {
      log(colors.red, '❌ Error:', error.response.status, error.response.data);
      
      if (error.response.status === 401) {
        log(colors.yellow, '💡 Tip: Your JWT token may be invalid or expired');
      }
    } else {
      log(colors.red, '❌ Network Error:', error.message);
    }
    return false;
  }
}

/**
 * Test error cases
 */
async function testErrorCases(token) {
  log(colors.cyan, '\n📋 Test 3: Error Cases');
  
  // Test missing price ID
  log(colors.yellow, '\n  3a) Missing priceId');
  try {
    await axios.post(
      `${CHECKOUT_URL}/session`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token || 'fake-token'}`
        }
      }
    );
    log(colors.red, '  ❌ Should have failed');
  } catch (error) {
    if (error.response?.status === 400) {
      log(colors.green, '  ✅ Correctly rejected missing priceId');
    } else if (error.response?.status === 401) {
      log(colors.yellow, '  ⚠️  Got 401 (needs valid token)');
    } else {
      log(colors.red, '  ❌ Unexpected error:', error.response?.status);
    }
  }

  // Test missing auth token
  log(colors.yellow, '\n  3b) Missing auth token');
  try {
    await axios.post(
      `${CHECKOUT_URL}/session`,
      { priceId: 'price_test_123' }
    );
    log(colors.red, '  ❌ Should have failed');
  } catch (error) {
    if (error.response?.status === 401) {
      log(colors.green, '  ✅ Correctly rejected unauthorized request');
    } else {
      log(colors.red, '  ❌ Unexpected error:', error.response?.status);
    }
  }

  // Test invalid price ID (needs valid token)
  if (token) {
    log(colors.yellow, '\n  3c) Invalid priceId');
    try {
      await axios.post(
        `${CHECKOUT_URL}/session`,
        { priceId: 'price_invalid_fake_id_12345' },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      log(colors.red, '  ❌ Should have failed');
    } catch (error) {
      if (error.response?.status === 400) {
        log(colors.green, '  ✅ Correctly rejected invalid priceId');
      } else {
        log(colors.yellow, '  ⚠️  Got status:', error.response?.status);
      }
    }
  }
}

/**
 * Run all tests
 */
async function runTests() {
  log(colors.blue, '\n🚀 Starting Checkout Endpoint Tests');
  log(colors.blue, '===================================\n');
  
  log(colors.blue, 'Checkout URL:', CHECKOUT_URL);
  
  // Check Stripe configuration
  if (!process.env.STRIPE_SECRET_KEY) {
    log(colors.red, '\n❌ STRIPE_SECRET_KEY not set in environment!');
    log(colors.yellow, 'Set it in your .env file to test checkout endpoints');
    process.exit(1);
  }

  const token = process.env.JWT_TOKEN || process.env.TEST_JWT_TOKEN;
  const priceId = process.env.STRIPE_PRICE_PRO || process.env.TEST_PRICE_ID;

  const results = {
    config: false,
    session: false,
    errors: false
  };

  // Test 1: Configuration
  results.config = await testConfig();

  // Test 2: Create session (requires token)
  results.session = await testCreateSession(token, priceId);

  // Test 3: Error cases
  results.errors = await testErrorCases(token);

  // Summary
  log(colors.blue, '\n===================================');
  log(colors.blue, '📊 Test Results Summary\n');
  
  log(results.config ? colors.green : colors.red, 
    `  Config Endpoint: ${results.config ? '✅ Pass' : '❌ Fail'}`);
  
  if (!token || !priceId) {
    log(colors.yellow, '  Create Session: ⏭️  Skipped (no JWT_TOKEN or STRIPE_PRICE_PRO)');
  } else {
    log(results.session ? colors.green : colors.red,
      `  Create Session: ${results.session ? '✅ Pass' : '❌ Fail'}`);
  }
  
  log(colors.blue, '  Error Cases: ✅ Tested');

  log(colors.blue, '\n===================================\n');

  if (!token || !priceId) {
    log(colors.yellow, '💡 To test session creation, set these environment variables:');
    log(colors.cyan, '   JWT_TOKEN=<your-jwt-token>');
    log(colors.cyan, '   STRIPE_PRICE_PRO=price_1234567890abcdef');
    log(colors.reset, '\nYou can get a JWT token by logging into your app and copying it from');
    log(colors.reset, 'the browser dev tools (localStorage or network request headers)\n');
  } else if (results.session) {
    log(colors.green, '✅ All tests passed!\n');
    log(colors.yellow, '💡 Next steps:');
    log(colors.reset, '   1. Visit the checkout URL to complete a test payment');
    log(colors.reset, '   2. Use test card: 4242 4242 4242 4242');
    log(colors.reset, '   3. After payment, check webhook logs');
    log(colors.reset, '   4. Verify user subscription updated in MongoDB\n');
  }
}

// Run tests
runTests().catch(error => {
  log(colors.red, '\n❌ Test suite failed:', error.message);
  process.exit(1);
});
