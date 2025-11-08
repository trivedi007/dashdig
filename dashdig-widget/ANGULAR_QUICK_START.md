# DashDig Angular Integration - Quick Start

## ✅ Status: FIXED & READY FOR PRODUCTION

All Angular integration build errors have been resolved. Zero errors, zero circular dependencies, full Angular 15-17+ support.

---

## Installation

```bash
npm install @dashdig/widget
```

---

## Usage Examples

### 1. Standalone Component (Angular 17+ - Recommended)

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { DashdigComponent } from '@dashdig/widget/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashdigComponent],
  template: `
    <h1>My App</h1>
    
    <dashdig-widget
      [apiKey]="'your-api-key'"
      [position]="'bottom-right'"
      [theme]="'light'"
      [autoShow]="true"
      (load)="onWidgetLoad()"
      (error)="onWidgetError($event)">
    </dashdig-widget>
  `
})
export class AppComponent {
  onWidgetLoad() {
    console.log('DashDig widget loaded!');
  }
  
  onWidgetError(error: Error) {
    console.error('DashDig error:', error);
  }
}
```

### 2. NgModule Approach (Angular 14-16)

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { DashdigModule } from '@dashdig/widget/angular';

@NgModule({
  imports: [
    DashdigModule.forRoot({
      apiKey: 'your-api-key',
      position: 'bottom-right',
      theme: 'light',
      autoShow: true
    })
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### 3. Service Injection (Programmatic Control)

```typescript
// my-component.ts
import { Component } from '@angular/core';
import { DashdigService } from '@dashdig/widget/angular';

@Component({
  selector: 'app-example',
  template: `
    <button (click)="showWidget()">Show Widget</button>
    <button (click)="hideWidget()">Hide Widget</button>
    <button (click)="trackEvent()">Track Event</button>
  `
})
export class ExampleComponent {
  constructor(private dashdig: DashdigService) {}
  
  showWidget() {
    this.dashdig.show();
  }
  
  hideWidget() {
    this.dashdig.hide();
  }
  
  trackEvent() {
    this.dashdig.track('button_click', {
      button: 'example',
      timestamp: new Date().toISOString()
    });
  }
}
```

---

## Component API

### Inputs
```typescript
@Input() apiKey: string;              // Required: Your API key
@Input() position?: 'bottom-right' | 'bottom-left';  // Widget position
@Input() theme?: 'light' | 'dark';    // Widget theme
@Input() autoShow?: boolean;          // Auto-show on init
@Input() apiUrl?: string;             // Custom API URL
```

### Outputs
```typescript
@Output() load: EventEmitter<void>;   // Emitted when widget loads
@Output() error: EventEmitter<Error>; // Emitted on error
```

### Methods (via ViewChild)
```typescript
@ViewChild('widget') widget: DashdigComponent;

// Show/hide widget
this.widget.show();
this.widget.hide();

// Track events
this.widget.track('event_name', { data: 'value' });

// Get widget instance
const instance = this.widget.getInstance();
```

---

## Service API

### Methods
```typescript
// Show/hide widget
dashdig.show();
dashdig.hide();

// Track events
dashdig.track('event_name', { data: 'value' });

// Get widget instance
const widget = dashdig.getInstance();

// Check initialization status
const isReady = dashdig.isInitialized();

// Manual initialization
dashdig.initializeWith({
  apiKey: 'your-key',
  position: 'bottom-right'
});

// Cleanup
dashdig.destroy();
```

---

## Build Commands

```bash
# Build Angular integration
npm run build:angular

# Build all integrations
npm run build

# Type check
npm run type-check

# Run example app
cd examples/angular-example
npm install
npx ng serve
```

---

## Bundle Sizes

- **UMD Bundle:** 16 KB (~5 KB gzipped)
- **ESM Bundle:** 15 KB (~5 KB gzipped)

---

## Compatibility

| Angular Version | Status |
|----------------|--------|
| 14             | ✅ Supported |
| 15             | ✅ Supported |
| 16             | ✅ Supported |
| 17+            | ✅ Supported (Standalone recommended) |

---

## Features

✅ Standalone component support
✅ NgModule support  
✅ Service injection
✅ TypeScript declarations
✅ SSR (Server-Side Rendering) compatible
✅ Tree-shakeable
✅ Lazy loading support
✅ Shadow DOM isolation
✅ Event tracking
✅ Programmatic control

---

## Example App

See working examples in `examples/angular-example/`:
- Standalone component example
- NgModule example
- Service injection example
- Component-based example

```bash
cd examples/angular-example
npm install
npx ng serve
# Open http://localhost:4200
```

---

## Troubleshooting

### Build Errors
```bash
# Clean and rebuild
npm run clean
npm run build:angular
```

### Type Errors
Make sure you have the correct Angular version:
```bash
npm install @angular/core@^16.0.0
```

### Import Errors
Use the correct import path:
```typescript
import { DashdigComponent } from '@dashdig/widget/angular';
// NOT from '@dashdig/widget'
```

---

## Support

- 📖 Full docs: See `ANGULAR_INTEGRATION_FIXED.md`
- 💻 Examples: See `examples/angular-example/`
- 🐛 Issues: File on GitHub

---

**Last Updated:** November 8, 2025
**Status:** ✅ Production Ready


