# Dashdig Dashboard - Global Styling System

## 📁 File Structure

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout (imports dashboard.css)
│   ├── globals.css             # Tailwind base + custom utilities
│   └── examples/
│       └── styles-demo/
│           └── page.tsx        # Live demo of all styles
├── styles/
│   ├── dashboard.css           # 👈 Main global stylesheet
│   ├── USAGE_GUIDE.md          # Comprehensive usage guide
│   └── README.md               # This file
```

## 🚀 Quick Start

### 1. Import Already Configured
The `dashboard.css` file is already imported in the root layout:

```tsx
// app/layout.tsx
import '../styles/dashboard.css'
```

### 2. Inter Font Already Loaded
```tsx
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
```

### 3. Start Using Utility Classes
```tsx
<button className="btn-primary">
  Click Me
</button>
```

## 🎨 Design System

### Color Palette

| Purpose | Variable | Hex Value |
|---------|----------|-----------|
| Primary Orange | `--primary-orange` | `#FF6B35` |
| Primary Orange Hover | `--primary-orange-hover` | `#E85A2A` |
| Text Primary | `--text-primary` | `#1F2937` |
| Text Secondary | `--text-secondary` | `#6C757D` |
| Border | `--border-color` | `#E5E7EB` |
| Background | `--background` | `#F9FAFB` |
| Success Green | `--success-green` | `#10B981` |
| Error Red | `--error-red` | `#EF4444` |
| Warning Amber | `--warning-amber` | `#F59E0B` |
| Info Blue | `--info-blue` | `#3B82F6` |
| Purple | `--purple` | `#8B5CF6` |

### Typography Scale

| Class | Size | Usage |
|-------|------|-------|
| `.text-xs` | 12px | Captions, labels |
| `.text-sm` | 14px | Body text, descriptions |
| `.text-base` | 16px | Default body text |
| `.text-lg` | 18px | Emphasized text |
| `.text-xl` | 20px | Subheadings |
| `.text-2xl` | 24px | Section headings |
| `.text-3xl` | 30px | Page headings |
| `.text-4xl` | 36px | Hero headings |

### Spacing Scale

| Class | Value | Pixels |
|-------|-------|--------|
| `1` | 0.25rem | 4px |
| `2` | 0.5rem | 8px |
| `3` | 0.75rem | 12px |
| `4` | 1rem | 16px |
| `5` | 1.25rem | 20px |
| `6` | 1.5rem | 24px |
| `8` | 2rem | 32px |

## 🧩 Core Components

### 1. Buttons

#### Primary Button
```html
<button class="btn-primary">Primary Action</button>
<button class="btn-primary btn-sm">Small</button>
<button class="btn-primary btn-lg">Large</button>
```

#### Secondary Button
```html
<button class="btn-secondary">Secondary Action</button>
```

#### Icon Button
```html
<button class="btn-icon">🏠</button>
```

### 2. Cards

#### Basic Card
```html
<div class="card">
  <div class="card-header">
    <h3>Card Title</h3>
  </div>
  <div class="card-body">
    Card content
  </div>
  <div class="card-footer">
    <button class="btn-primary">Action</button>
  </div>
</div>
```

#### Card Variants
- `.card-flat` - No shadow
- `.card-elevated` - Larger shadow
- `.card-hoverable` - Lifts on hover

### 3. Form Elements

All form elements are styled by default:
```html
<input type="text" placeholder="Enter text...">
<textarea placeholder="Enter description..."></textarea>
<select>
  <option>Option 1</option>
</select>
```

## 📱 Responsive Breakpoints

| Breakpoint | Min Width | Prefix | Usage |
|------------|-----------|--------|-------|
| Mobile | - | (none) | Default, mobile-first |
| Tablet | 768px | `md:` | Tablets, small laptops |
| Desktop | 1024px | `lg:` | Desktop screens |
| Large Desktop | 1280px | `xl:` | Large monitors |

### Responsive Examples

```html
<!-- Hide on mobile, show on desktop -->
<div class="hidden lg:block">Desktop only</div>

<!-- Responsive grid: 1 col mobile, 2 tablet, 4 desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>

<!-- Responsive text size -->
<h1 class="text-2xl md:text-3xl lg:text-4xl">
  Responsive Heading
</h1>
```

## 🛠️ Common Patterns

### 1. Stat Card
```html
<div class="card card-hoverable">
  <div class="card-body">
    <div class="flex items-center gap-4">
      <div class="flex items-center justify-center w-12 h-12 bg-orange-light rounded-lg">
        <span class="text-2xl">📊</span>
      </div>
      <div class="flex-1">
        <p class="text-xs text-secondary font-semibold">TOTAL CLICKS</p>
        <p class="text-2xl font-bold text-primary mt-1">12,345</p>
      </div>
    </div>
  </div>
</div>
```

### 2. Action Bar
```html
<div class="flex justify-between items-center p-4 bg-white border-b">
  <div>
    <h2 class="text-xl font-semibold">Page Title</h2>
    <p class="text-sm text-secondary">Description</p>
  </div>
  <div class="flex gap-3">
    <button class="btn-secondary">Cancel</button>
    <button class="btn-primary">Save</button>
  </div>
</div>
```

### 3. Alert Box
```html
<!-- Success -->
<div class="flex items-start gap-3 p-4 bg-success-light border border-success rounded-lg">
  <span class="text-success text-xl">✓</span>
  <div class="flex-1">
    <p class="font-semibold text-success">Success!</p>
    <p class="text-sm">Operation completed successfully.</p>
  </div>
</div>

<!-- Error -->
<div class="flex items-start gap-3 p-4 bg-error-light border border-error rounded-lg">
  <span class="text-error text-xl">✕</span>
  <div class="flex-1">
    <p class="font-semibold text-error">Error</p>
    <p class="text-sm">Something went wrong.</p>
  </div>
</div>
```

### 4. Navigation Menu
```html
<nav class="flex flex-col gap-1 p-3">
  <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-lg bg-orange text-white font-medium">
    <span>📊</span>
    <span>Dashboard</span>
  </a>
  <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-lg text-secondary hover:bg-slate hover:text-orange transition">
    <span>🔗</span>
    <span>URLs</span>
  </a>
</nav>
```

## 🎯 Utility Classes Reference

### Layout
- `.flex`, `.inline-flex` - Flexbox
- `.grid` - Grid layout
- `.block`, `.inline-block`, `.hidden` - Display

### Flexbox
- `.flex-row`, `.flex-col` - Direction
- `.justify-start/center/end/between/around` - Justify
- `.items-start/center/end/baseline/stretch` - Align

### Spacing
- `.mt-{1-8}` - Margin top
- `.mb-{1-8}` - Margin bottom
- `.ml-{0-6}` - Margin left
- `.mr-{0-6}` - Margin right
- `.p-{0-8}` - Padding all
- `.px-{0-6}` - Padding horizontal
- `.py-{0-6}` - Padding vertical
- `.gap-{1-6}` - Gap (flex/grid)

### Text
- `.text-{xs/sm/base/lg/xl/2xl/3xl/4xl}` - Size
- `.font-{normal/medium/semibold/bold}` - Weight
- `.text-{left/center/right}` - Alignment
- `.text-{primary/secondary/muted/orange/success/error}` - Color

### Background
- `.bg-{white/slate/gray/orange/success/error}` - Colors
- `.bg-{color}-light` - Light variants

### Border
- `.border`, `.border-{t/b/l/r}` - Borders
- `.rounded{-sm/-lg/-xl/-2xl/-full}` - Radius

### Shadow
- `.shadow{-sm/-md/-lg/-xl/-none}` - Box shadows

### Other
- `.w-full`, `.h-full` - Full width/height
- `.cursor-pointer` - Pointer cursor
- `.truncate` - Text ellipsis
- `.opacity-{0/50/75/100}` - Opacity
- `.transition` - Smooth transitions

## 📚 Documentation

### Full Documentation
See [`USAGE_GUIDE.md`](./USAGE_GUIDE.md) for comprehensive documentation with examples.

### Live Demo
Visit `/examples/styles-demo` in your browser to see all components and utilities in action.

## 🔧 Customization

### Using CSS Variables in Custom CSS
```css
.my-custom-button {
  background-color: var(--primary-orange);
  color: var(--text-white);
  padding: var(--spacing-3) var(--spacing-5);
  border-radius: var(--radius-lg);
}
```

### Extending with Tailwind
You can still use Tailwind classes alongside dashboard.css:
```html
<div class="card hover:scale-105 transform transition-transform">
  <!-- Combines dashboard.css card with Tailwind hover effect -->
</div>
```

## ✅ Best Practices

### 1. **Use Utility Classes First**
```html
<!-- ✅ Good -->
<div class="flex justify-between items-center p-4">

<!-- ❌ Avoid -->
<div style="display: flex; justify-content: space-between; padding: 16px;">
```

### 2. **Mobile-First Approach**
```html
<!-- ✅ Good: Start with mobile, add larger breakpoints -->
<div class="text-sm md:text-base lg:text-lg">

<!-- ❌ Avoid: Starting with desktop -->
<div class="text-lg md:text-sm">
```

### 3. **Consistent Spacing**
```html
<!-- ✅ Good: Use spacing scale -->
<div class="mt-4 mb-6 p-5">

<!-- ❌ Avoid: Random values -->
<div class="mt-[17px] mb-[23px] p-[19px]">
```

### 4. **Semantic HTML**
```html
<!-- ✅ Good -->
<button class="btn-primary">Submit</button>

<!-- ❌ Avoid -->
<div class="btn-primary" onclick="submit()">Submit</div>
```

## 🐛 Troubleshooting

### Styles Not Applying?
1. Check that `dashboard.css` is imported in `app/layout.tsx`
2. Clear your browser cache
3. Restart your dev server: `npm run dev`

### Conflicting with Tailwind?
Dashboard.css is designed to work alongside Tailwind. If you have conflicts:
1. Use more specific selectors
2. Check the CSS layer order
3. Use `!important` as a last resort

### Performance Concerns?
- Dashboard.css is optimized and tree-shaken in production
- Only includes utilities you're actually using
- Gzip compression reduces file size significantly

## 📊 File Size

| File | Size (Dev) | Size (Prod) |
|------|-----------|-------------|
| dashboard.css | ~35KB | ~8KB (gzipped) |
| Combined with Tailwind | ~3.8MB | ~12KB (gzipped) |

## 🤝 Contributing

When adding new utilities or components:
1. Follow the existing naming convention
2. Add documentation to USAGE_GUIDE.md
3. Add examples to the demo page
4. Test across all breakpoints
5. Ensure accessibility (focus states, ARIA, etc.)

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ Complete design system with CSS variables
- ✅ Button components (primary, secondary, icon)
- ✅ Card components with variants
- ✅ Typography system
- ✅ Spacing utilities (margin, padding, gap)
- ✅ Flexbox utilities
- ✅ Grid utilities
- ✅ Responsive breakpoints
- ✅ Form element styling
- ✅ Color utilities
- ✅ Border utilities
- ✅ Shadow utilities
- ✅ Animation utilities
- ✅ Accessibility features

## 🔗 Related Files

- [`globals.css`](../app/globals.css) - Tailwind base configuration
- [`layout.tsx`](../app/layout.tsx) - Root layout with imports
- [`USAGE_GUIDE.md`](./USAGE_GUIDE.md) - Comprehensive usage guide
- [`/app/examples/styles-demo/page.tsx`](../app/examples/styles-demo/page.tsx) - Live demo

---

**Created for Dashdig Dashboard** | Version 1.0.0  
**Font**: Inter (Google Fonts)  
**Framework**: Next.js 14+ with Tailwind CSS  
**Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)


