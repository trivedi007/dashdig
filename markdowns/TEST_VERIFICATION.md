# Test Verification Guide

This document provides step-by-step instructions to verify all implementations from the technical guide.

## ✅ Files Modified/Created

### Modified Files:
1. **backend/src/models/Url.js** - Enhanced schema with metadata, click details, expires structure
2. **backend/src/controllers/url.controller.js** - Enhanced URL creation and click tracking
3. **backend/src/middleware/rateLimiter.js** - Multiple rate limiters per endpoint
4. **railway.toml** - Added healthcheck configuration
5. **vercel.json** - Added API proxy rewrites

### Created Files:
1. **docker-compose.yml** - Complete local development environment
2. **backend/Dockerfile** - Production-ready backend container
3. **frontend/Dockerfile** - Production-ready frontend container
4. **backend/tests/ai.service.test.js** - Unit tests for AI service
5. **backend/tests/load-test.yml** - Load testing configuration
6. **IMPLEMENTATION_SUMMARY.md** - Comprehensive implementation documentation

## 🧪 Verification Steps

### 1. Backend Health Check
```bash
# Wait for backend to fully start (may take 30-60 seconds on first run)
sleep 30

# Test health endpoint
curl http://localhost:3001/health

# Expected response:
# {"status":"OK","timestamp":"...","service":"Dashdig API"}
```

### 2. Test URL Creation with New Schema
```bash
# Test demo URL creation
curl -X POST http://localhost:3001/demo-url \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.amazon.com/Apple-AirPods-Pro/dp/B09JQMJHXY",
    "keywords": ["airpods", "apple", "headphones"]
  }'

# Expected response should include:
# - shortCode with contextual slug
# - metadata object (if fetchable)
# - clicks.details array (empty initially)
# - expires.afterClicks field
```

### 3. Verify New Schema Fields
```bash
# Check database for new fields
curl http://localhost:3001/debug/urls

# Verify each URL document contains:
# - metadata: { title, description, image }
# - clicks: { total, count, limit, lastClickedAt, details: [] }
# - expires: { at, afterClicks }
# - customizable: true/false
```

### 4. Test Click Tracking with Details
```bash
# Create a test URL
RESPONSE=$(curl -s -X POST http://localhost:3001/demo-url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/test"}')

# Extract shortCode
SHORT_CODE=$(echo $RESPONSE | grep -o '"shortCode":"[^"]*"' | cut -d'"' -f4)

# Visit the URL multiple times to generate clicks
for i in {1..5}; do
  curl -s "http://localhost:3001/$SHORT_CODE" > /dev/null
  echo "Click $i tracked"
  sleep 1
done

# Check if click details were stored
curl "http://localhost:3001/debug/urls" | grep -A 20 "$SHORT_CODE"
```

### 5. Test Rate Limiting
```bash
# Test API rate limit (100 req/min)
for i in {1..105}; do
  curl -s http://localhost:3001/health > /dev/null
  echo "Request $i"
done
# Should see 429 error after ~100 requests

# Test URL creation limit (10 req/min)
for i in {1..12}; do
  curl -s -X POST http://localhost:3001/demo-url \
    -H "Content-Type: application/json" \
    -d "{\"url\": \"https://example.com/test$i\"}" > /dev/null
  echo "URL creation $i"
done
# Should see 429 error after ~10 URLs
```

### 6. Test Metadata Fetching
```bash
# Create URL with metadata
curl -X POST http://localhost:3001/demo-url \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.hoka.com/en/us/mens-running-shoes/bondi-8/1123202.html",
    "keywords": ["hoka", "bondi", "running"]
  }' | jq

# Response should include metadata object with title/description
```

### 7. Run Unit Tests
```bash
cd backend
npm test

# Expected: All AI service tests pass
# - generateHumanReadableUrl tests
# - sanitizeSlug tests
# - generateFallbackUrl tests
# - fetchMetadata tests
```

### 8. Test Docker Setup (Optional)
```bash
# Start all services
docker-compose up -d

# Check services are running
docker-compose ps

# Test backend through Docker
curl http://localhost:3001/health

# Stop services
docker-compose down
```

### 9. Load Testing (Optional)
```bash
cd backend

# Install Artillery if not already installed
npm install -g artillery

# Run load test
artillery run tests/load-test.yml

# Monitor:
# - Response times
# - Success rate
# - Rate limiting behavior
```

## 📊 What to Verify

### Database Schema:
- ✅ New `metadata` object in URL documents
- ✅ `clicks.total` and `clicks.count` fields
- ✅ `clicks.details` array with click information
- ✅ `expires.at` and `expires.afterClicks` fields
- ✅ `customizable` boolean field
- ✅ Backward compatibility maintained

### URL Controller:
- ✅ Metadata fetching during URL creation
- ✅ Click details stored in database
- ✅ Redis atomic counters working
- ✅ Trending URLs tracked
- ✅ Both sync and async tracking work

### Rate Limiting:
- ✅ Different limits for different endpoints
- ✅ 429 errors with Retry-After headers
- ✅ Redis-backed (or memory fallback)
- ✅ Per-IP limiting working

### Deployment Configs:
- ✅ Railway healthcheck configured
- ✅ Vercel rewrites configured
- ✅ Docker Compose working
- ✅ Dockerfiles build successfully

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check MongoDB connection
echo $MONGODB_URI

# Check Redis connection
redis-cli ping

# Check logs
cd backend && npm start
```

### Tests Failing
```bash
# Install dependencies
cd backend && npm install

# Run tests with verbose output
npm test -- --verbose
```

### Docker Issues
```bash
# Clean up and restart
docker-compose down -v
docker-compose up --build
```

## ✨ Success Criteria

All implementations are successful if:

1. ✅ Backend starts without errors
2. ✅ Health endpoint returns 200 OK
3. ✅ URL creation includes metadata
4. ✅ Click tracking stores details
5. ✅ Rate limiting works per endpoint
6. ✅ Unit tests pass
7. ✅ Database schema matches guide
8. ✅ Docker setup works

## 📝 Notes

- Backend may take 30-60 seconds to start on first run (npm install)
- MongoDB connection required for full functionality
- Redis optional (will fallback to memory)
- All changes maintain backward compatibility
- Existing URLs continue to work

---

**Last Updated:** 2025-01-18
**Implementation Status:** ✅ Complete
