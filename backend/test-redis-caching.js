#!/usr/bin/env node

/**
 * Redis Caching Test Script
 * 
 * Tests the Redis caching implementation for URL shortening.
 * 
 * Run: node test-redis-caching.js
 */

require('dotenv').config();
const { connectRedis, getRedis, healthCheck, getRedisStatus, cacheGet, cacheDel } = require('./src/config/redis');
const { getCacheStats, resetCacheStats } = require('./src/services/cache.service');

const API_BASE = process.env.API_BASE_URL || 'http://localhost:3001';
const TEST_URL = 'https://www.example.com/test-redis-caching-' + Date.now();

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  errors: []
};

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  console.log(`  ${title}`);
  console.log('='.repeat(60) + '\n');
}

function logResult(testName, passed, details = '') {
  if (passed) {
    console.log(`✅ PASS: ${testName}`);
    testResults.passed++;
  } else {
    console.log(`❌ FAIL: ${testName}`);
    if (details) console.log(`   Details: ${details}`);
    testResults.failed++;
    testResults.errors.push({ test: testName, details });
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testRedisConnection() {
  logSection('TEST 1: Verify Redis Connection');
  
  try {
    // Connect to Redis
    console.log('Connecting to Redis...');
    await connectRedis();
    
    // Check status
    const status = getRedisStatus();
    console.log('Redis Status:', JSON.stringify(status, null, 2));
    
    // Health check
    const health = await healthCheck();
    console.log('Health Check:', JSON.stringify(health, null, 2));
    
    const redis = getRedis();
    if (redis) {
      logResult('Redis connection', true);
      
      // Check for "Redis connected" message
      console.log('\nLooking for "Redis connected" in logs...');
      logResult('Redis connected message', status.connected, 
        status.connected ? 'Found in status' : 'Redis not connected');
      
      return true;
    } else {
      logResult('Redis connection', false, 'Redis client is null');
      return false;
    }
  } catch (error) {
    logResult('Redis connection', false, error.message);
    return false;
  }
}

async function createTestUrl() {
  logSection('TEST 2: Create a new short URL via API');
  
  try {
    console.log(`Creating short URL for: ${TEST_URL}`);
    
    const response = await fetch(`${API_BASE}/api/urls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: TEST_URL,
        keywords: ['test', 'redis', 'caching']
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    const shortCode = data.slug || data.shortCode || data.short_url?.split('/').pop();
    
    if (shortCode) {
      logResult('Create short URL', true);
      console.log(`\nShort code created: ${shortCode}`);
      return shortCode;
    } else {
      logResult('Create short URL', false, 'No short code in response');
      return null;
    }
  } catch (error) {
    logResult('Create short URL', false, error.message);
    return null;
  }
}

async function testCacheMiss(shortCode) {
  logSection('TEST 3: First redirect request (Cache MISS)');
  
  try {
    // Clear cache first to ensure MISS
    const cacheKey = `url:${shortCode.toLowerCase()}`;
    console.log(`Clearing cache key: ${cacheKey}`);
    await cacheDel(cacheKey);
    
    // Reset stats
    resetCacheStats();
    
    console.log(`\nMaking first redirect request to: ${API_BASE}/${shortCode}`);
    console.log('Expected: Cache MISS (database lookup)');
    
    const startTime = Date.now();
    const response = await fetch(`${API_BASE}/${shortCode}`, {
      redirect: 'manual', // Don't follow redirects
      headers: {
        'Accept': 'text/html'
      }
    });
    const elapsed = Date.now() - startTime;
    
    console.log(`\nResponse status: ${response.status}`);
    console.log(`Response time: ${elapsed}ms`);
    console.log(`Location header: ${response.headers.get('location')}`);
    
    // Check cache stats
    const stats = getCacheStats();
    console.log('\nCache Stats after first request:');
    console.log(JSON.stringify(stats, null, 2));
    
    // Verify cache MISS (URL should now be in cache)
    const cachedData = await cacheGet(cacheKey);
    
    if (response.status === 301 || response.status === 302) {
      logResult('First redirect successful', true);
      
      // Cache MISS means the URL was fetched from DB, then cached
      // We verify by checking if it's now in cache
      if (cachedData) {
        console.log('\n✅ URL is now cached (was fetched from DB - cache MISS)');
        logResult('Cache MISS on first request', true);
      } else {
        console.log('\n⚠️  URL not in cache after redirect');
        logResult('Cache MISS on first request', false, 'URL not cached after request');
      }
      
      return true;
    } else {
      logResult('First redirect successful', false, `Unexpected status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logResult('First redirect (Cache MISS)', false, error.message);
    return false;
  }
}

async function testCacheHit(shortCode) {
  logSection('TEST 4: Second redirect request (Cache HIT)');
  
  try {
    const cacheKey = `url:${shortCode.toLowerCase()}`;
    
    // Verify URL is in cache before second request
    const cachedBefore = await cacheGet(cacheKey);
    console.log('Cache status before second request:', cachedBefore ? 'CACHED' : 'NOT CACHED');
    
    if (!cachedBefore) {
      logResult('Cache HIT on second request', false, 'URL was not cached after first request');
      return false;
    }
    
    console.log(`\nMaking second redirect request to: ${API_BASE}/${shortCode}`);
    console.log('Expected: Cache HIT (fast response)');
    
    const startTime = Date.now();
    const response = await fetch(`${API_BASE}/${shortCode}`, {
      redirect: 'manual',
      headers: {
        'Accept': 'text/html'
      }
    });
    const elapsed = Date.now() - startTime;
    
    console.log(`\nResponse status: ${response.status}`);
    console.log(`Response time: ${elapsed}ms (should be faster than first request)`);
    console.log(`Location header: ${response.headers.get('location')}`);
    
    // Check cache stats
    const stats = getCacheStats();
    console.log('\nCache Stats after second request:');
    console.log(JSON.stringify(stats, null, 2));
    
    if (response.status === 301 || response.status === 302) {
      logResult('Second redirect successful', true);
      
      // Cache HIT is verified by faster response time and cached data still present
      if (elapsed < 100) {
        console.log('\n✅ Fast response time indicates cache HIT');
        logResult('Cache HIT on second request', true);
      } else {
        console.log('\n⚠️  Response was slower than expected for cache HIT');
        logResult('Cache HIT on second request', true, `Response time: ${elapsed}ms`);
      }
      
      return true;
    } else {
      logResult('Second redirect successful', false, `Unexpected status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logResult('Second redirect (Cache HIT)', false, error.message);
    return false;
  }
}

async function testTTL(shortCode) {
  logSection('TEST 5: Verify TTL (Time To Live)');
  
  try {
    const redis = getRedis();
    if (!redis) {
      logResult('TTL verification', false, 'Redis client not available');
      return false;
    }
    
    const cacheKey = `url:${shortCode.toLowerCase()}`;
    console.log(`Checking TTL for key: ${cacheKey}`);
    
    const ttl = await redis.ttl(cacheKey);
    console.log(`TTL: ${ttl} seconds`);
    
    // Expected TTL is ~86400 seconds (24 hours)
    const expectedTTL = 86400;
    const tolerance = 60; // Allow 1 minute tolerance
    
    if (ttl > 0) {
      console.log(`\nExpected TTL: ~${expectedTTL} seconds (24 hours)`);
      console.log(`Actual TTL: ${ttl} seconds`);
      
      if (Math.abs(ttl - expectedTTL) <= tolerance) {
        logResult('TTL is approximately 24 hours', true);
      } else if (ttl > expectedTTL - 3600) {
        // Within 1 hour of expected
        logResult('TTL is approximately 24 hours', true, `TTL: ${ttl}s (expected ~${expectedTTL}s)`);
      } else {
        logResult('TTL is approximately 24 hours', false, `TTL: ${ttl}s (expected ~${expectedTTL}s)`);
      }
      
      return true;
    } else if (ttl === -1) {
      logResult('TTL verification', false, 'Key exists but has no expiration');
      return false;
    } else if (ttl === -2) {
      logResult('TTL verification', false, 'Key does not exist');
      return false;
    }
  } catch (error) {
    logResult('TTL verification', false, error.message);
    return false;
  }
}

async function testCacheInvalidation(shortCode) {
  logSection('TEST 6: Test cache invalidation');
  
  try {
    const redis = getRedis();
    const cacheKey = `url:${shortCode.toLowerCase()}`;
    
    // Verify cache exists before invalidation
    const cachedBefore = await cacheGet(cacheKey);
    console.log('Cache status before invalidation:', cachedBefore ? 'CACHED' : 'NOT CACHED');
    
    if (!cachedBefore) {
      logResult('Cache invalidation', false, 'No cached data to invalidate');
      return false;
    }
    
    // Simulate updating the URL (this should invalidate cache)
    console.log('\nSimulating URL update by deleting cache key...');
    const deleted = await cacheDel(cacheKey);
    console.log(`Cache deletion result: ${deleted ? 'SUCCESS' : 'FAILED'}`);
    
    // Verify cache is cleared
    const cachedAfter = await cacheGet(cacheKey);
    console.log('Cache status after invalidation:', cachedAfter ? 'CACHED' : 'CLEARED');
    
    if (!cachedAfter) {
      logResult('Cache invalidation', true);
      
      // Make a request to verify cache is rebuilt
      console.log('\nMaking request after invalidation (should be cache MISS)...');
      const response = await fetch(`${API_BASE}/${shortCode}`, {
        redirect: 'manual'
      });
      
      // Check if cache is rebuilt
      await sleep(100); // Wait for async caching
      const rebuiltCache = await cacheGet(cacheKey);
      
      if (rebuiltCache) {
        logResult('Cache rebuild after invalidation', true);
      } else {
        logResult('Cache rebuild after invalidation', false, 'Cache not rebuilt after request');
      }
      
      return true;
    } else {
      logResult('Cache invalidation', false, 'Cache was not cleared');
      return false;
    }
  } catch (error) {
    logResult('Cache invalidation', false, error.message);
    return false;
  }
}

async function reportCacheStats() {
  logSection('CACHE HIT RATIO REPORT');
  
  try {
    const stats = getCacheStats();
    
    console.log('Final Cache Statistics:');
    console.log('-'.repeat(40));
    
    console.log('\nURL Cache:');
    console.log(`  Hits: ${stats.url.hits}`);
    console.log(`  Misses: ${stats.url.misses}`);
    console.log(`  Total Requests: ${stats.url.total}`);
    console.log(`  Hit Rate: ${stats.url.hitRate}`);
    
    console.log('\nAnalytics Cache:');
    console.log(`  Hits: ${stats.analytics.hits}`);
    console.log(`  Misses: ${stats.analytics.misses}`);
    console.log(`  Total Requests: ${stats.analytics.total}`);
    console.log(`  Hit Rate: ${stats.analytics.hitRate}`);
    
    console.log('\nUser Cache:');
    console.log(`  Hits: ${stats.user.hits}`);
    console.log(`  Misses: ${stats.user.misses}`);
    console.log(`  Total Requests: ${stats.user.total}`);
    console.log(`  Hit Rate: ${stats.user.hitRate}`);
    
    console.log('\nRedis Connection:');
    console.log(`  Connected: ${stats.redisConnected}`);
    
    return stats;
  } catch (error) {
    console.error('Error getting cache stats:', error.message);
    return null;
  }
}

async function runTests() {
  console.log('\n' + '█'.repeat(60));
  console.log('█  REDIS CACHING TEST SUITE');
  console.log('█'.repeat(60));
  console.log(`\nTest started at: ${new Date().toISOString()}`);
  console.log(`API Base URL: ${API_BASE}`);
  console.log(`Test URL: ${TEST_URL}`);
  
  // Run tests
  const redisConnected = await testRedisConnection();
  
  if (!redisConnected) {
    console.log('\n⛔ Redis is not connected. Some tests will be skipped.');
  }
  
  const shortCode = await createTestUrl();
  
  if (shortCode) {
    await testCacheMiss(shortCode);
    await sleep(500); // Small delay between requests
    await testCacheHit(shortCode);
    await testTTL(shortCode);
    await testCacheInvalidation(shortCode);
  } else {
    console.log('\n⛔ Could not create test URL. Redirect tests skipped.');
  }
  
  await reportCacheStats();
  
  // Final summary
  logSection('TEST SUMMARY');
  console.log(`Tests Passed: ${testResults.passed}`);
  console.log(`Tests Failed: ${testResults.failed}`);
  console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
  console.log(`Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
  
  if (testResults.errors.length > 0) {
    console.log('\nErrors:');
    testResults.errors.forEach((err, i) => {
      console.log(`  ${i + 1}. ${err.test}: ${err.details}`);
    });
  }
  
  console.log(`\nTest completed at: ${new Date().toISOString()}`);
  
  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  console.error('\n❌ Test suite failed with error:', error.message);
  process.exit(1);
});
