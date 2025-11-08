# DashDig Widget - Angular Example App

## ✅ Angular Integration Test & Examples

This example app demonstrates all the ways to integrate DashDig widget in Angular applications.

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Open browser to http://localhost:4200
```

The app will open to the **Simple Test** page automatically.

---

## What's Included

### 🧪 Simple Test (Default Page)
**File:** `src/app/simple-test.component.ts`

Minimal test to verify integration works:
- ✅ Widget component renders
- ✅ No compilation errors
- ✅ Events fire correctly
- ✅ Visual verification checklist

**Purpose:** Quick smoke test to confirm everything works!

---

### 🧩 Component Example
**File:** `src/app/examples/component-example/component-example.component.ts`

Full component-based integration:
- All `@Input()` properties
- All `@Output()` events
- `ViewChild` access to methods
- Interactive configuration UI

**Best for:** Template-driven Angular apps

---

### 💉 Service Example
**File:** `src/app/examples/service-example/service-example.component.ts`

Service injection pattern:
- Global widget management
- Programmatic control
- Dependency injection
- Shared state

**Best for:** Apps needing programmatic control

---

### ⚡ Standalone Example
**File:** `src/app/examples/standalone-example/standalone-example.component.ts`

Modern standalone component:
- No NgModule required
- Direct imports
- Angular 17+ pattern
- Simpler code

**Best for:** New Angular 15+ apps

---

### 📦 Module Example
**File:** `src/app/examples/module-example/module-example.component.ts`

Traditional NgModule approach:
- `DashdigModule.forRoot()`
- Global configuration
- Module-based architecture

**Best for:** Existing Angular 14-16 apps

---

## Testing Checklist

### 1. Visual Test
- [ ] App loads on http://localhost:4200
- [ ] Simple Test page shows success ✅
- [ ] Widget component renders
- [ ] No console errors

### 2. Navigation Test
- [ ] All 5 tabs are clickable
- [ ] Each page loads without errors
- [ ] Widget appears on each page

### 3. Interaction Test
- [ ] "Show Widget" button works
- [ ] "Hide Widget" button works
- [ ] "Track Event" logs to console
- [ ] Configuration changes apply

### 4. Build Test
```bash
# Production build
npx ng build --configuration production

# Should succeed with exit code 0
# Output in dist/dashdig-angular-example/
```

---

## Expected Console Output

When app loads successfully:
```
✅ [Simple Test] Widget loaded successfully!
```

When tracking events:
```
✅ [Component Example] Widget loaded
📊 Event tracked: button_click
```

---

## Troubleshooting

### App won't compile?
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Widget doesn't show?
```bash
# Build widget first
cd ../..
npm run build:angular
cd examples/angular-example
npm start
```

### Port 4200 in use?
```bash
npx ng serve --port 4300
```

---

## File Structure

```
src/app/
├── app.component.ts           # Main app shell with navigation
├── app.routes.ts             # Route configuration
├── simple-test.component.ts  # ← START HERE (Quick test)
└── examples/
    ├── component-example/    # Component-based integration
    ├── service-example/      # Service injection pattern
    ├── standalone-example/   # Standalone component (Angular 17+)
    └── module-example/       # Traditional NgModule approach
```

---

## Requirements

- **Node.js:** 16+
- **npm:** 8+
- **Angular CLI:** 17+ (installed automatically)
- **Browser:** Chrome, Firefox, Safari, Edge (modern versions)

---

## Build Commands

```bash
# Development
npm start                 # Start dev server
npm run serve            # Same as npm start

# Production
npm run build            # Production build
npm run build:prod       # Same as above

# Lint
npm run lint             # Run ESLint

# Test
npm test                 # Run unit tests (if configured)
```

---

## Integration Examples

### Standalone Component (Recommended for new apps)
```typescript
import { Component } from '@angular/core';
import { DashdigComponent } from '@dashdig/widget/angular';

@Component({
  standalone: true,
  imports: [DashdigComponent],
  template: `<dashdig-widget [apiKey]="'your-key'"></dashdig-widget>`
})
export class AppComponent {}
```

### NgModule (Recommended for existing apps)
```typescript
import { DashdigModule } from '@dashdig/widget/angular';

@NgModule({
  imports: [
    DashdigModule.forRoot({
      apiKey: 'your-api-key',
      position: 'bottom-right'
    })
  ]
})
export class AppModule {}
```

---

## Next Steps

1. **Start the app:** `npm start`
2. **Check Simple Test:** Should show all ✅
3. **Explore Examples:** Click through all 5 tabs
4. **Try Production Build:** `npm run build`
5. **Copy code to your app:** Use examples as reference

---

## Success Criteria

If you see:
- ✅ App loads without errors
- ✅ Simple Test shows success banner
- ✅ All tabs load correctly
- ✅ Production build succeeds

**Then Angular integration is COMPLETE!** 🎉

---

## Documentation

- **Quick Start:** `../../ANGULAR_QUICK_START.md`
- **Testing Guide:** `../../ANGULAR_TESTING_GUIDE.md`
- **Complete Details:** `../../ANGULAR_INTEGRATION_FIXED.md`

---

## Support

Issues or questions?
- Check console for errors
- Review example code
- Check parent directory documentation

---

**Last Updated:** November 8, 2025
**Angular Version:** 17+
**Status:** ✅ Production Ready
