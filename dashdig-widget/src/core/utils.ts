/**
 * DashDig Utility Functions
 * Pure utility functions with no side effects
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Browser information
 */
export interface BrowserInfo {
  name: string;
  version: string;
}

/**
 * Device type
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * Debounced function type
 */
export type DebouncedFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
};

/**
 * Throttled function type
 */
export type ThrottledFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
};

// ============================================================================
// ID Generation
// ============================================================================

/**
 * Generate a unique identifier
 * Uses crypto.randomUUID if available, otherwise falls back to Math.random with timestamp
 * 
 * @returns A unique identifier string
 * 
 * @example
 * ```typescript
 * const id = generateId();
 * console.log(id); // "550e8400-e29b-41d4-a716-446655440000" or "1234567890-abc123def"
 * ```
 */
export function generateId(): string {
  // Try to use crypto.randomUUID (modern browsers)
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback: timestamp + random string
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 15);
  const randomPart2 = Math.random().toString(36).substring(2, 15);
  
  return `${timestamp}-${randomPart}${randomPart2}`;
}

// ============================================================================
// Function Utilities
// ============================================================================

/**
 * Create a debounced version of a function that delays execution
 * The function will only be called after it stops being called for the specified delay
 * 
 * @param fn - The function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function with cancel method
 * 
 * @example
 * ```typescript
 * const search = (query: string) => console.log('Searching:', query);
 * const debouncedSearch = debounce(search, 300);
 * 
 * debouncedSearch('a');
 * debouncedSearch('ab');
 * debouncedSearch('abc'); // Only this will execute after 300ms
 * 
 * // Cancel pending execution
 * debouncedSearch.cancel();
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debounced = function (this: any, ...args: Parameters<T>): void {
    // Clear existing timeout
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Set new timeout
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  } as DebouncedFunction<T>;

  // Add cancel method
  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}

/**
 * Create a throttled version of a function that limits execution frequency
 * The function will execute at most once per specified delay period
 * 
 * @param fn - The function to throttle
 * @param delay - Minimum delay between executions in milliseconds
 * @returns Throttled function with cancel method
 * 
 * @example
 * ```typescript
 * const handleScroll = () => console.log('Scrolling');
 * const throttledScroll = throttle(handleScroll, 200);
 * 
 * window.addEventListener('scroll', throttledScroll);
 * // Will execute at most once every 200ms
 * 
 * // Cancel pending execution
 * throttledScroll.cancel();
 * ```
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ThrottledFunction<T> {
  let lastExecutionTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;

  const execute = function (): void {
    if (lastArgs !== null) {
      fn.apply(lastThis, lastArgs);
      lastExecutionTime = Date.now();
      lastArgs = null;
      lastThis = null;
      timeoutId = null;
    }
  };

  const throttled = function (this: any, ...args: Parameters<T>): void {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecutionTime;

    lastArgs = args;
    lastThis = this;

    if (timeSinceLastExecution >= delay) {
      // Execute immediately
      execute();
    } else if (timeoutId === null) {
      // Schedule execution
      const remainingTime = delay - timeSinceLastExecution;
      timeoutId = setTimeout(execute, remainingTime);
    }
  } as ThrottledFunction<T>;

  // Add cancel method
  throttled.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastArgs = null;
    lastThis = null;
  };

  return throttled;
}

// ============================================================================
// String Utilities
// ============================================================================

/**
 * Sanitize HTML string to prevent XSS attacks
 * Escapes angle brackets, quotes, and ampersands
 * 
 * @param html - HTML string to sanitize
 * @returns Sanitized string safe for display
 * 
 * @example
 * ```typescript
 * const unsafe = '<script>alert("XSS")</script>';
 * const safe = sanitizeHtml(unsafe);
 * console.log(safe); // "&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;"
 * ```
 */
export function sanitizeHtml(html: string): string {
  if (typeof html !== 'string') {
    return '';
  }

  const replacements: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };

  return html.replace(/[&<>"'/]/g, (char) => replacements[char] || char);
}

// ============================================================================
// Date Utilities
// ============================================================================

/**
 * Format a Date object to human-readable string
 * Returns format like "January 15, 2024"
 * 
 * @param date - Date object to format
 * @returns Formatted date string
 * 
 * @example
 * ```typescript
 * const date = new Date('2024-01-15');
 * const formatted = formatDate(date);
 * console.log(formatted); // "January 15, 2024"
 * ```
 */
export function formatDate(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Validate API key format
 * Checks if key is non-empty and contains only alphanumeric characters and hyphens
 * 
 * @param key - API key string to validate
 * @returns True if valid, false otherwise
 * 
 * @example
 * ```typescript
 * validateApiKey('abc123-def456'); // true
 * validateApiKey('invalid key!'); // false
 * validateApiKey(''); // false
 * ```
 */
export function validateApiKey(key: string): boolean {
  if (typeof key !== 'string' || key.trim().length === 0) {
    return false;
  }

  // Check format: alphanumeric with hyphens and underscores
  // Minimum length of 8 characters for security
  const apiKeyRegex = /^[a-zA-Z0-9_-]{8,}$/;
  return apiKeyRegex.test(key);
}

// ============================================================================
// Browser Detection
// ============================================================================

/**
 * Get browser information from user agent
 * Detects browser type and version
 * 
 * @returns Object with browser name and version
 * 
 * @example
 * ```typescript
 * const browser = getBrowserInfo();
 * console.log(browser); // { name: "Chrome", version: "120.0.0" }
 * ```
 */
export function getBrowserInfo(): BrowserInfo {
  if (typeof navigator === 'undefined' || !navigator.userAgent) {
    return { name: 'Unknown', version: '0.0.0' };
  }

  const ua = navigator.userAgent;
  let name = 'Unknown';
  let version = '0.0.0';

  // Edge (Chromium-based)
  if (ua.includes('Edg/')) {
    name = 'Edge';
    const match = ua.match(/Edg\/(\d+(\.\d+)*)/);
    version = match && match[1] ? match[1] : version;
  }
  // Chrome
  else if (ua.includes('Chrome/') && !ua.includes('Edg/')) {
    name = 'Chrome';
    const match = ua.match(/Chrome\/(\d+(\.\d+)*)/);
    version = match && match[1] ? match[1] : version;
  }
  // Safari
  else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
    name = 'Safari';
    const match = ua.match(/Version\/(\d+(\.\d+)*)/);
    version = match && match[1] ? match[1] : version;
  }
  // Firefox
  else if (ua.includes('Firefox/')) {
    name = 'Firefox';
    const match = ua.match(/Firefox\/(\d+(\.\d+)*)/);
    version = match && match[1] ? match[1] : version;
  }
  // Opera
  else if (ua.includes('OPR/') || ua.includes('Opera/')) {
    name = 'Opera';
    const match = ua.match(/(?:OPR|Opera)\/(\d+(\.\d+)*)/);
    version = match && match[1] ? match[1] : version;
  }
  // Internet Explorer
  else if (ua.includes('Trident/') || ua.includes('MSIE ')) {
    name = 'Internet Explorer';
    const match = ua.match(/(?:MSIE |rv:)(\d+(\.\d+)*)/);
    version = match && match[1] ? match[1] : version;
  }

  return { name, version };
}

/**
 * Detect device type from screen width and user agent
 * Returns 'mobile', 'tablet', or 'desktop'
 * 
 * @returns Device type string
 * 
 * @example
 * ```typescript
 * const device = getDeviceType();
 * console.log(device); // "desktop" or "mobile" or "tablet"
 * ```
 */
export function getDeviceType(): DeviceType {
  // Server-side or no window object
  if (typeof window === 'undefined') {
    return 'desktop';
  }

  const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';

  // Check user agent first for more accurate detection
  const mobileRegex = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const tabletRegex = /iPad|Android(?!.*Mobile)/i;

  if (tabletRegex.test(ua)) {
    return 'tablet';
  }

  if (mobileRegex.test(ua)) {
    return 'mobile';
  }

  // Fallback to screen width detection
  if (width <= 768) {
    return 'mobile';
  } else if (width <= 1024) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

// ============================================================================
// Additional Utility Functions
// ============================================================================

/**
 * Deep clone an object using structured clone or JSON fallback
 * 
 * @param obj - Object to clone
 * @returns Cloned object
 * 
 * @example
 * ```typescript
 * const original = { a: 1, b: { c: 2 } };
 * const cloned = deepClone(original);
 * cloned.b.c = 3;
 * console.log(original.b.c); // 2 (unchanged)
 * ```
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Use structuredClone if available (modern browsers)
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(obj);
    } catch {
      // Fall through to JSON method
    }
  }

  // Fallback to JSON method (loses functions, dates become strings)
  try {
    return JSON.parse(JSON.stringify(obj)) as T;
  } catch {
    return obj;
  }
}

/**
 * Check if code is running in browser environment
 * 
 * @returns True if in browser, false if in Node.js or other environment
 * 
 * @example
 * ```typescript
 * if (isBrowser()) {
 *   window.addEventListener('load', handler);
 * }
 * ```
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Safely parse JSON with fallback value
 * 
 * @param jsonString - JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed object or fallback value
 * 
 * @example
 * ```typescript
 * const data = safeJsonParse('{"key": "value"}', {});
 * const invalid = safeJsonParse('invalid json', { default: true });
 * ```
 */
export function safeJsonParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return fallback;
  }
}

/**
 * Get query parameter from URL
 * 
 * @param name - Parameter name
 * @param url - URL string (defaults to current location)
 * @returns Parameter value or null
 * 
 * @example
 * ```typescript
 * const utm = getQueryParam('utm_source');
 * console.log(utm); // "google" or null
 * ```
 */
export function getQueryParam(name: string, url?: string): string | null {
  if (!isBrowser() && !url) {
    return null;
  }

  const urlString = url || window.location.href;
  
  try {
    const urlObj = new URL(urlString);
    return urlObj.searchParams.get(name);
  } catch {
    return null;
  }
}

/**
 * Truncate string to specified length with ellipsis
 * 
 * @param str - String to truncate
 * @param maxLength - Maximum length
 * @returns Truncated string
 * 
 * @example
 * ```typescript
 * truncate('Hello World', 8); // "Hello..."
 * truncate('Short', 10); // "Short"
 * ```
 */
export function truncate(str: string, maxLength: number): string {
  if (typeof str !== 'string') {
    return '';
  }

  if (str.length <= maxLength) {
    return str;
  }

  return str.substring(0, maxLength - 3) + '...';
}

