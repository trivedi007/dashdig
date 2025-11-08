# DashDig Widget - Vue 3 Example

This example demonstrates all three methods of integrating the DashDig widget into a Vue 3 application using TypeScript.

## 🎯 What's Included

This example showcases:

1. **Composition API (useDashdig)** - Recommended approach for Vue 3
2. **Component Approach** - Declarative component-based integration
3. **Plugin Approach** - Global installation for app-wide access

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The example will open at `http://localhost:3001`

## 📦 Project Structure

```
vue-example/
├── src/
│   ├── components/
│   │   ├── ComposableExample.vue    # useDashdig composable demo
│   │   ├── ComponentExample.vue     # <DashdigWidget> component demo
│   │   └── PluginExample.vue        # Global plugin demo
│   ├── App.vue                      # Main app with tab navigation
│   └── main.ts                      # App entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎨 Integration Methods

### 1. Composition API (useDashdig) ✨ Recommended

The `useDashdig` composable provides reactive state and automatic lifecycle management.

```vue
<script setup>
import { useDashdig } from '@dashdig/widget/vue';

const { show, hide, track, isLoaded, isVisible } = useDashdig('your-api-key', {
  position: 'bottom-right',
  theme: 'dark',
  autoShow: false
});

function handleClick() {
  track('button_click', { button: 'example' });
}
</script>

<template>
  <button @click="show">Show Widget</button>
  <button @click="hide">Hide Widget</button>
  <button @click="handleClick">Track Event</button>
  <p v-if="isLoaded">Widget loaded!</p>
</template>
```

**Features:**
- ✅ Reactive state (`isLoaded`, `isVisible`)
- ✅ Automatic initialization and cleanup
- ✅ TypeScript support
- ✅ Perfect for Composition API users

### 2. Component Approach

Use the `<DashdigWidget>` component for declarative integration.

```vue
<script setup>
import { ref } from 'vue';
import DashdigWidget from '@dashdig/widget/vue';

const widgetRef = ref(null);

const showWidget = () => widgetRef.value?.show();
const hideWidget = () => widgetRef.value?.hide();
</script>

<template>
  <DashdigWidget
    ref="widgetRef"
    api-key="your-api-key"
    position="bottom-right"
    theme="light"
    :auto-show="false"
    @load="onLoad"
    @error="onError"
  />

  <button @click="showWidget">Show Widget</button>
  <button @click="hideWidget">Hide Widget</button>
</template>
```

**Features:**
- ✅ Declarative component syntax
- ✅ Event handlers (`@load`, `@error`)
- ✅ Template ref access
- ✅ Vue-like API

### 3. Plugin Approach

Install DashDig globally for app-wide access.

```typescript
// main.ts
import { createApp } from 'vue';
import { DashdigPlugin } from '@dashdig/widget/vue';
import App from './App.vue';

const app = createApp(App);

app.use(DashdigPlugin, {
  apiKey: 'your-api-key',
  position: 'bottom-right',
  theme: 'light'
});

app.mount('#app');
```

```vue
<!-- Any component -->
<script setup>
import { getCurrentInstance } from 'vue';

const instance = getCurrentInstance();
const dashdig = instance?.proxy?.$dashdig;

function showWidget() {
  dashdig?.show();
}
</script>

<template>
  <button @click="showWidget">Show Widget</button>
</template>
```

**Features:**
- ✅ Single initialization
- ✅ Available in all components
- ✅ No imports needed
- ✅ TypeScript support

## 🔧 Configuration Options

All integration methods support these options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | Required | Your DashDig API key |
| `position` | `'bottom-right' \| 'bottom-left'` | `'bottom-right'` | Widget position |
| `theme` | `'light' \| 'dark'` | `'light'` | Widget theme |
| `autoShow` | `boolean` | `true` | Auto-show on init |
| `apiUrl` | `string` | Optional | Custom API URL |

## 📚 API Reference

### useDashdig Composable

```typescript
const {
  show,       // () => void - Show widget
  hide,       // () => void - Hide widget
  track,      // (event: string, data?: object) => void - Track event
  isLoaded,   // Readonly<Ref<boolean>> - Widget loaded state
  isVisible,  // Readonly<Ref<boolean>> - Widget visibility state
  widget      // Readonly<Ref<Widget | null>> - Widget instance
} = useDashdig(apiKey, options);
```

### DashdigWidget Component

**Props:**
- `api-key` (required): API key
- `position`: Widget position
- `theme`: Widget theme
- `auto-show`: Auto-show widget
- `api-url`: Custom API URL

**Events:**
- `@load`: Emitted when widget loads successfully
- `@error`: Emitted on initialization error

**Exposed Methods (via ref):**
- `show()`: Show the widget
- `hide()`: Hide the widget
- `track(event, data)`: Track custom event
- `widget`: Access widget instance

### DashdigPlugin

**Global Properties:**
- `$dashdig.show()`: Show widget
- `$dashdig.hide()`: Hide widget
- `$dashdig.track(event, data)`: Track event
- `$dashdig.getInstance()`: Get widget instance
- `$dashdig.isLoaded()`: Check if loaded

## 🎓 Examples in This Demo

### Composable Example
- Reactive state management
- Event tracking with JSON data
- Real-time status indicators
- Full configuration control

### Component Example
- Declarative component usage
- Template ref access
- Event handlers
- Exposed methods demonstration

### Plugin Example
- Global installation guide
- Multiple access methods (Options API, Composition API, Provide/Inject)
- Global method demonstration
- Installation status detection

## 🛠️ Development

### Available Scripts

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Tech Stack

- Vue 3.4+
- TypeScript 5.3+
- Vite 5.0+
- DashDig Widget SDK

## 🔗 Links

- [DashDig Widget Documentation](../../README.md)
- [Vue Integration Guide](../../docs/USAGE.md#vue-3)
- [API Reference](../../docs/API.md)
- [DashDig Website](https://dashdig.com)

## 💡 Tips

1. **Composable is Recommended**: Use `useDashdig` for most Vue 3 applications
2. **Plugin for Global Use**: Use `DashdigPlugin` if you need the widget everywhere
3. **Component for Flexibility**: Use `<DashdigWidget>` for specific components
4. **TypeScript Support**: All methods have full TypeScript support
5. **Reactive State**: The composable provides reactive `isLoaded` and `isVisible` state

## 🐛 Troubleshooting

### Widget Not Showing

Make sure you have:
1. Valid API key
2. Widget initialized (`isLoaded` is `true`)
3. Called `show()` method if `autoShow` is `false`

### Plugin Not Available

If `$dashdig` is undefined:
1. Check that you've called `app.use(DashdigPlugin, {...})`
2. Ensure you're accessing it after app mount
3. Check console for plugin installation errors

### TypeScript Errors

If you see TypeScript errors:
1. Ensure `@dashdig/widget/vue` is properly aliased in `vite.config.ts`
2. Check that TypeScript is configured correctly
3. Restart the TypeScript server

## 📄 License

This example is part of the DashDig Widget SDK.

---

**Ready to integrate DashDig into your Vue app?**

Check out the [main documentation](../../README.md) or explore the example code!





