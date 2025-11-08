# DashDig Widget Documentation Index

Complete documentation for the DashDig JavaScript widget.

---

## 📚 Documentation Structure

### Core Documentation

1. **[README.md](./README.md)** - Main documentation
   - Quick Start (30 seconds)
   - Installation guide
   - Framework integration overview
   - Configuration options
   - API methods
   - Browser support
   - Bundle sizes
   - Performance metrics
   - Security best practices
   - Troubleshooting

2. **[API.md](./API.md)** - Detailed API reference
   - Configuration interface
   - All methods with signatures
   - Event system
   - TypeScript types
   - Framework-specific APIs
   - Error handling
   - Best practices

3. **[INTEGRATION.md](./INTEGRATION.md)** - Framework integration guides
   - React integration
   - Vue 3 integration
   - Angular integration
   - Vanilla JavaScript
   - Next.js setup
   - Nuxt 3 setup
   - WordPress integration
   - Common issues

---

## 🚀 Quick Start by Framework

### React
```jsx
import { DashdigWidget } from '@dashdig/widget/react';

<DashdigWidget apiKey="ddg_your_key" />
```
[Full React Guide →](./INTEGRATION.md#react-integration)

### Vue 3
```vue
<template>
  <DashdigWidget api-key="ddg_your_key" />
</template>

<script setup>
import { DashdigWidget } from '@dashdig/widget/vue';
</script>
```
[Full Vue Guide →](./INTEGRATION.md#vue-3-integration)

### Angular
```typescript
import { DashdigComponent } from '@dashdig/widget/angular';

@Component({
  imports: [DashdigComponent],
  template: '<dashdig-widget [apiKey]="apiKey"></dashdig-widget>'
})
```
[Full Angular Guide →](./INTEGRATION.md#angular-integration)

### Vanilla JS
```html
<script src="https://cdn.dashdig.com/v1.0.0/dashdig.min.js"></script>
<script>
  Dashdig.init({ apiKey: 'ddg_your_key' });
</script>
```
[Full Vanilla JS Guide →](./INTEGRATION.md#vanilla-javascript)

---

## 📖 Documentation by Topic

### Getting Started
- [Installation](./README.md#installation)
- [Quick Start](./README.md#quick-start)
- [Configuration Options](./README.md#configuration-options)
- [Examples](../examples/)

### Framework Integration
- [React Integration](./INTEGRATION.md#react-integration)
- [Vue 3 Integration](./INTEGRATION.md#vue-3-integration)
- [Angular Integration](./INTEGRATION.md#angular-integration)
- [Next.js Setup](./INTEGRATION.md#nextjs)
- [Nuxt 3 Setup](./INTEGRATION.md#nuxt-3)

### API Reference
- [init() Method](./API.md#initconfig)
- [track() Method](./API.md#trackevent-data)
- [show() / hide() Methods](./API.md#show)
- [Events System](./API.md#events)
- [TypeScript Types](./API.md#typescript-types)

### Advanced Topics
- [Performance Optimization](./README.md#performance)
- [Security Best Practices](./README.md#security)
- [Error Handling](./API.md#error-handling)
- [Best Practices](./API.md#best-practices)

### Troubleshooting
- [Common Issues](./INTEGRATION.md#common-issues)
- [Widget Not Appearing](./README.md#troubleshooting)
- [TypeScript Errors](./README.md#troubleshooting)
- [Build Errors](./README.md#troubleshooting)

---

## 📁 Additional Resources

### Examples
Complete working examples in multiple frameworks:
- [React Example](../examples/react-example/) - Component + Hook usage
- [Vue Example](../examples/vue-example/) - Component + Composable usage
- [Angular Example](../examples/angular-example/) - 5 integration patterns
- [Vanilla HTML](../examples/quickstart.html) - Simple HTML example

### Build & Deployment
- [Build Optimization](../BUILD_OPTIMIZATION.md) - Optimization techniques
- [CDN Deployment](../CDN_DEPLOYMENT.md) - CloudFlare R2 deployment
- [Build Verification](../BUILD_QUICK_REFERENCE.md) - Quality checks

### Project Documentation
- [Main README](../README.md) - Project overview
- [Changelog](../CHANGELOG.md) - Version history
- [Contributing Guide](../CONTRIBUTING.md) - How to contribute
- [License](../LICENSE) - MIT License

---

## 🎯 Common Use Cases

### 1. Add Analytics to Existing React App
```bash
npm install @dashdig/widget
```
```jsx
import { DashdigWidget } from '@dashdig/widget/react';

<DashdigWidget apiKey="ddg_your_key" />
```
✅ Done in 30 seconds!

### 2. Track Custom Events
```javascript
Dashdig.track('button_click', {
  button: 'signup',
  page: 'homepage'
});
```
[Learn more →](./API.md#trackevent-data)

### 3. Show/Hide Widget Programmatically
```javascript
// React
const { show, hide } = useDashdig(config);

// Vanilla JS
Dashdig.show();
Dashdig.hide();
```
[Learn more →](./API.md#show)

### 4. TypeScript Integration
```typescript
import type { DashdigConfig } from '@dashdig/widget/react';

const config: DashdigConfig = {
  apiKey: 'ddg_your_key',
  position: 'bottom-right'
};
```
[Learn more →](./API.md#typescript-types)

### 5. Next.js Setup
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
```
[Learn more →](./INTEGRATION.md#nextjs)

---

## 📊 Technical Specifications

### Bundle Sizes
| Bundle | Minified | Gzipped | Brotli |
|--------|----------|---------|--------|
| Core (Vanilla) | 4.7 KB | 1.9 KB | 1.6 KB |
| React | 9.0 KB | 3.3 KB | 2.8 KB |
| Vue 3 | 8.5 KB | 3.1 KB | 2.6 KB |
| Angular | 15.7 KB | 4.9 KB | 4.1 KB |

[Details →](./README.md#bundle-size)

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

[Details →](./README.md#browser-support)

### Performance
- First Load: 50-100ms
- Cached: <10ms
- Parse + Execute: <5ms
- Time to Interactive: <100ms

[Details →](./README.md#performance)

---

## 🔍 Search by Keyword

**Installation:** [README](./README.md#installation), [React](./INTEGRATION.md#react-integration), [Vue](./INTEGRATION.md#vue-3-integration), [Angular](./INTEGRATION.md#angular-integration)

**Configuration:** [Options](./README.md#configuration-options), [API Reference](./API.md#configuration)

**API Methods:** [init()](./API.md#initconfig), [track()](./API.md#trackevent-data), [show()](./API.md#show), [hide()](./API.md#hide)

**Events:** [Event System](./API.md#events), [Event Tracking](./API.md#trackevent-data)

**TypeScript:** [Types](./API.md#typescript-types), [React Types](./API.md#react), [Vue Types](./API.md#vue-3), [Angular Types](./API.md#angular)

**Frameworks:** [React](./INTEGRATION.md#react-integration), [Vue](./INTEGRATION.md#vue-3-integration), [Angular](./INTEGRATION.md#angular-integration), [Next.js](./INTEGRATION.md#nextjs), [Nuxt](./INTEGRATION.md#nuxt-3)

**Troubleshooting:** [Common Issues](./INTEGRATION.md#common-issues), [Widget Not Appearing](./README.md#troubleshooting), [Build Errors](./README.md#troubleshooting)

**Performance:** [Bundle Size](./README.md#bundle-size), [Optimization](./README.md#performance), [Build Guide](../BUILD_OPTIMIZATION.md)

**Security:** [CSP](./README.md#security), [SRI](./README.md#security), [Privacy](./README.md#security)

---

## 💡 Need Help?

### Documentation
- Start with [README.md](./README.md) for quick start
- Check [INTEGRATION.md](./INTEGRATION.md) for your framework
- See [API.md](./API.md) for detailed reference

### Examples
- Browse [/examples](../examples/) for working code
- Try the [Quick Start example](../examples/quickstart.html)
- Run framework examples locally

### Support
- **Email:** support@dashdig.com
- **GitHub Issues:** [Report a bug](https://github.com/dashdig/dashdig-widget/issues)
- **Discord:** [Join community](https://discord.gg/dashdig)

---

**Last Updated:** November 8, 2025
**Documentation Version:** 1.0.0

