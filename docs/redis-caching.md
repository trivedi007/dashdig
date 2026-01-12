# Redis Caching Configuration

## Overview

Redis is used for caching to improve application performance by reducing database queries and API calls. The Redis client is configured with automatic reconnection and comprehensive error handling.

**File:** `backend/src/config/redis.js`

## Features

✅ **Automatic Reconnection** - Reconnects on connection failures  
✅ **Error Handling** - Graceful degradation if Redis unavailable  
✅ **Health Monitoring** - Built-in health check functionality  
✅ **Logging** - Detailed connection status logging  
✅ **Helper Functions** - Easy-to-use cache methods  
✅ **JSON Support** - Automatic serialization/deserialization  

## Environment Variables

```bash
# Optional - Redis connection URL
REDIS_URL=redis://localhost:6379

# With password
REDIS_URL=redis://:mypassword@localhost:6379

# With database number
REDIS_URL=redis://localhost:6379/0

# Redis Cloud / Upstash
REDIS_URL=redis://default:password@redis-12345.upstash.io:6379
```

**Note:** If `REDIS_URL` is not set, the application will run without caching (degraded performance but functional).

## Usage

### Initialize Redis Connection

In `server.js`:

```javascript
const { connectRedis } = require('./config/redis');

async function startServer() {
  // Connect to Redis (non-blocking)
  try {
    await connectRedis();
  } catch (error) {
    console.warn('Redis connection failed, continuing without cache');
  }
  
  // Start server
  app.listen(PORT);
}
```

### Using Cache Helpers

The easiest way to use Redis is through the provided helper functions:

```javascript
const { cacheGet, cacheSet, cacheDel, cacheExists } = require('./config/redis');

// Get cached value
const cachedUser = await cacheGet('user:123');
if (cachedUser) {
  return cachedUser; // Cache hit
}

// Set cache with 1 hour expiry
const user = await User.findById(userId);
await cacheSet('user:123', user, 3600);

// Delete cache
await cacheDel('user:123');

// Check if key exists
const exists = await cacheExists('user:123');
```

### Using Redis Client Directly

For advanced operations:

```javascript
const { getRedis } = require('./config/redis');

async function advancedCaching() {
  const redis = getRedis();
  
  if (!redis) {
    console.log('Redis not available');
    return null; // Fallback to non-cached logic
  }
  
  // Use Redis commands directly
  await redis.lpush('notifications', JSON.stringify(notification));
  await redis.expire('session:xyz', 3600);
  const count = await redis.incr('page:views');
}
```

## API Reference

### Core Functions

#### `connectRedis()`

Initializes Redis connection. Safe to call multiple times.

```javascript
const { connectRedis } = require('./config/redis');

await connectRedis();
```

**Returns:** `Promise<RedisClient|null>`

#### `getRedis()`

Returns the Redis client if connected, otherwise `null`.

```javascript
const { getRedis } = require('./config/redis');

const redis = getRedis();
if (redis) {
  await redis.set('key', 'value');
}
```

**Returns:** `RedisClient|null`

#### `isRedisConnected()`

Check if Redis is currently connected and ready.

```javascript
const { isRedisConnected } = require('./config/redis');

if (isRedisConnected()) {
  console.log('Redis is connected');
}
```

**Returns:** `boolean`

#### `getRedisStatus()`

Get detailed Redis connection status.

```javascript
const { getRedisStatus } = require('./config/redis');

const status = getRedisStatus();
console.log(status);
// {
//   configured: true,
//   connected: true,
//   status: 'ready',
//   reconnectAttempts: 0,
//   maxReconnectAttempts: 10
// }
```

**Returns:** `Object`

#### `healthCheck()`

Perform a health check by pinging Redis.

```javascript
const { healthCheck } = require('./config/redis');

const health = await healthCheck();
console.log(health);
// {
//   healthy: true,
//   latency: '5ms',
//   status: 'ready'
// }
```

**Returns:** `Promise<Object>`

#### `disconnectRedis()`

Gracefully disconnect from Redis.

```javascript
const { disconnectRedis } = require('./config/redis');

await disconnectRedis();
```

**Returns:** `Promise<void>`

### Cache Helper Functions

#### `cacheGet(key)`

Get a value from cache with automatic JSON parsing.

```javascript
const { cacheGet } = require('./config/redis');

const user = await cacheGet('user:123');
// Returns: parsed object or null
```

**Parameters:**
- `key` (string): Cache key

**Returns:** `Promise<any|null>`

#### `cacheSet(key, value, expirySeconds)`

Set a value in cache with automatic JSON stringification.

```javascript
const { cacheSet } = require('./config/redis');

await cacheSet('user:123', userObject, 3600); // 1 hour expiry
```

**Parameters:**
- `key` (string): Cache key
- `value` (any): Value to cache
- `expirySeconds` (number, optional): Time to live in seconds

**Returns:** `Promise<boolean>`

#### `cacheDel(key)`

Delete a key from cache.

```javascript
const { cacheDel } = require('./config/redis');

await cacheDel('user:123');
```

**Parameters:**
- `key` (string): Cache key

**Returns:** `Promise<boolean>`

#### `cacheExists(key)`

Check if a key exists in cache.

```javascript
const { cacheExists } = require('./config/redis');

if (await cacheExists('user:123')) {
  console.log('Cache hit');
}
```

**Parameters:**
- `key` (string): Cache key

**Returns:** `Promise<boolean>`

## Common Patterns

### Cache-Aside Pattern

```javascript
const { cacheGet, cacheSet } = require('./config/redis');

async function getUser(userId) {
  const cacheKey = `user:${userId}`;
  
  // Try cache first
  let user = await cacheGet(cacheKey);
  
  if (user) {
    console.log('Cache hit');
    return user;
  }
  
  // Cache miss - fetch from database
  console.log('Cache miss');
  user = await User.findById(userId);
  
  // Store in cache for 1 hour
  await cacheSet(cacheKey, user, 3600);
  
  return user;
}
```

### Invalidate Cache on Update

```javascript
const { cacheDel } = require('./config/redis');

async function updateUser(userId, updates) {
  // Update database
  const user = await User.findByIdAndUpdate(userId, updates, { new: true });
  
  // Invalidate cache
  await cacheDel(`user:${userId}`);
  
  return user;
}
```

### Rate Limiting with Redis

```javascript
const { getRedis } = require('./config/redis');

async function checkRateLimit(userId, maxRequests = 100, windowSeconds = 3600) {
  const redis = getRedis();
  if (!redis) return true; // Allow if Redis unavailable
  
  const key = `ratelimit:${userId}`;
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, windowSeconds);
  }
  
  return current <= maxRequests;
}
```

### Session Storage

```javascript
const { cacheSet, cacheGet, cacheDel } = require('./config/redis');

// Store session (30 minutes)
await cacheSet(`session:${sessionId}`, { userId, data }, 1800);

// Get session
const session = await cacheGet(`session:${sessionId}`);

// Delete session (logout)
await cacheDel(`session:${sessionId}`);
```

### Cache Multiple Keys

```javascript
const { getRedis } = require('./config/redis');

async function cacheMultiple(keyValuePairs, expirySeconds) {
  const redis = getRedis();
  if (!redis) return false;
  
  const pipeline = redis.pipeline();
  
  for (const [key, value] of Object.entries(keyValuePairs)) {
    const serialized = JSON.stringify(value);
    if (expirySeconds) {
      pipeline.setex(key, expirySeconds, serialized);
    } else {
      pipeline.set(key, serialized);
    }
  }
  
  await pipeline.exec();
  return true;
}

// Usage
await cacheMultiple({
  'user:1': { name: 'Alice' },
  'user:2': { name: 'Bob' }
}, 3600);
```

## Connection Events

The Redis client emits several events that are automatically logged:

| Event | Description | Log |
|-------|-------------|-----|
| `connect` | Connection initiated | `🔌 Connecting to Redis...` |
| `ready` | Connection established | `✅ Redis connected and ready` |
| `error` | Error occurred | `❌ Redis error: <message>` |
| `close` | Connection closed | `🔌 Connection closed` |
| `reconnecting` | Attempting reconnection | `🔄 Attempting to reconnect...` |
| `end` | Connection ended | `⛔ Connection ended` |

## Reconnection Strategy

The Redis client automatically attempts to reconnect on connection failures:

- **Initial Delay:** 3 seconds
- **Max Delay:** 30 seconds (exponential backoff)
- **Max Attempts:** 10
- **Auto-reconnect on errors:** `READONLY`, `ECONNREFUSED`, `ETIMEDOUT`, `ENOTFOUND`

After 10 failed attempts, the client stops trying and logs:
```
[REDIS] ❌ Max reconnection attempts reached. Giving up.
```

The application continues to function without Redis (with degraded performance).

## Error Handling

### Application Continues Without Redis

If Redis is unavailable, the application **continues to work** but without caching:

```javascript
const { cacheGet, cacheSet } = require('./config/redis');

// These operations fail gracefully
const cached = await cacheGet('key'); // Returns null
await cacheSet('key', 'value');       // Returns false, logs error
```

### Checking Redis Availability

Always check if Redis is available before performing critical operations:

```javascript
const { isRedisConnected, getRedis } = require('./config/redis');

if (isRedisConnected()) {
  const redis = getRedis();
  // Perform Redis operations
} else {
  // Fallback to non-cached logic
}
```

## Performance Considerations

### Cache Key Naming

Use consistent, hierarchical key names:

```javascript
// Good
user:123
user:123:profile
user:123:posts
session:abc-def-ghi
ratelimit:user:123

// Bad
123
user123profile
random_key_name
```

### Expiry Times

Set appropriate expiry times to prevent stale data:

```javascript
// Short-lived (1-5 minutes)
cacheSet('trending:posts', posts, 300);

// Medium-lived (1 hour)
cacheSet('user:profile', profile, 3600);

// Long-lived (1 day)
cacheSet('settings:global', settings, 86400);

// Permanent (manual invalidation)
cacheSet('feature:flags', flags);
```

### Memory Usage

Monitor Redis memory usage and set maxmemory policy:

```bash
# In Redis config
maxmemory 256mb
maxmemory-policy allkeys-lru
```

## Health Check Endpoint

Add Redis health to your health check endpoint:

```javascript
const { healthCheck, getRedisStatus } = require('./config/redis');

app.get('/health', async (req, res) => {
  const mongoHealth = mongoose.connection.readyState === 1;
  const redisHealth = await healthCheck();
  const redisStatus = getRedisStatus();
  
  res.json({
    status: mongoHealth ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: {
        connected: mongoHealth
      },
      redis: {
        configured: redisStatus.configured,
        connected: redisStatus.connected,
        healthy: redisHealth.healthy,
        latency: redisHealth.latency
      }
    }
  });
});
```

## Testing

### Local Development

```bash
# Install Redis locally
brew install redis  # macOS
sudo apt install redis-server  # Ubuntu

# Start Redis
redis-server

# Set environment variable
export REDIS_URL=redis://localhost:6379

# Start application
npm run dev
```

### Test Redis Connection

```bash
# Test with redis-cli
redis-cli ping
# Should return: PONG

# Monitor Redis
redis-cli monitor

# Check info
redis-cli info
```

### Test Application

```bash
# Run test script
node tests/test-redis.js
```

## Production Deployment

### Railway

1. Add Redis service in Railway dashboard
2. Copy the Redis URL
3. Add environment variable:
   ```
   REDIS_URL=redis://default:password@redis.railway.internal:6379
   ```

### Upstash (Serverless Redis)

1. Create Redis database at https://upstash.com
2. Copy the Redis URL
3. Add to environment:
   ```
   REDIS_URL=redis://default:password@redis-12345.upstash.io:6379
   ```

### Redis Cloud

1. Create database at https://redis.com/cloud
2. Copy connection URL
3. Add to environment

## Monitoring

### Check Connection Status

```javascript
const { getRedisStatus } = require('./config/redis');

setInterval(() => {
  const status = getRedisStatus();
  console.log('Redis Status:', status);
}, 60000); // Every minute
```

### Log Cache Hit Rate

```javascript
let hits = 0;
let misses = 0;

async function getCachedData(key, fetchFn) {
  const cached = await cacheGet(key);
  
  if (cached) {
    hits++;
    console.log(`Cache hit rate: ${(hits/(hits+misses)*100).toFixed(2)}%`);
    return cached;
  }
  
  misses++;
  const data = await fetchFn();
  await cacheSet(key, data, 3600);
  
  return data;
}
```

## Troubleshooting

### "REDIS_URL not configured"

**Cause:** `REDIS_URL` environment variable not set

**Solution:** Set `REDIS_URL` or run without Redis (degraded performance)

### "Redis error: ECONNREFUSED"

**Cause:** Redis server not running or wrong host/port

**Solution:**
1. Check if Redis is running: `redis-cli ping`
2. Verify `REDIS_URL` is correct
3. Check firewall settings

### "Redis error: WRONGPASS"

**Cause:** Incorrect password in `REDIS_URL`

**Solution:** Verify password in Redis connection URL

### "Max reconnection attempts reached"

**Cause:** Persistent connection failure

**Solution:**
1. Check Redis server status
2. Verify network connectivity
3. Check Redis logs for errors

## Best Practices

✅ **Set expiry times** - Prevent stale data and memory bloat  
✅ **Use namespaced keys** - Organize keys by feature/type  
✅ **Handle failures gracefully** - Check if Redis available  
✅ **Monitor cache hit rates** - Optimize caching strategy  
✅ **Invalidate on updates** - Keep cache fresh  
✅ **Use pipelines for bulk ops** - Improve performance  
✅ **Set memory limits** - Prevent Redis from using too much RAM  

❌ **Don't cache sensitive data** - Use short expiry or encrypt  
❌ **Don't rely solely on cache** - Always have database fallback  
❌ **Don't cache large objects** - Limit to < 1MB per key  
❌ **Don't use blocking commands** - Use async operations  

## Related Documentation

- [ioredis Documentation](https://github.com/redis/ioredis)
- [Redis Commands](https://redis.io/commands)
- [Redis Best Practices](https://redis.io/docs/manual/patterns/)
