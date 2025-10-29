/**
 * DashDig Widget - Vue 3 Plugin
 * Global plugin for app-wide DashDig integration
 */

import type { App, Plugin } from 'vue';
import DashdigWidget from '../../core/widget';
import type { DashdigConfig } from '../../core/widget';

/**
 * Plugin options
 */
export interface DashdigPluginOptions {
  /** API key for authentication (required) */
  apiKey: string;
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
 * Global DashDig instance interface
 */
export interface DashdigGlobal {
  /** Show the widget */
  show: () => void;
  /** Hide the widget */
  hide: () => void;
  /** Track an event */
  track: (event: string, data?: Record<string, any>) => void;
  /** Get widget instance */
  getInstance: () => DashdigWidget | null;
  /** Check if widget is loaded */
  isLoaded: () => boolean;
}

/**
 * Augment Vue's ComponentCustomProperties for TypeScript support
 */
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $dashdig: DashdigGlobal;
  }
}

// Store widget instance globally
let widgetInstance: DashdigWidget | null = null;

/**
 * DashDig Vue 3 Plugin
 * 
 * Installs DashDig globally in your Vue application.
 * Provides $dashdig in all components for easy access.
 * 
 * @example
 * ```typescript
 * import { createApp } from 'vue';
 * import { DashdigPlugin } from '@dashdig/widget/vue';
 * import App from './App.vue';
 * 
 * const app = createApp(App);
 * 
 * app.use(DashdigPlugin, {
 *   apiKey: 'your-api-key',
 *   position: 'bottom-right',
 *   theme: 'light'
 * });
 * 
 * app.mount('#app');
 * ```
 * 
 * Usage in components:
 * ```vue
 * <script setup>
 * import { getCurrentInstance } from 'vue';
 * 
 * const instance = getCurrentInstance();
 * const dashdig = instance?.proxy?.$dashdig;
 * 
 * function trackClick() {
 *   dashdig?.track('button_click', { button: 'example' });
 * }
 * </script>
 * 
 * <template>
 *   <button @click="trackClick">Track Click</button>
 * </template>
 * ```
 */
export const DashdigPlugin: Plugin = {
  install(app: App, options: DashdigPluginOptions) {
    // Validate API key
    if (!options || !options.apiKey) {
      console.error('[DashDig Vue Plugin] API key is required');
      return;
    }

    try {
      // Create widget configuration
      const config: DashdigConfig = {
        apiKey: options.apiKey,
        position: options.position,
        theme: options.theme,
        autoShow: options.autoShow,
        apiUrl: options.apiUrl
      };

      // Create widget instance
      widgetInstance = new DashdigWidget(config);

      // Create global $dashdig object
      const dashdigGlobal: DashdigGlobal = {
        show: () => {
          if (widgetInstance) {
            widgetInstance.show();
          } else {
            console.warn('[DashDig Vue Plugin] Widget not initialized');
          }
        },

        hide: () => {
          if (widgetInstance) {
            widgetInstance.hide();
          } else {
            console.warn('[DashDig Vue Plugin] Widget not initialized');
          }
        },

        track: (event: string, data?: Record<string, any>) => {
          if (widgetInstance) {
            widgetInstance.track(event, data);
          } else {
            console.warn('[DashDig Vue Plugin] Widget not initialized');
          }
        },

        getInstance: () => widgetInstance,

        isLoaded: () => widgetInstance !== null
      };

      // Add to global properties
      app.config.globalProperties.$dashdig = dashdigGlobal;

      // Provide for Composition API
      app.provide('dashdig', dashdigGlobal);

      console.log('[DashDig Vue Plugin] Plugin installed successfully');
    } catch (error) {
      console.error('[DashDig Vue Plugin] Installation error:', error);
    }

    // Cleanup on app unmount
    app.mixin({
      beforeUnmount() {
        // Only destroy on root instance unmount
        if (this.$ === this.$.root) {
          if (widgetInstance) {
            try {
              widgetInstance.destroy();
              widgetInstance = null;
            } catch (error) {
              console.error('[DashDig Vue Plugin] Cleanup error:', error);
            }
          }
        }
      }
    });
  }
};

export default DashdigPlugin;


