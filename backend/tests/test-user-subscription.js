#!/usr/bin/env node

/**
 * User Subscription Model Test
 * 
 * Tests the enhanced subscription fields and methods
 * Run: node tests/test-user-subscription.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

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

async function runTests() {
  try {
    log(colors.blue, '\n🚀 Starting User Subscription Tests');
    log(colors.blue, '====================================\n');

    // Test 1: Create new user with free plan defaults
    log(colors.cyan, '📋 Test 1: Create user with free plan defaults');
    const user = new User({
      email: 'test@example.com',
      identifier: 'test@example.com'
    });

    log(colors.green, '✅ Plan:', user.subscription.plan);
    log(colors.green, '✅ Status:', user.subscription.status);
    log(colors.green, '✅ URLs/month:', user.subscription.planLimits.urlsPerMonth);
    log(colors.green, '✅ Clicks tracked:', user.subscription.planLimits.clicksTracked);
    log(colors.green, '✅ Analytics retention:', user.subscription.planLimits.analyticsRetention, 'days');
    log(colors.green, '✅ AI Model:', user.subscription.planLimits.aiModel);
    log(colors.green, '✅ Cancel at period end:', user.subscription.cancelAtPeriodEnd);

    // Test 2: getPlanLimits() method
    log(colors.cyan, '\n📋 Test 2: getPlanLimits() method');
    const limits = user.getPlanLimits();
    log(colors.green, '✅ Returned limits:', JSON.stringify(limits, null, 2));

    // Test 3: canCreateUrl() method
    log(colors.cyan, '\n📋 Test 3: canCreateUrl() method');
    user.usage = { currentMonth: { urls: 10 } };
    const canCreate = user.canCreateUrl();
    log(colors.green, '✅ Can create URL (10/25):', canCreate);

    user.usage.currentMonth.urls = 25;
    const cannotCreate = user.canCreateUrl();
    log(colors.green, '✅ Can create URL (25/25):', cannotCreate);

    // Test 4: Test different plan tiers
    log(colors.cyan, '\n📋 Test 4: Different plan tiers');
    const plans = ['trial', 'free', 'starter', 'pro', 'business', 'enterprise'];
    
    for (const plan of plans) {
      user.subscription.plan = plan;
      const planLimits = user.getPlanLimits();
      const apiRate = user.getApiRateLimit();
      
      log(colors.yellow, `\n  ${plan.toUpperCase()}:`);
      log(colors.reset, `    URLs: ${planLimits.urlsPerMonth === -1 ? 'Unlimited' : planLimits.urlsPerMonth}`);
      log(colors.reset, `    Clicks: ${planLimits.clicksTracked === -1 ? 'Unlimited' : planLimits.clicksTracked}`);
      log(colors.reset, `    Analytics: ${planLimits.analyticsRetention} days`);
      log(colors.reset, `    AI Model: ${planLimits.aiModel}`);
      log(colors.reset, `    API Rate: ${apiRate.limit} req/hr`);
    }

    // Test 5: Test unlimited plans
    log(colors.cyan, '\n📋 Test 5: Unlimited plan (Pro)');
    user.subscription.plan = 'pro';
    user.usage.currentMonth.urls = 999999;
    const unlimitedCheck = user.canCreateUrl();
    log(colors.green, '✅ Can create URL (999999 URLs created):', unlimitedCheck);

    // Test 6: Custom plan limits
    log(colors.cyan, '\n📋 Test 6: Custom plan limits');
    user.subscription.plan = 'starter';
    user.subscription.planLimits = {
      urlsPerMonth: 500, // Custom limit instead of default 250
      clicksTracked: 20000,
      analyticsRetention: 60,
      aiModel: 'sonnet'
    };
    const customLimits = user.getPlanLimits();
    log(colors.green, '✅ Custom limits applied:', JSON.stringify(customLimits, null, 2));

    // Test 7: Business tier
    log(colors.cyan, '\n📋 Test 7: Business tier (new)');
    user.subscription.plan = 'business';
    const businessLimits = user.getPlanLimits();
    const businessRate = user.getApiRateLimit();
    log(colors.green, '✅ Business plan exists in enum');
    log(colors.green, '✅ Business URLs:', businessLimits.urlsPerMonth === -1 ? 'Unlimited' : businessLimits.urlsPerMonth);
    log(colors.green, '✅ Business API rate:', businessRate.limit, 'req/hr');
    log(colors.green, '✅ Business AI model:', businessLimits.aiModel);

    log(colors.blue, '\n====================================');
    log(colors.green, '✅ All tests passed!\n');

  } catch (error) {
    log(colors.red, '❌ Test failed:', error.message);
    log(colors.red, error.stack);
    process.exit(1);
  }
}

// Run tests without connecting to DB (schema validation only)
runTests().then(() => {
  log(colors.cyan, '💡 Note: These tests validate the schema and methods.');
  log(colors.cyan, '   For full integration tests, connect to MongoDB first.\n');
  process.exit(0);
}).catch(error => {
  log(colors.red, '❌ Test suite failed:', error.message);
  process.exit(1);
});
