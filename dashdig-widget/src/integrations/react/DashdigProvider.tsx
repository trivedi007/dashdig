/**
 * DashDig Widget - React Provider Component
 * Provides DashDig context to React applications
 * Target: < 5KB gzipped (with hooks)
 * 
 * @file React context provider for DashDig widget
 * @version 1.0.0
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import dashdigInstance from '../../core/url-shortener';
import type { DashdigInitOptions, ShortenOptions, ShortenResponse } from '../../core/url-shortener';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * DashDig context value interface
 */
export interface DashdigContextValue {
  /** Whether the widget is initialized */
  isInitialized: boolean;
  /** Initialize the widget with API key */
  init: (options: DashdigInitOptions) => void;
  /** Shorten a URL */
  shorten: (options: ShortenOptions) => Promise<ShortenResponse>;
  /** Track a custom event */
  track: (event: string, data?: any) => void;
  /** Loading state for async operations */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
}

/**
 * Props for DashdigProvider component
 */
export interface DashdigProviderProps {
  /** API key for auto-initialization */
  apiKey?: string;
  /** Base URL for API (optional) */
  baseUrl?: string;
  /** Child components */
  children: React.ReactNode;
}

// ============================================================================
// Context
// ============================================================================

/**
 * DashDig React Context
 */
const DashdigContext = createContext<DashdigContextValue | undefined>(undefined);

// ============================================================================
// Provider Component
// ============================================================================

/**
 * DashDig Provider Component
 * Wraps your React app to provide DashDig functionality
 * 
 * @param props - Provider props
 * @returns Provider component
 * 
 * @example
 * import { DashdigProvider } from '@dashdig/widget-react';
 * 
 * function App() {
 *   return (
 *     <DashdigProvider apiKey="your-api-key">
 *       <YourApp />
 *     </DashdigProvider>
 *   );
 * }
 */
export const DashdigProvider: React.FC<DashdigProviderProps> = ({
  apiKey,
  baseUrl,
  children
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Initialize widget on mount if apiKey is provided
   */
  useEffect(() => {
    if (apiKey && !isInitialized) {
      try {
        dashdigInstance.init({ apiKey, baseUrl });
        setIsInitialized(true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Initialization failed'));
        setIsInitialized(false);
      }
    }
  }, [apiKey, baseUrl, isInitialized]);

  /**
   * Initialize manually (for cases without apiKey prop)
   */
  const init = useCallback((options: DashdigInitOptions) => {
    try {
      dashdigInstance.init(options);
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Initialization failed'));
      setIsInitialized(false);
      throw err;
    }
  }, []);

  /**
   * Shorten a URL
   */
  const shorten = useCallback(async (options: ShortenOptions): Promise<ShortenResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await dashdigInstance.shorten(options);
      setIsLoading(false);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Shortening failed');
      setError(error);
      setIsLoading(false);
      throw error;
    }
  }, []);

  /**
   * Track an event
   */
  const track = useCallback((event: string, data?: any) => {
    try {
      dashdigInstance.track(event, data);
    } catch (err) {
      console.warn('[DashDig React] Track error:', err);
    }
  }, []);

  const value: DashdigContextValue = {
    isInitialized,
    init,
    shorten,
    track,
    isLoading,
    error
  };

  return (
    <DashdigContext.Provider value={value}>
      {children}
    </DashdigContext.Provider>
  );
};

// ============================================================================
// Hook
// ============================================================================

/**
 * useDashdig Hook
 * Access DashDig functionality in any component
 * 
 * @returns DashDig context value
 * @throws {Error} If used outside DashdigProvider
 * 
 * @example
 * import { useDashdig } from '@dashdig/widget-react';
 * 
 * function MyComponent() {
 *   const { shorten, isLoading, error } = useDashdig();
 * 
 *   const handleClick = async () => {
 *     try {
 *       const result = await shorten({ url: 'https://example.com' });
 *       console.log(result.shortUrl);
 *     } catch (error) {
 *       console.error('Failed to shorten URL:', error);
 *     }
 *   };
 * 
 *   return (
 *     <button onClick={handleClick} disabled={isLoading}>
 *       {isLoading ? 'Shortening...' : 'Shorten URL'}
 *     </button>
 *   );
 * }
 */
export const useDashdig = (): DashdigContextValue => {
  const context = useContext(DashdigContext);

  if (context === undefined) {
    throw new Error('useDashdig must be used within a DashdigProvider');
  }

  return context;
};

export default DashdigProvider;

