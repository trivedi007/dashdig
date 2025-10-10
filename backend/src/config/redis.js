const Redis = require('ioredis');

let redis;

const connectRedis = async () => {
  // Use REDIS_URL if provided (for Railway), otherwise fall back to localhost
  const redisUrl = process.env.REDIS_URL;
  
  if (redisUrl) {
    redis = new Redis(redisUrl);
  } else {
    redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
    });
  }

  redis.on('error', (err) => {
    console.error('Redis Error:', err);
  });

  redis.on('connect', () => {
    console.log('Redis Connected');
  });

  return redis;
};

const getRedis = () => {
  if (!redis) {
    throw new Error('Redis not initialized');
  }
  return redis;
};

module.exports = { connectRedis, getRedis };
