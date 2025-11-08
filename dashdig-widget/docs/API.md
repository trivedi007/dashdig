# DashDig Widget API Reference

Complete API documentation for the DashDig JavaScript widget.

---

## Table of Contents

- [Global Object](#global-object)
- [Configuration](#configuration)
- [Methods](#methods)
- [Events](#events)
- [TypeScript Types](#typescript-types)
- [Framework-Specific APIs](#framework-specific-apis)

---

## Global Object

When loaded via CDN, DashDig is available as a global object on `window.Dashdig` or `window.DashdigWidget`.

```javascript
console.log(Dashdig); // Widget instance
console.log(typeof Dashdig.init); // 'function'
```

---

## Configuration

### `DashdigConfig`

Configuration object for initializing the widget.

```typescript
interface DashdigConfig {
  // Required
  apiKey: string;

  // Optional
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'light' | 'dark';
  autoShow?: boolean;
  apiUrl?: string;
  enableWebVitals?: boolean;
}
```

#### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `apiKey` | `string` | ✅ Yes | - | Your DashDig API key from dashdig.com |
| `position` | `'bottom-right'` \| `'bottom-left'` | No | `'bottom-right'` | Widget position on screen |
| `theme` | `'light'` \| `'dark'` | No | `'light'` | Widget color theme |
| `autoShow` | `boolean` | No | `true` | Automatically show widget on init |
| `apiUrl` | `string` | No | `'https://api.dashdig.com'` | Custom API endpoint URL |
| `enableWebVitals` | `boolean` | No | `true` | Enable Web Vitals tracking |

---

## Methods

### `init(config)`

Initialize the DashDig widget with configuration.

**Signature:**
```typescript
init(config: DashdigConfig): Promise<void>
```

**Parameters:**
- `config` (Object): Configuration options

**Returns:**
- `Promise<void>`: Resolves when initialization is complete

**Throws:**
- `Error`: If API key is missing or invalid

**Example:**
```javascript
try {
  await Dashdig.init({
    apiKey: 'ddg_your_api_key_here',
    position: 'bottom-right',
    theme: 'light',
    autoShow: true
  });
  console.log('Widget initialized successfully!');
} catch (error) {
  console.error('Initialization failed:', error);
}
```

---

### `show()`

Display the widget on the page.

**Signature:**
```typescript
show(): void
```

**Parameters:** None

**Returns:** `void`

**Example:**
```javascript
// Show the widget
Dashdig.show();

// Show after user interaction
document.getElementById('helpButton').addEventListener('click', () => {
  Dashdig.show();
});
```

---

### `hide()`

Hide the widget from the page.

**Signature:**
```typescript
hide(): void
```

**Parameters:** None

**Returns:** `void`

**Example:**
```javascript
// Hide the widget
Dashdig.hide();

// Hide after 5 seconds
setTimeout(() => {
  Dashdig.hide();
}, 5000);
```

---

### `track(event, data?)`

Track a custom event with optional data.

**Signature:**
```typescript
track(event: string, data?: Record<string, any>): void
```

**Parameters:**
- `event` (string): Event name (required)
- `data` (Object): Optional event data

**Returns:** `void`

**Examples:**

**Simple event:**
```javascript
Dashdig.track('page_view');
```

**Event with data:**
```javascript
Dashdig.track('button_click', {
  button: 'signup',
  page: 'homepage',
  timestamp: new Date().toISOString()
});
```

**Complex event:**
```javascript
Dashdig.track('purchase_complete', {
  product: 'Pro Plan',
  amount: 29.99,
  currency: 'USD',
  user: {
    id: 'user_123',
    email: 'user@example.com',
    plan: 'free'
  },
  metadata: {
    source: 'web',
    campaign: 'summer_sale'
  }
});
```

**Best Practices:**
- Use snake_case for event names
- Keep event names descriptive but concise
- Include relevant context in data
- Avoid sensitive information (passwords, credit cards, etc.)

---

### `destroy()`

Cleanup and remove the widget from the page.

**Signature:**
```typescript
destroy(): void
```

**Parameters:** None

**Returns:** `void`

**Example:**
```javascript
// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  Dashdig.destroy();
});

// Cleanup in SPA navigation
router.beforeEach((to, from, next) => {
  if (from.path !== to.path) {
    Dashdig.destroy();
  }
  next();
});
```

---

### `getConfig()`

Get the current widget configuration.

**Signature:**
```typescript
getConfig(): Readonly<Required<DashdigConfig>>
```

**Parameters:** None

**Returns:**
- `Readonly<Required<DashdigConfig>>`: Current configuration (read-only)

**Example:**
```javascript
const config = Dashdig.getConfig();
console.log('Current API Key:', config.apiKey);
console.log('Current Theme:', config.theme);
console.log('Position:', config.position);
```

---

### `isShown()`

Check if the widget is currently visible.

**Signature:**
```typescript
isShown(): boolean
```

**Parameters:** None

**Returns:**
- `boolean`: `true` if widget is visible, `false` otherwise

**Example:**
```javascript
if (Dashdig.isShown()) {
  console.log('Widget is visible');
} else {
  console.log('Widget is hidden');
}

// Toggle visibility
const toggleWidget = () => {
  if (Dashdig.isShown()) {
    Dashdig.hide();
  } else {
    Dashdig.show();
  }
};
```

---

## Events

### Custom Events

The widget emits custom DOM events that you can listen to.

#### Event: `dashdig:load`

Fired when the widget successfully loads and initializes.

**Event Detail:** `void`

**Example:**
```javascript
window.addEventListener('dashdig:load', () => {
  console.log('DashDig widget loaded!');
  // Initialize your app features that depend on the widget
  initAnalytics();
});
```

---

#### Event: `dashdig:error`

Fired when the widget encounters an error.

**Event Detail:** `{ error: Error }`

**Example:**
```javascript
window.addEventListener('dashdig:error', (event) => {
  console.error('DashDig error:', event.detail.error);
  // Handle error (show fallback, notify user, etc.)
  showErrorNotification('Analytics temporarily unavailable');
});
```

---

#### Event: `dashdig:show`

Fired when the widget becomes visible.

**Event Detail:** `void`

**Example:**
```javascript
window.addEventListener('dashdig:show', () => {
  console.log('Widget is now visible');
  // Track widget visibility
  analytics.track('widget_shown');
});
```

---

#### Event: `dashdig:hide`

Fired when the widget is hidden.

**Event Detail:** `void`

**Example:**
```javascript
window.addEventListener('dashdig:hide', () => {
  console.log('Widget is now hidden');
  // Track widget hiding
  analytics.track('widget_hidden');
});
```

---

#### Event: `dashdig:track`

Fired when an event is tracked.

**Event Detail:** `{ event: string, data?: Record<string, any> }`

**Example:**
```javascript
window.addEventListener('dashdig:track', (event) => {
  console.log('Event tracked:', event.detail.event);
  console.log('Event data:', event.detail.data);
});
```

---

## TypeScript Types

### Import Types

```typescript
// Core types
import type { 
  DashdigConfig,
  DashdigWidget as DashdigInstance
} from '@dashdig/widget';

// React types
import type {
  DashdigWidgetProps,
  UseDashdigOptions,
  UseDashdigReturn
} from '@dashdig/widget/react';

// Vue types
import type {
  DashdigWidgetProps,
  UseDashdigOptions
} from '@dashdig/widget/vue';

// Angular types
import type {
  DashdigConfig,
  DashdigComponent
} from '@dashdig/widget/angular';
```

---

### Type Definitions

#### `DashdigConfig`

```typescript
interface DashdigConfig {
  apiKey: string;
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'light' | 'dark';
  autoShow?: boolean;
  apiUrl?: string;
  enableWebVitals?: boolean;
}
```

#### `DashdigWidget` (Core)

```typescript
interface DashdigWidget {
  init(config: DashdigConfig): Promise<void>;
  show(): void;
  hide(): void;
  track(event: string, data?: Record<string, any>): void;
  destroy(): void;
  getConfig(): Readonly<Required<DashdigConfig>>;
  isShown(): boolean;
}
```

#### `WebVitalsMetrics`

```typescript
interface WebVitalsMetrics {
  lcp?: number;  // Largest Contentful Paint
  fid?: number;  // First Input Delay
  cls?: number;  // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  fcp?: number;  // First Contentful Paint
}
```

---

## Framework-Specific APIs

### React

#### Component Props

```typescript
interface DashdigWidgetProps {
  apiKey: string;
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'light' | 'dark';
  autoShow?: boolean;
  apiUrl?: string;
  enableWebVitals?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}
```

#### `useDashdig` Hook

```typescript
function useDashdig(config: DashdigConfig): UseDashdigReturn;

interface UseDashdigReturn {
  widget: DashdigWidget | null;
  track: (event: string, data?: Record<string, any>) => void;
  show: () => void;
  hide: () => void;
  isShown: () => boolean;
}
```

**Example:**
```typescript
import { useDashdig } from '@dashdig/widget/react';

function MyComponent() {
  const { widget, track, show, hide, isShown } = useDashdig({
    apiKey: 'ddg_your_key',
    position: 'bottom-right'
  });

  const handleClick = () => {
    track('button_click', { button: 'example' });
  };

  return (
    <div>
      <button onClick={show}>Show</button>
      <button onClick={hide}>Hide</button>
      <button onClick={handleClick}>Track</button>
      <p>Widget visible: {isShown() ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

---

### Vue 3

#### Component Props

```typescript
interface DashdigWidgetProps {
  apiKey: string;
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'light' | 'dark';
  autoShow?: boolean;
  apiUrl?: string;
  enableWebVitals?: boolean;
}
```

#### Component Events

```typescript
interface DashdigWidgetEmits {
  (event: 'load'): void;
  (event: 'error', error: Error): void;
}
```

#### `useDashdig` Composable

```typescript
function useDashdig(config: DashdigConfig): UseDashdigReturn;

interface UseDashdigReturn {
  widget: Ref<DashdigWidget | null>;
  track: (event: string, data?: Record<string, any>) => void;
  show: () => void;
  hide: () => void;
  isShown: () => boolean;
}
```

**Example:**
```vue
<script setup lang="ts">
import { useDashdig } from '@dashdig/widget/vue';

const { widget, track, show, hide, isShown } = useDashdig({
  apiKey: 'ddg_your_key',
  position: 'bottom-right'
});

const handleClick = () => {
  track('button_click', { button: 'example' });
};
</script>

<template>
  <div>
    <button @click="show">Show</button>
    <button @click="hide">Hide</button>
    <button @click="handleClick">Track</button>
    <p>Widget visible: {{ isShown() ? 'Yes' : 'No' }}</p>
  </div>
</template>
```

---

### Angular

#### Component Inputs

```typescript
class DashdigComponent {
  @Input() apiKey!: string;
  @Input() position?: 'bottom-right' | 'bottom-left';
  @Input() theme?: 'light' | 'dark';
  @Input() autoShow?: boolean;
  @Input() apiUrl?: string;
  @Input() enableWebVitals?: boolean;
}
```

#### Component Outputs

```typescript
class DashdigComponent {
  @Output() load = new EventEmitter<void>();
  @Output() error = new EventEmitter<Error>();
}
```

#### Component Methods

```typescript
class DashdigComponent {
  show(): void;
  hide(): void;
  track(event: string, data?: Record<string, any>): void;
  getInstance(): DashdigWidget | null;
}
```

#### Service API

```typescript
@Injectable({ providedIn: 'root' })
class DashdigService {
  show(): void;
  hide(): void;
  track(event: string, data?: Record<string, any>): void;
  getInstance(): DashdigWidget | null;
  isInitialized(): boolean;
  initializeWith(config: DashdigConfig): void;
  destroy(): void;
}
```

**Example:**
```typescript
import { Component, ViewChild } from '@angular/core';
import { DashdigComponent } from '@dashdig/widget/angular';

@Component({
  selector: 'app-root',
  template: `
    <dashdig-widget 
      #widget
      [apiKey]="apiKey"
      (load)="onLoad()">
    </dashdig-widget>
    <button (click)="widget.show()">Show</button>
    <button (click)="widget.hide()">Hide</button>
  `
})
export class AppComponent {
  apiKey = 'ddg_your_key';
  @ViewChild('widget') widget!: DashdigComponent;

  onLoad() {
    console.log('Widget loaded!');
  }
}
```

---

## Error Handling

### Error Types

```typescript
class DashdigError extends Error {
  constructor(message: string, code?: string);
  code?: string;
}
```

### Common Errors

| Code | Message | Solution |
|------|---------|----------|
| `MISSING_API_KEY` | API key is required | Provide valid API key in config |
| `INVALID_API_KEY` | API key is invalid | Check API key is correct |
| `NETWORK_ERROR` | Network request failed | Check internet connection |
| `INITIALIZATION_ERROR` | Widget initialization failed | Check config and console |
| `API_ERROR` | API returned error | Check API status |

### Example Error Handling

```javascript
try {
  await Dashdig.init({
    apiKey: 'ddg_invalid_key'
  });
} catch (error) {
  if (error instanceof DashdigError) {
    switch (error.code) {
      case 'MISSING_API_KEY':
        console.error('Please provide an API key');
        break;
      case 'INVALID_API_KEY':
        console.error('API key is invalid');
        break;
      case 'NETWORK_ERROR':
        console.error('Network connection failed');
        break;
      default:
        console.error('Unexpected error:', error.message);
    }
  }
}
```

---

## Best Practices

### 1. Error Handling

Always handle initialization errors:

```javascript
try {
  await Dashdig.init(config);
} catch (error) {
  console.error('Widget failed to initialize:', error);
  // Show fallback or notify user
}
```

### 2. Event Tracking

Use descriptive event names:

```javascript
// ✅ Good
Dashdig.track('purchase_complete', { amount: 29.99 });

// ❌ Bad
Dashdig.track('event1', { data: 'something' });
```

### 3. Performance

Initialize widget after critical content:

```javascript
// Wait for critical content to load
window.addEventListener('load', () => {
  Dashdig.init(config);
});
```

### 4. Privacy

Respect user privacy:

```javascript
// Check consent before initializing
if (userHasConsented()) {
  Dashdig.init(config);
}
```

### 5. Cleanup

Always cleanup in SPAs:

```javascript
// React
useEffect(() => {
  Dashdig.init(config);
  return () => Dashdig.destroy();
}, []);

// Vue
onUnmounted(() => {
  Dashdig.destroy();
});

// Angular
ngOnDestroy() {
  this.dashdig.destroy();
}
```

---

## See Also

- [Main Documentation](./README.md)
- [Integration Guide](./INTEGRATION.md)
- [Examples](../examples/)
- [Changelog](../CHANGELOG.md)

---

**Last Updated:** November 8, 2025
**API Version:** 1.0.0

