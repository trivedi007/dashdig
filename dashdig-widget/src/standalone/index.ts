/**
 * DashDig Widget - Standalone/Embed Entry Point
 * Auto-initializes from script tag with data-dashdig-key attribute
 * Exposes global Dashdig API for manual usage
 * Target: < 2KB gzipped
 * 
 * @file Main entry point for vanilla JavaScript usage
 * @version 1.0.0
 */

import dashdigInstance from '../core/url-shortener';
import type { DashdigInitOptions, ShortenOptions, ShortenResponse } from '../core/url-shortener';

// ============================================================================
// Global Type Definitions
// ============================================================================

declare global {
  interface Window {
    Dashdig: DashdigAPI;
  }
}

/**
 * Public API interface
 */
interface DashdigAPI {
  /**
   * Initialize the widget
   * @param options - Configuration options with API key
   */
  init(options: DashdigInitOptions): void;

  /**
   * Shorten a URL
   * @param options - URL and optional customization options
   * @returns Promise with shortened URL details
   */
  shorten(options: ShortenOptions): Promise<ShortenResponse>;

  /**
   * Track a custom event
   * @param event - Event name
   * @param data - Optional event data
   */
  track(event: string, data?: any): void;

  /**
   * Check if initialized
   * @returns True if widget is initialized
   */
  isInitialized(): boolean;
}

// ============================================================================
// Auto-Initialization Logic
// ============================================================================

/**
 * Auto-initialize from script tag if data-dashdig-key attribute is present
 * 
 * @example
 * <script src="https://cdn.dashdig.com/widget/v1/dashdig.min.js" data-dashdig-key="your-api-key"></script>
 */
function autoInit(): void {
  try {
    // Get the current script element
    const scripts = document.getElementsByTagName('script');
    let apiKey: string | null = null;

    // Search for script with data-dashdig-key attribute
    for (let i = 0; i < scripts.length; i++) {
      const script = scripts[i];
      const key = script.getAttribute('data-dashdig-key');
      
      if (key) {
        apiKey = key;
        break;
      }
    }

    // If API key found, auto-initialize
    if (apiKey) {
      dashdigInstance.init({ apiKey });
      
      if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
        console.log('[DashDig] Auto-initialized from script tag');
      }
    }
  } catch (error) {
    console.warn('[DashDig] Auto-initialization failed:', error);
  }
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Create the public API object
 * This is what users interact with via window.Dashdig
 */
const DashdigAPI: DashdigAPI = {
  /**
   * Initialize the DashDig widget
   * 
   * @param options - Configuration with API key
   * @throws {Error} If API key is invalid
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
  init(options: DashdigInitOptions): void {
    dashdigInstance.init(options);
  },

  /**
   * Shorten a URL
   * 
   * @param options - URL shortening options
   * @returns Promise with shortened URL details
   * @throws {Error} If widget is not initialized or URL is invalid
   * 
   * @example
   * // Basic usage
   * const result = await Dashdig.shorten({
   *   url: 'https://example.com/very/long/url'
   * });
   * console.log(result.shortUrl);
   * 
   * @example
   * // With custom slug and expiration
   * const result = await Dashdig.shorten({
   *   url: 'https://example.com/product',
   *   customSlug: 'my-product',
   *   expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)
   * });
   */
  async shorten(options: ShortenOptions): Promise<ShortenResponse> {
    return await dashdigInstance.shorten(options);
  },

  /**
   * Track a custom event with optional data
   * 
   * @param event - Event name
   * @param data - Optional event data
   * 
   * @example
   * Dashdig.track('button_clicked', { buttonId: 'cta-signup' });
   * 
   * @example
   * Dashdig.track('page_view');
   */
  track(event: string, data?: any): void {
    dashdigInstance.track(event, data);
  },

  /**
   * Check if the widget is initialized
   * 
   * @returns True if initialized with a valid API key
   * 
   * @example
   * if (Dashdig.isInitialized()) {
   *   const result = await Dashdig.shorten({ url: 'https://example.com' });
   * } else {
   *   console.log('Please initialize first');
   * }
   */
  isInitialized(): boolean {
    return dashdigInstance.isInitialized();
  }
};

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initialize when DOM is ready
 */
if (typeof window !== 'undefined') {
  // Expose API globally
  window.Dashdig = DashdigAPI;

  // Auto-initialize if script tag has data-dashdig-key
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    // DOM already loaded
    autoInit();
  }
}

// ============================================================================
// Exports
// ============================================================================

// Export for module usage (TypeScript/ES6)
export default DashdigAPI;
export { DashdigAPI as Dashdig };
export type { DashdigInitOptions, ShortenOptions, ShortenResponse };
