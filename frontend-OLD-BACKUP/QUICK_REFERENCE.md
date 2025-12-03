# Dashdig Dashboard - Quick Reference Card

## 🎨 Color Palette

```css
/* Brand Orange */
bg-[#FF6B35]           /* Primary */
hover:bg-[#E85A2A]     /* Hover */
active:bg-[#D64E1F]    /* Active */
text-[#FF6B35]         /* Text */

/* Text */
text-slate-900         /* Headings, primary text */
text-slate-600         /* Body text, secondary */
text-slate-400         /* Muted, placeholder */

/* Backgrounds */
bg-white               /* Cards, containers */
bg-slate-50            /* Page background */
bg-slate-100           /* Hover states */

/* Borders */
border-slate-200       /* Default border */
border-slate-300       /* Darker border */
```

## 🔘 Buttons

```tsx
/* Primary */
<button className="bg-[#FF6B35] hover:bg-[#E85A2A] text-white px-4 py-2 rounded-lg font-semibold">

/* Secondary */
<button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2 rounded-lg font-semibold">

/* Icon */
<button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-50">
```

## 🎴 Cards

```tsx
/* Standard */
<div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

/* Hoverable */
<div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition">
```

## 📝 Typography

```tsx
/* Page Heading */
<h1 className="text-3xl font-bold text-slate-900">

/* Section Heading */
<h2 className="text-xl font-semibold text-slate-900">

/* Body Text */
<p className="text-sm text-slate-600">

/* Small Text */
<p className="text-xs text-slate-400">
```

## 📏 Spacing

```tsx
/* Padding */
p-4    /* 16px all sides */
px-6   /* 24px horizontal */
py-3   /* 12px vertical */

/* Margin */
mt-4   /* 16px top */
mb-6   /* 24px bottom */
gap-3  /* 12px gap (flex/grid) */
```

## 📱 Responsive

```tsx
/* Mobile → Tablet → Desktop */
<div className="text-sm md:text-base lg:text-lg">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
<div className="hidden lg:block"> {/* Desktop only */}
```

## 🎯 Common Patterns

### Flex Container
```tsx
<div className="flex justify-between items-center">
```

### Grid Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
```

### Centered Content
```tsx
<div className="flex items-center justify-center">
```

### Card Grid
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
  <div className="card card-hoverable">...</div>
</div>
```

## ✅ Status Colors

```tsx
/* Success */
<div className="bg-green-100 text-green-700 border-green-600">

/* Error */
<div className="bg-red-100 text-red-700 border-red-600">

/* Warning */
<div className="bg-amber-100 text-amber-700 border-amber-600">

/* Info */
<div className="bg-blue-100 text-blue-700 border-blue-600">
```

## 🚫 Don't Use

```css
❌ #FF6B2C (old orange)
❌ #1F2937 (use text-slate-900)
❌ #6C757D (use text-slate-600)
❌ style={{ }} (use className)
```

## 📚 Full Docs

- **Colors:** `COLOR_STANDARDS.md`
- **Usage:** `styles/USAGE_GUIDE.md`
- **Summary:** `REFACTORING_SUMMARY.md`

---

**Keep this card handy when building components!** 🚀


