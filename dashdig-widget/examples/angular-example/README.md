# DashDig Widget - Angular Example

This example demonstrates all integration methods for the DashDig widget in Angular 17+ applications.

## 🎯 What's Included

This example showcases:

1. **Component Approach** - Declarative template-based integration
2. **Service Injection** - Programmatic control via dependency injection
3. **Standalone Components** - Modern Angular 17+ approach (no NgModule)
4. **Module Approach** - Traditional NgModule with forRoot()

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
ng serve
# or
npm start
```

The example will open at `http://localhost:4200`

## 📦 Project Structure

```
angular-example/
├── src/
│   ├── app/
│   │   ├── examples/
│   │   │   ├── component-example/           # Component approach
│   │   │   ├── service-example/             # Service injection
│   │   │   ├── standalone-example/          # Standalone (Angular 17+)
│   │   │   └── module-example/              # NgModule approach
│   │   ├── app.component.ts                 # Main app with routing
│   │   └── app.routes.ts                    # Route configuration
│   ├── index.html
│   ├── main.ts                              # Bootstrap
│   └── styles.css
├── angular.json                              # Angular CLI config
├── package.json
├── tsconfig.json
└── README.md
```

## 🎨 Integration Methods

### 1. Component Approach

Use the `<dashdig-widget>` component in your templates:

```typescript
import { Component } from '@angular/core';
import { DashdigComponent } from '@dashdig/widget/angular';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [DashdigComponent],
  template: `
    <dashdig-widget
      [apiKey]="'your-api-key'"
      [position]="'bottom-right'"
      [theme]="'light'"
      (load)="onLoad()"
      (error)="onError($event)"
    ></dashdig-widget>
  `
})
export class ExampleComponent {
  onLoad() {
    console.log('Widget loaded');
  }

  onError(error: Error) {
    console.error('Widget error:', error);
  }
}
```

### 2. Service Injection

Inject `DashdigService` for programmatic control:

```typescript
import { Component } from '@angular/core';
import { DashdigService, DASHDIG_CONFIG } from '@dashdig/widget/angular';

@Component({
  selector: 'app-example',
  providers: [
    {
      provide: DASHDIG_CONFIG,
      useValue: {
        apiKey: 'your-api-key',
        position: 'bottom-right',
        theme: 'light'
      }
    },
    DashdigService
  ]
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
    this.dashdig.track('button_click', { button: 'cta' });
  }
}
```

### 3. Standalone Components (Angular 17+) ⭐ Recommended

The modern approach without NgModule:

```typescript
import { Component } from '@angular/core';
import { DashdigComponent } from '@dashdig/widget/angular';

@Component({
  selector: 'app-root',
  standalone: true,  // ← Standalone!
  imports: [DashdigComponent],
  template: `
    <dashdig-widget
      [apiKey]="'your-api-key'"
      [position]="'bottom-right'"
    ></dashdig-widget>
  `
})
export class AppComponent {}
```

**Bootstrap:**
```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent).catch(err => console.error(err));
```

### 4. Module Approach

Traditional NgModule approach:

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DashdigModule } from '@dashdig/widget/angular';

@NgModule({
  imports: [
    BrowserModule,
    DashdigModule.forRoot({
      apiKey: 'your-api-key',
      position: 'bottom-right',
      theme: 'light'
    })
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

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

### DashdigComponent

**Inputs:**
- `apiKey` (required): API key
- `position`: Widget position
- `theme`: Widget theme
- `autoShow`: Auto-show widget
- `apiUrl`: Custom API URL

**Outputs:**
- `(load)`: Emitted when widget loads
- `(error)`: Emitted on error

**Methods (via ViewChild):**
- `show()`: Show the widget
- `hide()`: Hide the widget
- `track(event, data)`: Track custom event
- `getInstance()`: Get widget instance

### DashdigService

**Methods:**
- `show()`: Show the widget
- `hide()`: Hide the widget
- `track(event, data?)`: Track custom event
- `getInstance()`: Get widget instance
- `isInitialized()`: Check if initialized
- `initializeWith(config)`: Manual initialization

## 🛠️ Development

### Available Scripts

```bash
# Start development server
ng serve
# or
npm start

# Build for production
ng build

# Run tests
ng test

# Lint
ng lint
```

### Tech Stack

- Angular 17+
- TypeScript 5.2+
- Angular CLI
- Standalone Components
- Zone.js

## 🎓 Examples in This Demo

### Component Example
- Template-based integration
- Event handlers (`@load`, `@error`)
- ViewChild for programmatic access
- Configuration via inputs

### Service Example
- Dependency injection
- Programmatic control
- Provider configuration
- Event tracking

### Standalone Example
- Angular 17+ approach
- No NgModule required
- Simplified imports
- Modern best practices

### Module Example
- Traditional NgModule
- `forRoot()` configuration
- App-wide service
- Backwards compatible

## 🔗 Links

- [DashDig Widget Documentation](../../README.md)
- [Angular Integration Guide](../../USAGE.md#angular)
- [API Reference](../../docs/API.md)
- [DashDig Website](https://dashdig.com)

## 💡 Tips

1. **Use Standalone Components**: For Angular 17+, use standalone components for simpler setup
2. **Service for Programmatic Control**: Use `DashdigService` when you need programmatic access
3. **Component for Templates**: Use `<dashdig-widget>` for declarative integration
4. **TypeScript Strict Mode**: All examples work with strict mode enabled
5. **Zone.js Compatible**: Fully compatible with Angular's change detection

## 🐛 Troubleshooting

### Widget Not Showing

Check that:
1. API key is valid
2. Component/service is properly initialized
3. `autoShow` is `true` or you're calling `show()`
4. No console errors

### Import Errors

If you see import errors:
1. Check path aliases in `tsconfig.json`
2. Ensure Angular version is 17+
3. Verify `@dashdig/widget` is installed

### Service Not Working

If service isn't initialized:
1. Check that you're providing `DASHDIG_CONFIG`
2. Verify `DashdigService` is in providers
3. For modules, use `forRoot()` in AppModule

## 📄 License

This example is part of the DashDig Widget SDK.

---

**Ready to integrate DashDig into your Angular app?**

Check out the [main documentation](../../README.md) or explore the example code!


