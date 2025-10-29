/**
 * DashDig API Client
 * Handles all API communication with retry logic, timeout handling, and error management
 */

// ============================================================================
// Custom Error Classes
// ============================================================================

/**
 * Network error for connection issues
 */
export class NetworkError extends Error {
  public readonly statusCode: number;
  
  constructor(message: string, statusCode: number = 0) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * API error for server-side errors
 */
export class APIError extends Error {
  public readonly statusCode: number;
  public readonly response?: any;
  
  constructor(message: string, statusCode: number, response?: any) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.response = response;
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

/**
 * Validation error for client-side validation failures
 */
export class ValidationError extends Error {
  public readonly statusCode: number;
  public readonly fields?: Record<string, string>;
  
  constructor(message: string, fields?: Record<string, string>) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.fields = fields;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Event data structure for tracking
 */
export interface EventData {
  event: string;
  data?: Record<string, any>;
  timestamp?: number;
  sessionId?: string;
  metadata?: Record<string, any>;
}

/**
 * Event tracking request
 */
export interface TrackEventRequest {
  event: string;
  data?: Record<string, any>;
  url?: string;
  referrer?: string;
  userAgent?: string;
  timestamp: number;
}

/**
 * Event tracking response
 */
export interface TrackEventResponse {
  success: boolean;
  eventId: string;
  timestamp: number;
}

/**
 * URL shortening request
 */
export interface ShortenUrlRequest {
  url: string;
  customCode?: string;
  expiresAt?: number;
  metadata?: Record<string, any>;
}

/**
 * URL shortening response
 */
export interface ShortenUrlResponse {
  success: boolean;
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  createdAt: number;
}

/**
 * Analytics data for a short URL
 */
export interface AnalyticsData {
  shortCode: string;
  originalUrl: string;
  clicks: number;
  uniqueVisitors: number;
  lastClickAt: number | null;
  createdAt: number;
  expiresAt: number | null;
  referrers: Record<string, number>;
  countries: Record<string, number>;
  devices: Record<string, number>;
  browsers: Record<string, number>;
}

/**
 * Analytics response
 */
export interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
}

/**
 * Retry configuration
 */
interface RetryConfig {
  maxAttempts: number;
  delays: number[];
}

// ============================================================================
// API Client Class
// ============================================================================

/**
 * DashDig API Client
 * Provides methods to interact with the DashDig API with automatic retry and error handling
 */
export default class DashdigAPIClient {
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly timeout: number = 10000; // 10 seconds
  private readonly retryConfig: RetryConfig = {
    maxAttempts: 3,
    delays: [1000, 2000, 4000] // Exponential backoff: 1s, 2s, 4s
  };

  /**
   * Create a new DashDig API client
   * @param apiKey - API key for authentication
   * @param apiUrl - Base URL for the API (default: https://api.dashdig.com)
   */
  constructor(apiKey: string, apiUrl: string = 'https://api.dashdig.com') {
    if (!apiKey || apiKey.trim().length === 0) {
      throw new ValidationError('API key is required');
    }

    this.apiKey = apiKey;
    this.apiUrl = apiUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  /**
   * Build request headers with authentication
   * @returns Headers object with Content-Type and Authorization
   * @private
   */
  private buildHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'X-DashDig-SDK': 'widget-js',
      'X-DashDig-Version': '1.0.0'
    };
  }

  /**
   * Make HTTP request with retry logic and timeout handling
   * @param endpoint - API endpoint path
   * @param options - Fetch options
   * @param attempt - Current attempt number (for retry logic)
   * @returns Promise with response data
   * @private
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit,
    attempt: number = 1
  ): Promise<T> {
    // Check if browser is offline
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new NetworkError('Network is offline', 0);
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = `${this.apiUrl}${endpoint}`;
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...this.buildHeaders(),
          ...options.headers
        }
      });

      clearTimeout(timeoutId);

      // Handle different status codes
      if (response.ok) {
        // Success (2xx)
        const data = await response.json();
        return data as T;
      } else if (response.status >= 400 && response.status < 500) {
        // Client errors (4xx) - don't retry
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 400) {
          throw new ValidationError(
            errorData.message || 'Validation failed',
            errorData.fields
          );
        } else if (response.status === 401) {
          throw new APIError('Unauthorized - Invalid API key', 401, errorData);
        } else if (response.status === 403) {
          throw new APIError('Forbidden - Access denied', 403, errorData);
        } else if (response.status === 404) {
          throw new APIError('Resource not found', 404, errorData);
        } else if (response.status === 429) {
          throw new APIError('Rate limit exceeded', 429, errorData);
        } else {
          throw new APIError(
            errorData.message || `Client error: ${response.status}`,
            response.status,
            errorData
          );
        }
      } else {
        // Server errors (5xx) - retry if attempts remaining
        const errorData = await response.json().catch(() => ({}));
        
        if (attempt < this.retryConfig.maxAttempts) {
          // Retry with exponential backoff
          const delay = this.retryConfig.delays[attempt - 1] || 4000;
          await this.sleep(delay);
          return this.makeRequest<T>(endpoint, options, attempt + 1);
        } else {
          throw new APIError(
            errorData.message || `Server error: ${response.status}`,
            response.status,
            errorData
          );
        }
      }
    } catch (error: any) {
      clearTimeout(timeoutId);

      // Handle abort/timeout
      if (error.name === 'AbortError') {
        if (attempt < this.retryConfig.maxAttempts) {
          const delay = this.retryConfig.delays[attempt - 1] || 4000;
          await this.sleep(delay);
          return this.makeRequest<T>(endpoint, options, attempt + 1);
        } else {
          throw new NetworkError('Request timeout', 408);
        }
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        if (attempt < this.retryConfig.maxAttempts) {
          const delay = this.retryConfig.delays[attempt - 1] || 4000;
          await this.sleep(delay);
          return this.makeRequest<T>(endpoint, options, attempt + 1);
        } else {
          throw new NetworkError('Network request failed', 0);
        }
      }

      // Re-throw custom errors
      if (error instanceof NetworkError || 
          error instanceof APIError || 
          error instanceof ValidationError) {
        throw error;
      }

      // Unknown error
      throw new NetworkError(`Unknown error: ${error.message}`, 0);
    }
  }

  /**
   * Sleep utility for retry delays
   * @param ms - Milliseconds to sleep
   * @private
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Send tracking event to the API
   * @param event - Event name
   * @param data - Event data object
   * @returns Promise with tracking response
   * @throws {ValidationError} If event name is invalid
   * @throws {NetworkError} If network request fails
   * @throws {APIError} If API returns an error
   * 
   * @example
   * ```typescript
   * const client = new DashdigAPIClient('your-api-key');
   * await client.sendEvent('button_click', { buttonId: 'signup' });
   * ```
   */
  public async sendEvent(
    event: string,
    data?: Record<string, any>
  ): Promise<TrackEventResponse> {
    // Validate event name
    if (!event || event.trim().length === 0) {
      throw new ValidationError('Event name is required');
    }

    const payload: TrackEventRequest = {
      event: event.trim(),
      data: data || {},
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      timestamp: Date.now()
    };

    return this.makeRequest<TrackEventResponse>('/api/track', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  /**
   * Shorten a URL using the DashDig API
   * @param url - Original URL to shorten
   * @param customCode - Optional custom short code
   * @param expiresAt - Optional expiration timestamp
   * @param metadata - Optional metadata object
   * @returns Promise with shortened URL details
   * @throws {ValidationError} If URL is invalid
   * @throws {NetworkError} If network request fails
   * @throws {APIError} If API returns an error
   * 
   * @example
   * ```typescript
   * const client = new DashdigAPIClient('your-api-key');
   * const result = await client.getShortUrl('https://example.com/very/long/url');
   * console.log(result.shortUrl); // https://dsh.dg/abc123
   * ```
   */
  public async getShortUrl(
    url: string,
    customCode?: string,
    expiresAt?: number,
    metadata?: Record<string, any>
  ): Promise<ShortenUrlResponse> {
    // Validate URL
    if (!url || url.trim().length === 0) {
      throw new ValidationError('URL is required');
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      throw new ValidationError('Invalid URL format');
    }

    const payload: ShortenUrlRequest = {
      url: url.trim(),
      customCode,
      expiresAt,
      metadata
    };

    return this.makeRequest<ShortenUrlResponse>('/api/shorten', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  /**
   * Get analytics data for a shortened URL
   * @param shortCode - The short code to get analytics for
   * @returns Promise with analytics data
   * @throws {ValidationError} If short code is invalid
   * @throws {NetworkError} If network request fails
   * @throws {APIError} If API returns an error (including 404 for non-existent codes)
   * 
   * @example
   * ```typescript
   * const client = new DashdigAPIClient('your-api-key');
   * const analytics = await client.getAnalytics('abc123');
   * console.log(`Total clicks: ${analytics.data.clicks}`);
   * ```
   */
  public async getAnalytics(shortCode: string): Promise<AnalyticsResponse> {
    // Validate short code
    if (!shortCode || shortCode.trim().length === 0) {
      throw new ValidationError('Short code is required');
    }

    // Validate short code format (alphanumeric, dash, underscore)
    if (!/^[a-zA-Z0-9_-]+$/.test(shortCode)) {
      throw new ValidationError('Invalid short code format');
    }

    return this.makeRequest<AnalyticsResponse>(
      `/api/analytics/${encodeURIComponent(shortCode.trim())}`,
      {
        method: 'GET'
      }
    );
  }

  /**
   * Test API connection and authentication
   * @returns Promise that resolves if connection is successful
   * @throws {NetworkError} If network request fails
   * @throws {APIError} If API returns an error
   * 
   * @example
   * ```typescript
   * const client = new DashdigAPIClient('your-api-key');
   * try {
   *   await client.testConnection();
   *   console.log('Connected successfully!');
   * } catch (error) {
   *   console.error('Connection failed:', error.message);
   * }
   * ```
   */
  public async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest<{ success: boolean }>('/api/health', {
        method: 'GET'
      });
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get the current API URL
   * @returns The base API URL
   */
  public getApiUrl(): string {
    return this.apiUrl;
  }

  /**
   * Check if the client has a valid API key
   * @returns True if API key is present
   */
  public hasApiKey(): boolean {
    return this.apiKey.length > 0;
  }
}


