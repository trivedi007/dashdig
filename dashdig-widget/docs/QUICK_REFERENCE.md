# DashDig Widget - Quick Reference Card

Single-page reference for common tasks. Perfect for bookmarking! 🔖

---

## ⚡ 30-Second Integration

### React
```jsx
import { DashdigWidget } from '@dashdig/widget/react';
<DashdigWidget apiKey="ddg_your_key" />
```

### Vue 3
```vue
<template>
  <DashdigWidget api-key="ddg_your_key" />
</template>
<script setup>
import { DashdigWidget } from '@dashdig/widget/vue';
</script>
```

### Angular
```typescript
import { DashdigComponent } from '@dashdig/widget/angular';
@Component({
  imports: [DashdigComponent],
  template: '<dashdig-widget [apiKey]="apiKey"></dashdig-widget>'
})
```

### Vanilla JS
```html
<script src="https://cdn.dashdig.com/v1.0.0/dashdig.min.js"></script>
<script>Dashdig.init({ apiKey: 'ddg_your_key' });</script>
```

---

## 📦 Installation

```bash
# NPM
npm install @dashdig/widget

# Yarn
yarn add @dashdig/widget

# pnpm
pnpm add @dashdig/widget

# CDN
<script src="https://cdn.dashdig.com/v1.0.0/dashdig.min.js"></script>
```

---

## ⚙️ Configuration

```javascript
{
  apiKey: 'ddg_your_key',           // Required
  position: 'bottom-right',         // 'bottom-right' | 'bottom-left'
  theme: 'light',                   // 'light' | 'dark'
  autoShow: true,                   // boolean
  apiUrl: 'https://api.dashdig.com', // string
  enableWebVitals: true             // boolean
}
```

---

## 🔧 Core Methods

```javascript
// Initialize
await Dashdig.init(config);

// Show/Hide
Dashdig.show();
Dashdig.hide();

// Track event
Dashdig.track('event_name', { key: 'value' });

// Check state
const isVisible = Dashdig.isShown();
const config = Dashdig.getConfig();

// Cleanup
Dashdig.destroy();
```

---

## 📊 Event Tracking

```javascript
// Simple event
Dashdig.track('page_view');

// Event with data
Dashdig.track('button_click', {
  button: 'signup',
  page: 'homepage'
});

// Complex event
Dashdig.track('purchase', {
  product: 'Pro Plan',
  amount: 29.99,
  currency: 'USD'
});
```

---

## 🎣 React Hooks

```jsx
import { useDashdig } from '@dashdig/widget/react';

function MyComponent() {
  const { widget, track, show, hide, isShown } = useDashdig({
    apiKey: 'ddg_your_key'
  });

  return (
    <button onClick={() => track('click')}>Track</button>
  );
}
```

---

## 🔷 Vue Composables

```vue
<script setup>
import { useDashdig } from '@dashdig/widget/vue';

const { widget, track, show, hide, isShown } = useDashdig({
  apiKey: 'ddg_your_key'
});

const handleClick = () => track('click');
</script>
```

---

## 🅰️ Angular Service

```typescript
import { Component } from '@angular/core';
import { DashdigService } from '@dashdig/widget/angular';

@Component({
  selector: 'app-root',
  template: '<button (click)="track()">Track</button>'
})
export class AppComponent {
  constructor(private dashdig: DashdigService) {}

  track() {
    this.dashdig.track('click');
  }
}
```

---

## 📝 TypeScript Types

```typescript
import type {
  DashdigConfig,
  DashdigWidget,
  DashdigWidgetProps
} from '@dashdig/widget/react';

const config: DashdigConfig = {
  apiKey: 'ddg_your_key',
  position: 'bottom-right'
};
```

---

## 🎯 Next.js Setup

```typescript
// app/layout.tsx
import { DashdigWidget } from '@dashdig/widget/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <DashdigWidget apiKey={process.env.NEXT_PUBLIC_DASHDIG_API_KEY!} />
      </body>
    </html>
  );
}

// .env.local
NEXT_PUBLIC_DASHDIG_API_KEY=ddg_your_key
```

---

## 🔺 Nuxt 3 Setup

```typescript
// plugins/dashdig.client.ts
import { DashdigPlugin } from '@dashdig/widget/vue';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(DashdigPlugin, {
    apiKey: 'ddg_your_key'
  });
});
```

---

## 🎨 Events

```javascript
// Listen for widget load
window.addEventListener('dashdig:load', () => {
  console.log('Loaded!');
});

// Listen for errors
window.addEventListener('dashdig:error', (event) => {
  console.error('Error:', event.detail);
});

// Listen for visibility changes
window.addEventListener('dashdig:show', () => {});
window.addEventListener('dashdig:hide', () => {});
```

---

## 🐛 Troubleshooting

### Widget Not Appearing
```javascript
// Check if loaded
console.log(typeof Dashdig); // should be 'object'

// Check API key
const config = Dashdig.getConfig();
console.log(config.apiKey);

// Check visibility
console.log(Dashdig.isShown()); // should be true
```

### TypeScript Errors
```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["@dashdig/widget"]
  }
}
```

### Build Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Bundle Sizes

| Bundle | Minified | Gzipped |
|--------|----------|---------|
| Core   | 4.7 KB   | 1.9 KB  |
| React  | 9.0 KB   | 3.3 KB  |
| Vue 3  | 8.5 KB   | 3.1 KB  |
| Angular| 15.7 KB  | 4.9 KB  |

---

## 🌐 Browser Support

✅ Chrome 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Edge 90+

---

## 🔗 Quick Links

- [Main Docs](./README.md)
- [API Reference](./API.md)
- [Integration Guide](./INTEGRATION.md)
- [Examples](../examples/)
- [Get API Key](https://dashdig.com/signup)

---

## 💡 Common Patterns

### Conditional Loading
```jsx
{userConsented && <DashdigWidget apiKey="..." />}
```

### Error Handling
```javascript
try {
  await Dashdig.init(config);
} catch (error) {
  console.error('Init failed:', error);
}
```

### Cleanup in SPA
```javascript
// React
useEffect(() => {
  Dashdig.init(config);
  return () => Dashdig.destroy();
}, []);

// Vue
onUnmounted(() => Dashdig.destroy());

// Angular
ngOnDestroy() {
  this.dashdig.destroy();
}
```

### Track Route Changes
```javascript
// React Router
useEffect(() => {
  Dashdig.track('page_view', { path: location.pathname });
}, [location]);

// Vue Router
router.afterEach((to) => {
  Dashdig.track('page_view', { path: to.path });
});

// Angular Router
router.events.subscribe((event) => {
  if (event instanceof NavigationEnd) {
    Dashdig.track('page_view', { path: event.url });
  }
});
```

---

## 🎯 Best Practices

✅ Use environment variables for API keys  
✅ Initialize after critical content loads  
✅ Track meaningful events only  
✅ Respect user privacy preferences  
✅ Handle errors gracefully  
✅ Cleanup in single-page apps  
✅ Use TypeScript for type safety  
✅ Test in all target browsers

---

**Print this page for offline reference!** 📄

---

**Last Updated:** November 8, 2025  
**Version:** 1.0.0

