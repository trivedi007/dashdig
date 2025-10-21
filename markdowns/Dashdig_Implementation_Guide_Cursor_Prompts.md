# Dashdig Implementation Guide: Cursor + Sonnet 4.5 Prompts

## Important Note on Repository Access

I was unable to directly access the Dashdig GitHub repository at https://github.com/trivedi007/dashdig due to access restrictions. The prompts below are based on industry best practices for analytics/monitoring SaaS platforms and can be adapted once you provide specific details about your codebase structure (file paths, tech stack, existing components).

**To maximize effectiveness**: Share your current `package.json`, main directory structure, and tech stack details, and I can refine these prompts with exact file paths and function names.

---

# 1. Browser Extension Development (Chrome/Firefox Manifest V3)

## Cursor Prompt: Create Browser Extension Foundation

```
Create a production-ready Chrome/Firefox browser extension for Dashdig with Manifest V3:

TECHNICAL REQUIREMENTS:
- Manifest V3 compliance with service worker (not background page)
- Cross-browser compatibility using webextension-polyfill
- Vite bundler for development and production builds
- TypeScript with strict type checking
- Shadow DOM for UI isolation

PROJECT STRUCTURE:
dashdig-extension/
├── manifest.json (version 3)
├── src/
│   ├── background/
│   │   └── service-worker.ts
│   ├── content/
│   │   └── content-script.ts
│   ├── popup/
│   │   ├── popup.html
│   │   ├── popup.ts
│   │   └── popup.css
│   ├── shared/
│   │   ├── api-client.ts
│   │   ├── storage.ts
│   │   └── constants.ts
│   └── types/
│       └── index.ts
├── vite.config.ts
├── package.json
└── tsconfig.json

IMPLEMENTATION DETAILS:

1. **manifest.json** requirements:
   - manifest_version: 3
   - permissions: ["activeTab", "storage"]
   - host_permissions: ["https://dashdig.com/*"] (adjust to your domain)
   - action with popup
   - content_scripts for automatic injection on user websites
   - web_accessible_resources for assets

2. **Service Worker** (src/background/service-worker.ts):
   - Listen for installation and activation events
   - Handle messages from content scripts and popup
   - Manage chrome.storage for API keys and settings
   - No DOM access (use offscreen documents if needed)
   - Implement retry logic for API calls
   - Auto-terminate gracefully (no long-running timers)

3. **Content Script** (src/content/content-script.ts):
   - Inject Dashdig tracking script into host pages
   - Create shadow DOM for isolated UI components
   - Communicate with service worker via chrome.runtime.sendMessage
   - Detect page events (load, navigation, errors)
   - Send analytics to Dashdig API
   - Handle errors gracefully without breaking host page

4. **Popup UI** (src/popup/):
   - Display current page analytics
   - API key configuration form
   - Enable/disable tracking toggle
   - Link to Dashdig dashboard
   - Use React or Preact for UI (keep bundle \u003c 50KB)

5. **API Client** (src/shared/api-client.ts):
   - RESTful communication with Dashdig backend
   - Authentication using API keys from chrome.storage
   - Automatic retry with exponential backoff
   - Error handling and user notifications
   - TypeScript interfaces for all API responses

6. **Storage Manager** (src/shared/storage.ts):
   - Wrapper around chrome.storage.local
   - Type-safe storage operations
   - Sync settings across extension components
   - Encryption for sensitive data

BUILD CONFIGURATION:

vite.config.ts setup:
- Multiple entry points (background, content, popup)
- Output separate bundles for each component
- Inline source maps for debugging
- Minification for production
- Generate both Chrome and Firefox manifests

SECURITY:
- Content Security Policy with no unsafe-eval
- No remotely hosted code
- Input sanitization for user-provided API keys
- Validate all messages between components

PERFORMANCE:
- Bundle size \u003c 200KB total
- Service worker startup \u003c 100ms
- Content script injection \u003c 50ms
- Use code splitting for rarely-used features

TESTING:
- Unit tests with Jest for all shared modules
- E2E tests with Puppeteer for Chrome
- Manual testing checklist for Firefox
- Test in both dev and production builds

BROWSER COMPATIBILITY:
- Chrome 127+
- Firefox 109+
- Use webextension-polyfill for API compatibility

Generate complete, production-ready code for all components with proper TypeScript types, error handling, and inline comments explaining Manifest V3 patterns.
```

## Cursor Prompt: Content Script Analytics Injection

```
Implement the Dashdig content script that injects analytics into websites:

FILE: src/content/content-script.ts

REQUIREMENTS:
1. Inject Dashdig tracking script asynchronously without blocking page load
2. Use Shadow DOM for any UI components (isolated CSS)
3. Detect and send page view, click, scroll, and custom events
4. Communicate with service worker for API calls
5. Handle errors silently (never break host page)
6. Support opt-out via Do Not Track
7. Performance budget: \u003c50ms execution time

CODE STRUCTURE:

class DashdigContentScript {
  private apiKey: string | null = null;
  private shadowRoot: ShadowRoot | null = null;
  
  async init() {
    // Get API key from storage
    // Check if tracking is enabled
    // Inject tracking code
    // Set up event listeners
  }
  
  private injectTracker() {
    // Create script element
    // Add async attribute
    // Set src to Dashdig CDN or inline code
    // Append to document.head
  }
  
  private setupEventListeners() {
    // Page view (immediate)
    // Clicks (debounced)
    // Scrolling (throttled)
    // Page unload (beacon API)
  }
  
  private sendEvent(eventType: string, data: object) {
    // Send message to service worker
    // Service worker handles API call
  }
  
  private createShadowDom() {
    // Create container div
    // Attach shadow root
    // Load isolated styles
  }
}

PERFORMANCE OPTIMIZATIONS:
- Use requestIdleCallback for non-critical setup
- Debounce click events (300ms)
- Throttle scroll events (1000ms)
- Use Intersection Observer for viewport tracking
- Batch events and send every 5 seconds or 10 events

ERROR HANDLING:
- Try-catch around all external API calls
- Fallback if Shadow DOM not supported
- Silent failure mode (log to console.debug only)
- Report errors to Dashdig error tracking endpoint

Implement with full TypeScript types, comprehensive error handling, and JSDoc comments.
```

---

# 2. WordPress Plugin Development

## Cursor Prompt: WordPress Plugin Foundation

```
Create a WordPress plugin for automatic Dashdig analytics injection:

PLUGIN STRUCTURE:
dashdig-wordpress/
├── dashdig.php (main plugin file)
├── includes/
│   ├── class-dashdig.php (core plugin class)
│   ├── class-dashdig-admin.php (admin settings)
│   ├── class-dashdig-public.php (public-facing functionality)
│   └── class-dashdig-activator.php (activation hooks)
├── admin/
│   ├── css/dashdig-admin.css
│   ├── js/dashdig-admin.js
│   └── partials/admin-display.php
├── public/
│   ├── css/dashdig-public.css
│   └── js/dashdig-public.js
└── README.txt

MAIN PLUGIN FILE (dashdig.php):

/**
 * Plugin Name: Dashdig Analytics
 * Plugin URI: https://dashdig.com/wordpress
 * Description: Automatically inject Dashdig analytics tracking into your WordPress site
 * Version: 1.0.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Author: Your Name
 * License: GPL v2 or later
 * Text Domain: dashdig
 */

IMPLEMENTATION REQUIREMENTS:

1. **Admin Settings Page** (includes/class-dashdig-admin.php):
   - Add to Settings menu
   - API key input field (sanitized, validated)
   - Tracking enabled/disabled toggle
   - Position selector (header/footer)
   - Page-type targeting (all pages, posts only, custom)
   - Test connection button (AJAX verification)
   - Save settings using WordPress Options API

2. **Script Injection** (includes/class-dashdig-public.php):
   - Hook into wp_head or wp_footer based on settings
   - Inject Dashdig tracking script asynchronously
   - Pass API key via data attribute
   - Conditional loading based on page type
   - Exclude admin pages and logged-in admin users (optional)
   - wp_enqueue_script with proper dependencies

3. **Settings Storage**:
   - Use Options API: get_option(), update_option()
   - Store as serialized array or individual options
   - Options: dashdig_api_key, dashdig_enabled, dashdig_position
   - Sanitize on save: sanitize_text_field() for API key
   - Validate API key format before saving

4. **Security**:
   - Nonce verification on all form submissions
   - Capability checks: current_user_can('manage_options')
   - Sanitize all inputs: sanitize_text_field(), esc_attr()
   - Escape all outputs: esc_html(), esc_url(), esc_js()
   - Prepared SQL statements if custom queries needed

5. **Performance**:
   - Only load admin CSS/JS on settings page
   - Async/defer on public tracking script
   - Conditional loading (don't load if disabled)
   - Cache bust on plugin version change
   - No database queries on frontend if possible

6. **Gutenberg Block** (optional advanced feature):
   - Register custom block for manual placement
   - Block attributes: event name, properties
   - Use @wordpress/blocks and @wordpress/block-editor
   - Server-side rendering for SEO

CODE SAMPLE for script injection:

```php
public function inject_tracking_script() {
    // Check if enabled
    if (!get_option('dashdig_enabled', false)) {
        return;
    }
    
    // Get API key
    $api_key = get_option('dashdig_api_key', '');
    if (empty($api_key)) {
        return;
    }
    
    // Get position
    $position = get_option('dashdig_position', 'footer');
    
    // Enqueue script
    if ($position === 'header') {
        add_action('wp_head', [$this, 'output_script'], 999);
    } else {
        add_action('wp_footer', [$this, 'output_script'], 999);
    }
}

public function output_script() {
    $api_key = esc_attr(get_option('dashdig_api_key'));
    ?\u003e
    \u003cscript\u003e
    (function() {
        var d = document, s = d.createElement('script');
        s.src = 'https://cdn.dashdig.com/track.js';
        s.async = true;
        s.setAttribute('data-api-key', '\u003c?php echo $api_key; ?\u003e');
        (d.head || d.body).appendChild(s);
    })();
    \u003c/script\u003e
    \u003c?php
}
```

WORDPRESS CODING STANDARDS:
- Use tabs for indentation
- Yoda conditions (true === $value)
- Prefix all functions with dashdig_
- Class names: Class_Dashdig_Something
- Internationalization: __(), _e() with 'dashdig' text domain

Generate complete, production-ready plugin code following WordPress Coding Standards with proper documentation, security measures, and performance optimization.
```

---

# 3. Embeddable JavaScript Widget

## Cursor Prompt: Async Widget with Framework Integrations

```
Create a production-ready embeddable JavaScript widget for Dashdig with async loading and framework wrappers:

PROJECT STRUCTURE:
dashdig-widget/
├── src/
│   ├── core/
│   │   ├── widget.ts (main widget class)
│   │   ├── api-client.ts
│   │   └── utils.ts
│   ├── integrations/
│   │   ├── react/
│   │   │   ├── DashdigWidget.tsx
│   │   │   ├── useDashdig.ts
│   │   │   └── index.ts
│   │   ├── vue/
│   │   │   ├── DashdigWidget.vue
│   │   │   ├── plugin.ts
│   │   │   └── index.ts
│   │   └── angular/
│   │       ├── dashdig.module.ts
│   │       ├── dashdig.component.ts
│   │       └── index.ts
│   └── standalone/
│       └── embed.ts (bootstrap script)
├── dist/
│   ├── dashdig.min.js (vanilla JS bundle)
│   ├── dashdig-react.min.js
│   ├── dashdig-vue.min.js
│   └── dashdig-angular.min.js
├── rollup.config.js
├── package.json
└── tsconfig.json

PART 1: ASYNC BOOTSTRAP SCRIPT (embed.ts)

Create the minimal bootstrap loader (\u003c 5KB gzipped):

```typescript
// This is the script users embed in their site
(function(window, document) {
  'use strict';
  
  // Configuration queue pattern (Intercom-style)
  window.Dashdig = window.Dashdig || function() {
    (window.Dashdig.q = window.Dashdig.q || []).push(arguments);
  };
  window.Dashdig.q = window.Dashdig.q || [];
  
  // API key from script tag
  var script = document.currentScript || 
    document.querySelector('script[data-dashdig-key]');
  var apiKey = script?.getAttribute('data-dashdig-key');
  
  if (!apiKey) {
    console.warn('[Dashdig] No API key provided');
    return;
  }
  
  // Lazy load main widget
  function loadWidget() {
    var w = document.createElement('script');
    w.src = 'https://cdn.dashdig.com/widget/v1/dashdig.min.js';
    w.async = true;
    w.setAttribute('data-api-key', apiKey);
    
    w.onload = function() {
      // Process queued calls
      var q = window.Dashdig.q;
      window.Dashdig.q = [];
      q.forEach(function(args) {
        window.Dashdig.apply(null, args);
      });
    };
    
    (document.head || document.body).appendChild(w);
  }
  
  // Load on page load or immediately if already loaded
  if (document.readyState === 'complete') {
    loadWidget();
  } else {
    window.addEventListener('load', loadWidget);
  }
})(window, document);
```

EMBEDDING CODE:
```html
\u003cscript src="https://cdn.dashdig.com/embed.js" data-dashdig-key="YOUR_API_KEY" async\u003e\u003c/script\u003e
```

PART 2: MAIN WIDGET CLASS (widget.ts)

```typescript
interface DashdigConfig {
  apiKey: string;
  apiUrl?: string;
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'light' | 'dark';
  autoShow?: boolean;
}

class DashdigWidget {
  private config: DashdigConfig;
  private container: HTMLDivElement | null = null;
  private shadowRoot: ShadowRoot | null = null;
  
  constructor(config: DashdigConfig) {
    this.config = {
      apiUrl: 'https://api.dashdig.com',
      position: 'bottom-right',
      theme: 'light',
      autoShow: true,
      ...config
    };
    
    this.init();
  }
  
  private async init() {
    // Create isolated container
    this.createContainer();
    // Load styles
    await this.loadStyles();
    // Render UI
    this.render();
    // Setup event listeners
    this.setupEvents();
  }
  
  private createContainer() {
    this.container = document.createElement('div');
    this.container.id = 'dashdig-widget-container';
    this.container.style.cssText = `
      position: fixed;
      ${this.config.position === 'bottom-right' ? 'right: 20px' : 'left: 20px'};
      bottom: 20px;
      z-index: 999999;
    `;
    
    // Use Shadow DOM for style isolation
    if ('attachShadow' in Element.prototype) {
      this.shadowRoot = this.container.attachShadow({ mode: 'open' });
    } else {
      this.shadowRoot = this.container as any;
    }
    
    document.body.appendChild(this.container);
  }
  
  private async loadStyles() {
    const styles = `
      :host { all: initial; }
      .widget { 
        font-family: -apple-system, sans-serif;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        padding: 20px;
        max-width: 360px;
      }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    this.shadowRoot!.appendChild(styleSheet);
  }
  
  // Additional methods...
}

// Export for module systems
export default DashdigWidget;

// Global exposure for script tag usage
if (typeof window !== 'undefined') {
  (window as any).DashdigWidget = DashdigWidget;
}
```

PART 3: REACT INTEGRATION (react/DashdigWidget.tsx)

```typescript
import React, { useEffect, useRef } from 'react';
import DashdigWidget from '../../core/widget';

interface DashdigWidgetProps {
  apiKey: string;
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'light' | 'dark';
  autoShow?: boolean;
  onLoad?: () =\u003e void;
  onError?: (error: Error) =\u003e void;
}

export const DashdigWidget: React.FC\u003cDashdigWidgetProps\u003e = ({
  apiKey,
  position = 'bottom-right',
  theme = 'light',
  autoShow = true,
  onLoad,
  onError
}) =\u003e {
  const widgetRef = useRef\u003cDashdigWidget | null\u003e(null);
  
  useEffect(() =\u003e {
    try {
      widgetRef.current = new DashdigWidget({
        apiKey,
        position,
        theme,
        autoShow
      });
      
      onLoad?.();
    } catch (error) {
      onError?.(error as Error);
    }
    
    // Cleanup
    return () =\u003e {
      widgetRef.current?.destroy();
    };
  }, [apiKey]);
  
  return null; // Widget appends to body
};

// Hook for imperative usage
export const useDashdig = (apiKey: string) =\u003e {
  const widgetRef = useRef\u003cDashdigWidget | null\u003e(null);
  
  useEffect(() =\u003e {
    widgetRef.current = new DashdigWidget({ apiKey });
    return () =\u003e widgetRef.current?.destroy();
  }, [apiKey]);
  
  const show = () =\u003e widgetRef.current?.show();
  const hide = () =\u003e widgetRef.current?.hide();
  const track = (event: string, data: any) =\u003e widgetRef.current?.track(event, data);
  
  return { show, hide, track };
};
```

PART 4: VUE INTEGRATION (vue/DashdigWidget.vue)

```vue
\u003ctemplate\u003e
  \u003c!-- Widget appends to body, no template needed --\u003e
\u003c/template\u003e

\u003cscript\u003e
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import DashdigWidget from '../../core/widget';

export default defineComponent({
  name: 'DashdigWidget',
  props: {
    apiKey: { type: String, required: true },
    position: { type: String, default: 'bottom-right' },
    theme: { type: String, default: 'light' },
    autoShow: { type: Boolean, default: true }
  },
  emits: ['load', 'error'],
  setup(props, { emit }) {
    const widget = ref(null);
    
    onMounted(() =\u003e {
      try {
        widget.value = new DashdigWidget({
          apiKey: props.apiKey,
          position: props.position,
          theme: props.theme,
          autoShow: props.autoShow
        });
        emit('load');
      } catch (error) {
        emit('error', error);
      }
    });
    
    onUnmounted(() =\u003e {
      widget.value?.destroy();
    });
    
    return {};
  }
});
\u003c/script\u003e
```

PART 5: ANGULAR INTEGRATION (angular/dashdig.module.ts)

```typescript
import { NgModule, ModuleWithProviders } from '@angular/core';
import { DashdigComponent } from './dashdig.component';
import { DashdigService } from './dashdig.service';

export interface DashdigConfig {
  apiKey: string;
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'light' | 'dark';
}

@NgModule({
  declarations: [DashdigComponent],
  exports: [DashdigComponent]
})
export class DashdigModule {
  static forRoot(config: DashdigConfig): ModuleWithProviders\u003cDashdigModule\u003e {
    return {
      ngModule: DashdigModule,
      providers: [
        { provide: 'DASHDIG_CONFIG', useValue: config },
        DashdigService
      ]
    };
  }
}
```

BUILD CONFIGURATION (rollup.config.js):

- Bundle separate builds for vanilla, React, Vue, Angular
- Tree-shaking enabled
- Minification with Terser
- Source maps for debugging
- Target bundle sizes: \u003c30KB (core), \u003c10KB (each integration)

CDN SETUP:
- Host on CloudFlare CDN or similar
- Enable Brotli compression
- Cache for 1 year with versioned URLs
- CORS headers for cross-origin requests

Generate complete, production-ready code for all components with TypeScript types, error handling, and framework integration examples.
```

---

# 4. Performance Optimizations for Sub-50ms Load Times

## Cursor Prompt: Performance Optimization

```
Optimize the Dashdig widget and tracking code for sub-50ms load times:

OPTIMIZATION CHECKLIST:

1. **Bundle Size Reduction**:
   - Target: Core bundle \u003c 30KB gzipped
   - Use Rollup tree-shaking aggressively
   - Remove unused lodash functions (use lodash-es)
   - Replace moment.js with date-fns (save 60KB)
   - Analyze with webpack-bundle-analyzer

2. **Code Splitting Strategy**:
```typescript
// Lazy load non-critical features
const loadAdvancedFeatures = () =\u003e 
  import(/* webpackChunkName: "advanced" */ './advanced-features');

// Load on user interaction
button.addEventListener('click', async () =\u003e {
  const module = await loadAdvancedFeatures();
  module.showAdvancedDialog();
});
```

3. **Compression Implementation**:
```nginx
# Enable Brotli (14-21% smaller than Gzip)
brotli on;
brotli_comp_level 5;
brotli_types text/javascript application/javascript;

# Gzip fallback
gzip on;
gzip_comp_level 6;
gzip_types text/javascript application/javascript;
```

4. **Resource Hints**:
```html
\u003c!-- Preconnect to API domain --\u003e
\u003clink rel="preconnect" href="https://api.dashdig.com"\u003e

\u003c!-- Preload critical CSS --\u003e
\u003clink rel="preload" href="/widget.css" as="style"\u003e

\u003c!-- Prefetch likely next page --\u003e
\u003clink rel="prefetch" href="/dashboard.js" as="script"\u003e
```

5. **Critical Rendering Path**:
```typescript
// Inline critical CSS (above-the-fold)
const criticalCSS = `
  .widget-button { 
    position: fixed;
    bottom: 20px;
    right: 20px;
  }
`;

// Defer non-critical
const loadNonCriticalCSS = () =\u003e {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/widget-full.css';
  document.head.appendChild(link);
};
```

6. **Lazy Loading with Intersection Observer**:
```typescript
class LazyLoader {
  private observer: IntersectionObserver;
  
  constructor() {
    this.observer = new IntersectionObserver(this.onIntersect.bind(this), {
      rootMargin: '50px'
    });
  }
  
  observe(element: Element) {
    this.observer.observe(element);
  }
  
  private onIntersect(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry =\u003e {
      if (entry.isIntersecting) {
        this.loadContent(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }
  
  private loadContent(element: Element) {
    // Load deferred content
  }
}
```

7. **Web Vitals Optimization**:
```typescript
import { onLCP, onFID, onCLS } from 'web-vitals';

function sendToAnalytics(metric) {
  fetch('/analytics', {
    method: 'POST',
    body: JSON.stringify(metric)
  });
}

// Track Core Web Vitals
onLCP(sendToAnalytics); // Target: \u003c2.5s
onFID(sendToAnalytics); // Target: \u003c100ms (deprecated, use INP)
onCLS(sendToAnalytics); // Target: \u003c0.1
```

8. **HTTP/2 \u0026 HTTP/3 Configuration**:
```nginx
listen 443 quic reuseport;
listen 443 ssl http2;

# Advertise HTTP/3
add_header Alt-Svc 'h3=":443"; ma=86400';

# HTTP/2 push
http2_push /critical.css;
http2_push /critical.js;
```

PERFORMANCE BUDGET:
- Initial Bundle: \u003c30KB gzipped
- Total JS: \u003c100KB
- Total CSS: \u003c20KB
- Time to Interactive: \u003c3s (3G)
- First Contentful Paint: \u003c1.5s
- Largest Contentful Paint: \u003c2.5s

Implement all optimizations with before/after Lighthouse scores and bundle size comparisons.
```

---

# 5. Unit Testing Strategies

## Cursor Prompt: Comprehensive Test Suite

```
Create a comprehensive testing strategy for the Dashdig codebase using Vitest and Playwright:

PROJECT STRUCTURE:
tests/
├── unit/
│   ├── widget.test.ts
│   ├── api-client.test.ts
│   └── utils.test.ts
├── integration/
│   ├── extension.test.ts
│   └── wordpress-plugin.test.ts
├── e2e/
│   ├── user-flows.spec.ts
│   └── cross-browser.spec.ts
├── performance/
│   └── load-time.test.ts
└── fixtures/
    └── mock-data.ts

PART 1: UNIT TESTS (Vitest)

vitest.config.ts:
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: ['node_modules/', 'tests/']
    }
  }
});
```

Example: Widget Core Tests (widget.test.ts)
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import DashdigWidget from '../src/core/widget';

describe('DashdigWidget', () =\u003e {
  let widget: DashdigWidget;
  
  beforeEach(() =\u003e {
    widget = new DashdigWidget({ apiKey: 'test-key' });
  });
  
  it('should initialize with config', () =\u003e {
    expect(widget.config.apiKey).toBe('test-key');
    expect(widget.config.position).toBe('bottom-right');
  });
  
  it('should create shadow DOM container', () =\u003e {
    const container = document.getElementById('dashdig-widget-container');
    expect(container).not.toBeNull();
    expect(container?.shadowRoot).not.toBeNull();
  });
  
  it('should track events', async () =\u003e {
    const spy = vi.spyOn(widget.api, 'sendEvent');
    await widget.track('page_view', { url: '/test' });
    
    expect(spy).toHaveBeenCalledWith('page_view', { url: '/test' });
  });
  
  it('should handle API errors gracefully', async () =\u003e {
    vi.spyOn(widget.api, 'sendEvent').mockRejectedValue(new Error('Network error'));
    
    await expect(widget.track('test', {})).resolves.not.toThrow();
  });
  
  it('should load in under 50ms', async () =\u003e {
    const start = performance.now();
    const widget = new DashdigWidget({ apiKey: 'test' });
    await widget.init();
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(50);
  });
});
```

PART 2: INTEGRATION TESTS

Example: Browser Extension Integration
```typescript
import { describe, it, expect } from 'vitest';
import { chrome } from './mocks/chrome';

// Mock Chrome APIs
global.chrome = chrome;

describe('Extension Integration', () =\u003e {
  it('should store API key in chrome.storage', async () =\u003e {
    await chrome.storage.local.set({ apiKey: 'test-key' });
    const result = await chrome.storage.local.get('apiKey');
    
    expect(result.apiKey).toBe('test-key');
  });
  
  it('should inject content script into pages', async () =\u003e {
    const tabs = await chrome.tabs.query({ active: true });
    await chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['content-script.js']
    });
    
    // Verify injection
  });
});
```

PART 3: E2E TESTS (Playwright)

playwright.config.ts:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'] }
    }
  ]
});
```

Example: User Flow Tests (user-flows.spec.ts)
```typescript
import { test, expect } from '@playwright/test';

test.describe('Widget User Flows', () =\u003e {
  test('should load widget on page', async ({ page }) =\u003e {
    await page.goto('/');
    
    // Wait for widget to appear
    const widget = page.locator('#dashdig-widget-container');
    await expect(widget).toBeVisible();
    
    // Measure load time
    const timing = await page.evaluate(() =\u003e performance.timing);
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    expect(loadTime).toBeLessThan(3000);
  });
  
  test('should track page view', async ({ page }) =\u003e {
    let apiCalled = false;
    
    // Intercept API calls
    await page.route('**/api/track', route =\u003e {
      apiCalled = true;
      route.fulfill({ status: 200 });
    });
    
    await page.goto('/');
    
    // Wait for API call
    await page.waitForTimeout(1000);
    expect(apiCalled).toBe(true);
  });
  
  test('should handle errors gracefully', async ({ page }) =\u003e {
    // Simulate API failure
    await page.route('**/api/**', route =\u003e 
      route.fulfill({ status: 500 })
    );
    
    await page.goto('/');
    
    // Widget should still render
    const widget = page.locator('#dashdig-widget-container');
    await expect(widget).toBeVisible();
    
    // No console errors
    const errors = [];
    page.on('console', msg =\u003e {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    
    expect(errors.length).toBe(0);
  });
});
```

PART 4: PERFORMANCE TESTS

Example: Load Time Benchmarks
```typescript
import { describe, it, expect } from 'vitest';

describe('Performance Benchmarks', () =\u003e {
  it('should load core bundle in \u003c50ms', async () =\u003e {
    const start = performance.now();
    await import('../src/core/widget');
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(50);
  });
  
  it('should have bundle size \u003c30KB', () =\u003e {
    const stats = require('../dist/stats.json');
    const size = stats.assets[0].size;
    
    expect(size).toBeLessThan(30 * 1024);
  });
});
```

REAL-WORLD TESTING SCENARIOS:

1. **High Traffic Simulation**:
```typescript
test('should handle 1000 concurrent events', async () =\u003e {
  const promises = Array(1000).fill(null).map(() =\u003e
    widget.track('test_event', { timestamp: Date.now() })
  );
  
  await expect(Promise.all(promises)).resolves.not.toThrow();
});
```

2. **Network Condition Testing**:
```typescript
test('should work on slow 3G', async ({ page }) =\u003e {
  // Emulate slow 3G
  await page.emulateNetworkConditions({
    offline: false,
    downloadThroughput: 400 * 1024 / 8,
    uploadThroughput: 400 * 1024 / 8,
    latency: 400
  });
  
  await page.goto('/');
  const widget = page.locator('#dashdig-widget-container');
  await expect(widget).toBeVisible({ timeout: 10000 });
});
```

3. **Cross-Browser Compatibility**:
```typescript
test('should work in all browsers', async ({ browserName }) =\u003e {
  console.log(`Testing in ${browserName}`);
  // Test browser-specific features
});
```

COVERAGE TARGETS:
- Unit tests: 80%+ coverage
- Integration tests: Critical paths
- E2E tests: Major user flows
- Performance tests: All core modules

CI/CD INTEGRATION:
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:e2e
      - run: npm run test:performance
      - uses: codecov/codecov-action@v3
```

Generate complete test suites with proper mocking, fixtures, and CI/CD configuration.
```

---

# 6. Deployment Optimization

## Cursor Prompt: Vercel \u0026 Railway Setup

```
Set up optimal deployment configuration for Dashdig on Vercel (frontend) and Railway (backend):

VERCEL DEPLOYMENT (Next.js Frontend):

vercel.json:
```json
{
  \"version\": 2,
  \"builds\": [
    {
      \"src\": \"package.json\",
      \"use\": \"@vercel/next\"
    }
  ],
  \"routes\": [
    {
      \"src\": \"/api/(.*)\",
      \"dest\": \"https://dashdig-backend.railway.app/api/$1\"
    }
  ],
  \"headers\": [
    {
      \"source\": \"/(.*)\",
      \"headers\": [
        {
          \"key\": \"X-Content-Type-Options\",
          \"value\": \"nosniff\"
        },
        {
          \"key\": \"X-Frame-Options\",
          \"value\": \"DENY\"
        },
        {
          \"key\": \"X-XSS-Protection\",
          \"value\": \"1; mode=block\"
        }
      ]
    }
  ]
}
```

next.config.js optimizations:
```javascript
module.exports = {
  // ISR for semi-static pages
  async getStaticProps() {
    return {
      props: {},
      revalidate: 3600 // 1 hour
    };
  },
  
  // Image optimization
  images: {
    domains: ['cdn.dashdig.com'],
    formats: ['image/avif', 'image/webp']
  },
  
  // Bundle optimization
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  
  // Edge functions for auth
  experimental: {
    runtime: 'edge'
  }
};
```

RAILWAY DEPLOYMENT (Node.js Backend):

railway.json:
```json
{
  \"$schema\": \"https://railway.app/railway.schema.json\",
  \"build\": {
    \"builder\": \"NIXPACKS\",
    \"buildCommand\": \"npm run build\"
  },
  \"deploy\": {
    \"startCommand\": \"npm start\",
    \"restartPolicyType\": \"ON_FAILURE\",
    \"restartPolicyMaxRetries\": 10
  }
}
```

Dockerfile (optimized):
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD [\"node\", \"dist/index.js\"]
```

ENVIRONMENT VARIABLES:
```bash
# Vercel
NEXT_PUBLIC_API_URL=https://api.dashdig.com
NEXT_PUBLIC_CDN_URL=https://cdn.dashdig.com
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Railway
PORT=3000
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
API_KEY_SALT=...
```

COST OPTIMIZATION STRATEGIES:

1. **Vercel ISR Instead of SSR**:
```typescript
// BEFORE (SSR - expensive)
export async function getServerSideProps() {
  const data = await fetchData();
  return { props: { data } };
}

// AFTER (ISR - 86% cost reduction)
export async function getStaticProps() {
  const data = await fetchData();
  return { 
    props: { data },
    revalidate: 3600 // Regenerate every hour
  };
}
```

2. **Railway Resource Optimization**:
```yaml
# railway.toml
[deploy]
  numReplicas = 1
  healthcheckPath = \"/health\"
  healthcheckTimeout = 100
  
[resources]
  memory = 512 # MB
  cpu = 0.5 # vCPU
```

MONITORING SETUP:

```typescript
// Vercel Analytics
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return (
    \u003c\u003e
      \u003cComponent {...pageProps} /\u003e
      \u003cAnalytics /\u003e
    \u003c/\u003e
  );
}

// Custom metrics
export function reportWebVitals(metric) {
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(metric)
  });
}
```

CI/CD PIPELINE:

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
    
jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/build-push-action@v2
      - run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

Generate complete deployment configurations optimized for cost and performance.
```

---

# 7. Migration Timeline \u0026 Cost Analysis

## Comprehensive Migration \u0026 Scaling Strategy

Based on extensive research, here's your complete migration decision framework:

### **Migration Thresholds:**

| Traffic Level | Current Cost (Vercel/Railway) | AWS Cost | When to Migrate |
|--------------|------------------------------|-----------|-----------------|
| 1K req/day | $25/mo | $15/mo | Stay on Vercel/Railway |
| 10K req/day | $55/mo | $40/mo | Stay on Vercel/Railway |
| 100K req/day | $270/mo | $200/mo | Consider migration |
| 1M req/day | $1,520-2,520/mo | $1,250/mo | Migrate to save 40-60% |

### **Financial Triggers for Migration:**
- **MRR \u003c $10K + costs \u003e $500/mo**: Evaluate AWS/GCP
- **MRR $10-50K + costs \u003e $1,000/mo**: Migrate for 40-60% savings
- **MRR \u003e $50K + costs \u003e $2,000/mo**: Migration ROI in 3-6 months

### **Migration Timeline (Vercel/Railway → AWS):**

**Phase 1: Planning (Weeks 1-2)**
- Audit current architecture
- Design AWS infrastructure (Terraform)
- Estimate costs with AWS Calculator
- Get team buy-in

**Phase 2: Infrastructure Setup (Weeks 3-5)**
- Create AWS accounts and VPCs
- Set up CloudFront + S3
- Deploy Lambda/ECS containers
- Configure RDS PostgreSQL
- Set up DNS and SSL

**Phase 3: Migration (Weeks 6-7)**
- Deploy application to AWS
- Set up CI/CD (GitHub Actions)
- Load testing
- Parallel run with Vercel

**Phase 4: Cutover (Week 8)**
- DNS migration with weighted routing
- Monitor for issues
- Decommission old infrastructure

**Total Timeline: 6-8 weeks**

### **Cost Comparison at Scale:**

**100,000 Requests/Day:**
- Vercel + Railway: $270/month
- AWS (CloudFront + Lambda + RDS): $200/month
- Savings: **26%**

**1,000,000 Requests/Day:**
- Vercel + Railway: $1,520-2,520/month
- AWS (CloudFront + ECS + RDS): $1,250/month
- Savings: **40-60%**

---

# 8. YC-Focused MRR Features

## Quick-Win Monetization Implementation

### **Priority 1: Usage-Based Pricing (Week 1)**

```typescript
// Stripe implementation
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create usage-based pricing
const price = await stripe.prices.create({
  currency: 'usd',
  recurring: {
    interval: 'month',
    usage_type: 'metered'
  },
  billing_scheme: 'tiered',
  tiers: [
    { up_to: 100000, flat_amount: 0 }, // Free tier
    { up_to: 500000, unit_amount: 10 }, // $0.10 per 1K events
    { up_to: 'inf', unit_amount: 5 }  // $0.05 per 1K events above 500K
  ],
  tiers_mode: 'graduated',
  product: 'prod_xxx'
});

// Report usage
await stripe.subscriptionItems.createUsageRecord(
  'si_xxx',
  {
    quantity: eventsTracked,
    timestamp: Math.floor(Date.now() / 1000)
  }
);
```

### **Priority 2: Freemium Conversion Funnel (Week 1-2)**

**Pricing Tiers:**
```typescript
const PRICING_TIERS = {
  FREE: {
    price: 0,
    events: 10_000,
    retention: 7, // days
    dashboards: 3,
    teamMembers: 1
  },
  STARTER: {
    price: 49,
    events: 100_000,
    retention: 30,
    dashboards: 10,
    teamMembers: 3
  },
  PRO: {
    price: 149,
    events: 500_000,
    retention: 90,
    dashboards: Infinity,
    teamMembers: 10,
    apiAccess: true
  },
  ENTERPRISE: {
    price: 499,
    events: Infinity,
    retention: 365,
    dashboards: Infinity,
    teamMembers: Infinity,
    whiteLabel: true,
    sso: true,
    dedicatedSupport: true
  }
};
```

### **Priority 3: MRR Analytics Dashboard (Week 2)**

```typescript
// ProfitWell integration (FREE)
import ProfitWell from 'profitwell-node';

const profitwell = new ProfitWell(process.env.PROFITWELL_API_KEY);

// Track subscription events
await profitwell.createSubscription({
  user_id: user.id,
  email: user.email,
  plan_id: 'pro',
  plan_currency: 'usd',
  value: 14900, // $149.00 in cents
  status: 'active'
});

// Metrics to track
const metrics = {
  mrr: await profitwell.getMRR(),
  churn: await profitwell.getChurnRate(),
  ltv: await profitwell.getLTV(),
  nrr: await profitwell.getNetRevenueRetention()
};
```

### **YC Demo Day Metrics to Show:**
- Current MRR: $[X]
- MRR Growth Rate: [Y]% MoM
- Customer Count: [N]
- Average Revenue Per Account (ARPA): $[Z]/mo
- Net Revenue Retention: [\u003e100%]
- Customer Churn: [\u003c5%]
- LTV:CAC Ratio: [\u003e3:1]

### **Quick-Win Revenue Features (2-4 weeks each):**
1. **White-labeling** ($200-500/mo add-on)
2. **API access** (Pro tier, $99+/mo)
3. **Export features** (gated in Pro)
4. **Slack integrations** (Pro tier)
5. **SSO/SAML** (Enterprise, $500+/mo)
6. **Custom domains** (Enterprise)
7. **Advanced alerting** ($25/mo add-on)

---

# 9. Production Architecture for 100k+ Websites

## Comprehensive Scaling Strategy

### **Technology Stack Recommendation:**

```yaml
Infrastructure:
  Cloud: AWS (primary)
  Orchestration: Kubernetes (EKS)
  IaC: Terraform

Data Ingestion:
  API Gateway: AWS API Gateway + Kong
  Event Streaming: Apache Kafka / Redpanda
  Load Balancing: AWS ALB/NLB

Data Processing:
  Stream Processing: Apache Flink
  Batch Processing: Apache Spark

Data Storage:
  Analytics: ClickHouse (time-series)
  Metrics: InfluxDB (real-time)
  Relational: PostgreSQL 15 + TimescaleDB
  Cache: Redis 7 (Cluster mode)
  Object Storage: AWS S3 + Glacier

Monitoring:
  Metrics: Prometheus + Grafana
  Logs: Loki + Grafana
  Traces: Jaeger + OpenTelemetry
  Alerts: Alertmanager + PagerDuty
```

### **Multi-Tenant Architecture:**

```sql
-- Hybrid sharding approach
CREATE TABLE tenant_catalog (
    tenant_id SERIAL PRIMARY KEY,
    tenant_name VARCHAR(255),
    shard_id INT,
    tier VARCHAR(50), -- free, pro, enterprise
    created_at TIMESTAMPTZ
);

-- Each shard uses time-series partitioning
CREATE TABLE events (
    tenant_id INT,
    event_time TIMESTAMPTZ,
    event_type VARCHAR(100),
    properties JSONB
) PARTITION BY RANGE (event_time);
```

### **Scaling Milestones:**

**0-10k Websites:**
- Modular monolith
- Single PostgreSQL database
- Cost: $5k-15k/mo
- Team: 3-5 engineers

**10k-50k Websites:**
- Extract ingestion microservice
- Add ClickHouse for analytics
- Database sharding (3-5 shards)
- Kafka event streaming
- Cost: $30k-80k/mo
- Team: 10-20 engineers

**50k-100k Websites:**
- Full microservices
- 10-20 database shards
- Multi-region deployment
- Kubernetes + service mesh
- Cost: $150k-300k/mo
- Team: 30-50 engineers

**100k+ Websites:**
- Global active-active
- 50+ database shards
- ML-powered auto-scaling
- Edge computing
- Cost: $500k+/mo
- Team: 50+ engineers

### **Performance Targets:**

```
Ingestion:
- Throughput: 100k-1M events/second
- Latency: \u003c100ms (p95)
- Availability: 99.9%

Query Performance:
- Simple queries: \u003c100ms (p95)
- Complex aggregations: \u003c1 second (p95)
- Dashboard loads: \u003c2 seconds (p95)

System Availability:
- API uptime: 99.95% (multi-AZ)
- Platform uptime: 99.99% (multi-region)
```

---

# 10. Implementation Roadmap

## 8-Week Sprint Plan for YC Demo

### **Week 1-2: Foundation**
- [ ] Set up Stripe integration
- [ ] Implement 3-tier pricing
- [ ] Create pricing page
- [ ] Configure ProfitWell MRR tracking
- [ ] Build basic MRR dashboard

### **Week 3-4: Monetization**
- [ ] Implement feature gating
- [ ] Add 14-day free trial
- [ ] Create email onboarding sequence (5 emails)
- [ ] Build upgrade CTAs in product
- [ ] Add annual billing option (20% discount)

### **Week 5-6: Quick Wins**
- [ ] Implement usage-based metering
- [ ] Add API access with rate limiting
- [ ] Build export features (CSV/PDF)
- [ ] Create Slack integration
- [ ] Add white-labeling capability

### **Week 7-8: Polish \u0026 Demo Prep**
- [ ] Set up monitoring dashboards
- [ ] Conduct load testing
- [ ] Optimize performance (\u003c50ms load times)
- [ ] Prepare YC Demo Day metrics
- [ ] Create pitch deck with MRR charts

---

# Cursor Prompt Templates Summary

## Complete Copy-Paste Prompts

### For Browser Extension:
```
Create a production-ready Chrome/Firefox browser extension for Dashdig analytics with Manifest V3, service worker, content script injection, and cross-browser compatibility using webextension-polyfill and Vite bundler.
```

### For WordPress Plugin:
```
Build a WordPress plugin that automatically injects Dashdig tracking script with admin settings page, API key configuration, position selector (header/footer), and WordPress Coding Standards compliance.
```

### For Embeddable Widget:
```
Create an async-loading embeddable JavaScript widget with Shadow DOM isolation, React/Vue/Angular integrations, \u003c30KB bundle size, and CDN distribution using Rollup.
```

### For Performance Optimization:
```
Optimize Dashdig codebase for sub-50ms load times using tree-shaking, code splitting, Brotli compression, resource hints (preconnect/preload), lazy loading, and Core Web Vitals optimization targeting LCP \u003c2.5s, FID \u003c100ms, CLS \u003c0.1.
```

### For Testing:
```
Create comprehensive test suite using Vitest (unit tests, 80%+ coverage), Playwright (E2E cross-browser tests), performance benchmarks, and real-world scenarios including high traffic simulation and network condition testing.
```

### For Deployment:
```
Set up optimal Vercel deployment for Next.js frontend with ISR, image optimization, and edge functions, plus Railway deployment for Node.js backend with Docker optimization, health checks, and cost monitoring.
```

### For Architecture:
```
Design production-grade microservices architecture for 100k+ websites using Kubernetes, ClickHouse time-series database, Kafka event streaming, Redis caching, multi-tenant sharding, and 99.9%+ uptime with multi-AZ deployment.
```

---

# Key Recommendations

## Critical Success Factors

1. **Start Simple**: Begin with modular monolith, extract microservices only when needed
2. **Monetize Early**: Have pricing infrastructure ready before YC Demo Day
3. **Performance First**: Target sub-50ms load times from day one
4. **Monitor Everything**: Set up Prometheus/Grafana or Datadog immediately
5. **Test Comprehensively**: 80%+ unit test coverage, E2E tests for critical flows
6. **Scale Incrementally**: Don't over-engineer for 100k websites on day one

## Cost Optimization Priorities

1. **Use ISR over SSR** (86% Vercel cost reduction)
2. **Implement caching aggressively** (80% of savings potential)
3. **Right-size compute resources** (20-30% savings)
4. **Use reserved instances** when ready (30-50% savings)
5. **Stay on Vercel/Railway until $1000+/mo** costs

## YC Demo Day Checklist

- [ ] MRR dashboard with growth chart
- [ ] Clear pricing page (even if not charging yet)
- [ ] Trial-to-paid conversion funnel (target: 17-25%)
- [ ] Usage-based pricing component
- [ ] Key metrics ready: MRR, growth %, NRR, churn, LTV:CAC
- [ ] Performance metrics: sub-3s load times, 95+ Lighthouse score
- [ ] Live demo with real data
- [ ] Backup demo video

---

This comprehensive guide provides everything needed to implement Dashdig's browser extension, WordPress plugin, embeddable widgets, performance optimizations, testing strategies, deployment pipelines, and scaling architecture. All prompts are designed to work with Cursor AI and Claude Sonnet 4.5, with specific implementation details that can be adapted to your actual codebase structure once you provide the repository access or details.