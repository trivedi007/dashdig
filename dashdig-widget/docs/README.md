# DashDig JavaScript Widget

AI-powered analytics widget for any website. Lightweight, fast, and easy to integrate.

---

## ⚡ Quick Start

### CDN (Fastest - 30 Seconds)

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <h1>My Website</h1>

  <!-- Add DashDig Widget -->
  <script src="https://cdn.dashdig.com/v1.0.0/dashdig.min.js"></script>
  <script>
    Dashdig.init({
      apiKey: 'ddg_your_api_key_here',
      position: 'bottom-right',
      theme: 'light'
    });
  </script>
</body>
</html>
```

**That's it!** The widget is now tracking analytics.

### NPM (React/Vue/Angular)

```bash
npm install @dashdig/widget
```

See [Framework Integration](#framework-integration) below.

---

## 📦 Installation

### Option 1: CDN (Recommended for Quick Start)

```html
<!-- Latest version (auto-updates) -->
<script src="https://cdn.dashdig.com/latest/dashdig.min.js"></script>

<!-- Specific version (recommended for production) -->
<script src="https://cdn.dashdig.com/v1.0.0/dashdig.min.js"></script>

<!-- With SRI (most secure) -->
<script 
  src="https://cdn.dashdig.com/v1.0.0/dashdig.min.js"
  integrity="sha384-[hash-from-.cdn-integrity/hashes.txt]"
  crossorigin="anonymous">
</script>
```

### Option 2: NPM

```bash
# Install package
npm install @dashdig/widget

# Or with Yarn
yarn add @dashdig/widget

# Or with pnpm
pnpm add @dashdig/widget
```

---

## 🚀 Framework Integration

### React

```jsx
import { DashdigWidget } from '@dashdig/widget/react';

function App() {
  return (
    <DashdigWidget 
      apiKey="ddg_your_api_key_here"
      position="bottom-right"
      theme="light"
    />
  );
}

export default App;
```

**Advanced with Hook:**
```jsx
import { useDashdig } from '@dashdig/widget/react';

function App() {
  const { widget, track, show, hide } = useDashdig({
    apiKey: 'ddg_your_api_key_here',
    position: 'bottom-right'
  });

  const handleClick = () => {
    track('button_click', { button: 'signup' });
  };

  return (
    <div>
      <button onClick={show}>Show Widget</button>
      <button onClick={handleClick}>Track Event</button>
    </div>
  );
}
```

### Vue 3

```vue
<template>
  <div>
    <DashdigWidget 
      api-key="ddg_your_api_key_here"
      position="bottom-right"
      theme="light"
    />
  </div>
</template>

<script setup>
import { DashdigWidget } from '@dashdig/widget/vue';
</script>
```

**Advanced with Composable:**
```vue
<template>
  <div>
    <button @click="show">Show Widget</button>
    <button @click="trackEvent">Track Event</button>
  </div>
</template>

<script setup>
import { useDashdig } from '@dashdig/widget/vue';

const { widget, track, show, hide } = useDashdig({
  apiKey: 'ddg_your_api_key_here',
  position: 'bottom-right'
});

const trackEvent = () => {
  track('button_click', { button: 'signup' });
};
</script>
```

### Angular

```typescript
import { Component } from '@angular/core';
import { DashdigComponent } from '@dashdig/widget/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashdigComponent],
  template: `
    <dashdig-widget 
      [apiKey]="'ddg_your_api_key_here'"
      [position]="'bottom-right'"
      [theme]="'light'">
    </dashdig-widget>
  `
})
export class AppComponent {}
```

**Advanced with Service:**
```typescript
import { Component } from '@angular/core';
import { DashdigService } from '@dashdig/widget/angular';

@Component({
  selector: 'app-root',
  template: `
    <button (click)="show()">Show Widget</button>
    <button (click)="trackEvent()">Track Event</button>
  `
})
export class AppComponent {
  constructor(private dashdig: DashdigService) {}

  show() {
    this.dashdig.show();
  }

  trackEvent() {
    this.dashdig.track('button_click', { button: 'signup' });
  }
}
```

---

## ⚙️ Configuration Options

```typescript
interface DashdigConfig {
  // Required
  apiKey: string;              // Your DashDig API key (get from dashdig.com)

  // Optional
  position?: 'bottom-right' | 'bottom-left';  // Widget position (default: 'bottom-right')
  theme?: 'light' | 'dark';                    // Widget theme (default: 'light')
  autoShow?: boolean;                          // Auto-show on load (default: true)
  apiUrl?: string;                             // Custom API URL (default: 'https://api.dashdig.com')
  enableWebVitals?: boolean;                   // Track Web Vitals (default: true)
}
```

### Example with All Options

```javascript
Dashdig.init({
  apiKey: 'ddg_your_api_key_here',
  position: 'bottom-right',
  theme: 'dark',
  autoShow: false,
  apiUrl: 'https://api.dashdig.com',
  enableWebVitals: true
});
```

---

## 🔧 API Methods

### Global Object (CDN)

```javascript
// Initialize widget
Dashdig.init(config);

// Show widget
Dashdig.show();

// Hide widget
Dashdig.hide();

// Track custom event
Dashdig.track(event, data);

// Get current config
const config = Dashdig.getConfig();

// Check if visible
const isShown = Dashdig.isShown();

// Cleanup
Dashdig.destroy();
```

### Detailed Examples

#### Initialize
```javascript
await Dashdig.init({
  apiKey: 'ddg_your_api_key_here',
  position: 'bottom-right',
  theme: 'light'
});
console.log('Widget initialized!');
```

#### Track Events
```javascript
// Simple event
Dashdig.track('page_view');

// Event with data
Dashdig.track('button_click', {
  button: 'signup',
  page: 'homepage',
  timestamp: new Date().toISOString()
});

// Complex event
Dashdig.track('purchase', {
  product: 'Pro Plan',
  amount: 29.99,
  currency: 'USD',
  user: {
    id: 'user_123',
    email: 'user@example.com'
  }
});
```

#### Show/Hide
```javascript
// Show widget
Dashdig.show();

// Hide widget
Dashdig.hide();

// Toggle based on condition
if (userIsLoggedIn) {
  Dashdig.show();
} else {
  Dashdig.hide();
}
```

---

## 📊 Events

### Widget Events

```javascript
// Listen for widget load
window.addEventListener('dashdig:load', () => {
  console.log('Widget loaded!');
});

// Listen for errors
window.addEventListener('dashdig:error', (event) => {
  console.error('Widget error:', event.detail);
});

// Listen for visibility changes
window.addEventListener('dashdig:show', () => {
  console.log('Widget shown');
});

window.addEventListener('dashdig:hide', () => {
  console.log('Widget hidden');
});
```

### Framework Events

**React:**
```jsx
<DashdigWidget 
  apiKey="..."
  onLoad={() => console.log('Loaded!')}
  onError={(error) => console.error('Error:', error)}
/>
```

**Vue:**
```vue
<DashdigWidget 
  api-key="..."
  @load="onLoad"
  @error="onError"
/>
```

**Angular:**
```typescript
<dashdig-widget 
  [apiKey]="apiKey"
  (load)="onLoad()"
  (error)="onError($event)">
</dashdig-widget>
```

---

## 📁 Examples

Complete working examples are available in `/examples`:

| Framework | Location | Quick Start |
|-----------|----------|-------------|
| **React** | `/examples/react-example` | [React Guide](../examples/react-example/README.md) |
| **Vue 3** | `/examples/vue-example` | [Vue Guide](../examples/vue-example/README.md) |
| **Angular** | `/examples/angular-example` | [Angular Guide](../examples/angular-example/README.md) |
| **Vanilla** | `/examples/quickstart.html` | Open in browser |

### Running Examples

```bash
# React
cd examples/react-example && npm install && npm run dev

# Vue
cd examples/vue-example && npm install && npm run dev

# Angular
cd examples/angular-example && npm install && npm start
```

---

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |

**ES2020 Features:**
- Optional chaining (`?.`)
- Nullish coalescing (`??`)
- Dynamic imports
- No polyfills required!

---

## 📦 Bundle Size

### Core Widget (Vanilla JS)
- **Minified:** 4.7 KB
- **Gzipped:** 1.9 KB
- **Brotli:** 1.6 KB

### React Integration
- **Minified:** 9.0 KB
- **Gzipped:** 3.3 KB
- **Brotli:** 2.8 KB

### Angular Integration
- **Minified:** 15.7 KB
- **Gzipped:** 4.9 KB
- **Brotli:** 4.1 KB

**All well under the 30 KB target!** 🎉

**Comparison to competitors:**
- Google Analytics: 17.5 KB gzipped
- Mixpanel: 44 KB gzipped
- DashDig: **1.9 KB gzipped** (10-20x smaller!)

---

## 🚀 Performance

### Load Times
- **First Load:** 50-100ms
- **Cached:** <10ms
- **Parse + Execute:** <5ms
- **Time to Interactive:** <100ms

### Web Vitals
The widget automatically tracks Core Web Vitals:
- ✅ Largest Contentful Paint (LCP)
- ✅ First Input Delay (FID)
- ✅ Cumulative Layout Shift (CLS)
- ✅ Time to First Byte (TTFB)
- ✅ First Contentful Paint (FCP)

### Optimization Features
- ✅ Lazy loading
- ✅ Code splitting
- ✅ Tree-shaking
- ✅ Gzip + Brotli compression
- ✅ CDN caching
- ✅ Shadow DOM isolation

---

## 🔐 Security

### Content Security Policy (CSP)

```html
<meta http-equiv="Content-Security-Policy" 
  content="script-src 'self' https://cdn.dashdig.com; connect-src 'self' https://api.dashdig.com">
```

### Subresource Integrity (SRI)

```html
<script 
  src="https://cdn.dashdig.com/v1.0.0/dashdig.min.js"
  integrity="sha384-..."
  crossorigin="anonymous">
</script>
```

Get SRI hashes from: `.cdn-integrity/hashes.txt` in the repo.

### Privacy

- ✅ GDPR compliant
- ✅ No cookies by default
- ✅ No personal data tracking
- ✅ Respects Do Not Track
- ✅ User consent support

---

## 🐛 Troubleshooting

### Widget Not Loading

**Problem:** Widget doesn't appear on page.

**Solutions:**
1. Check API key is correct
2. Verify script is loaded: `console.log(typeof Dashdig)`
3. Check browser console for errors
4. Ensure API endpoint is accessible

### TypeScript Errors

**Problem:** TypeScript errors in framework integration.

**Solution:**
```typescript
// Ensure types are imported
import type { DashdigConfig } from '@dashdig/widget/react';

// Or use explicit types
const config: DashdigConfig = {
  apiKey: 'ddg_...',
  position: 'bottom-right'
};
```

### Build Errors

**Problem:** Build fails with module not found.

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Verify installation
npm list @dashdig/widget
```

### Widget Hidden Behind Content

**Problem:** Widget is not visible or behind other elements.

**Solution:**
```css
/* Increase z-index if needed */
#dashdig-widget-container {
  z-index: 999999 !important;
}
```

---

## 📚 Additional Documentation

- **API Reference:** [API.md](./API.md) - Detailed API documentation
- **Integration Guide:** [INTEGRATION.md](./INTEGRATION.md) - Framework-specific guides
- **Examples:** [/examples](../examples/) - Working code examples
- **Build Optimization:** [BUILD_OPTIMIZATION.md](../BUILD_OPTIMIZATION.md)
- **CDN Deployment:** [CDN_DEPLOYMENT.md](../CDN_DEPLOYMENT.md)

---

## 🤝 Support

### Documentation
- **Main Docs:** https://dashdig.com/docs
- **Widget Docs:** https://dashdig.com/docs/widget
- **API Reference:** https://dashdig.com/docs/api

### Resources
- **Website:** https://dashdig.com
- **GitHub:** https://github.com/dashdig/dashdig-widget
- **NPM:** https://npmjs.com/package/@dashdig/widget
- **Issues:** https://github.com/dashdig/dashdig-widget/issues

### Contact
- **Email:** support@dashdig.com
- **Twitter:** @dashdig
- **Discord:** https://discord.gg/dashdig

---

## 📄 License

MIT License - see [LICENSE](../LICENSE) file for details.

---

## 🎯 Quick Links

- [Get API Key](https://dashdig.com/signup)
- [View Dashboard](https://dashdig.com/dashboard)
- [Examples](/examples)
- [Changelog](../CHANGELOG.md)
- [Contributing](../CONTRIBUTING.md)

---

**Last Updated:** November 8, 2025
**Version:** 1.0.0
**Status:** ✅ Production Ready

