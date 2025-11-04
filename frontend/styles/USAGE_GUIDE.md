# Dashdig Dashboard - Global Styles Usage Guide

## 📋 Table of Contents
- [CSS Variables](#css-variables)
- [Typography](#typography)
- [Buttons](#buttons)
- [Cards](#cards)
- [Spacing Utilities](#spacing-utilities)
- [Flexbox Utilities](#flexbox-utilities)
- [Responsive Design](#responsive-design)
- [Color Utilities](#color-utilities)
- [Examples](#examples)

---

## 🎨 CSS Variables

All design tokens are available as CSS variables:

```css
/* Colors */
var(--primary-orange)          /* #FF6B35 */
var(--primary-orange-hover)    /* #E85A2A */
var(--text-primary)            /* #1F2937 */
var(--text-secondary)          /* #6C757D */
var(--border-color)            /* #E5E7EB */
var(--background)              /* #F9FAFB */
var(--success-green)           /* #10B981 */
var(--error-red)               /* #EF4444 */

/* Spacing */
var(--spacing-1)               /* 0.25rem / 4px */
var(--spacing-2)               /* 0.5rem / 8px */
var(--spacing-3)               /* 0.75rem / 12px */
var(--spacing-4)               /* 1rem / 16px */
var(--spacing-5)               /* 1.25rem / 20px */
var(--spacing-6)               /* 1.5rem / 24px */

/* Shadows */
var(--shadow-sm)
var(--shadow-md)
var(--shadow-lg)
var(--shadow-xl)

/* Border Radius */
var(--radius-sm)               /* 0.375rem */
var(--radius-md)               /* 0.5rem */
var(--radius-lg)               /* 0.75rem */
var(--radius-xl)               /* 1rem */
var(--radius-2xl)              /* 1.5rem */
```

---

## 📝 Typography

### Font Sizes
```html
<p class="text-xs">Extra small text (12px)</p>
<p class="text-sm">Small text (14px)</p>
<p class="text-base">Base text (16px)</p>
<p class="text-lg">Large text (18px)</p>
<p class="text-xl">Extra large text (20px)</p>
<p class="text-2xl">2XL text (24px)</p>
<p class="text-3xl">3XL text (30px)</p>
<p class="text-4xl">4XL text (36px)</p>
```

### Font Weights
```html
<p class="font-normal">Normal weight (400)</p>
<p class="font-medium">Medium weight (500)</p>
<p class="font-semibold">Semibold weight (600)</p>
<p class="font-bold">Bold weight (700)</p>
```

### Text Colors
```html
<p class="text-primary">Primary text (#1F2937)</p>
<p class="text-secondary">Secondary text (#6C757D)</p>
<p class="text-muted">Muted text (#9CA3AF)</p>
<p class="text-orange">Orange text (#FF6B35)</p>
<p class="text-success">Success text (#10B981)</p>
<p class="text-error">Error text (#EF4444)</p>
```

---

## 🔘 Buttons

### Primary Button
```html
<button class="btn-primary">
  Primary Action
</button>

<button class="btn-primary btn-sm">
  Small Button
</button>

<button class="btn-primary btn-lg">
  Large Button
</button>

<button class="btn-primary" disabled>
  Disabled Button
</button>
```

### Secondary Button
```html
<button class="btn-secondary">
  Secondary Action
</button>

<button class="btn-secondary btn-sm">
  Small Secondary
</button>
```

### Icon Button
```html
<button class="btn-icon">
  <svg>...</svg>
</button>

<button class="btn-icon" title="Delete">
  🗑️
</button>
```

### Button with Icon
```html
<button class="btn-primary">
  <svg class="w-4 h-4">...</svg>
  <span>Create Link</span>
</button>
```

---

## 🎴 Cards

### Basic Card
```html
<div class="card">
  <div class="card-header">
    <h3 class="text-lg font-semibold">Card Title</h3>
  </div>
  <div class="card-body">
    <p>Card content goes here...</p>
  </div>
  <div class="card-footer">
    <button class="btn-primary">Action</button>
  </div>
</div>
```

### Card Variants
```html
<!-- Flat Card (no shadow) -->
<div class="card card-flat">
  <div class="card-body">
    Flat card content
  </div>
</div>

<!-- Elevated Card (larger shadow) -->
<div class="card card-elevated">
  <div class="card-body">
    Elevated card content
  </div>
</div>

<!-- Hoverable Card (lifts on hover) -->
<div class="card card-hoverable">
  <div class="card-body">
    Hoverable card content
  </div>
</div>
```

### Simple Card (No Header/Footer)
```html
<div class="card">
  <div class="card-body">
    <h4 class="text-base font-semibold mb-2">Title</h4>
    <p class="text-secondary">Description text here.</p>
  </div>
</div>
```

---

## 📏 Spacing Utilities

### Margin
```html
<div class="mt-4">Margin top 16px</div>
<div class="mb-3">Margin bottom 12px</div>
<div class="ml-2">Margin left 8px</div>
<div class="mr-5">Margin right 20px</div>
```

### Padding
```html
<div class="p-4">Padding all sides 16px</div>
<div class="px-6">Padding horizontal 24px</div>
<div class="py-3">Padding vertical 12px</div>
```

### Gap (for Flex/Grid)
```html
<div class="flex gap-4">
  <span>Item 1</span>
  <span>Item 2</span>
</div>
```

---

## 🔄 Flexbox Utilities

### Basic Flex Container
```html
<div class="flex">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Flex Direction
```html
<div class="flex flex-row">Row layout</div>
<div class="flex flex-col">Column layout</div>
```

### Justify Content
```html
<div class="flex justify-start">Start</div>
<div class="flex justify-center">Center</div>
<div class="flex justify-end">End</div>
<div class="flex justify-between">Space Between</div>
<div class="flex justify-around">Space Around</div>
```

### Align Items
```html
<div class="flex items-start">Align top</div>
<div class="flex items-center">Align middle</div>
<div class="flex items-end">Align bottom</div>
```

### Common Flex Patterns
```html
<!-- Horizontal center -->
<div class="flex justify-center items-center">
  <span>Centered content</span>
</div>

<!-- Space between with vertical center -->
<div class="flex justify-between items-center">
  <span>Left</span>
  <span>Right</span>
</div>

<!-- Flex column with gap -->
<div class="flex flex-col gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (default, no prefix needed)
- **Tablet**: ≥ 768px (use `md:` prefix)
- **Desktop**: ≥ 1024px (use `lg:` prefix)
- **Large Desktop**: ≥ 1280px (use `xl:` prefix)

### Responsive Examples
```html
<!-- Hidden on mobile, visible on desktop -->
<div class="hidden lg:block">
  Desktop only content
</div>

<!-- Responsive grid -->
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

<!-- Responsive flex direction -->
<div class="flex flex-col md:flex-row gap-4">
  <div>Left</div>
  <div>Right</div>
</div>
```

---

## 🎨 Color Utilities

### Background Colors
```html
<div class="bg-white">White background</div>
<div class="bg-slate">Slate background</div>
<div class="bg-orange">Orange background</div>
<div class="bg-orange-light">Light orange</div>
<div class="bg-success">Success background</div>
<div class="bg-error">Error background</div>
```

### Border Colors
```html
<div class="border">Default border</div>
<div class="border-t">Top border only</div>
<div class="border-b">Bottom border only</div>
```

### Border Radius
```html
<div class="rounded">Medium rounded</div>
<div class="rounded-sm">Small rounded</div>
<div class="rounded-lg">Large rounded</div>
<div class="rounded-xl">Extra large rounded</div>
<div class="rounded-2xl">2XL rounded</div>
<div class="rounded-full">Fully rounded (circle)</div>
```

---

## 💡 Examples

### Example 1: Stat Card
```html
<div class="card">
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

### Example 2: Action Bar
```html
<div class="flex justify-between items-center p-4 bg-white border-b">
  <div>
    <h2 class="text-xl font-semibold text-primary">Dashboard</h2>
    <p class="text-sm text-secondary">Manage your links</p>
  </div>
  <div class="flex gap-3">
    <button class="btn-secondary">
      Export
    </button>
    <button class="btn-primary">
      Create Link
    </button>
  </div>
</div>
```

### Example 3: Form Group
```html
<div class="mb-4">
  <label class="block text-sm font-semibold text-primary mb-2">
    URL
  </label>
  <input 
    type="url" 
    placeholder="Enter URL..."
    class="w-full"
  />
  <p class="text-xs text-secondary mt-1">
    Enter the URL you want to shorten
  </p>
</div>
```

### Example 4: Alert Box
```html
<!-- Success Alert -->
<div class="flex items-start gap-3 p-4 bg-success-light border border-success rounded-lg">
  <span class="text-success text-xl">✓</span>
  <div class="flex-1">
    <p class="font-semibold text-success">Success!</p>
    <p class="text-sm text-primary">Your link has been created.</p>
  </div>
</div>

<!-- Error Alert -->
<div class="flex items-start gap-3 p-4 bg-error-light border border-error rounded-lg">
  <span class="text-error text-xl">✕</span>
  <div class="flex-1">
    <p class="font-semibold text-error">Error</p>
    <p class="text-sm text-primary">Something went wrong.</p>
  </div>
</div>
```

### Example 5: Grid Layout
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
  <div class="card card-hoverable">
    <div class="card-body">
      <p class="text-xs text-secondary">Total URLs</p>
      <p class="text-2xl font-bold text-primary mt-2">42</p>
    </div>
  </div>
  <div class="card card-hoverable">
    <div class="card-body">
      <p class="text-xs text-secondary">Total Clicks</p>
      <p class="text-2xl font-bold text-primary mt-2">1,234</p>
    </div>
  </div>
  <div class="card card-hoverable">
    <div class="card-body">
      <p class="text-xs text-secondary">Avg Clicks</p>
      <p class="text-2xl font-bold text-primary mt-2">29</p>
    </div>
  </div>
  <div class="card card-hoverable">
    <div class="card-body">
      <p class="text-xs text-secondary">Active Links</p>
      <p class="text-2xl font-bold text-primary mt-2">38</p>
    </div>
  </div>
</div>
```

### Example 6: Navigation Menu
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
  <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-lg text-secondary hover:bg-slate hover:text-orange transition">
    <span>📈</span>
    <span>Analytics</span>
  </a>
</nav>
```

---

## 🚀 Best Practices

### 1. **Consistency**
Always use the utility classes instead of inline styles for better consistency:
```html
<!-- ✅ Good -->
<div class="mt-4 mb-6 p-5">

<!-- ❌ Avoid -->
<div style="margin-top: 16px; margin-bottom: 24px; padding: 20px;">
```

### 2. **Responsive First**
Design mobile-first, then add tablet/desktop styles:
```html
<!-- ✅ Good -->
<div class="text-sm md:text-base lg:text-lg">

<!-- ❌ Avoid -->
<div class="text-lg md:text-sm">
```

### 3. **Semantic HTML**
Use proper HTML elements with utility classes:
```html
<!-- ✅ Good -->
<button class="btn-primary">Submit</button>

<!-- ❌ Avoid -->
<div class="btn-primary" onclick="...">Submit</div>
```

### 4. **Combine Classes**
Combine utility classes to build complex layouts:
```html
<div class="flex justify-between items-center p-4 border-b bg-white">
  <!-- Complex layout with simple classes -->
</div>
```

---

## 📚 Additional Resources

- **Inter Font**: Already imported from Google Fonts
- **Tailwind CSS**: Still available for advanced use cases
- **CSS Variables**: Access design tokens directly in CSS

For more complex styling needs, you can still use Tailwind CSS classes alongside these utilities. The dashboard.css file provides a solid foundation while Tailwind handles edge cases.

---

**Created for Dashdig Dashboard** | Version 1.0.0


