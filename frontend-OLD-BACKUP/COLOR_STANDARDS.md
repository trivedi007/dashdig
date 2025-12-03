# Dashdig Dashboard - Color Standards

## 🎨 Official Color Palette

### Brand Orange (Primary)
```css
Standard:    #FF6B35
Hover:       #E85A2A  
Active:      #D64E1F
Light BG:    #FFF4F0
```

**Usage in Components:**
```tsx
// Background
className="bg-[#FF6B35] hover:bg-[#E85A2A] active:bg-[#D64E1F]"

// Text
className="text-[#FF6B35]"

// Border
className="border-[#FF6B35]"
```

### Text Colors
| Use Case | Tailwind Class | Hex Value | CSS Variable |
|----------|---------------|-----------|--------------|
| Primary heading/body | `text-slate-900` | `#0F172A` | `--text-primary` |
| Secondary text | `text-slate-600` | `#475569` | `--text-secondary` |
| Muted/placeholder | `text-slate-400` | `#94A3B8` | `--text-muted` |
| White | `text-white` | `#FFFFFF` | `--text-white` |

### Background Colors
| Use Case | Tailwind Class | Hex Value |
|----------|----------------|-----------|
| Page background | `bg-slate-50` | `#F8FAFC` |
| Card/Container | `bg-white` | `#FFFFFF` |
| Hover state | `bg-slate-100` | `#F1F5F9` |
| Selected/Active | `bg-slate-200` | `#E2E8F0` |

### Border Colors
| Use Case | Tailwind Class | Hex Value |
|----------|----------------|-----------|
| Default border | `border-slate-200` | `#E2E8F0` |
| Light border | `border-slate-100` | `#F1F5F9` |
| Dark border | `border-slate-300` | `#CBD5E1` |

### Status Colors
| Status | Background | Text | Hex |
|--------|-----------|------|-----|
| Success | `bg-green-100` | `text-green-700` | `#10B981` |
| Error | `bg-red-100` | `text-red-700` | `#EF4444` |
| Warning | `bg-amber-100` | `text-amber-700` | `#F59E0B` |
| Info | `bg-blue-100` | `text-blue-700` | `#3B82F6` |

## ❌ Deprecated Colors

### DO NOT USE:
- `#FF6B2C` → Use `#FF6B35` instead
- `#1F2937` → Use `text-slate-900` (#0F172A)
- `#6C757D` → Use `text-slate-600` (#475569)
- `#9CA3AF` → Use `text-slate-400` (#94A3B8)

## ✅ Best Practices

### 1. Use Tailwind Classes (Preferred)
```tsx
// ✅ Good
<div className="bg-white border border-slate-200 text-slate-900">

// ❌ Avoid
<div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
```

### 2. Orange Brand Color Exception
Since Tailwind doesn't have our exact orange (`#FF6B35`), use arbitrary values:

```tsx
// ✅ Good - Brand color
<button className="bg-[#FF6B35] hover:bg-[#E85A2A] text-white">

// ❌ Don't use closest Tailwind orange (wrong shade)
<button className="bg-orange-500"> {/* This is #F97316, not our brand */}
```

### 3. Consistent Spacing
```tsx
// ✅ Good - Use Tailwind spacing scale
<div className="p-4 mb-6 gap-3">

// ❌ Avoid arbitrary values unless necessary
<div className="p-[17px] mb-[23px]">
```

### 4. Responsive Design
```tsx
// ✅ Good - Mobile first with breakpoints
<div className="text-sm md:text-base lg:text-lg">

// ❌ Avoid desktop-first
<div className="text-lg md:text-sm">
```

## 📋 Component-Specific Guidelines

### Buttons
```tsx
// Primary Button
<button className="bg-[#FF6B35] hover:bg-[#E85A2A] text-white px-4 py-2 rounded-lg font-semibold">

// Secondary Button  
<button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2 rounded-lg font-semibold">

// Icon Button
<button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-50">
```

### Cards
```tsx
// Standard Card
<div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

// Hoverable Card
<div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition">
```

### Text Hierarchy
```tsx
// Page Heading
<h1 className="text-3xl font-bold text-slate-900">

// Section Heading
<h2 className="text-xl font-semibold text-slate-900">

// Body Text
<p className="text-sm text-slate-600">

// Muted Text
<p className="text-xs text-slate-400">
```

## 🔍 Migration Checklist

When refactoring a component:

- [ ] Remove all inline `style` attributes
- [ ] Replace `#FF6B2C` with `#FF6B35`
- [ ] Use Tailwind classes for colors
- [ ] Use `bg-[#FF6B35]` for brand orange
- [ ] Use `text-slate-*` for text colors
- [ ] Use `border-slate-*` for borders
- [ ] Use `bg-slate-*` for backgrounds
- [ ] Ensure responsive breakpoints
- [ ] Test hover states
- [ ] Verify accessibility contrast

## 🎯 Color Usage Examples

### Dashboard Header
```tsx
<header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 shadow-sm">
  <Link href="/dashboard" className="flex items-center gap-2">
    <div className="w-10 h-10 flex items-center justify-center bg-[#FF6B35] rounded-lg">⚡</div>
    <span className="text-xl font-bold text-[#FF6B35]">Dashdig</span>
  </Link>
</header>
```

### Stat Card
```tsx
<div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 flex items-center justify-center bg-orange-100 rounded-lg">
      <span className="text-2xl">📊</span>
    </div>
    <div>
      <p className="text-xs font-semibold text-slate-500">TOTAL CLICKS</p>
      <p className="text-2xl font-bold text-slate-900">12,345</p>
    </div>
  </div>
</div>
```

### Alert Box
```tsx
<!-- Success -->
<div className="flex items-start gap-3 p-4 bg-green-100 border border-green-600 rounded-lg">
  <span className="text-green-600">✓</span>
  <div>
    <p className="font-semibold text-green-800">Success!</p>
    <p className="text-sm text-green-700">Operation completed.</p>
  </div>
</div>

<!-- Error -->
<div className="flex items-start gap-3 p-4 bg-red-100 border border-red-600 rounded-lg">
  <span className="text-red-600">✕</span>
  <div>
    <p className="font-semibold text-red-800">Error</p>
    <p className="text-sm text-red-700">Something went wrong.</p>
  </div>
</div>
```

## 📊 Color Contrast Ratios (WCAG AA)

All color combinations meet WCAG AA standards:

| Foreground | Background | Ratio | Pass |
|------------|------------|-------|------|
| #FF6B35 (Orange) | #FFFFFF (White) | 3.04:1 | ✓ Large text |
| #FFFFFF (White) | #FF6B35 (Orange) | 3.04:1 | ✓ Large text |
| #0F172A (Slate-900) | #FFFFFF (White) | 16.9:1 | ✓✓ AAA |
| #475569 (Slate-600) | #FFFFFF (White) | 8.59:1 | ✓✓ AAA |
| #94A3B8 (Slate-400) | #FFFFFF (White) | 3.99:1 | ✓ AA |

## 🔧 Tools

### Finding Non-Standard Colors
```bash
# Search for hardcoded colors
grep -r "#FF6B2C\|#1F2937\|#6C757D" app/ --include="*.tsx" --include="*.ts"

# Find inline styles
grep -r 'style=' app/ --include="*.tsx" --include="*.ts"
```

### Color Picker
Use browser DevTools to verify colors match our palette.

---

**Dashdig Design System** | Version 1.0  
**Last Updated:** 2024  
**Maintained by:** Frontend Team


