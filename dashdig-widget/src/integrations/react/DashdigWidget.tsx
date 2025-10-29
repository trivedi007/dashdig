/**
 * DashDig Widget - React Component
 * Embeddable analytics widget as a React component
 */

import { useEffect, useRef } from 'react';
import DashdigWidget from '../../core/widget';
import type { DashdigConfig } from '../../core/widget';

/**
 * Props for the DashdigWidget React component
 */
export interface DashdigWidgetProps {
  /** API key for authentication (required) */
  apiKey: string;
  /** Widget position on screen */
  position?: 'bottom-right' | 'bottom-left';
  /** Widget theme */
  theme?: 'light' | 'dark';
  /** Auto-show widget on mount */
  autoShow?: boolean;
  /** Callback fired when widget successfully loads */
  onLoad?: () => void;
  /** Callback fired when widget encounters an error */
  onError?: (error: Error) => void;
}

/**
 * DashDig Widget React Component
 * 
 * Renders an analytics widget that tracks user interactions.
 * The widget is appended to document.body and managed through Shadow DOM.
 * 
 * @param props - Component props
 * @returns null (widget renders outside React tree)
 * 
 * @example
 * ```tsx
 * import { DashdigWidget } from '@dashdig/widget/react';
 * 
 * function App() {
 *   return (
 *     <DashdigWidget
 *       apiKey="your-api-key"
 *       position="bottom-right"
 *       theme="light"
 *       autoShow={true}
 *       onLoad={() => console.log('Widget loaded')}
 *       onError={(error) => console.error('Widget error:', error)}
 *     />
 *   );
 * }
 * ```
 */
export const DashdigReactWidget: React.FC<DashdigWidgetProps> = ({
  apiKey,
  position,
  theme,
  autoShow,
  onLoad,
  onError
}) => {
  // Store widget instance reference
  const widgetRef = useRef<DashdigWidget | null>(null);

  useEffect(() => {
    // Initialize widget
    try {
      // Create widget configuration
      const config: DashdigConfig = {
        apiKey,
        position,
        theme,
        autoShow
      };

      // Instantiate widget
      widgetRef.current = new DashdigWidget(config);

      // Call onLoad callback if provided
      if (onLoad) {
        onLoad();
      }
    } catch (error) {
      // Call onError callback if provided
      if (onError && error instanceof Error) {
        onError(error);
      } else {
        console.error('[DashDig React] Widget initialization error:', error);
      }
    }

    // Cleanup function - destroy widget on unmount
    return () => {
      if (widgetRef.current) {
        try {
          widgetRef.current.destroy();
          widgetRef.current = null;
        } catch (error) {
          console.error('[DashDig React] Widget cleanup error:', error);
        }
      }
    };
  }, [apiKey, position, theme, autoShow, onLoad, onError]);

  // Widget renders outside React tree (appends to body)
  return null;
};

// Set display name for debugging
DashdigReactWidget.displayName = 'DashdigWidget';

export default DashdigReactWidget;

