/**
 * Unit tests for DashDig URL Shortener Core
 * Tests initialization, URL shortening, and tracking
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { DashdigURLShortener } from '../../src/core/url-shortener';

describe('DashdigURLShortener', () => {
  let shortener: DashdigURLShortener;

  beforeEach(() => {
    shortener = new DashdigURLShortener();
    // Mock fetch
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ============================================================================
  // Initialization Tests
  // ============================================================================

  describe('init()', () => {
    it('should initialize with valid API key', () => {
      expect(() => {
        shortener.init({ apiKey: 'test-api-key' });
      }).not.toThrow();

      expect(shortener.isInitialized()).toBe(true);
    });

    it('should throw error when API key is missing', () => {
      expect(() => {
        shortener.init({} as any);
      }).toThrow('[DashDig] API key is required');
    });

    it('should throw error when API key is empty string', () => {
      expect(() => {
        shortener.init({ apiKey: '   ' });
      }).toThrow('[DashDig] API key cannot be empty');
    });

    it('should throw error when API key is not a string', () => {
      expect(() => {
        shortener.init({ apiKey: 123 as any });
      }).toThrow('[DashDig] API key is required and must be a string');
    });

    it('should use default base URL if not provided', () => {
      shortener.init({ apiKey: 'test-key' });
      const config = shortener.getConfig();
      expect(config.baseUrl).toBe('https://api.dashdig.com');
    });

    it('should use custom base URL if provided', () => {
      shortener.init({
        apiKey: 'test-key',
        baseUrl: 'https://custom.api.com'
      });
      const config = shortener.getConfig();
      expect(config.baseUrl).toBe('https://custom.api.com');
    });

    it('should normalize base URL (remove trailing slash)', () => {
      shortener.init({
        apiKey: 'test-key',
        baseUrl: 'https://custom.api.com/'
      });
      const config = shortener.getConfig();
      expect(config.baseUrl).toBe('https://custom.api.com');
    });
  });

  // ============================================================================
  // URL Shortening Tests
  // ============================================================================

  describe('shorten()', () => {
    beforeEach(() => {
      shortener.init({ apiKey: 'test-api-key' });
    });

    it('should throw error if not initialized', async () => {
      const uninitializedShortener = new DashdigURLShortener();
      
      await expect(
        uninitializedShortener.shorten({ url: 'https://example.com' })
      ).rejects.toThrow('[DashDig] Widget not initialized');
    });

    it('should throw error if URL is missing', async () => {
      await expect(
        shortener.shorten({} as any)
      ).rejects.toThrow('[DashDig] URL is required');
    });

    it('should throw error if URL is empty', async () => {
      await expect(
        shortener.shorten({ url: '   ' })
      ).rejects.toThrow('[DashDig] URL cannot be empty');
    });

    it('should throw error if URL format is invalid', async () => {
      await expect(
        shortener.shorten({ url: 'not-a-valid-url' })
      ).rejects.toThrow('[DashDig] Invalid URL format');
    });

    it('should successfully shorten a valid URL', async () => {
      const mockResponse = {
        shortUrl: 'https://dsh.dg/abc123',
        shortCode: 'abc123',
        originalUrl: 'https://example.com',
        createdAt: Date.now()
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await shortener.shorten({ url: 'https://example.com' });

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.dashdig.com/api/shorten',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-api-key'
          }),
          body: JSON.stringify({ url: 'https://example.com' })
        })
      );
    });

    it('should send custom slug if provided', async () => {
      const mockResponse = {
        shortUrl: 'https://dsh.dg/my-custom-slug',
        shortCode: 'my-custom-slug',
        originalUrl: 'https://example.com',
        createdAt: Date.now()
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await shortener.shorten({
        url: 'https://example.com',
        customSlug: 'my-custom-slug'
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.dashdig.com/api/shorten',
        expect.objectContaining({
          body: JSON.stringify({
            url: 'https://example.com',
            customSlug: 'my-custom-slug'
          })
        })
      );
    });

    it('should throw error for invalid custom slug format', async () => {
      await expect(
        shortener.shorten({
          url: 'https://example.com',
          customSlug: 'invalid slug with spaces'
        })
      ).rejects.toThrow('[DashDig] Custom slug can only contain');
    });

    it('should send expiration if provided', async () => {
      const futureTime = Date.now() + 86400000; // 24 hours from now
      const mockResponse = {
        shortUrl: 'https://dsh.dg/abc123',
        shortCode: 'abc123',
        originalUrl: 'https://example.com',
        createdAt: Date.now()
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await shortener.shorten({
        url: 'https://example.com',
        expiresAt: futureTime
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.dashdig.com/api/shorten',
        expect.objectContaining({
          body: JSON.stringify({
            url: 'https://example.com',
            expiresAt: futureTime
          })
        })
      );
    });

    it('should throw error for past expiration timestamp', async () => {
      const pastTime = Date.now() - 1000;

      await expect(
        shortener.shorten({
          url: 'https://example.com',
          expiresAt: pastTime
        })
      ).rejects.toThrow('[DashDig] expiresAt must be a future timestamp');
    });

    // Error handling tests
    it('should handle 401 Unauthorized error', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid API key' })
      });

      await expect(
        shortener.shorten({ url: 'https://example.com' })
      ).rejects.toThrow('Invalid API key');
    });

    it('should handle 400 Validation error', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'URL is required' })
      });

      await expect(
        shortener.shorten({ url: 'https://example.com' })
      ).rejects.toThrow('Validation Error');
    });

    it('should handle 429 Rate limit error', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({ message: 'Rate limit exceeded' })
      });

      await expect(
        shortener.shorten({ url: 'https://example.com' })
      ).rejects.toThrow('Rate limit exceeded');
    });

    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(
        new TypeError('Failed to fetch')
      );

      await expect(
        shortener.shorten({ url: 'https://example.com' })
      ).rejects.toThrow('Network error');
    });
  });

  // ============================================================================
  // Tracking Tests
  // ============================================================================

  describe('track()', () => {
    it('should track event without initialization (queued)', () => {
      expect(() => {
        shortener.track('test_event', { key: 'value' });
      }).not.toThrow();
    });

    it('should track event with no data', () => {
      expect(() => {
        shortener.track('test_event');
      }).not.toThrow();
    });

    it('should warn for invalid event name', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      shortener.track('', { data: 'test' });
      expect(consoleSpy).toHaveBeenCalledWith(
        '[DashDig] Event name must be a non-empty string'
      );

      consoleSpy.mockRestore();
    });
  });

  // ============================================================================
  // Utility Method Tests
  // ============================================================================

  describe('isInitialized()', () => {
    it('should return false before initialization', () => {
      expect(shortener.isInitialized()).toBe(false);
    });

    it('should return true after initialization', () => {
      shortener.init({ apiKey: 'test-key' });
      expect(shortener.isInitialized()).toBe(true);
    });
  });

  describe('getConfig()', () => {
    it('should return safe config without exposing API key', () => {
      shortener.init({ apiKey: 'secret-key' });
      const config = shortener.getConfig();

      expect(config).toHaveProperty('baseUrl');
      expect(config).toHaveProperty('initialized');
      expect(config).not.toHaveProperty('apiKey');
    });
  });
});

