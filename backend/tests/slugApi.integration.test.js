/**
 * Integration Tests for Slug API
 * 
 * Tests the complete flow:
 * 1. Pattern detection API
 * 2. Slug availability checking
 * 3. Collision handling with suggestions
 * 4. Full URL creation flow
 */

const { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } = require('vitest');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Url = require('../src/models/Url');

describe('Slug API Integration Tests', () => {
  
  // Setup test database connection
  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/dashdig-test');
    }
  });
  
  afterAll(async () => {
    // Clean up and close connection
    await mongoose.connection.close();
  });
  
  beforeEach(async () => {
    // Clear URLs collection before each test
    await Url.deleteMany({});
  });
  
  // =============================================================================
  // PATTERN DETECTION API TESTS
  // =============================================================================
  
  describe('POST /api/slug/detect-pattern', () => {
    
    it('should detect Amazon pattern and return suggested slug', async () => {
      const response = await request(app)
        .post('/api/slug/detect-pattern')
        .send({ url: 'https://www.amazon.com/Echo-Dot-5th-Gen/dp/B09B8V1LZ3' })
        .expect(200);
      
      expect(response.body.matched).toBe(true);
      expect(response.body.patternName).toBe('Amazon');
      expect(response.body.suggestedSlug).toBeTruthy();
      expect(response.body.confidence).toBe('high');
      expect(response.body.template).toBe('Amazon.{ProductName}.{Category}');
    });
    
    it('should detect GitHub pattern', async () => {
      const response = await request(app)
        .post('/api/slug/detect-pattern')
        .send({ url: 'https://github.com/facebook/react' })
        .expect(200);
      
      expect(response.body.matched).toBe(true);
      expect(response.body.patternName).toBe('GitHub');
      expect(response.body.suggestedSlug).toBe('GitHub.facebook.react');
    });
    
    it('should return 400 if URL is missing', async () => {
      const response = await request(app)
        .post('/api/slug/detect-pattern')
        .send({})
        .expect(400);
      
      expect(response.body.error).toBeTruthy();
    });
    
    it('should handle generic URLs without pattern match', async () => {
      const response = await request(app)
        .post('/api/slug/detect-pattern')
        .send({ url: 'https://example.com/some/path' })
        .expect(200);
      
      expect(response.body.matched).toBe(false);
      expect(response.body.patternName).toBe('Generic');
    });
    
  });
  
  // =============================================================================
  // SLUG AVAILABILITY API TESTS
  // =============================================================================
  
  describe('GET /api/slug/check/:slug', () => {
    
    it('should return available=true for non-existent slug', async () => {
      const response = await request(app)
        .get('/api/slug/check/Amazon.EchoDot.5thGen')
        .expect(200);
      
      expect(response.body.available).toBe(true);
      expect(response.body.slug).toBe('Amazon.EchoDot.5thGen');
      expect(response.body.message).toMatch(/available/i);
    });
    
    it('should return available=false for existing slug', async () => {
      // Create a URL first
      await Url.create({
        originalUrl: 'https://www.amazon.com/Echo-Dot/dp/B09B8V1LZ3',
        shortCode: 'Amazon.EchoDot.5thGen',
        user: new mongoose.Types.ObjectId()
      });
      
      const response = await request(app)
        .get('/api/slug/check/Amazon.EchoDot.5thGen')
        .expect(200);
      
      expect(response.body.available).toBe(false);
      expect(response.body.message).toMatch(/taken/i);
    });
    
    it('should provide suggestions when slug is taken', async () => {
      // Create a URL first
      await Url.create({
        originalUrl: 'https://www.amazon.com/Echo-Dot/dp/B09B8V1LZ3',
        shortCode: 'Amazon.EchoDot.5thGen',
        user: new mongoose.Types.ObjectId()
      });
      
      const response = await request(app)
        .get('/api/slug/check/Amazon.EchoDot.5thGen')
        .expect(200);
      
      expect(response.body.available).toBe(false);
      expect(response.body.suggestions).toBeInstanceOf(Array);
      expect(response.body.suggestions.length).toBeGreaterThan(0);
      
      // Check suggestion structure
      const firstSuggestion = response.body.suggestions[0];
      expect(firstSuggestion).toHaveProperty('slug');
      expect(firstSuggestion).toHaveProperty('type');
      expect(firstSuggestion).toHaveProperty('available');
      expect(firstSuggestion.available).toBe(true);
    });
    
    it('should suggest numbered variants (slug.2, slug.3)', async () => {
      // Create original slug
      await Url.create({
        originalUrl: 'https://www.amazon.com/product1',
        shortCode: 'Amazon.Product',
        user: new mongoose.Types.ObjectId()
      });
      
      const response = await request(app)
        .get('/api/slug/check/Amazon.Product')
        .expect(200);
      
      const numberedSuggestions = response.body.suggestions.filter(s => s.type === 'numbered');
      expect(numberedSuggestions.length).toBeGreaterThan(0);
      expect(numberedSuggestions[0].slug).toMatch(/Amazon\.Product\.\d+/);
    });
    
    it('should suggest dated variants (slug.2025)', async () => {
      await Url.create({
        originalUrl: 'https://www.example.com/article',
        shortCode: 'Example.Article',
        user: new mongoose.Types.ObjectId()
      });
      
      const response = await request(app)
        .get('/api/slug/check/Example.Article')
        .expect(200);
      
      const datedSuggestions = response.body.suggestions.filter(s => s.type === 'dated');
      expect(datedSuggestions.length).toBeGreaterThan(0);
      expect(datedSuggestions[0].slug).toMatch(/\d{4}$/);
    });
    
    it('should suggest shorter variants', async () => {
      await Url.create({
        originalUrl: 'https://www.example.com/product',
        shortCode: 'Example.Long.Product.Name',
        user: new mongoose.Types.ObjectId()
      });
      
      const response = await request(app)
        .get('/api/slug/check/Example.Long.Product.Name')
        .expect(200);
      
      const shorterSuggestions = response.body.suggestions.filter(s => s.type === 'shorter');
      expect(shorterSuggestions.length).toBeGreaterThan(0);
      // Shorter version should have fewer dots
      const originalDots = 'Example.Long.Product.Name'.split('.').length;
      const shorterDots = shorterSuggestions[0].slug.split('.').length;
      expect(shorterDots).toBeLessThan(originalDots);
    });
    
  });
  
  // =============================================================================
  // SUPPORTED PATTERNS API TESTS
  // =============================================================================
  
  describe('GET /api/slug/patterns', () => {
    
    it('should return list of supported patterns', async () => {
      const response = await request(app)
        .get('/api/slug/patterns')
        .expect(200);
      
      expect(response.body.count).toBe(8);
      expect(response.body.patterns).toBeInstanceOf(Array);
      expect(response.body.patterns.length).toBe(8);
    });
    
    it('should return correct pattern structure', async () => {
      const response = await request(app)
        .get('/api/slug/patterns')
        .expect(200);
      
      const pattern = response.body.patterns[0];
      expect(pattern).toHaveProperty('id');
      expect(pattern).toHaveProperty('name');
      expect(pattern).toHaveProperty('domains');
      expect(pattern).toHaveProperty('template');
      expect(pattern.domains).toBeInstanceOf(Array);
    });
    
    it('should include Amazon, YouTube, and GitHub patterns', async () => {
      const response = await request(app)
        .get('/api/slug/patterns')
        .expect(200);
      
      const patternNames = response.body.patterns.map(p => p.name);
      expect(patternNames).toContain('Amazon');
      expect(patternNames).toContain('YouTube');
      expect(patternNames).toContain('GitHub');
    });
    
  });
  
  // =============================================================================
  // SLUG STATISTICS API TESTS
  // =============================================================================
  
  describe('GET /api/slug/stats', () => {
    
    it('should return slug statistics', async () => {
      // Create some test URLs
      await Url.create([
        {
          originalUrl: 'https://amazon.com/1',
          shortCode: 'Amazon.Product1',
          clicks: 100,
          user: new mongoose.Types.ObjectId()
        },
        {
          originalUrl: 'https://github.com/user/repo',
          shortCode: 'GitHub.User.Repo',
          clicks: 50,
          user: new mongoose.Types.ObjectId()
        }
      ]);
      
      const response = await request(app)
        .get('/api/slug/stats')
        .expect(200);
      
      expect(response.body.totalSlugs).toBe(2);
      expect(response.body.avgSlugLength).toBeGreaterThan(0);
      expect(response.body.topSlugs).toBeInstanceOf(Array);
      expect(response.body.topPatterns).toBeInstanceOf(Array);
    });
    
    it('should return top slugs sorted by clicks', async () => {
      await Url.create([
        {
          originalUrl: 'https://example.com/1',
          shortCode: 'Popular',
          clicks: 1000,
          user: new mongoose.Types.ObjectId()
        },
        {
          originalUrl: 'https://example.com/2',
          shortCode: 'LessPopular',
          clicks: 10,
          user: new mongoose.Types.ObjectId()
        }
      ]);
      
      const response = await request(app)
        .get('/api/slug/stats')
        .expect(200);
      
      expect(response.body.topSlugs[0].shortCode).toBe('Popular');
      expect(response.body.topSlugs[0].clicks).toBe(1000);
    });
    
  });
  
  // =============================================================================
  // FULL FLOW INTEGRATION TESTS
  // =============================================================================
  
  describe('Complete Smart Link Creation Flow', () => {
    
    it('should complete full flow: detect → check → create', async () => {
      const originalUrl = 'https://www.amazon.com/Echo-Dot-5th-Gen/dp/B09B8V1LZ3';
      
      // Step 1: Detect pattern
      const detectResponse = await request(app)
        .post('/api/slug/detect-pattern')
        .send({ url: originalUrl })
        .expect(200);
      
      expect(detectResponse.body.matched).toBe(true);
      const suggestedSlug = detectResponse.body.suggestedSlug;
      
      // Step 2: Check availability
      const checkResponse = await request(app)
        .get(`/api/slug/check/${suggestedSlug}`)
        .expect(200);
      
      expect(checkResponse.body.available).toBe(true);
      
      // Step 3: Create URL (assuming authenticated)
      // This would be done via POST /api/urls with the suggested slug
    });
    
    it('should handle collision and use suggestion', async () => {
      // Create first URL
      await Url.create({
        originalUrl: 'https://www.amazon.com/product1',
        shortCode: 'Amazon.Product',
        user: new mongoose.Types.ObjectId()
      });
      
      // Try to use same slug
      const checkResponse = await request(app)
        .get('/api/slug/check/Amazon.Product')
        .expect(200);
      
      expect(checkResponse.body.available).toBe(false);
      expect(checkResponse.body.suggestions.length).toBeGreaterThan(0);
      
      // Use first suggestion
      const suggestion = checkResponse.body.suggestions[0];
      const recheckResponse = await request(app)
        .get(`/api/slug/check/${suggestion.slug}`)
        .expect(200);
      
      expect(recheckResponse.body.available).toBe(true);
    });
    
    it('should handle multiple collisions with sequential numbering', async () => {
      // Create URLs with .2 and .3 already taken
      await Url.create([
        {
          originalUrl: 'https://example.com/1',
          shortCode: 'Example.Product',
          user: new mongoose.Types.ObjectId()
        },
        {
          originalUrl: 'https://example.com/2',
          shortCode: 'Example.Product.2',
          user: new mongoose.Types.ObjectId()
        },
        {
          originalUrl: 'https://example.com/3',
          shortCode: 'Example.Product.3',
          user: new mongoose.Types.ObjectId()
        }
      ]);
      
      const response = await request(app)
        .get('/api/slug/check/Example.Product')
        .expect(200);
      
      // Should suggest .4 or other variants
      const numberedSuggestion = response.body.suggestions.find(s => 
        s.slug === 'Example.Product.4' || s.slug === 'Example.Product.5'
      );
      expect(numberedSuggestion).toBeTruthy();
    });
    
  });
  
  // =============================================================================
  // PERFORMANCE TESTS
  // =============================================================================
  
  describe('Performance & Load Tests', () => {
    
    it('should handle multiple concurrent availability checks', async () => {
      const slugs = Array.from({ length: 10 }, (_, i) => `Test.Slug.${i}`);
      
      const promises = slugs.map(slug =>
        request(app).get(`/api/slug/check/${slug}`)
      );
      
      const results = await Promise.all(promises);
      
      results.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.available).toBe(true);
      });
    });
    
    it('should respond quickly to availability checks (< 500ms)', async () => {
      const start = Date.now();
      
      await request(app)
        .get('/api/slug/check/Performance.Test')
        .expect(200);
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(500);
    });
    
  });
  
  // =============================================================================
  // ERROR HANDLING TESTS
  // =============================================================================
  
  describe('Error Handling & Edge Cases', () => {
    
    it('should handle invalid slug characters gracefully', async () => {
      const response = await request(app)
        .get('/api/slug/check/Invalid@Slug#With$Special%Chars')
        .expect(200);
      
      // Should still process but might not match
      expect(response.body).toHaveProperty('available');
    });
    
    it('should handle very long slugs', async () => {
      const longSlug = 'A'.repeat(100); // Exceeds 50 char limit
      
      const response = await request(app)
        .get(`/api/slug/check/${longSlug}`)
        .expect(200);
      
      expect(response.body).toHaveProperty('available');
    });
    
    it('should handle empty slug', async () => {
      const response = await request(app)
        .get('/api/slug/check/')
        .expect(404); // Route not found
    });
    
    it('should handle invalid pattern detection URL', async () => {
      const response = await request(app)
        .post('/api/slug/detect-pattern')
        .send({ url: 'not-a-valid-url' })
        .expect(500);
      
      expect(response.body.error).toBeTruthy();
    });
    
  });
  
});

