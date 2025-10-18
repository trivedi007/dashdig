const Redis = require('ioredis');

let redis;
let isRedisAvailable = false;

const connectRedis = async () => {
  // Only connect if Redis URL is explicitly provided
  if (!process.env.REDIS_URL) {
    console.log('⚠️  Redis not configured - running without cache');
    return null;
  }
  
  try {
    redis = new Redis(process.env.REDIS_URL, {
      connectTimeout: 5000,
      lazyConnect: true,
      maxRetriesPerRequest: 0, // CRITICAL: Don't retry!
      retryStrategy: false, // CRITICAL: Don't retry!
    });
    
    // Stop on first error
    redis.on('error', (err) => {
      console.log('⚠️  Redis error (non-fatal):', err.message);
      isRedisAvailable = false;
    });
    
    redis.on('connect', () => {
      console.log('✅ Redis connected');
      isRedisAvailable = true;
    });
    
    redis.on('close', () => {
      isRedisAvailable = false;
    });

    // Try to connect with timeout
    await Promise.race([
      redis.connect(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Redis connection timeout')), 5000)
      )
    ]).catch(() => {
      console.log('⚠️  Redis unavailable - continuing without cache');
      isRedisAvailable = false;
    });

    return redis;
  } catch (error) {
    console.log('⚠️  Redis unavailable - continuing without cache');
    isRedisAvailable = false;
    return null;
  }
};

const getRedis = () => {
  if (!redis || !isRedisAvailable) {
    return null;
  }
  return redis;
};

const isRedisConnected = () => isRedisAvailable;

module.exports = { connectRedis, getRedis, isRedisConnected };
