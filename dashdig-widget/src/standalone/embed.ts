/**
 * DashDig Embed Script - Async Bootstrap Loader
 * Minimal loader that users embed on their sites
 * Target: < 5KB gzipped, no external dependencies
 */

// Extend Window interface globally
declare global {
  interface Window {
    Dashdig?: any;
    DashdigQueue?: any[];
    DashdigObject?: string;
  }
}

// Type definitions for the queue system
type DashdigCommand = [string, ...any[]];
type DashdigQueue = DashdigCommand[];

interface DashdigWidget {
  init: (apiKey: string, options?: Record<string, any>) => void;
  track: (event: string, data?: Record<string, any>) => void;
  identify: (userId: string, traits?: Record<string, any>) => void;
  page: (name?: string, properties?: Record<string, any>) => void;
  [key: string]: any;
}

(function () {
  'use strict';

  // Configuration
  const CDN_URL = 'https://cdn.dashdig.com/widget/v1/dashdig.min.js';
  const SCRIPT_ATTR = 'data-dashdig-key';
  const TIMEOUT_MS = 10000; // 10 second timeout for loading

  // Get reference to current script
  const currentScript = document.currentScript as HTMLScriptElement | null;
  
  // Extract API key from script tag
  const apiKey = currentScript?.getAttribute(SCRIPT_ATTR) || '';
  
  if (!apiKey) {
    console.warn('[DashDig] Warning: No API key found. Add data-dashdig-key attribute to the script tag.');
  }

  // Initialize queue if it doesn't exist
  // Using type assertions to bypass strict type checking
  (window as any).DashdigQueue = (window as any).DashdigQueue || [];
  (window as any).DashdigObject = 'Dashdig';

  // Create stub function that queues calls
  const stubFunction = function (...args: any[]): void {
    (window as any).DashdigQueue.push(args as DashdigCommand);
  };

  // Only create stub if Dashdig doesn't already exist
  if (!(window as any).Dashdig) {
    (window as any).Dashdig = stubFunction;
  }

  /**
   * Load the main widget script dynamically
   */
  function loadWidget(): void {
    // Check if already loaded
    if (document.querySelector(`script[src="${CDN_URL}"]`)) {
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = CDN_URL;
    script.crossOrigin = 'anonymous';

    let isTimedOut = false;

    // Set timeout for loading
    const timeoutId = setTimeout(() => {
      isTimedOut = true;
      console.warn('[DashDig] Widget failed to load within timeout period.');
    }, TIMEOUT_MS);

    // Handle successful load
    script.onload = function (): void {
      clearTimeout(timeoutId);
      
      if (isTimedOut) {
        return;
      }

      try {
        processQueue();
        
        // Auto-initialize with API key if available
        if (apiKey && typeof (window as any).Dashdig === 'function') {
          ((window as any).Dashdig as any)('init', apiKey);
        }
      } catch (error) {
        console.warn('[DashDig] Error processing queued commands:', error);
      }
    };

    // Handle load error
    script.onerror = function (): void {
      clearTimeout(timeoutId);
      console.warn('[DashDig] Failed to load widget script from CDN.');
    };

    // Insert script into page
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }

  /**
   * Process all queued function calls
   */
  function processQueue(): void {
    const queue = (window as any).DashdigQueue || [];
    
    if (!(window as any).Dashdig || typeof (window as any).Dashdig !== 'function') {
      console.warn('[DashDig] Widget not properly initialized.');
      return;
    }

    // Process each queued command
    while (queue.length > 0) {
      const args = queue.shift();
      if (args && args.length > 0) {
        try {
          ((window as any).Dashdig as any)(...args);
        } catch (error) {
          console.warn('[DashDig] Error executing queued command:', args[0], error);
        }
      }
    }

    // Replace queue push to execute immediately after loaded
    (window as any).DashdigQueue = {
      push: function (...args: any[]): number {
        try {
          ((window as any).Dashdig as any)(...args);
        } catch (error) {
          console.warn('[DashDig] Error executing command:', args, error);
        }
        return 0;
      }
    } as any;
  }

  /**
   * Add resource hints for faster loading
   * Preconnect to API and CDN domains
   */
  function addResourceHints(): void {
    // Preconnect to DashDig API
    const apiPreconnect = document.createElement('link');
    apiPreconnect.rel = 'preconnect';
    apiPreconnect.href = 'https://api.dashdig.com';
    apiPreconnect.crossOrigin = 'anonymous';
    document.head.appendChild(apiPreconnect);
    
    // DNS prefetch for CDN
    const cdnPrefetch = document.createElement('link');
    cdnPrefetch.rel = 'dns-prefetch';
    cdnPrefetch.href = 'https://cdn.dashdig.com';
    document.head.appendChild(cdnPrefetch);
  }

  /**
   * Initialize loading based on document ready state
   */
  function initLoader(): void {
    // Add resource hints immediately
    if (document.head) {
      addResourceHints();
    }
    
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // DOM is already ready
      setTimeout(loadWidget, 1);
    } else {
      // Wait for DOM to be ready
      if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', loadWidget, false);
        window.addEventListener('load', loadWidget, false);
      } else if ((document as any).attachEvent) {
        // IE8 fallback
        (document as any).attachEvent('onreadystatechange', function (): void {
          if (document.readyState === 'complete') {
            loadWidget();
          }
        });
        (window as any).attachEvent('onload', loadWidget);
      }
    }
  }

  // Start the loader
  initLoader();
})();

