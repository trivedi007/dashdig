# DashDig Widget Examples

## 🚀 Get Started in 30 Seconds

Pick your framework and follow the Quick Start guide:

| Framework | Command | Opens |
|-----------|---------|-------|
| **React** | `cd react-example && npm install && npm run dev` | http://localhost:5173 |
| **Vue 3** | `cd vue-example && npm install && npm run dev` | http://localhost:5174 |
| **Angular** | `cd angular-example && npm install && npm start` | http://localhost:4200 |

---

## 📚 Complete Documentation

See [`INTEGRATION_EXAMPLES.md`](./INTEGRATION_EXAMPLES.md) for:
- Complete API reference
- Framework-specific guides
- Code examples
- Troubleshooting
- Best practices

---

## ⚡ Quick Examples

### React

```jsx
import { DashdigWidget } from '@dashdig/widget/react';

function App() {
  return <DashdigWidget apiKey="your-key" position="bottom-right" theme="light" />;
}
```

### Vue 3

```vue
<template>
  <DashdigWidget api-key="your-key" position="bottom-right" theme="light" />
</template>

<script setup>
import { DashdigWidget } from '@dashdig/widget/vue';
</script>
```

### Angular

```typescript
import { Component } from '@angular/core';
import { DashdigComponent } from '@dashdig/widget/angular';

@Component({
  standalone: true,
  imports: [DashdigComponent],
  template: '<dashdig-widget [apiKey]="apiKey"></dashdig-widget>'
})
export class AppComponent {
  apiKey = 'your-key';
}
```

### Vanilla JavaScript

```html
<script src="https://cdn.dashdig.com/v1.0.0/dashdig.min.js"></script>
<script>
  Dashdig.init({ apiKey: 'your-key' });
</script>
```

---

## 📦 What's Included

### React Example
- ⚡ Quick Start (30 seconds)
- 📦 Component-based usage
- 🎣 Hook-based usage
- 🎨 Modern UI with tabs

### Vue Example
- ⚡ Simple Test component
- 📦 Component-based usage  
- 🔌 Plugin integration
- 🎨 Composition API

### Angular Example
- ⚡ Simple Test (loads by default)
- 🧩 Component approach
- 💉 Service injection
- ⚡ Standalone components (Angular 17+)
- 📦 NgModule approach (Angular 14-16)

---

## 🎯 Features Demonstrated

### All Examples Show:
- ✅ Basic widget integration
- ✅ Show/hide controls
- ✅ Event tracking
- ✅ Custom themes (light/dark)
- ✅ Position controls
- ✅ Error handling
- ✅ TypeScript support (where applicable)

---

## 🔧 Requirements

- **Node.js:** 16+
- **npm:** 8+
- **Browser:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

## 📖 Documentation Links

- **Complete Guide:** [`INTEGRATION_EXAMPLES.md`](./INTEGRATION_EXAMPLES.md)
- **React README:** [`react-example/README.md`](./react-example/README.md)
- **Vue README:** [`vue-example/README.md`](./vue-example/README.md)
- **Angular README:** [`angular-example/README.md`](./angular-example/README.md)

---

## 🐛 Troubleshooting

### Port Already in Use?
```bash
# React/Vue
npm run dev -- --port 3001

# Angular
ng serve --port 4201
```

### Package Not Found?
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Widget Not Showing?
1. Check browser console for errors
2. Verify API key is correct
3. Check network tab for API calls
4. Try the Simple/Quick Start example first

---

## 💡 Next Steps

1. **Pick a framework** from the table above
2. **Run the example** with the command provided
3. **Open in browser** at the URL shown
4. **Click "Quick Start" tab** for simplest example
5. **Copy the code** to your project
6. **Replace API key** with yours from [dashdig.com](https://dashdig.com)

---

**Status:** ✅ All Examples Working & Tested
**Last Updated:** November 8, 2025
**Need Help?** See [INTEGRATION_EXAMPLES.md](./INTEGRATION_EXAMPLES.md)
