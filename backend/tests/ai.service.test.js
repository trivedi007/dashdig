const AIService = require('../src/services/ai.service');

describe('AIService', () => {
  let aiService;

  beforeAll(() => {
    aiService = AIService;
  });

  describe('generateHumanReadableUrl', () => {
    test('generates human-readable URL from keywords', async () => {
      const url = 'https://amazon.com/gillette-razor-12pack';
      const keywords = ['razor', 'gift', 'mike'];
      
      const result = await aiService.generateHumanReadableUrl(url, keywords);
      
      expect(result).toBeTruthy();
      expect(result).toMatch(/^[a-z0-9.]+$/);
      expect(result.split('.').length).toBeGreaterThanOrEqual(1);
      expect(result.split('.').length).toBeLessThanOrEqual(5);
    });

    test('generates URL without keywords', async () => {
      const url = 'https://example.com/product';
      
      const result = await aiService.generateHumanReadableUrl(url, []);
      
      expect(result).toBeTruthy();
      expect(result).toMatch(/^[a-z0-9.]+$/);
    });

    test('handles invalid URLs gracefully', async () => {
      const url = 'not-a-valid-url';
      
      const result = await aiService.generateHumanReadableUrl(url, []);
      
      expect(result).toBeTruthy();
      expect(result).toMatch(/^[a-z0-9.]+$/);
    });
  });

  describe('sanitizeSlug', () => {
    test('converts to lowercase', () => {
      const slug = 'HELLO.WORLD';
      const result = aiService.sanitizeSlug(slug);
      
      expect(result).toBe('hello.world');
    });

    test('removes special characters', () => {
      const slug = 'hello@world#test';
      const result = aiService.sanitizeSlug(slug);
      
      expect(result).toBe('helloworldtest');
    });

    test('handles multiple dots', () => {
      const slug = 'hello...world';
      const result = aiService.sanitizeSlug(slug);
      
      expect(result).toBe('hello.world');
    });

    test('removes leading and trailing dots', () => {
      const slug = '.hello.world.';
      const result = aiService.sanitizeSlug(slug);
      
      expect(result).toBe('hello.world');
    });

    test('truncates long slugs', () => {
      const slug = 'a'.repeat(100);
      const result = aiService.sanitizeSlug(slug);
      
      expect(result.length).toBeLessThanOrEqual(50);
    });
  });

  describe('generateFallbackUrl', () => {
    test('uses keywords when provided', () => {
      const keywords = ['test', 'product', 'demo'];
      const url = 'https://example.com';
      
      const result = aiService.generateFallbackUrl(keywords, url);
      
      expect(result).toBe('test.product.demo');
    });

    test('generates from domain when no keywords', () => {
      const keywords = [];
      const url = 'https://example.com/path';
      
      const result = aiService.generateFallbackUrl(keywords, url);
      
      expect(result).toBeTruthy();
      expect(result).toMatch(/^[a-z0-9.]+$/);
    });

    test('handles brand-specific URLs (Hoka)', () => {
      const keywords = [];
      const url = 'https://www.hoka.com/en/us/mens-running-shoes/bondi-8/1123202.html';
      
      const result = aiService.generateFallbackUrl(keywords, url);
      
      expect(result).toContain('hoka');
    });

    test('handles retailer URLs (Amazon)', () => {
      const keywords = [];
      const url = 'https://www.amazon.com/Apple-AirPods-Pro/dp/B09JQMJHXY';
      
      const result = aiService.generateFallbackUrl(keywords, url);
      
      expect(result).toContain('amazon');
    });
  });

  describe('fetchMetadata', () => {
    test('returns metadata object structure', async () => {
      const url = 'https://example.com';
      
      const result = await aiService.fetchMetadata(url);
      
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('description');
      expect(typeof result.title).toBe('string');
      expect(typeof result.description).toBe('string');
    });

    test('handles fetch errors gracefully', async () => {
      const url = 'https://invalid-domain-that-does-not-exist-12345.com';
      
      const result = await aiService.fetchMetadata(url);
      
      expect(result).toEqual({ title: '', description: '' });
    });
  });
});
