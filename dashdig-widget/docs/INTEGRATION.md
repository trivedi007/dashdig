# DashDig Widget Integration Guide

Comprehensive integration guides for all supported frameworks and platforms.

---

## Table of Contents

- [React Integration](#react-integration)
- [Vue 3 Integration](#vue-3-integration)
- [Angular Integration](#angular-integration)
- [Vanilla JavaScript](#vanilla-javascript)
- [Next.js](#nextjs)
- [Nuxt 3](#nuxt-3)
- [WordPress](#wordpress)
- [Common Issues](#common-issues)

---

## React Integration

### Installation

```bash
npm install @dashdig/widget
# or
yarn add @dashdig/widget
# or
pnpm add @dashdig/widget
```

---

### Quick Start

**App.jsx / App.tsx**
```jsx
import React from 'react';
import { DashdigWidget } from '@dashdig/widget/react';

function App() {
  return (
    <div className="App">
      <h1>My React App</h1>
      
      {/* Add DashDig Widget */}
      <DashdigWidget 
        apiKey="ddg_your_api_key_here"
        position="bottom-right"
        theme="light"
      />
    </div>
  );
}

export default App;
```

**That's it!** Your React app now has analytics. ✅

---

### Component-Based Usage

**Full example with all props:**

```jsx
import React from 'react';
import { DashdigWidget } from '@dashdig/widget/react';

function App() {
  const handleLoad = () => {
    console.log('DashDig widget loaded successfully!');
  };

  const handleError = (error) => {
    console.error('DashDig error:', error);
  };

  return (
    <div className="App">
      <h1>My React App</h1>
      
      <DashdigWidget 
        apiKey="ddg_your_api_key_here"
        position="bottom-right"
        theme="light"
        autoShow={true}
        apiUrl="https://api.dashdig.com"
        enableWebVitals={true}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}

export default App;
```

---

### Hook-Based Usage

**Use the `useDashdig` hook for programmatic control:**

```jsx
import React from 'react';
import { useDashdig } from '@dashdig/widget/react';

function App() {
  const { widget, track, show, hide, isShown } = useDashdig({
    apiKey: 'ddg_your_api_key_here',
    position: 'bottom-right',
    theme: 'light'
  });

  const handleButtonClick = () => {
    track('button_click', {
      button: 'signup',
      page: 'homepage'
    });
  };

  const handleShowWidget = () => {
    show();
  };

  const handleHideWidget = () => {
    hide();
  };

  return (
    <div className="App">
      <h1>My React App</h1>
      
      <button onClick={handleButtonClick}>
        Sign Up (Tracked)
      </button>
      
      <button onClick={handleShowWidget}>
        Show Widget
      </button>
      
      <button onClick={handleHideWidget}>
        Hide Widget
      </button>
      
      <p>Widget visible: {isShown() ? 'Yes' : 'No'}</p>
    </div>
  );
}

export default App;
```

---

### TypeScript Support

**Full TypeScript example:**

```typescript
import React, { useCallback } from 'react';
import { DashdigWidget, useDashdig } from '@dashdig/widget/react';
import type { DashdigWidgetProps } from '@dashdig/widget/react';

// Component with typed props
function AnalyticsWidget() {
  const config: DashdigWidgetProps = {
    apiKey: process.env.REACT_APP_DASHDIG_API_KEY!,
    position: 'bottom-right',
    theme: 'light',
    autoShow: true
  };

  const handleLoad = useCallback(() => {
    console.log('Widget loaded!');
  }, []);

  const handleError = useCallback((error: Error) => {
    console.error('Error:', error);
  }, []);

  return (
    <DashdigWidget 
      {...config}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
}

// Hook usage with TypeScript
function TrackedButton() {
  const { track } = useDashdig({
    apiKey: process.env.REACT_APP_DASHDIG_API_KEY!
  });

  const handleClick = useCallback(() => {
    track('button_click', {
      timestamp: new Date().toISOString(),
      page: window.location.pathname
    });
  }, [track]);

  return (
    <button onClick={handleClick}>
      Tracked Button
    </button>
  );
}

export default function App() {
  return (
    <div>
      <AnalyticsWidget />
      <TrackedButton />
    </div>
  );
}
```

---

### Advanced Patterns

#### Conditional Rendering

```jsx
import React, { useState } from 'react';
import { DashdigWidget } from '@dashdig/widget/react';

function App() {
  const [showAnalytics, setShowAnalytics] = useState(true);

  return (
    <div>
      {showAnalytics && (
        <DashdigWidget apiKey="ddg_your_key" />
      )}
      
      <button onClick={() => setShowAnalytics(!showAnalytics)}>
        Toggle Analytics
      </button>
    </div>
  );
}
```

#### Context-Based Configuration

```jsx
import React, { createContext, useContext } from 'react';
import { DashdigWidget } from '@dashdig/widget/react';

const AnalyticsContext = createContext(null);

export function AnalyticsProvider({ children, config }) {
  return (
    <AnalyticsContext.Provider value={config}>
      <DashdigWidget {...config} />
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  return useContext(AnalyticsContext);
}

// Usage
function App() {
  return (
    <AnalyticsProvider config={{ apiKey: 'ddg_your_key' }}>
      <YourApp />
    </AnalyticsProvider>
  );
}
```

---

## Vue 3 Integration

### Installation

```bash
npm install @dashdig/widget
# or
yarn add @dashdig/widget
# or
pnpm add @dashdig/widget
```

---

### Quick Start

**App.vue**
```vue
<template>
  <div id="app">
    <h1>My Vue App</h1>
    
    <!-- Add DashDig Widget -->
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

**That's it!** Your Vue app now has analytics. ✅

---

### Component Usage (Composition API)

**Full example with all props:**

```vue
<template>
  <div id="app">
    <h1>My Vue App</h1>
    
    <DashdigWidget 
      :api-key="apiKey"
      position="bottom-right"
      theme="light"
      :auto-show="true"
      api-url="https://api.dashdig.com"
      :enable-web-vitals="true"
      @load="onLoad"
      @error="onError"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { DashdigWidget } from '@dashdig/widget/vue';

const apiKey = ref('ddg_your_api_key_here');

const onLoad = () => {
  console.log('DashDig widget loaded successfully!');
};

const onError = (error) => {
  console.error('DashDig error:', error);
};
</script>
```

---

### Composable Usage

**Use the `useDashdig` composable for programmatic control:**

```vue
<template>
  <div id="app">
    <h1>My Vue App</h1>
    
    <button @click="handleButtonClick">
      Sign Up (Tracked)
    </button>
    
    <button @click="show">Show Widget</button>
    <button @click="hide">Hide Widget</button>
    
    <p>Widget visible: {{ isShown() ? 'Yes' : 'No' }}</p>
  </div>
</template>

<script setup>
import { useDashdig } from '@dashdig/widget/vue';

const { widget, track, show, hide, isShown } = useDashdig({
  apiKey: 'ddg_your_api_key_here',
  position: 'bottom-right',
  theme: 'light'
});

const handleButtonClick = () => {
  track('button_click', {
    button: 'signup',
    page: 'homepage'
  });
};
</script>
```

---

### TypeScript Support

**Full TypeScript example:**

```vue
<template>
  <div id="app">
    <DashdigWidget 
      v-bind="config"
      @load="onLoad"
      @error="onError"
    />
    
    <button @click="trackEvent">Track Event</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { DashdigWidget, useDashdig } from '@dashdig/widget/vue';
import type { DashdigWidgetProps } from '@dashdig/widget/vue';

const apiKey = ref<string>('ddg_your_api_key_here');

const config = computed<DashdigWidgetProps>(() => ({
  apiKey: apiKey.value,
  position: 'bottom-right',
  theme: 'light',
  autoShow: true
}));

const { track } = useDashdig(config.value);

const onLoad = (): void => {
  console.log('Widget loaded!');
};

const onError = (error: Error): void => {
  console.error('Error:', error);
};

const trackEvent = (): void => {
  track('custom_event', {
    timestamp: new Date().toISOString()
  });
};
</script>
```

---

### Advanced Patterns

#### Plugin Installation

```typescript
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { DashdigPlugin } from '@dashdig/widget/vue';

const app = createApp(App);

app.use(DashdigPlugin, {
  apiKey: 'ddg_your_api_key_here',
  position: 'bottom-right',
  theme: 'light'
});

app.mount('#app');
```

#### Global Configuration

```typescript
// composables/useDashdig.ts
import { inject } from 'vue';
import type { DashdigWidget } from '@dashdig/widget/vue';

export function useDashdigGlobal() {
  const widget = inject<DashdigWidget>('dashdig');
  
  if (!widget) {
    throw new Error('DashDig not configured');
  }
  
  return widget;
}
```

---

## Angular Integration

### Installation

```bash
npm install @dashdig/widget
# or
yarn add @dashdig/widget
# or
pnpm add @dashdig/widget
```

---

### Quick Start (Standalone Component)

**app.component.ts**
```typescript
import { Component } from '@angular/core';
import { DashdigComponent } from '@dashdig/widget/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashdigComponent],
  template: `
    <h1>My Angular App</h1>
    
    <!-- Add DashDig Widget -->
    <dashdig-widget 
      [apiKey]="'ddg_your_api_key_here'"
      [position]="'bottom-right'"
      [theme]="'light'">
    </dashdig-widget>
  `
})
export class AppComponent {}
```

**That's it!** Your Angular app now has analytics. ✅

---

### Component Usage (Full Example)

**app.component.ts**
```typescript
import { Component } from '@angular/core';
import { DashdigComponent } from '@dashdig/widget/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashdigComponent],
  template: `
    <div class="app">
      <h1>My Angular App</h1>
      
      <dashdig-widget 
        [apiKey]="apiKey"
        [position]="position"
        [theme]="theme"
        [autoShow]="autoShow"
        [apiUrl]="apiUrl"
        [enableWebVitals]="enableWebVitals"
        (load)="onLoad()"
        (error)="onError($event)">
      </dashdig-widget>
    </div>
  `
})
export class AppComponent {
  apiKey = 'ddg_your_api_key_here';
  position: 'bottom-right' | 'bottom-left' = 'bottom-right';
  theme: 'light' | 'dark' = 'light';
  autoShow = true;
  apiUrl = 'https://api.dashdig.com';
  enableWebVitals = true;

  onLoad(): void {
    console.log('DashDig widget loaded successfully!');
  }

  onError(error: Error): void {
    console.error('DashDig error:', error);
  }
}
```

---

### Service-Based Usage

**app.component.ts**
```typescript
import { Component, OnInit } from '@angular/core';
import { DashdigService } from '@dashdig/widget/angular';

@Component({
  selector: 'app-root',
  template: `
    <div class="app">
      <h1>My Angular App</h1>
      
      <button (click)="trackEvent()">Sign Up (Tracked)</button>
      <button (click)="showWidget()">Show Widget</button>
      <button (click)="hideWidget()">Hide Widget</button>
    </div>
  `
})
export class AppComponent implements OnInit {
  constructor(private dashdig: DashdigService) {}

  ngOnInit(): void {
    this.dashdig.initializeWith({
      apiKey: 'ddg_your_api_key_here',
      position: 'bottom-right',
      theme: 'light'
    });
  }

  trackEvent(): void {
    this.dashdig.track('button_click', {
      button: 'signup',
      page: 'homepage'
    });
  }

  showWidget(): void {
    this.dashdig.show();
  }

  hideWidget(): void {
    this.dashdig.hide();
  }
}
```

---

### Module-Based Setup (Angular 14-16)

**app.module.ts**
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DashdigModule } from '@dashdig/widget/angular';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    DashdigModule.forRoot({
      apiKey: 'ddg_your_api_key_here',
      position: 'bottom-right',
      theme: 'light'
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

**app.component.ts**
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>My Angular App</h1>
    <dashdig-widget></dashdig-widget>
  `
})
export class AppComponent {}
```

---

### Advanced Patterns

#### ViewChild Access

```typescript
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { DashdigComponent } from '@dashdig/widget/angular';

@Component({
  selector: 'app-root',
  template: `
    <dashdig-widget 
      #widget
      [apiKey]="apiKey">
    </dashdig-widget>
    <button (click)="controlWidget()">Toggle</button>
  `
})
export class AppComponent implements AfterViewInit {
  @ViewChild('widget') widget!: DashdigComponent;
  apiKey = 'ddg_your_key';

  ngAfterViewInit(): void {
    console.log('Widget instance:', this.widget);
  }

  controlWidget(): void {
    if (this.widget) {
      this.widget.show();
      this.widget.track('widget_toggled');
    }
  }
}
```

#### Environment Configuration

```typescript
// environment.ts
export const environment = {
  production: false,
  dashdig: {
    apiKey: 'ddg_dev_key',
    position: 'bottom-right' as const,
    theme: 'light' as const
  }
};

// app.component.ts
import { Component } from '@angular/core';
import { DashdigComponent } from '@dashdig/widget/angular';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashdigComponent],
  template: `
    <dashdig-widget [apiKey]="config.apiKey" [position]="config.position"></dashdig-widget>
  `
})
export class AppComponent {
  config = environment.dashdig;
}
```

---

## Vanilla JavaScript

### CDN Usage

**index.html**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website</title>
</head>
<body>
  <h1>My Website</h1>
  <button id="trackButton">Track Event</button>

  <!-- Load DashDig Widget -->
  <script src="https://cdn.dashdig.com/v1.0.0/dashdig.min.js"></script>
  
  <script>
    // Initialize widget
    Dashdig.init({
      apiKey: 'ddg_your_api_key_here',
      position: 'bottom-right',
      theme: 'light'
    }).then(() => {
      console.log('DashDig initialized!');
    }).catch((error) => {
      console.error('Initialization error:', error);
    });

    // Track button click
    document.getElementById('trackButton').addEventListener('click', () => {
      Dashdig.track('button_click', { button: 'example' });
    });
  </script>
</body>
</html>
```

---

## Next.js

### App Router (Next.js 13+)

**app/layout.tsx**
```typescript
import { DashdigWidget } from '@dashdig/widget/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        
        {/* Add DashDig Widget */}
        <DashdigWidget 
          apiKey={process.env.NEXT_PUBLIC_DASHDIG_API_KEY!}
          position="bottom-right"
          theme="light"
        />
      </body>
    </html>
  );
}
```

### Pages Router (Next.js 12 and below)

**pages/_app.tsx**
```typescript
import type { AppProps } from 'next/app';
import { DashdigWidget } from '@dashdig/widget/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      
      {/* Add DashDig Widget */}
      <DashdigWidget 
        apiKey={process.env.NEXT_PUBLIC_DASHDIG_API_KEY!}
        position="bottom-right"
        theme="light"
      />
    </>
  );
}
```

**.env.local**
```
NEXT_PUBLIC_DASHDIG_API_KEY=ddg_your_api_key_here
```

---

## Nuxt 3

### Plugin Setup

**plugins/dashdig.client.ts**
```typescript
import { defineNuxtPlugin } from '#app';
import { DashdigPlugin } from '@dashdig/widget/vue';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  
  nuxtApp.vueApp.use(DashdigPlugin, {
    apiKey: config.public.dashdigApiKey,
    position: 'bottom-right',
    theme: 'light'
  });
});
```

**nuxt.config.ts**
```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      dashdigApiKey: process.env.DASHDIG_API_KEY
    }
  }
});
```

**.env**
```
DASHDIG_API_KEY=ddg_your_api_key_here
```

**app.vue**
```vue
<template>
  <div>
    <NuxtPage />
    <DashdigWidget 
      :api-key="dashdigApiKey"
      position="bottom-right"
    />
  </div>
</template>

<script setup>
import { DashdigWidget } from '@dashdig/widget/vue';

const config = useRuntimeConfig();
const dashdigApiKey = config.public.dashdigApiKey;
</script>
```

---

## WordPress

### Manual Integration

Add to your theme's `footer.php` before `</body>`:

```php
<!-- DashDig Widget -->
<script src="https://cdn.dashdig.com/v1.0.0/dashdig.min.js"></script>
<script>
  Dashdig.init({
    apiKey: '<?php echo esc_js(get_option('dashdig_api_key')); ?>',
    position: 'bottom-right',
    theme: 'light'
  });
</script>
```

### Using Plugin

1. Download DashDig WordPress plugin
2. Upload to `/wp-content/plugins/`
3. Activate in WordPress admin
4. Go to Settings → DashDig
5. Enter your API key
6. Save changes

---

## Common Issues

### Widget Not Appearing

**Problem:** Widget doesn't show on page.

**Solutions:**
1. Check API key is correct
2. Verify script is loaded: `console.log(typeof Dashdig)`
3. Check autoShow is `true`
4. Look for errors in console

### TypeScript Errors

**Problem:** TypeScript can't find types.

**Solution:**
```typescript
// Add to tsconfig.json
{
  "compilerOptions": {
    "types": ["@dashdig/widget"]
  }
}
```

### Build Errors

**Problem:** Module not found during build.

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors

**Problem:** CORS error when making API calls.

**Solution:**
Ensure you're using the correct API URL:
```javascript
Dashdig.init({
  apiKey: 'your_key',
  apiUrl: 'https://api.dashdig.com'  // Correct URL
});
```

---

## Next Steps

- [API Reference](./API.md) - Detailed API documentation
- [Examples](../examples/) - Working code examples
- [Main Documentation](./README.md) - Overview and quick start

---

**Last Updated:** November 8, 2025
**Version:** 1.0.0

