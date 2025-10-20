# 🧪 Smart URL Generator - Test Suite

## **Overview**

Comprehensive test suite for Dashdig Smart Links with **90+ test cases** covering pattern detection, API integration, collision handling, and edge cases.

---

## **📦 Test Structure**

```
tests/
├── setup.js                      # Test environment configuration
├── smartUrl.test.js              # Pattern detection unit tests (60+ cases)
├── slugApi.integration.test.js   # API integration tests (30+ cases)
└── README.md                     # This file
```

---

## **🚀 Running Tests**

### **Install Dependencies**

```bash
npm install --save-dev vitest supertest @vitest/coverage-v8
```

### **Run All Tests**

```bash
npm test
```

### **Run with Coverage**

```bash
npm run test:coverage
```

### **Run Specific Test File**

```bash
npm test smartUrl.test
npm test slugApi.integration.test
```

### **Watch Mode (Auto-rerun on changes)**

```bash
npm test -- --watch
```

### **Verbose Output**

```bash
VERBOSE_TESTS=true npm test
```

---

## **📋 Test Coverage**

### **1. E-Commerce URLs (10 tests)**
- ✅ Amazon product URLs with ASIN
- ✅ Amazon with tracking parameters
- ✅ Amazon international domains (.co.uk, .de, .ca)
- ✅ BJs Wholesale Club URLs
- ✅ Target product URLs
- ✅ Walmart URLs
- ✅ eBay listings
- ✅ Etsy product pages
- ✅ Shopify stores
- ✅ Generic e-commerce sites

### **2. Social Media URLs (10 tests)**
- ✅ Twitter/X tweets
- ✅ X.com domain (rebrand)
- ✅ LinkedIn profiles
- ✅ LinkedIn company pages
- ✅ LinkedIn articles
- ✅ Instagram posts
- ✅ Facebook pages
- ✅ TikTok videos
- ✅ Reddit posts with subreddits
- ✅ Medium articles

### **3. News Articles (8 tests)**
- ✅ NYTimes articles with dates
- ✅ NYTimes shortened URLs (nyti.ms)
- ✅ Washington Post
- ✅ Reuters
- ✅ BBC News
- ✅ CNN articles
- ✅ Bloomberg
- ✅ The Guardian

### **4. Video Platforms (8 tests)**
- ✅ YouTube watch URLs
- ✅ YouTube short URLs (youtu.be)
- ✅ YouTube Shorts
- ✅ YouTube embed URLs
- ✅ Vimeo videos
- ✅ TikTok videos
- ✅ Twitch streams
- ✅ Dailymotion

### **5. GitHub URLs (6 tests)**
- ✅ Repository URLs
- ✅ GitHub issues
- ✅ Pull requests
- ✅ Gist URLs
- ✅ Raw content URLs
- ✅ GitHub Pages

### **6. Special Cases (15 tests)**
- ✅ Very long URLs (100+ chars)
- ✅ URLs with many parameters (10+)
- ✅ Already shortened URLs (bit.ly, tinyurl)
- ✅ URLs with special characters (%, &, =)
- ✅ International domains (.co.uk, .de, .jp)
- ✅ Google Search results
- ✅ URLs with no path
- ✅ URLs with only query params
- ✅ Empty/null URLs
- ✅ Invalid URLs
- ✅ FTP URLs
- ✅ File URLs
- ✅ Data URLs
- ✅ mailto: links
- ✅ tel: links

### **7. Slug Quality Tests (10 tests)**
- ✅ 50 character limit enforcement
- ✅ PascalCase formatting
- ✅ Dot separator usage
- ✅ No consecutive dots
- ✅ No leading/trailing dots
- ✅ Valid characters only (a-zA-Z0-9.-)
- ✅ No spaces in slugs
- ✅ URL encoding handling
- ✅ Unicode character removal
- ✅ Case sensitivity handling

### **8. API Integration Tests (25 tests)**
- ✅ Pattern detection endpoint
- ✅ Slug availability checking
- ✅ Collision detection
- ✅ Smart suggestions (numbered, dated, shorter)
- ✅ Statistics endpoint
- ✅ Supported patterns list
- ✅ Error handling (400, 404, 500)
- ✅ Rate limiting
- ✅ Authentication
- ✅ CORS headers
- ✅ Performance benchmarks
- ✅ Concurrent requests
- ✅ Database transaction handling
- ✅ Cache invalidation
- ✅ Full flow integration

---

## **🎯 Example Test Cases**

### **Test 1: Amazon Product Detection**

```javascript
it('should detect Amazon product URLs with ASIN', () => {
  const url = 'https://www.amazon.com/Echo-Dot-5th-Gen/dp/B09B8V1LZ3';
  const result = detectPattern(url);
  
  expect(result.matched).toBe(true);
  expect(result.patternName).toBe('Amazon');
  expect(result.extracted.asin).toBe('B09B8V1LZ3');
  expect(result.suggestedSlug).toMatch(/Amazon\./);
  expect(result.suggestedSlug.length).toBeLessThanOrEqual(50);
});
```

### **Test 2: Slug Collision Handling**

```javascript
it('should provide suggestions when slug is taken', async () => {
  // Create a URL first
  await Url.create({
    originalUrl: 'https://amazon.com/product',
    shortCode: 'Amazon.EchoDot.5thGen'
  });
  
  const response = await request(app)
    .get('/api/slug/check/Amazon.EchoDot.5thGen')
    .expect(200);
  
  expect(response.body.available).toBe(false);
  expect(response.body.suggestions).toBeInstanceOf(Array);
  expect(response.body.suggestions.length).toBeGreaterThan(0);
  
  // Verify suggestion types
  const types = response.body.suggestions.map(s => s.type);
  expect(types).toContain('numbered');  // .2, .3
  expect(types).toContain('dated');     // .2025
  expect(types).toContain('shorter');   // Remove last component
});
```

### **Test 3: Very Long URL Handling**

```javascript
it('should handle very long URLs with many parameters', () => {
  const url = 'https://amazon.com/dp/B09B8V1LZ3?tag=aff-20&ref=xyz&keywords=echo+dot&qid=123&sr=8-1&th=1&psc=1&spLa=xyz&linkCode=abc';
  const result = detectPattern(url);
  
  expect(result.suggestedSlug.length).toBeLessThanOrEqual(50);
  expect(result.extracted.asin).toBe('B09B8V1LZ3');
  // Should strip tracking params from slug
  expect(result.suggestedSlug).not.toMatch(/tag|ref|keywords/);
});
```

### **Test 4: Full Integration Flow**

```javascript
it('should complete full flow: detect → check → create', async () => {
  const url = 'https://github.com/facebook/react';
  
  // Step 1: Detect pattern
  const detectResponse = await request(app)
    .post('/api/slug/detect-pattern')
    .send({ url })
    .expect(200);
  
  expect(detectResponse.body.suggestedSlug).toBe('GitHub.facebook.react');
  
  // Step 2: Check availability
  const checkResponse = await request(app)
    .get('/api/slug/check/GitHub.facebook.react')
    .expect(200);
  
  expect(checkResponse.body.available).toBe(true);
  
  // Step 3: Create URL (would be POST /api/urls with auth)
});
```

### **Test 5: Performance Test**

```javascript
it('should respond quickly to availability checks (< 500ms)', async () => {
  const start = Date.now();
  
  await request(app)
    .get('/api/slug/check/Performance.Test')
    .expect(200);
  
  const duration = Date.now() - start;
  expect(duration).toBeLessThan(500);
});
```

---

## **📊 Coverage Goals**

Target Coverage:
- ✅ **Statements**: > 90%
- ✅ **Branches**: > 85%
- ✅ **Functions**: > 90%
- ✅ **Lines**: > 90%

Run `npm run test:coverage` to see detailed coverage report.

---

## **🔧 Configuration**

### **vitest.config.js**

```javascript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    },
    setupFiles: ['./tests/setup.js'],
    testTimeout: 10000
  }
});
```

### **Environment Variables**

Create `.env.test`:

```bash
NODE_ENV=test
MONGODB_TEST_URI=mongodb://localhost:27017/dashdig-test
ANTHROPIC_API_KEY=sk-test-... (optional, will use mocks)
```

---

## **🚨 Common Issues & Solutions**

### **Issue 1: MongoDB Connection Failed**

**Error**: `MongoServerError: connect ECONNREFUSED`

**Solution**:
```bash
# Start MongoDB locally
mongod --dbpath ./data/db

# Or use Docker
docker run -d -p 27017:27017 mongo
```

### **Issue 2: Tests Timing Out**

**Error**: `Test timeout of 5000ms exceeded`

**Solution**: Increase timeout in `vitest.config.js` or specific tests:
```javascript
it('slow test', async () => {
  // ...
}, { timeout: 15000 });
```

### **Issue 3: Port Already in Use**

**Error**: `EADDRINUSE: address already in use :::5002`

**Solution**:
```bash
# Kill existing process
lsof -ti:5002 | xargs kill -9

# Or use different port in tests
PORT=5003 npm test
```

---

## **📈 CI/CD Integration**

### **GitHub Actions**

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:latest
        ports:
          - 27017:27017
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## **🎓 Writing New Tests**

### **Pattern Detection Test Template**

```javascript
it('should detect [PLATFORM] URLs', () => {
  const url = '[URL]';
  const result = detectPattern(url);
  
  expect(result.matched).toBe(true);
  expect(result.patternName).toBe('[PLATFORM]');
  expect(result.suggestedSlug).toMatch(/[PATTERN]/);
});
```

### **API Integration Test Template**

```javascript
it('should [TEST DESCRIPTION]', async () => {
  const response = await request(app)
    .get('/api/slug/[ENDPOINT]')
    .expect(200);
  
  expect(response.body.[PROPERTY]).toBe([VALUE]);
});
```

---

## **✅ Test Checklist**

Before committing:
- [ ] All tests passing (`npm test`)
- [ ] Coverage > 90% (`npm run test:coverage`)
- [ ] No eslint errors
- [ ] Added tests for new features
- [ ] Updated README if needed

---

## **📚 Resources**

- [Vitest Documentation](https://vitest.dev/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)
- [Test Coverage Best Practices](https://martinfowler.com/bliki/TestCoverage.html)

---

## **🎉 Summary**

This test suite provides:
- ✅ 90+ comprehensive test cases
- ✅ Unit & integration testing
- ✅ Pattern detection for 8+ platforms
- ✅ API endpoint validation
- ✅ Collision handling verification
- ✅ Performance benchmarks
- ✅ Edge case coverage
- ✅ CI/CD ready

**Run tests and ensure 100% pass rate before deployment!** 🚀

