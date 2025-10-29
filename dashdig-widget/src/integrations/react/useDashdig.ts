/**
 * DashDig Widget - React Hook
 * Custom hook for programmatic widget control
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import DashdigWidget from '../../core/widget';
import type { DashdigConfig } from '../../core/widget';

/**
 * Options for useDashdig hook
 */
export interface UseDashdigOptions {
  /** Widget position on screen */
  position?: 'bottom-right' | 'bottom-left';
  /** Widget theme */
  theme?: 'light' | 'dark';
  /** Auto-show widget on mount */
  autoShow?: boolean;
  /** API URL override */
  apiUrl?: string;
}

/**
 * Return type for useDashdig hook
 */
export interface UseDashdigReturn {
  /** Show the widget */
  show: () => void;
  /** Hide the widget */
  hide: () => void;
  /** Track an event */
  track: (event: string, data?: Record<string, any>) => void;
  /** Whether the widget is loaded and ready */
  isLoaded: boolean;
  /** Current visibility state */
  isVisible: boolean;
  /** Widget instance (for advanced usage) */
  widget: DashdigWidget | null;
}

/**
 * Custom React hook for DashDig widget
 * 
 * Provides programmatic control over the DashDig widget.
 * Automatically initializes and cleans up the widget.
 * 
 * @param apiKey - API key for authentication
 * @param options - Optional configuration
 * @returns Object with widget control methods and state
 * 
 * @example
 * ```tsx
 * import { useDashdig } from '@dashdig/widget/react';
 * 
 * function App() {
 *   const { show, hide, track, isLoaded } = useDashdig('your-api-key', {
 *     position: 'bottom-right',
 *     theme: 'dark',
 *     autoShow: false
 *   });
 * 
 *   return (
 *     <div>
 *       <button onClick={show}>Show Widget</button>
 *       <button onClick={hide}>Hide Widget</button>
 *       <button onClick={() => track('button_click', { button: 'example' })}>
 *         Track Event
 *       </button>
 *       {isLoaded && <p>Widget loaded!</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useDashdig(
  apiKey: string,
  options?: UseDashdigOptions
): UseDashdigReturn {
  // Store widget instance reference
  const widgetRef = useRef<DashdigWidget | null>(null);

  // Track loading state
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Track visibility state
  const [isVisible, setIsVisible] = useState<boolean>(
    options?.autoShow !== undefined ? options.autoShow : true
  );

  // Initialize widget
  useEffect(() => {
    // Don't initialize if no API key
    if (!apiKey) {
      console.warn('[DashDig React Hook] API key is required');
      return;
    }

    try {
      // Create widget configuration
      const config: DashdigConfig = {
        apiKey,
        position: options?.position,
        theme: options?.theme,
        autoShow: options?.autoShow,
        apiUrl: options?.apiUrl
      };

      // Instantiate widget
      widgetRef.current = new DashdigWidget(config);
      setIsLoaded(true);
      
      // Set initial visibility state
      if (widgetRef.current.isShown()) {
        setIsVisible(true);
      }
    } catch (error) {
      console.error('[DashDig React Hook] Widget initialization error:', error);
      setIsLoaded(false);
    }

    // Cleanup function - destroy widget on unmount
    return () => {
      if (widgetRef.current) {
        try {
          widgetRef.current.destroy();
          widgetRef.current = null;
          setIsLoaded(false);
          setIsVisible(false);
        } catch (error) {
          console.error('[DashDig React Hook] Widget cleanup error:', error);
        }
      }
    };
  }, [apiKey, options?.position, options?.theme, options?.autoShow, options?.apiUrl]);

  /**
   * Show the widget
   */
  const show = useCallback(() => {
    if (widgetRef.current) {
      try {
        widgetRef.current.show();
        setIsVisible(true);
      } catch (error) {
        console.error('[DashDig React Hook] Error showing widget:', error);
      }
    } else {
      console.warn('[DashDig React Hook] Widget not initialized');
    }
  }, []);

  /**
   * Hide the widget
   */
  const hide = useCallback(() => {
    if (widgetRef.current) {
      try {
        widgetRef.current.hide();
        setIsVisible(false);
      } catch (error) {
        console.error('[DashDig React Hook] Error hiding widget:', error);
      }
    } else {
      console.warn('[DashDig React Hook] Widget not initialized');
    }
  }, []);

  /**
   * Track an event
   */
  const track = useCallback((event: string, data?: Record<string, any>) => {
    if (widgetRef.current) {
      try {
        widgetRef.current.track(event, data);
      } catch (error) {
        console.error('[DashDig React Hook] Error tracking event:', error);
      }
    } else {
      console.warn('[DashDig React Hook] Widget not initialized');
    }
  }, []);

  return {
    show,
    hide,
    track,
    isLoaded,
    isVisible,
    widget: widgetRef.current
  };
}

export default useDashdig;


