/**
 * DashDig URL Shortener Widget - Core Implementation
 * Zero dependencies, vanilla JavaScript URL shortening widget
 * Target: < 2KB gzipped
 * 
 * @file Core widget implementation with init, shorten, and track methods
 * @version 1.0.0
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Configuration options for initializing the DashDig widget
 * @typedef {Object} DashdigInitOptions
 * @property {string} apiKey - Required API key for authentication
 * @property {string} [baseUrl='https://api.dashdig.com'] - Optional base URL for API endpoints
 */
export interface DashdigInitOptions {
  apiKey: string;
  baseUrl?: string;
}

/**
 * Options for shortening a URL
 * @typedef {Object} ShortenOptions
 * @property {string} url - The URL to shorten (required)
 * @property {string} [customSlug] - Optional custom slug for the short URL
 * @property {number} [expiresAt] - Optional expiration timestamp (Unix timestamp in milliseconds)
 */
export interface ShortenOptions {
  url: string;
  customSlug?: string;
  expiresAt?: number;
}

/**
 * Response from URL shortening operation
 * @typedef {Object} ShortenResponse
 * @property {string} shortUrl - The complete shortened URL
 * @property {string} shortCode - Just the short code/slug portion
 * @property {string} originalUrl - The original long URL
 * @property {number} createdAt - Creation timestamp
 */
export interface ShortenResponse {
  shortUrl: string;
  shortCode: string;
  originalUrl: string;
  createdAt: number;
}

/**
 * Widget configuration state
 * @private
 */
interface WidgetConfig {
  apiKey: string | null;
  baseUrl: string;
  initialized: boolean;
}

// ============================================================================
// Widget Class
// ============================================================================

/**
 * DashDig URL Shortener Widget
 * Provides URL shortening and analytics tracking capabilities
 * 
 * @class DashdigURLShortener
 * @example
 * // Auto-init from script tag with data-dashdig-key
 * <script src="https://cdn.dashdig.com/widget/v1/dashdig.min.js" data-dashdig-key="your-api-key"></script>
 * 
 * @example
 * // Manual initialization
 * Dashdig.init({ apiKey: 'your-api-key' });
 * 
 * @example
 * // Shorten a URL
 * const result = await Dashdig.shorten({ url: 'https://example.com/long-url' });
 * console.log(result.shortUrl); // https://dsh.dg/abc123
 */
export class DashdigURLShortener {
  private config: WidgetConfig = {
    apiKey: null,
    baseUrl: 'https://api.dashdig.com',
    initialized: false
  };

  private sessionId: string = this.generateSessionId();
  private eventQueue: Array<{event: string; data: any; timestamp: number}> = [];

  /**
   * Initialize the DashDig widget with configuration
   * 
   * @param {DashdigInitOptions} options - Configuration options
   * @throws {Error} If API key is not provided or invalid
   * 
   * @example
   * Dashdig.init({ apiKey: 'your-api-key-here' });
   * 
   * @example
   * Dashdig.init({ 
   *   apiKey: 'your-api-key-here',
   *   baseUrl: 'https://custom-api.dashdig.com'
   * });
   */
  public init(options: DashdigInitOptions): void {
    // Validate API key
    if (!options || !options.apiKey || typeof options.apiKey !== 'string') {
      throw new Error('[DashDig] API key is required and must be a string');
    }

    if (options.apiKey.trim().length === 0) {
      throw new Error('[DashDig] API key cannot be empty');
    }

    // Set configuration
    this.config.apiKey = options.apiKey.trim();
    
    if (options.baseUrl) {
      // Validate and normalize base URL
      try {
        const url = new URL(options.baseUrl);
        this.config.baseUrl = url.origin;
      } catch (error) {
        console.warn('[DashDig] Invalid baseUrl provided, using default');
      }
    }

    this.config.initialized = true;

    // Track initialization
    this.track('widget_initialized', {
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
    });

    // Log success (only in development)
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      console.log('[DashDig] Widget initialized successfully');
    }
  }

  /**
   * Shorten a URL using the DashDig API
   * 
   * @param {ShortenOptions} options - URL shortening options
   * @returns {Promise<ShortenResponse>} Promise that resolves with shortened URL details
   * @throws {Error} If widget is not initialized
   * @throws {Error} If URL is invalid or missing
   * @throws {Error} If API request fails
   * 
   * @example
   * const result = await Dashdig.shorten({
   *   url: 'https://example.com/very/long/url'
   * });
   * console.log(result.shortUrl); // https://dsh.dg/abc123
   * 
   * @example
   * // With custom slug
   * const result = await Dashdig.shorten({
   *   url: 'https://example.com/product',
   *   customSlug: 'my-product',
   *   expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // Expires in 7 days
   * });
   */
  public async shorten(options: ShortenOptions): Promise<ShortenResponse> {
    // Check if initialized
    if (!this.config.initialized || !this.config.apiKey) {
      throw new Error('[DashDig] Widget not initialized. Call Dashdig.init() first.');
    }

    // Validate URL
    if (!options || !options.url || typeof options.url !== 'string') {
      throw new Error('[DashDig] URL is required and must be a string');
    }

    const urlToShorten = options.url.trim();
    
    if (urlToShorten.length === 0) {
      throw new Error('[DashDig] URL cannot be empty');
    }

    // Validate URL format
    try {
      new URL(urlToShorten);
    } catch (error) {
      throw new Error('[DashDig] Invalid URL format. Please provide a valid HTTP(S) URL.');
    }

    // Prepare request payload
    const payload: any = {
      url: urlToShorten
    };

    if (options.customSlug) {
      // Validate custom slug (alphanumeric, dash, underscore only)
      if (!/^[a-zA-Z0-9_-]+$/.test(options.customSlug)) {
        throw new Error('[DashDig] Custom slug can only contain letters, numbers, dashes, and underscores');
      }
      payload.customSlug = options.customSlug;
    }

    if (options.expiresAt) {
      // Validate expiration timestamp
      if (typeof options.expiresAt !== 'number' || options.expiresAt <= Date.now()) {
        throw new Error('[DashDig] expiresAt must be a future timestamp');
      }
      payload.expiresAt = options.expiresAt;
    }

    // Make API request
    try {
      const response = await this.makeRequest<any>('/api/shorten', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      // Track successful shortening
      this.track('url_shortened', {
        shortCode: response.shortCode,
        hasCustomSlug: !!options.customSlug,
        hasExpiration: !!options.expiresAt
      });

      return {
        shortUrl: response.shortUrl,
        shortCode: response.shortCode,
        originalUrl: response.originalUrl || urlToShorten,
        createdAt: response.createdAt || Date.now()
      };
    } catch (error: any) {
      // Track error
      this.track('shorten_error', {
        error: error.message,
        url: urlToShorten
      });

      throw error;
    }
  }

  /**
   * Track a custom event with optional data
   * Events are queued and sent asynchronously to avoid blocking
   * 
   * @param {string} event - Event name
   * @param {any} [data] - Optional event data
   * 
   * @example
   * Dashdig.track('button_clicked', { buttonId: 'signup' });
   * 
   * @example
   * Dashdig.track('page_view');
   */
  public track(event: string, data?: any): void {
    if (!event || typeof event !== 'string' || event.trim().length === 0) {
      console.warn('[DashDig] Event name must be a non-empty string');
      return;
    }

    // Add to event queue
    this.eventQueue.push({
      event: event.trim(),
      data: data || {},
      timestamp: Date.now()
    });

    // Send events asynchronously (debounced)
    this.sendEvents();
  }

  /**
   * Make an HTTP request to the DashDig API
   * @private
   */
  private async makeRequest<T>(endpoint: string, options: RequestInit): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-DashDig-SDK': 'widget-js/1.0.0',
          ...(options.headers || {})
        }
      });

      // Handle response
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        
        switch (response.status) {
          case 400:
            throw new Error(`Validation Error: ${errorData.message || 'Invalid request'}`);
          case 401:
            throw new Error('Invalid API key. Please check your configuration.');
          case 403:
            throw new Error('Access denied. Please check your API key permissions.');
          case 404:
            throw new Error('API endpoint not found.');
          case 429:
            throw new Error('Rate limit exceeded. Please try again later.');
          case 500:
          case 502:
          case 503:
          case 504:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(errorData.message || `Request failed with status ${response.status}`);
        }
      }

      return await response.json();
    } catch (error: any) {
      // Handle network errors
      if (error.name === 'TypeError' || error.message?.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }

      // Re-throw other errors
      throw error;
    }
  }

  /**
   * Send queued events to the API
   * @private
   */
  private sendEventsTimeout: any = null;
  private async sendEvents(): Promise<void> {
    // Debounce sending (wait 500ms after last track() call)
    if (this.sendEventsTimeout) {
      clearTimeout(this.sendEventsTimeout);
    }

    this.sendEventsTimeout = setTimeout(async () => {
      if (this.eventQueue.length === 0 || !this.config.initialized) {
        return;
      }

      const events = [...this.eventQueue];
      this.eventQueue = [];

      try {
        await fetch(`${this.config.baseUrl}/api/analytics`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          },
          body: JSON.stringify({
            events,
            sessionId: this.sessionId,
            metadata: {
              url: typeof window !== 'undefined' ? window.location.href : undefined,
              referrer: typeof document !== 'undefined' ? document.referrer : undefined,
              userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
            }
          })
        });
      } catch (error) {
        // Silently fail analytics - don't interrupt user experience
        if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
          console.warn('[DashDig] Failed to send analytics:', error);
        }
        
        // Re-queue events for retry
        this.eventQueue.unshift(...events);
      }
    }, 500);
  }

  /**
   * Generate a unique session ID
   * @private
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Check if widget is initialized
   * @returns {boolean} True if widget is initialized
   */
  public isInitialized(): boolean {
    return this.config.initialized;
  }

  /**
   * Get current configuration (without exposing API key)
   * @returns {object} Safe configuration object
   */
  public getConfig(): { baseUrl: string; initialized: boolean } {
    return {
      baseUrl: this.config.baseUrl,
      initialized: this.config.initialized
    };
  }
}

/**
 * Create and export singleton instance
 */
const dashdigInstance = new DashdigURLShortener();

export default dashdigInstance;

