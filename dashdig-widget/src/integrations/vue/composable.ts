/**
 * DashDig Widget - Vue 3 Composable
 * Composition API hook for programmatic widget control
 */

import { ref, onMounted, onUnmounted, readonly } from 'vue';
import type { Ref } from 'vue';
import DashdigWidget from '../../core/widget';
import type { DashdigConfig } from '../../core/widget';

/**
 * Options for useDashdig composable
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
 * Return type for useDashdig composable
 */
export interface UseDashdigReturn {
  /** Show the widget */
  show: () => void;
  /** Hide the widget */
  hide: () => void;
  /** Track an event */
  track: (event: string, data?: Record<string, any>) => void;
  /** Whether the widget is loaded and ready */
  isLoaded: Readonly<Ref<boolean>>;
  /** Current visibility state */
  isVisible: Readonly<Ref<boolean>>;
  /** Widget instance (for advanced usage) */
  widget: Readonly<Ref<DashdigWidget | null>>;
}

/**
 * Vue 3 composable for DashDig widget
 * 
 * Provides programmatic control over the DashDig widget using Composition API.
 * Automatically initializes and cleans up the widget.
 * 
 * @param apiKey - API key for authentication
 * @param options - Optional configuration
 * @returns Object with widget control methods and reactive state
 * 
 * @example
 * ```vue
 * <script setup>
 * import { useDashdig } from '@dashdig/widget/vue';
 * 
 * const { show, hide, track, isLoaded } = useDashdig('your-api-key', {
 *   position: 'bottom-right',
 *   theme: 'dark',
 *   autoShow: false
 * });
 * </script>
 * 
 * <template>
 *   <button @click="show">Show Widget</button>
 *   <button @click="hide">Hide Widget</button>
 *   <button @click="track('button_click', { button: 'example' })">
 *     Track Event
 *   </button>
 *   <p v-if="isLoaded">Widget loaded!</p>
 * </template>
 * ```
 */
export function useDashdig(
  apiKey: string,
  options?: UseDashdigOptions
): UseDashdigReturn {
  // Widget instance reference
  const widget = ref<DashdigWidget | null>(null);

  // Reactive state
  const isLoaded = ref<boolean>(false);
  const isVisible = ref<boolean>(
    options?.autoShow !== undefined ? options.autoShow : true
  );

  /**
   * Show the widget
   */
  const show = (): void => {
    if (widget.value) {
      try {
        widget.value.show();
        isVisible.value = true;
      } catch (error) {
        console.error('[DashDig Vue Composable] Error showing widget:', error);
      }
    } else {
      console.warn('[DashDig Vue Composable] Widget not initialized');
    }
  };

  /**
   * Hide the widget
   */
  const hide = (): void => {
    if (widget.value) {
      try {
        widget.value.hide();
        isVisible.value = false;
      } catch (error) {
        console.error('[DashDig Vue Composable] Error hiding widget:', error);
      }
    } else {
      console.warn('[DashDig Vue Composable] Widget not initialized');
    }
  };

  /**
   * Track an event
   */
  const track = (event: string, data?: Record<string, any>): void => {
    if (widget.value) {
      try {
        widget.value.track(event, data);
      } catch (error) {
        console.error('[DashDig Vue Composable] Error tracking event:', error);
      }
    } else {
      console.warn('[DashDig Vue Composable] Widget not initialized');
    }
  };

  /**
   * Initialize widget on mount
   */
  onMounted(() => {
    if (!apiKey) {
      console.warn('[DashDig Vue Composable] API key is required');
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

      // Create widget instance
      widget.value = new DashdigWidget(config);
      isLoaded.value = true;

      // Update visibility state
      if (widget.value.isShown()) {
        isVisible.value = true;
      }
    } catch (error) {
      console.error('[DashDig Vue Composable] Widget initialization error:', error);
      isLoaded.value = false;
    }
  });

  /**
   * Cleanup widget on unmount
   */
  onUnmounted(() => {
    if (widget.value) {
      try {
        widget.value.destroy();
        widget.value = null;
        isLoaded.value = false;
        isVisible.value = false;
      } catch (error) {
        console.error('[DashDig Vue Composable] Widget cleanup error:', error);
      }
    }
  });

  return {
    show,
    hide,
    track,
    isLoaded: readonly(isLoaded),
    isVisible: readonly(isVisible),
    widget: readonly(widget)
  };
}


