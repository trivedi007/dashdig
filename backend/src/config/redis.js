const Redis = require('ioredis');

let redis;
let isRedisAvailable = false;

const connectRedis = async () => {
  try {
    // Use REDIS_URL if provided (for Railway), otherwise fall back to localhost
    const redisUrl = process.env.REDIS_URL;
    
    if (redisUrl) {
      redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) {
            console.warn('⚠️  Redis connection failed after 3 attempts. Running without Redis.');
            return null;
          }
          return Math.min(times * 100, 3000);
        },
        lazyConnect: true,
      });
    } else {
      redis = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) {
            console.warn('⚠️  Redis connection failed after 3 attempts. Running without Redis.');
            return null;
          }
          return Math.min(times * 100, 3000);
        },
        lazyConnect: true,
      });
    }

    redis.on('error', (err) => {
      // Silently log errors to avoid spam
      if (!err.message.includes('ENOTFOUND') && !err.message.includes('getaddrinfo')) {
        console.error('Redis Error:', err.message);
      }
      isRedisAvailable = false;
    });

    redis.on('connect', () => {
      console.log('✅ Redis Connected');
      isRedisAvailable = true;
    });

    redis.on('close', () => {
      isRedisAvailable = false;
    });

    // Try to connect with a timeout
    await Promise.race([
      redis.connect(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Redis connection timeout')), 5000)
      )
    ]).catch(() => {
      console.warn('⚠️  Redis unavailable. Application will run with limited rate limiting.');
      isRedisAvailable = false;
    });

    return redis;
  } catch (error) {
    console.warn('⚠️  Redis connection error:', error.message);
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
