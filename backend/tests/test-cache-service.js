#!/usr/bin/env node

/**
 * Cache Service Test Script
 * 
 * Tests URL caching, analytics caching, and cache invalidation
 * Run: node tests/test-cache-service.js
 * 
 * Requires: Redis connection (REDIS_URL environment variable)
 */

require('dotenv').config();
const {
  cacheUrl,
  getCachedUrl,
  invalidateUrl,
  cacheAnalytics,
  getCachedAnalytics,
  invalidateAnalytics,
  cacheUser,
  getCachedUser,
  invalidateUser,
  getCacheStats,
  resetCacheStats
} = require('../src/services/cache.service');
const { isRedisConnected } = require('../src/config/redis');

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

// Mock URL data
const mockUrlData = {
  _id: '507f1f77bcf86cd799439011',
  shortCode: 'test-url',
  originalUrl: 'https://example.com/test',
  isActive: true,
  expiresAt: null,
  clicks: { count: 100, limit: null },
  userId: '507f1f77bcf86cd799439012'
};

/**
 * Test 1: Cache and retrieve URL
 */
async function testCacheUrl() {
  log(colors.cyan, '\n📋 Test 1: Cache and Retrieve URL');
  
  try {
    const shortCode = 'test-url-' + Date.now();
    
    // Cache URL
    const cached = await cacheUrl(shortCode, {
      ...mockUrlData,
      shortCode
    }, 60); // 1 minute TTL
    
    if (!cached) {
      log(colors.yellow, '⚠️  Cache returned false (Redis not available)');
      return { skipped: true };
    }
    
    log(colors.blue, '   Cached URL:', shortCode);
    
    // Retrieve from cache
    const retrieved = await getCachedUrl(shortCode);
    
    if (retrieved && retrieved.shortCode === shortCode) {
      log(colors.green, '✅ URL cached and retrieved successfully');
      log(colors.blue, '   Original URL:', retrieved.originalUrl);
      
      // Cleanup
      await invalidateUrl(shortCode);
      return { success: true };
    } else {
      log(colors.red, '❌ Failed to retrieve cached URL');
      return { success: false };
    }
  } catch (error) {
    log(colors.red, '❌ Error:', error.message);
    return { success: false, error };
  }
}

/**
 * Test 2: Cache miss handling
 */
async function testCacheMiss() {
  log(colors.cyan, '\n📋 Test 2: Cache Miss Handling');
  
  try {
    const nonExistentCode = 'non-existent-' + Date.now();
    
    const retrieved = await getCachedUrl(nonExistentCode);
    
    if (retrieved === null) {
      log(colors.green, '✅ Cache miss handled correctly (returned null)');
      return { success: true };
    } else {
      log(colors.red, '❌ Should return null for cache miss');
      return { success: false };
    }
  } catch (error) {
    log(colors.red, '❌ Error:', error.message);
    return { success: false, error };
  }
}

/**
 * Test 3: Cache invalidation
 */
async function testCacheInvalidation() {
  log(colors.cyan, '\n📋 Test 3: Cache Invalidation');
  
  try {
    const shortCode = 'test-invalidate-' + Date.now();
    
    // Cache URL
    await cacheUrl(shortCode, { ...mockUrlData, shortCode }, 60);
    
    // Verify it's cached
    let retrieved = await getCachedUrl(shortCode);
    if (!retrieved) {
      log(colors.yellow, '⚠️  URL not cached (Redis unavailable)');
      return { skipped: true };
    }
    
    log(colors.blue, '   URL cached');
    
    // Invalidate
    const invalidated = await invalidateUrl(shortCode);
    
    if (!invalidated) {
      log(colors.yellow, '⚠️  Invalidation returned false');
      return { skipped: true };
    }
    
    log(colors.blue, '   URL invalidated');
    
    // Verify it's gone
    retrieved = await getCachedUrl(shortCode);
    
    if (retrieved === null) {
      log(colors.green, '✅ Cache invalidation works correctly');
      return { success: true };
    } else {
      log(colors.red, '❌ URL still cached after invalidation');
      return { success: false };
    }
  } catch (error) {
    log(colors.red, '❌ Error:', error.message);
    return { success: false, error };
  }
}

/**
 * Test 4: Analytics caching
 */
async function testAnalyticsCaching() {
  log(colors.cyan, '\n📋 Test 4: Analytics Caching');
  
  try {
    const urlId = 'test-analytics-' + Date.now();
    const analyticsData = {
      clicks: 1250,
      uniqueVisitors: 890,
      topCountries: ['US', 'UK', 'CA'],
      clicksByDay: { '2026-01-10': 45, '2026-01-11': 67 }
    };
    
    // Cache analytics
    const cached = await cacheAnalytics(urlId, analyticsData, 60);
    
    if (!cached) {
      log(colors.yellow, '⚠️  Cache returned false (Redis unavailable)');
      return { skipped: true };
    }
    
    log(colors.blue, '   Cached analytics for:', urlId);
    
    // Retrieve
    const retrieved = await getCachedAnalytics(urlId);
    
    if (retrieved && retrieved.clicks === analyticsData.clicks) {
      log(colors.green, '✅ Analytics cached and retrieved successfully');
      log(colors.blue, '   Clicks:', retrieved.clicks);
      
      // Cleanup
      await invalidateAnalytics(urlId);
      return { success: true };
    } else {
      log(colors.red, '❌ Failed to retrieve cached analytics');
      return { success: false };
    }
  } catch (error) {
    log(colors.red, '❌ Error:', error.message);
    return { success: false, error };
  }
}

/**
 * Test 5: User caching
 */
async function testUserCaching() {
  log(colors.cyan, '\n📋 Test 5: User Caching');
  
  try {
    const userId = 'test-user-' + Date.now();
    const userData = {
      _id: userId,
      email: 'test@example.com',
      subscription: { plan: 'pro', status: 'active' },
      usage: { urlsCreated: 50 },
      isActive: true
    };
    
    // Cache user
    const cached = await cacheUser(userId, userData, 60);
    
    if (!cached) {
      log(colors.yellow, '⚠️  Cache returned false (Redis unavailable)');
      return { skipped: true };
    }
    
    log(colors.blue, '   Cached user:', userId);
    
    // Retrieve
    const retrieved = await getCachedUser(userId);
    
    if (retrieved && retrieved.email === userData.email) {
      log(colors.green, '✅ User cached and retrieved successfully');
      log(colors.blue, '   Email:', retrieved.email);
      
      // Cleanup
      await invalidateUser(userId);
      return { success: true };
    } else {
      log(colors.red, '❌ Failed to retrieve cached user');
      return { success: false };
    }
  } catch (error) {
    log(colors.red, '❌ Error:', error.message);
    return { success: false, error };
  }
}

/**
 * Test 6: Cache statistics
 */
async function testCacheStats() {
  log(colors.cyan, '\n📋 Test 6: Cache Statistics');
  
  try {
    // Reset stats
    resetCacheStats();
    
    const shortCode = 'test-stats-' + Date.now();
    
    // Create some cache hits and misses
    await cacheUrl(shortCode, { ...mockUrlData, shortCode }, 60);
    await getCachedUrl(shortCode); // Hit
    await getCachedUrl(shortCode); // Hit
    await getCachedUrl('non-existent'); // Miss
    
    const stats = getCacheStats();
    
    log(colors.blue, '   Stats:', JSON.stringify(stats, null, 2));
    
    if (stats.url && stats.redisConnected !== undefined) {
      log(colors.green, '✅ Cache statistics working');
      return { success: true };
    } else {
      log(colors.red, '❌ Invalid stats format');
      return { success: false };
    }
  } catch (error) {
    log(colors.red, '❌ Error:', error.message);
    return { success: false, error };
  }
}

/**
 * Test 7: TTL expiration
 */
async function testTTLExpiration() {
  log(colors.cyan, '\n📋 Test 7: TTL Expiration (2 second wait)');
  
  try {
    const shortCode = 'test-ttl-' + Date.now();
    
    // Cache with 2 second TTL
    await cacheUrl(shortCode, { ...mockUrlData, shortCode }, 2);
    
    // Verify it exists
    let retrieved = await getCachedUrl(shortCode);
    if (!retrieved) {
      log(colors.yellow, '⚠️  URL not cached (Redis unavailable)');
      return { skipped: true };
    }
    
    log(colors.blue, '   URL cached with 2s TTL');
    log(colors.blue, '   ⏰ Waiting 3 seconds...');
    
    // Wait for expiration
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Should be expired
    retrieved = await getCachedUrl(shortCode);
    
    if (retrieved === null) {
      log(colors.green, '✅ TTL expiration works correctly');
      return { success: true };
    } else {
      log(colors.red, '❌ URL still cached after TTL expired');
      return { success: false };
    }
  } catch (error) {
    log(colors.red, '❌ Error:', error.message);
    return { success: false, error };
  }
}

/**
 * Run all tests
 */
async function runTests() {
  log(colors.blue, '\n🚀 Starting Cache Service Tests');
  log(colors.blue, '================================\n');
  
  // Check Redis connection
  if (!isRedisConnected()) {
    log(colors.yellow, '⚠️  Redis not connected');
    log(colors.yellow, '   Tests will verify graceful degradation\n');
  } else {
    log(colors.green, '✅ Redis connected\n');
  }

  const results = {
    cacheUrl: await testCacheUrl(),
    cacheMiss: await testCacheMiss(),
    invalidation: await testCacheInvalidation(),
    analytics: await testAnalyticsCaching(),
    user: await testUserCaching(),
    stats: await testCacheStats(),
    ttl: await testTTLExpiration()
  };

  // Summary
  log(colors.blue, '\n================================');
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

  log(colors.blue, '\n================================');
  log(colors.green, `✅ Passed: ${passed}`);
  log(colors.red, `❌ Failed: ${failed}`);
  log(colors.yellow, `⏭️  Skipped: ${skipped}`);
  log(colors.blue, '================================\n');

  // Show cache stats if available
  if (isRedisConnected()) {
    const finalStats = getCacheStats();
    log(colors.cyan, '📊 Final Cache Statistics:\n');
    log(colors.blue, JSON.stringify(finalStats, null, 2));
    log(colors.reset, '');
  }

  if (failed > 0) {
    log(colors.red, '❌ Some tests failed\n');
    process.exit(1);
  } else if (skipped === Object.keys(results).length) {
    log(colors.yellow, '⚠️  All tests skipped (Redis not available)');
    log(colors.yellow, '   This is OK - cache service gracefully degrades\n');
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
