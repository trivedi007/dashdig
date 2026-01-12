#!/usr/bin/env node

/**
 * Redis Configuration Test Script
 * 
 * Tests Redis connection, reconnection, and caching operations
 * Run: node tests/test-redis.js
 */

require('dotenv').config();
const {
  connectRedis,
  disconnectRedis,
  getRedis,
  isRedisConnected,
  getRedisStatus,
  healthCheck,
  cacheGet,
  cacheSet,
  cacheDel,
  cacheExists
} = require('../src/config/redis');

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
 * Test 1: Connection
 */
async function testConnection() {
  log(colors.cyan, '\n📋 Test 1: Redis Connection');
  
  try {
    const redis = await connectRedis();
    
    if (!redis) {
      log(colors.yellow, '⚠️  Redis not configured (REDIS_URL not set)');
      log(colors.yellow, '   This is OK - application will run without caching');
      return { skipped: true };
    }
    
    if (isRedisConnected()) {
      log(colors.green, '✅ Redis connected successfully');
      return { success: true };
    } else {
      log(colors.yellow, '⚠️  Redis client created but not connected');
      log(colors.yellow, '   Will reconnect automatically');
      return { success: false };
    }
  } catch (error) {
    log(colors.red, '❌ Connection failed:', error.message);
    return { success: false, error };
  }
}

/**
 * Test 2: Status Check
 */
async function testStatus() {
  log(colors.cyan, '\n📋 Test 2: Connection Status');
  
  try {
    const status = getRedisStatus();
    
    log(colors.blue, '   Status:', JSON.stringify(status, null, 2));
    
    if (status.configured && status.connected) {
      log(colors.green, '✅ Redis is connected and ready');
      return { success: true };
    } else if (status.configured && !status.connected) {
      log(colors.yellow, '⚠️  Redis configured but not connected');
      return { success: false };
    } else {
      log(colors.yellow, '⚠️  Redis not configured');
      return { skipped: true };
    }
  } catch (error) {
    log(colors.red, '❌ Status check failed:', error.message);
    return { success: false, error };
  }
}

/**
 * Test 3: Health Check
 */
async function testHealthCheck() {
  log(colors.cyan, '\n📋 Test 3: Health Check (Ping)');
  
  try {
    const health = await healthCheck();
    
    log(colors.blue, '   Health:', JSON.stringify(health, null, 2));
    
    if (health.healthy) {
      log(colors.green, `✅ Redis healthy (latency: ${health.latency})`);
      return { success: true };
    } else if (health.message === 'Redis not connected') {
      log(colors.yellow, '⚠️  Redis not connected (expected when not configured)');
      return { skipped: true };
    } else {
      log(colors.red, '❌ Redis unhealthy:', health.message);
      return { success: false };
    }
  } catch (error) {
    log(colors.red, '❌ Health check failed:', error.message);
    return { success: false, error };
  }
}

/**
 * Test 4: Cache Set/Get (String)
 */
async function testCacheString() {
  log(colors.cyan, '\n📋 Test 4: Cache Set/Get (String)');
  
  try {
    const testKey = 'test:string:' + Date.now();
    const testValue = 'Hello Redis!';
    
    // Set cache
    const setResult = await cacheSet(testKey, testValue, 60);
    if (!setResult) {
      log(colors.yellow, '⚠️  Cache set returned false (Redis unavailable)');
      return { skipped: true };
    }
    
    log(colors.blue, `   Set: ${testKey} = "${testValue}"`);
    
    // Get cache
    const cachedValue = await cacheGet(testKey);
    
    if (cachedValue === testValue) {
      log(colors.green, `✅ Cache retrieved correctly: "${cachedValue}"`);
      
      // Cleanup
      await cacheDel(testKey);
      return { success: true };
    } else {
      log(colors.red, '❌ Cache mismatch:', cachedValue, '!==', testValue);
      return { success: false };
    }
  } catch (error) {
    log(colors.red, '❌ Cache string test failed:', error.message);
    return { success: false, error };
  }
}

/**
 * Test 5: Cache Set/Get (Object)
 */
async function testCacheObject() {
  log(colors.cyan, '\n📋 Test 5: Cache Set/Get (Object)');
  
  try {
    const testKey = 'test:object:' + Date.now();
    const testObject = {
      name: 'Dashdig',
      version: '1.0.0',
      features: ['url-shortening', 'analytics', 'ai-powered']
    };
    
    // Set cache
    const setResult = await cacheSet(testKey, testObject, 60);
    if (!setResult) {
      log(colors.yellow, '⚠️  Cache set returned false (Redis unavailable)');
      return { skipped: true };
    }
    
    log(colors.blue, '   Set object:', JSON.stringify(testObject));
    
    // Get cache
    const cachedObject = await cacheGet(testKey);
    
    if (JSON.stringify(cachedObject) === JSON.stringify(testObject)) {
      log(colors.green, '✅ Object cached and retrieved correctly');
      
      // Cleanup
      await cacheDel(testKey);
      return { success: true };
    } else {
      log(colors.red, '❌ Object mismatch');
      log(colors.red, '   Expected:', testObject);
      log(colors.red, '   Got:', cachedObject);
      return { success: false };
    }
  } catch (error) {
    log(colors.red, '❌ Cache object test failed:', error.message);
    return { success: false, error };
  }
}

/**
 * Test 6: Cache Expiry
 */
async function testCacheExpiry() {
  log(colors.cyan, '\n📋 Test 6: Cache Expiry');
  
  try {
    const testKey = 'test:expiry:' + Date.now();
    const testValue = 'Expires soon';
    
    // Set cache with 2 second expiry
    const setResult = await cacheSet(testKey, testValue, 2);
    if (!setResult) {
      log(colors.yellow, '⚠️  Cache set returned false (Redis unavailable)');
      return { skipped: true };
    }
    
    log(colors.blue, '   Set with 2 second expiry');
    
    // Check exists immediately
    const existsNow = await cacheExists(testKey);
    if (!existsNow) {
      log(colors.red, '❌ Key should exist immediately after set');
      return { success: false };
    }
    
    log(colors.blue, '   ⏰ Waiting 3 seconds for expiry...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check exists after expiry
    const existsAfter = await cacheExists(testKey);
    if (existsAfter) {
      log(colors.red, '❌ Key should have expired');
      return { success: false };
    }
    
    log(colors.green, '✅ Cache expired correctly');
    return { success: true };
  } catch (error) {
    log(colors.red, '❌ Cache expiry test failed:', error.message);
    return { success: false, error };
  }
}

/**
 * Test 7: Cache Delete
 */
async function testCacheDelete() {
  log(colors.cyan, '\n📋 Test 7: Cache Delete');
  
  try {
    const testKey = 'test:delete:' + Date.now();
    
    // Set cache
    await cacheSet(testKey, 'To be deleted', 60);
    
    // Verify exists
    const existsBefore = await cacheExists(testKey);
    if (!existsBefore) {
      log(colors.yellow, '⚠️  Key not set (Redis unavailable)');
      return { skipped: true };
    }
    
    // Delete
    const deleteResult = await cacheDel(testKey);
    if (!deleteResult) {
      log(colors.yellow, '⚠️  Delete returned false');
      return { skipped: true };
    }
    
    // Verify deleted
    const existsAfter = await cacheExists(testKey);
    if (existsAfter) {
      log(colors.red, '❌ Key should be deleted');
      return { success: false };
    }
    
    log(colors.green, '✅ Cache deleted successfully');
    return { success: true };
  } catch (error) {
    log(colors.red, '❌ Cache delete test failed:', error.message);
    return { success: false, error };
  }
}

/**
 * Test 8: Direct Client Access
 */
async function testDirectClient() {
  log(colors.cyan, '\n📋 Test 8: Direct Client Access');
  
  try {
    const redis = getRedis();
    
    if (!redis) {
      log(colors.yellow, '⚠️  Redis client not available');
      return { skipped: true };
    }
    
    // Test direct Redis command
    const pong = await redis.ping();
    
    if (pong === 'PONG') {
      log(colors.green, '✅ Direct client access works (PING → PONG)');
      return { success: true };
    } else {
      log(colors.red, '❌ Unexpected ping response:', pong);
      return { success: false };
    }
  } catch (error) {
    log(colors.red, '❌ Direct client test failed:', error.message);
    return { success: false, error };
  }
}

/**
 * Run all tests
 */
async function runTests() {
  log(colors.blue, '\n🚀 Starting Redis Configuration Tests');
  log(colors.blue, '====================================\n');
  
  if (!process.env.REDIS_URL) {
    log(colors.yellow, '⚠️  REDIS_URL not set in environment');
    log(colors.yellow, '   Tests will verify graceful degradation\n');
  } else {
    log(colors.blue, 'Redis URL:', process.env.REDIS_URL.replace(/:[^:@]+@/, ':****@'));
  }

  const results = {
    connection: await testConnection(),
    status: await testStatus(),
    healthCheck: await testHealthCheck(),
    cacheString: await testCacheString(),
    cacheObject: await testCacheObject(),
    cacheExpiry: await testCacheExpiry(),
    cacheDelete: await testCacheDelete(),
    directClient: await testDirectClient()
  };

  // Summary
  log(colors.blue, '\n====================================');
  log(colors.blue, '📊 Test Results Summary\n');

  let passed = 0;
  let failed = 0;
  let skipped = 0;

  for (const [name, result] of Object.entries(results)) {
    if (result.skipped) {
      skipped++;
      log(colors.yellow, `  ${name}: ⏭️  Skipped`);
    } else if (result.success) {
      passed++;
      log(colors.green, `  ${name}: ✅ Pass`);
    } else {
      failed++;
      log(colors.red, `  ${name}: ❌ Fail`);
    }
  }

  log(colors.blue, '\n====================================');
  log(colors.green, `✅ Passed: ${passed}`);
  log(colors.red, `❌ Failed: ${failed}`);
  log(colors.yellow, `⏭️  Skipped: ${skipped}`);
  log(colors.blue, '====================================\n');

  // Disconnect
  await disconnectRedis();
  
  if (failed > 0) {
    log(colors.red, '❌ Some tests failed');
    process.exit(1);
  } else if (skipped === Object.keys(results).length) {
    log(colors.yellow, '⚠️  All tests skipped (Redis not configured)');
    log(colors.yellow, '   This is OK for development without Redis\n');
    process.exit(0);
  } else {
    log(colors.green, '🎉 All tests passed!\n');
    process.exit(0);
  }
}

// Run tests
runTests().catch(error => {
  log(colors.red, '\n❌ Test suite crashed:', error.message);
  log(colors.red, error.stack);
  process.exit(1);
});
