/**
 * Performance Monitoring and Optimization Utilities
 * 
 * Provides Web Vitals tracking, debouncing, throttling, and other
 * performance optimization utilities for the DashDig widget.
 */

/**
 * Web Vitals Metrics Interface
 */
export interface WebVitalsMetrics {
  /** Largest Contentful Paint (target: < 2.5s) */
  LCP?: number;
  /** First Input Delay (target: < 100ms) */
  FID?: number;
  /** Cumulative Layout Shift (target: < 0.1) */
  CLS?: number;
  /** Time to First Byte (target: < 800ms) */
  TTFB?: number;
  /** First Contentful Paint */
  FCP?: number;
}

/**
 * Performance observer callback type
 */
type PerformanceCallback = (entry: PerformanceEntry) => void;

/**
 * Debounce function execution
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function execution
 * @param func - Function to throttle
 * @param limit - Minimum time between executions in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Execute callback when browser is idle
 * Falls back to setTimeout if requestIdleCallback is not available
 * @param callback - Function to execute
 * @param options - Idle callback options
 */
export function onIdle(
  callback: () => void,
  options?: { timeout?: number }
): void {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback, options);
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(callback, options?.timeout || 1);
  }
}

/**
 * Measure and report Largest Contentful Paint (LCP)
 * Target: < 2.5 seconds for good experience
 */
export function measureLCP(callback: (value: number) => void): void {
  try {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        
        if (lastEntry && lastEntry.renderTime) {
          callback(lastEntry.renderTime);
        } else if (lastEntry && lastEntry.loadTime) {
          callback(lastEntry.loadTime);
        }
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    }
  } catch (error) {
    console.warn('[DashDig Performance] LCP measurement failed:', error);
  }
}

/**
 * Measure and report First Input Delay (FID)
 * Target: < 100ms for good experience
 */
export function measureFID(callback: (value: number) => void): void {
  try {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry: any) => {
          if (entry.processingStart && entry.startTime) {
            const fid = entry.processingStart - entry.startTime;
            callback(fid);
          }
        });
      });

      observer.observe({ type: 'first-input', buffered: true });
    }
  } catch (error) {
    console.warn('[DashDig Performance] FID measurement failed:', error);
  }
}

/**
 * Measure and report Cumulative Layout Shift (CLS)
 * Target: < 0.1 for good experience
 */
export function measureCLS(callback: (value: number) => void): void {
  try {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            callback(clsValue);
          }
        });
      });

      observer.observe({ type: 'layout-shift', buffered: true });
    }
  } catch (error) {
    console.warn('[DashDig Performance] CLS measurement failed:', error);
  }
}

/**
 * Measure and report Time to First Byte (TTFB)
 * Target: < 800ms for good experience
 */
export function measureTTFB(callback: (value: number) => void): void {
  try {
    if ('performance' in window && 'timing' in performance) {
      const timing = performance.timing as any;
      
      // Wait for timing data to be available
      onIdle(() => {
        const ttfb = timing.responseStart - timing.requestStart;
        if (ttfb > 0) {
          callback(ttfb);
        }
      });
    } else if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry: any) => {
          if (entry.responseStart) {
            callback(entry.responseStart);
          }
        });
      });

      observer.observe({ type: 'navigation', buffered: true });
    }
  } catch (error) {
    console.warn('[DashDig Performance] TTFB measurement failed:', error);
  }
}

/**
 * Measure and report First Contentful Paint (FCP)
 * Target: < 1.8s for good experience
 */
export function measureFCP(callback: (value: number) => void): void {
  try {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            callback(entry.startTime);
          }
        });
      });

      observer.observe({ type: 'paint', buffered: true });
    }
  } catch (error) {
    console.warn('[DashDig Performance] FCP measurement failed:', error);
  }
}

/**
 * Collect all Web Vitals metrics
 * @param callback - Function called with collected metrics
 */
export function collectWebVitals(
  callback: (metrics: WebVitalsMetrics) => void
): void {
  const metrics: WebVitalsMetrics = {};
  let metricsCollected = 0;
  const expectedMetrics = 5;

  const checkComplete = () => {
    metricsCollected++;
    if (metricsCollected >= expectedMetrics) {
      callback(metrics);
    }
  };

  // Measure LCP
  measureLCP((value) => {
    metrics.LCP = value;
    checkComplete();
  });

  // Measure FID
  measureFID((value) => {
    metrics.FID = value;
    checkComplete();
  });

  // Measure CLS
  measureCLS((value) => {
    metrics.CLS = value;
    checkComplete();
  });

  // Measure TTFB
  measureTTFB((value) => {
    metrics.TTFB = value;
    checkComplete();
  });

  // Measure FCP
  measureFCP((value) => {
    metrics.FCP = value;
    checkComplete();
  });

  // Fallback: send metrics after 10 seconds even if not all are collected
  setTimeout(() => {
    callback(metrics);
  }, 10000);
}

/**
 * Send Web Vitals metrics to analytics endpoint
 * @param apiUrl - API endpoint URL
 * @param apiKey - API key for authentication
 * @param metrics - Web Vitals metrics
 */
export async function reportWebVitals(
  apiUrl: string,
  apiKey: string,
  metrics: WebVitalsMetrics
): Promise<void> {
  try {
    const data = {
      type: 'web-vitals',
      metrics,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Use sendBeacon for reliability (works even when page is unloading)
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      navigator.sendBeacon(`${apiUrl}/v1/performance`, blob);
    } else {
      // Fallback to fetch
      await fetch(`${apiUrl}/v1/performance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-DashDig-API-Key': apiKey
        },
        body: JSON.stringify(data),
        keepalive: true
      });
    }
  } catch (error) {
    console.warn('[DashDig Performance] Failed to report Web Vitals:', error);
  }
}

/**
 * Create Intersection Observer for lazy loading
 * @param callback - Function called when element is visible
 * @param options - Intersection observer options
 * @returns Intersection observer instance or null
 */
export function createIntersectionObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
): IntersectionObserver | null {
  if ('IntersectionObserver' in window) {
    return new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry);
        }
      });
    }, options);
  }
  return null;
}

/**
 * Preload resource
 * @param href - Resource URL
 * @param as - Resource type
 */
export function preloadResource(href: string, as: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Add DNS prefetch
 * @param domain - Domain to prefetch
 */
export function dnsPrefetch(domain: string): void {
  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = domain;
  document.head.appendChild(link);
}

/**
 * Add preconnect
 * @param domain - Domain to preconnect
 * @param crossorigin - Whether to use crossorigin
 */
export function preconnect(domain: string, crossorigin = false): void {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = domain;
  if (crossorigin) {
    link.crossOrigin = 'anonymous';
  }
  document.head.appendChild(link);
}

/**
 * Get performance score
 * @param metrics - Web Vitals metrics
 * @returns Performance score (0-100)
 */
export function getPerformanceScore(metrics: WebVitalsMetrics): number {
  let score = 100;

  // LCP scoring (target: < 2.5s)
  if (metrics.LCP) {
    if (metrics.LCP > 4000) score -= 30;
    else if (metrics.LCP > 2500) score -= 15;
  }

  // FID scoring (target: < 100ms)
  if (metrics.FID) {
    if (metrics.FID > 300) score -= 30;
    else if (metrics.FID > 100) score -= 15;
  }

  // CLS scoring (target: < 0.1)
  if (metrics.CLS) {
    if (metrics.CLS > 0.25) score -= 20;
    else if (metrics.CLS > 0.1) score -= 10;
  }

  // TTFB scoring (target: < 800ms)
  if (metrics.TTFB) {
    if (metrics.TTFB > 1800) score -= 10;
    else if (metrics.TTFB > 800) score -= 5;
  }

  // FCP scoring (target: < 1.8s)
  if (metrics.FCP) {
    if (metrics.FCP > 3000) score -= 10;
    else if (metrics.FCP > 1800) score -= 5;
  }

  return Math.max(0, score);
}

