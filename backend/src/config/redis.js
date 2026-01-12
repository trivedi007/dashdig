const Redis = require('ioredis');

/**
 * Redis Client Configuration
 * 
 * Provides a Redis client with automatic reconnection,
 * error handling, and health monitoring.
 * 
 * Environment Variables:
 * - REDIS_URL: Redis connection URL (optional)
 *   Format: redis://[:password@]host[:port][/db-number]
 *   Example: redis://localhost:6379
 *   Example with auth: redis://:mypassword@localhost:6379
 */

let redisClient = null;
let isConnected = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const RECONNECT_DELAY = 3000; // 3 seconds

/**
 * Create and configure Redis client
 */
function createRedisClient() {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    console.log('⚠️  REDIS_URL not configured - Redis caching disabled');
    return null;
  }

  console.log('[REDIS] Initializing Redis client...');
  console.log('[REDIS] Redis URL:', redisUrl.replace(/:[^:@]+@/, ':****@')); // Hide password in logs

  const client = new Redis(redisUrl, {
    // Connection settings
    connectTimeout: 10000, // 10 seconds
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    enableOfflineQueue: true, // Queue commands when disconnected
    
    // Reconnection strategy
    retryStrategy(times) {
      const delay = Math.min(times * RECONNECT_DELAY, 30000); // Max 30 seconds
      
      if (times > MAX_RECONNECT_ATTEMPTS) {
        console.error('[REDIS] ❌ Max reconnection attempts reached. Giving up.');
        return null; // Stop retrying
      }
      
      console.log(`[REDIS] 🔄 Reconnection attempt ${times}/${MAX_RECONNECT_ATTEMPTS} in ${delay}ms...`);
      reconnectAttempts = times;
      return delay;
    },
    
    // Reconnect on error
    reconnectOnError(err) {
      const targetErrors = [
        'READONLY',
        'ECONNREFUSED',
        'ETIMEDOUT',
        'ENOTFOUND'
      ];
      
      if (targetErrors.some(target => err.message.includes(target))) {
        console.log('[REDIS] ⚠️  Reconnectable error detected:', err.message);
        return true; // Reconnect
      }
      
      return false; // Don't reconnect
    }
  });

  // Event: Connection successful
  client.on('connect', () => {
    console.log('[REDIS] 🔌 Connecting to Redis...');
  });

  // Event: Connection ready
  client.on('ready', () => {
    console.log('[REDIS] ✅ Redis connected and ready');
    isConnected = true;
    reconnectAttempts = 0;
  });

  // Event: Error occurred
  client.on('error', (err) => {
    console.error('[REDIS] ❌ Redis error:', err.message);
    isConnected = false;
    
    // Log additional details for common errors
    if (err.message.includes('ECONNREFUSED')) {
      console.error('[REDIS] 💡 Tip: Check if Redis server is running');
    } else if (err.message.includes('ETIMEDOUT')) {
      console.error('[REDIS] 💡 Tip: Check network connectivity and firewall settings');
    } else if (err.message.includes('WRONGPASS')) {
      console.error('[REDIS] 💡 Tip: Check REDIS_URL password is correct');
    }
  });

  // Event: Connection closed
  client.on('close', () => {
    console.log('[REDIS] 🔌 Connection closed');
    isConnected = false;
  });

  // Event: Reconnecting
  client.on('reconnecting', () => {
    console.log('[REDIS] 🔄 Attempting to reconnect...');
  });

  // Event: Connection ended
  client.on('end', () => {
    console.log('[REDIS] ⛔ Connection ended (no more reconnection attempts)');
    isConnected = false;
  });

  return client;
}

/**
 * Initialize Redis connection
 * Safe to call multiple times - will only create one client
 */
async function connectRedis() {
  if (redisClient) {
    console.log('[REDIS] ℹ️  Redis client already initialized');
    return redisClient;
  }

  try {
    redisClient = createRedisClient();
    
    if (!redisClient) {
      console.log('[REDIS] ⚠️  Redis disabled - application will run without caching');
      return null;
    }

    // Wait for connection (with timeout)
    await Promise.race([
      redisClient.ping(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 10000)
      )
    ]);

    console.log('[REDIS] ✅ Initial connection successful');
    return redisClient;

  } catch (error) {
    console.error('[REDIS] ⚠️  Initial connection failed:', error.message);
    console.log('[REDIS] ℹ️  Application will continue without Redis (may impact performance)');
    
    // Don't throw - allow app to continue without Redis
    return redisClient; // Return client anyway - it will reconnect
  }
}

/**
 * Get Redis client instance
 * Returns null if Redis is not configured or not connected
 */
function getRedis() {
  if (!redisClient) {
    return null;
  }
  
  // Check if client is in a usable state
  if (redisClient.status === 'ready' || redisClient.status === 'connect') {
    return redisClient;
  }
  
  return null;
}

/**
 * Check if Redis is currently connected
 */
function isRedisConnected() {
  return isConnected && redisClient && redisClient.status === 'ready';
}

/**
 * Get Redis connection status
 */
function getRedisStatus() {
  if (!redisClient) {
    return {
      configured: false,
      connected: false,
      status: 'not_configured',
      reconnectAttempts: 0
    };
  }

  return {
    configured: true,
    connected: isConnected,
    status: redisClient.status,
    reconnectAttempts,
    maxReconnectAttempts: MAX_RECONNECT_ATTEMPTS
  };
}

/**
 * Health check - ping Redis
 */
async function healthCheck() {
  if (!redisClient || !isRedisConnected()) {
    return {
      healthy: false,
      message: 'Redis not connected'
    };
  }

  try {
    const startTime = Date.now();
    const result = await redisClient.ping();
    const latency = Date.now() - startTime;

    return {
      healthy: result === 'PONG',
      latency: `${latency}ms`,
      status: redisClient.status
    };
  } catch (error) {
    return {
      healthy: false,
      message: error.message
    };
  }
}

/**
 * Gracefully disconnect from Redis
 */
async function disconnectRedis() {
  if (!redisClient) {
    return;
  }

  try {
    console.log('[REDIS] 🔌 Disconnecting...');
    await redisClient.quit();
    console.log('[REDIS] ✅ Disconnected successfully');
  } catch (error) {
    console.error('[REDIS] ⚠️  Error during disconnect:', error.message);
    // Force disconnect
    redisClient.disconnect();
  } finally {
    redisClient = null;
    isConnected = false;
    reconnectAttempts = 0;
  }
}

/**
 * Cache helper - Get value with JSON parsing
 */
async function cacheGet(key) {
  const client = getRedis();
  if (!client) return null;

  try {
    const value = await client.get(key);
    if (!value) return null;
    
    // Try to parse as JSON, return as-is if not JSON
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (error) {
    console.error('[REDIS] Error getting cache key:', key, error.message);
    return null;
  }
}

/**
 * Cache helper - Set value with JSON stringification
 */
async function cacheSet(key, value, expirySeconds = null) {
  const client = getRedis();
  if (!client) return false;

  try {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    
    if (expirySeconds) {
      await client.setex(key, expirySeconds, serialized);
    } else {
      await client.set(key, serialized);
    }
    
    return true;
  } catch (error) {
    console.error('[REDIS] Error setting cache key:', key, error.message);
    return false;
  }
}

/**
 * Cache helper - Delete key
 */
async function cacheDel(key) {
  const client = getRedis();
  if (!client) return false;

  try {
    await client.del(key);
    return true;
  } catch (error) {
    console.error('[REDIS] Error deleting cache key:', key, error.message);
    return false;
  }
}

/**
 * Cache helper - Check if key exists
 */
async function cacheExists(key) {
  const client = getRedis();
  if (!client) return false;

  try {
    const exists = await client.exists(key);
    return exists === 1;
  } catch (error) {
    console.error('[REDIS] Error checking cache key:', key, error.message);
    return false;
  }
}

// Export Redis client and helper functions
module.exports = {
  connectRedis,
  disconnectRedis,
  getRedis,
  isRedisConnected,
  getRedisStatus,
  healthCheck,
  // Cache helpers
  cacheGet,
  cacheSet,
  cacheDel,
  cacheExists,
  // Export client directly (use with caution - prefer helper functions)
  get client() {
    return redisClient;
  }
};
