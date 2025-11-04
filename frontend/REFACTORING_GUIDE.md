# Dashboard CSS Refactoring Guide

## Color Mapping

Replace hardcoded hex colors with CSS variables:

```css
/* Primary Colors */
#FF6B35 → bg-[#FF6B35] or text-[#FF6B35] (keep for Tailwind)
         → var(--primary-orange) (in custom CSS)
#FF6B2C → #FF6B35 (standardize to #FF6B35)
#E85A2A → var(--primary-orange-hover)
#D64E1F → var(--primary-orange-active)

/* Text Colors */
#1F2937 → text-slate-900 or text-primary (utility class)
#6C757D → text-slate-600 or text-secondary (utility class)
#9CA3AF → text-slate-400 or text-muted (utility class)

/* Backgrounds */
#F9FAFB → bg-slate-50 or bg-gray
#FFFFFF → bg-white
#F8FAFC → bg-slate-50

/* Borders */
#E5E7EB → border-slate-200
#E2E8F0 → border-slate-200
```

## Refactoring Strategy

### 1. Use Tailwind Classes (Preferred)
```tsx
// Before
style={{ color: '#1F2937', fontSize: '14px' }}

// After
className="text-slate-900 text-sm"
```

### 2. Use dashboard.css Utility Classes
```tsx
// Before
style={{ display: 'flex', justifyContent: 'space-between' }}

// After
className="flex justify-between"
```

### 3. Keep Tailwind for Orange (Brand Color)
```tsx
// Keep as is - Tailwind doesn't have exact orange
className="bg-[#FF6B35] hover:bg-[#E85A2A]"
```

## Files to Refactor

- [x] globals.css (already using variables)
- [x] dashboard.css (source of truth)
- [ ] DashboardHeader.tsx
- [ ] dashboard/layout.tsx (sidebar)
- [ ] dashboard/page.tsx
- [ ] dashboard/overview/page.tsx
- [ ] dashboard/urls/page.tsx
- [ ] dashboard/widget/page.tsx
- [ ] components/cards/StatCard.tsx
- [ ] components/tables/UrlTable.tsx
- [ ] components/charts/ClicksChart.tsx

## Refactoring Checklist

For each file:
- [ ] Remove inline `style` attributes
- [ ] Replace hardcoded colors with variables
- [ ] Use Tailwind utility classes
- [ ] Use dashboard.css utility classes where applicable
- [ ] Ensure consistent spacing
- [ ] Test responsive behavior


