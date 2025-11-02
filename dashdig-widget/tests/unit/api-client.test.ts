/**
 * Unit Tests for DashdigAPIClient
 * Tests API calls, retry logic, timeout handling, error responses, and network failures
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import DashdigAPIClient, {
  NetworkError,
  APIError,
  ValidationError,
  type TrackEventResponse,
  type ShortenUrlResponse,
  type AnalyticsResponse
} from '../../src/core/api-client';

describe('DashdigAPIClient', () => {
  let client: DashdigAPIClient;
  let fetchMock: any;

  beforeEach(() => {
    // Mock fetch
    fetchMock = vi.fn();
    global.fetch = fetchMock;

    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true
    });

    // Reset client
    client = new DashdigAPIClient('test-api-key');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should create client with API key', () => {
      expect(() => {
        new DashdigAPIClient('test-key');
      }).not.toThrow();
    });

    it('should throw ValidationError when API key is empty', () => {
      expect(() => {
        new DashdigAPIClient('');
      }).toThrow(ValidationError);
      
      expect(() => {
        new DashdigAPIClient('');
      }).toThrow('API key is required');
    });

    it('should throw ValidationError when API key is whitespace', () => {
      expect(() => {
        new DashdigAPIClient('   ');
      }).toThrow(ValidationError);
    });

    it('should use default API URL', () => {
      const client = new DashdigAPIClient('test-key');
      expect(client.getApiUrl()).toBe('https://api.dashdig.com');
    });

    it('should accept custom API URL', () => {
      const client = new DashdigAPIClient('test-key', 'https://custom.api.com');
      expect(client.getApiUrl()).toBe('https://custom.api.com');
    });

    it('should remove trailing slash from API URL', () => {
      const client = new DashdigAPIClient('test-key', 'https://custom.api.com/');
      expect(client.getApiUrl()).toBe('https://custom.api.com');
    });

    it('should confirm API key presence', () => {
      const client = new DashdigAPIClient('test-key');
      expect(client.hasApiKey()).toBe(true);
    });
  });

  describe('sendEvent', () => {
    it('should send event successfully', async () => {
      const mockResponse: TrackEventResponse = {
        success: true,
        eventId: 'evt_123',
        timestamp: Date.now()
      };

      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await client.sendEvent('button_click', { buttonId: 'signup' });

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.dashdig.com/api/track',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-api-key',
            'X-DashDig-SDK': 'widget-js',
            'X-DashDig-Version': '1.0.0'
          })
        })
      );
    });

    it('should include event data in request', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true, eventId: 'evt_123', timestamp: Date.now() })
      });

      await client.sendEvent('page_view', { page: '/home', referrer: 'google' });

      const callArgs = fetchMock.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);

      expect(body.event).toBe('page_view');
      expect(body.data).toEqual({ page: '/home', referrer: 'google' });
      expect(body.timestamp).toBeDefined();
    });

    it('should throw ValidationError when event name is empty', async () => {
      await expect(client.sendEvent('')).rejects.toThrow(ValidationError);
      await expect(client.sendEvent('')).rejects.toThrow('Event name is required');
    });

    it('should throw ValidationError when event name is whitespace', async () => {
      await expect(client.sendEvent('   ')).rejects.toThrow(ValidationError);
    });

    it('should trim event name', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true, eventId: 'evt_123', timestamp: Date.now() })
      });

      await client.sendEvent('  button_click  ');

      const callArgs = fetchMock.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);

      expect(body.event).toBe('button_click');
    });
  });

  describe('getShortUrl', () => {
    it('should shorten URL successfully', async () => {
      const mockResponse: ShortenUrlResponse = {
        success: true,
        shortCode: 'abc123',
        shortUrl: 'https://dsh.dg/abc123',
        originalUrl: 'https://example.com/long/url',
        createdAt: Date.now()
      };

      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await client.getShortUrl('https://example.com/long/url');

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.dashdig.com/api/shorten',
        expect.objectContaining({
          method: 'POST'
        })
      );
    });

    it('should include custom code when provided', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          success: true,
          shortCode: 'custom',
          shortUrl: 'https://dsh.dg/custom',
          originalUrl: 'https://example.com',
          createdAt: Date.now()
        })
      });

      await client.getShortUrl('https://example.com', 'custom');

      const callArgs = fetchMock.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);

      expect(body.customCode).toBe('custom');
    });

    it('should throw ValidationError when URL is empty', async () => {
      await expect(client.getShortUrl('')).rejects.toThrow(ValidationError);
      await expect(client.getShortUrl('')).rejects.toThrow('URL is required');
    });

    it('should throw ValidationError when URL format is invalid', async () => {
      await expect(client.getShortUrl('not-a-url')).rejects.toThrow(ValidationError);
      await expect(client.getShortUrl('not-a-url')).rejects.toThrow('Invalid URL format');
    });

    it('should accept valid URLs', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          success: true,
          shortCode: 'abc',
          shortUrl: 'https://dsh.dg/abc',
          originalUrl: 'https://example.com',
          createdAt: Date.now()
        })
      });

      await expect(client.getShortUrl('https://example.com')).resolves.toBeDefined();
      await expect(client.getShortUrl('http://example.com')).resolves.toBeDefined();
    });
  });

  describe('getAnalytics', () => {
    it('should fetch analytics successfully', async () => {
      const mockResponse: AnalyticsResponse = {
        success: true,
        data: {
          shortCode: 'abc123',
          originalUrl: 'https://example.com',
          clicks: 100,
          uniqueVisitors: 75,
          lastClickAt: Date.now(),
          createdAt: Date.now() - 86400000,
          expiresAt: null,
          referrers: { 'google.com': 50, 'twitter.com': 25 },
          countries: { 'US': 60, 'GB': 20 },
          devices: { 'mobile': 60, 'desktop': 40 },
          browsers: { 'chrome': 70, 'firefox': 30 }
        }
      };

      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await client.getAnalytics('abc123');

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.dashdig.com/api/analytics/abc123',
        expect.objectContaining({
          method: 'GET'
        })
      );
    });

    it('should throw ValidationError when short code is empty', async () => {
      await expect(client.getAnalytics('')).rejects.toThrow(ValidationError);
      await expect(client.getAnalytics('')).rejects.toThrow('Short code is required');
    });

    it('should throw ValidationError for invalid short code format', async () => {
      await expect(client.getAnalytics('abc@123')).rejects.toThrow(ValidationError);
      await expect(client.getAnalytics('abc@123')).rejects.toThrow('Invalid short code format');
    });

    it('should accept valid short code formats', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          success: true,
          data: {
            shortCode: 'abc123',
            originalUrl: 'https://example.com',
            clicks: 0,
            uniqueVisitors: 0,
            lastClickAt: null,
            createdAt: Date.now(),
            expiresAt: null,
            referrers: {},
            countries: {},
            devices: {},
            browsers: {}
          }
        })
      });

      await expect(client.getAnalytics('abc123')).resolves.toBeDefined();
      await expect(client.getAnalytics('abc-123')).resolves.toBeDefined();
      await expect(client.getAnalytics('abc_123')).resolves.toBeDefined();
    });

    it('should URL encode short code', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          success: true,
          data: {} as any
        })
      });

      await client.getAnalytics('abc-123');

      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.dashdig.com/api/analytics/abc-123',
        expect.any(Object)
      );
    });
  });

  describe('Retry Logic', () => {
    it('should retry on 5xx server errors', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ message: 'Internal Server Error' })
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 503,
          json: () => Promise.resolve({ message: 'Service Unavailable' })
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ success: true, eventId: 'evt_123', timestamp: Date.now() })
        });

      const result = await client.sendEvent('test_event');

      expect(result.success).toBe(true);
      expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it('should retry on timeout', async () => {
      vi.useFakeTimers();

      fetchMock
        .mockImplementationOnce(() => new Promise(() => {})) // Never resolves (timeout)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ success: true, eventId: 'evt_123', timestamp: Date.now() })
        });

      const promise = client.sendEvent('test_event');

      // Advance timers to trigger timeout
      vi.advanceTimersByTime(10000);
      await Promise.resolve();

      // Advance timers for retry delay
      vi.advanceTimersByTime(1000);
      await Promise.resolve();

      const result = await promise;

      expect(result.success).toBe(true);
      expect(fetchMock).toHaveBeenCalledTimes(2);

      vi.useRealTimers();
    });

    it('should retry on network errors', async () => {
      fetchMock
        .mockRejectedValueOnce(new TypeError('Failed to fetch'))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ success: true, eventId: 'evt_123', timestamp: Date.now() })
        });

      const result = await client.sendEvent('test_event');

      expect(result.success).toBe(true);
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('should fail after max retry attempts', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Internal Server Error' })
      });

      await expect(client.sendEvent('test_event')).rejects.toThrow(APIError);
      expect(fetchMock).toHaveBeenCalledTimes(3); // Max 3 attempts
    });

    it('should use exponential backoff delays', async () => {
      vi.useFakeTimers();

      fetchMock
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: () => Promise.resolve({})
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: () => Promise.resolve({})
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ success: true, eventId: 'evt_123', timestamp: Date.now() })
        });

      const promise = client.sendEvent('test_event');

      // First attempt fails immediately
      await Promise.resolve();

      // First retry after 1s
      vi.advanceTimersByTime(1000);
      await Promise.resolve();

      // Second retry after 2s
      vi.advanceTimersByTime(2000);
      await Promise.resolve();

      await promise;

      expect(fetchMock).toHaveBeenCalledTimes(3);

      vi.useRealTimers();
    });
  });

  describe('Error Handling', () => {
    it('should throw NetworkError when offline', async () => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false
      });

      await expect(client.sendEvent('test')).rejects.toThrow(NetworkError);
      await expect(client.sendEvent('test')).rejects.toThrow('Network is offline');
    });

    it('should throw ValidationError on 400 Bad Request', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({
          message: 'Validation failed',
          fields: { url: 'Invalid URL' }
        })
      });

      await expect(client.sendEvent('test')).rejects.toThrow(ValidationError);
    });

    it('should throw APIError on 401 Unauthorized', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: 'Invalid API key' })
      });

      await expect(client.sendEvent('test')).rejects.toThrow(APIError);
      await expect(client.sendEvent('test')).rejects.toThrow('Unauthorized - Invalid API key');
    });

    it('should throw APIError on 403 Forbidden', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 403,
        json: () => Promise.resolve({ message: 'Access denied' })
      });

      await expect(client.sendEvent('test')).rejects.toThrow(APIError);
      await expect(client.sendEvent('test')).rejects.toThrow('Forbidden - Access denied');
    });

    it('should throw APIError on 404 Not Found', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Not found' })
      });

      await expect(client.getAnalytics('nonexistent')).rejects.toThrow(APIError);
      await expect(client.getAnalytics('nonexistent')).rejects.toThrow('Resource not found');
    });

    it('should throw APIError on 429 Rate Limit', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 429,
        json: () => Promise.resolve({ message: 'Too many requests' })
      });

      await expect(client.sendEvent('test')).rejects.toThrow(APIError);
      await expect(client.sendEvent('test')).rejects.toThrow('Rate limit exceeded');
    });

    it('should not retry on 4xx client errors', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: 'Bad request' })
      });

      await expect(client.sendEvent('test')).rejects.toThrow();
      expect(fetchMock).toHaveBeenCalledTimes(1); // No retries
    });

    it('should include error response data', async () => {
      const errorData = { message: 'Custom error', code: 'ERR_001' };

      fetchMock.mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve(errorData)
      });

      try {
        await client.sendEvent('test');
        expect.fail('Should have thrown');
      } catch (error: any) {
        expect(error).toBeInstanceOf(APIError);
        expect(error.response).toEqual(errorData);
        expect(error.statusCode).toBe(401);
      }
    });
  });

  describe('Timeout Handling', () => {
    it('should timeout after 10 seconds', async () => {
      vi.useFakeTimers();

      fetchMock.mockImplementation(() => new Promise(() => {})); // Never resolves

      const promise = client.sendEvent('test');

      vi.advanceTimersByTime(10000);
      await Promise.resolve();

      // Should retry
      vi.advanceTimersByTime(1000);
      await Promise.resolve();

      vi.advanceTimersByTime(10000);
      await Promise.resolve();

      vi.advanceTimersByTime(2000);
      await Promise.resolve();

      vi.advanceTimersByTime(10000);
      await Promise.resolve();

      await expect(promise).rejects.toThrow(NetworkError);
      await expect(promise).rejects.toThrow('Request timeout');

      vi.useRealTimers();
    });

    it('should abort request on timeout', async () => {
      vi.useFakeTimers();

      const abortSpy = vi.fn();
      fetchMock.mockImplementation((url, options) => {
        options.signal.addEventListener('abort', abortSpy);
        return new Promise(() => {});
      });

      const promise = client.sendEvent('test');

      vi.advanceTimersByTime(10000);
      await Promise.resolve();

      expect(abortSpy).toHaveBeenCalled();

      vi.useRealTimers();
    });
  });

  describe('testConnection', () => {
    it('should return true on successful connection', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true })
      });

      const result = await client.testConnection();

      expect(result).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.dashdig.com/api/health',
        expect.objectContaining({
          method: 'GET'
        })
      );
    });

    it('should throw error on connection failure', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({})
      });

      await expect(client.testConnection()).rejects.toThrow();
    });
  });

  describe('Custom Error Classes', () => {
    it('should create NetworkError with status code', () => {
      const error = new NetworkError('Connection failed', 0);
      
      expect(error).toBeInstanceOf(NetworkError);
      expect(error.message).toBe('Connection failed');
      expect(error.name).toBe('NetworkError');
      expect(error.statusCode).toBe(0);
    });

    it('should create APIError with response data', () => {
      const response = { code: 'ERR_001', details: 'Error details' };
      const error = new APIError('API error', 500, response);
      
      expect(error).toBeInstanceOf(APIError);
      expect(error.message).toBe('API error');
      expect(error.name).toBe('APIError');
      expect(error.statusCode).toBe(500);
      expect(error.response).toEqual(response);
    });

    it('should create ValidationError with field errors', () => {
      const fields = { email: 'Invalid email', url: 'Invalid URL' };
      const error = new ValidationError('Validation failed', fields);
      
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toBe('Validation failed');
      expect(error.name).toBe('ValidationError');
      expect(error.statusCode).toBe(400);
      expect(error.fields).toEqual(fields);
    });
  });
});
