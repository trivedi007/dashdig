const { getRedis } = require('./src/config/redis');

async function clearCache() {
  try {
    const redis = getRedis();
    if (!redis) {
      console.log('❌ Redis not available');
      return;
    }

    console.log('🗑️  Clearing Redis cache...');
    
    // Clear all URL caches
    const keys = await redis.keys('url:*');
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`✅ Cleared ${keys.length} cached URLs`);
    } else {
      console.log('ℹ️  No cached URLs found');
    }
    
    // Specifically clear the hoka.bondi.running cache
    await redis.del('url:hoka.bondi.running');
    console.log('✅ Cleared hoka.bondi.running cache');
    
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
  }
}

clearCache();
