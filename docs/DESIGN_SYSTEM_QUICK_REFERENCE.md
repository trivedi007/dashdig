# Dashdig Design System - Quick Reference Card

## 🎨 Core Colors (Copy & Paste Ready)

```typescript
// Primary
accent: '#FF6B35'
accentHover: '#E55A2B'
boltGold: '#FFCC33'        // ⚡ Lightning - ALWAYS solid gold
black: '#1A1A1A'           // Borders & shadows

// Backgrounds
bgDark: '#0F0F1A'          // Dashboard
bgCard: '#1A1A2E'          // Cards
bgCream: '#FDF8F3'         // Landing page

// Text
textPrimary: '#FFFFFF'     // Main text (dark mode)
textSecondary: '#A0A0B8'   // Labels (dark mode)

// Status
success: '#10B981'
warning: '#F59E0B'
error: '#EF4444'
```

---

## ⚡ Lightning Bolt Rule

**ALWAYS USE SOLID GOLD - NEVER GRADIENT**

```tsx
// ✅ CORRECT
<Zap className="text-[#FFCC33] fill-[#FFCC33]" />

// ❌ WRONG
<Zap className="text-gradient fill-gradient" />
```

---

## 🌑 Neo-Brutalist Shadows

```css
shadow-sm: 2px 2px 0 #1A1A1A
shadow-md: 3px 3px 0 #1A1A1A
shadow-lg: 4px 4px 0 #1A1A1A
shadow-xl: 6px 6px 0 #1A1A1A  /* Hover */
```

---

## 🔲 Borders

```css
width: 2px
color: #1A1A1A
radius-sm: 6px
radius-md: 8px
radius-lg: 12px
radius-xl: 16px
```

---

## ✍️ Typography

```
Display: 'Space Grotesk'  → Headings, logo, buttons
Body: 'Inter'             → Paragraphs, UI text
Mono: 'JetBrains Mono'    → URLs, code
```

---

## 🌈 Gradients

```typescript
// Aurora (Dashboard accent)
linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)

// Accent (Buttons)
linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)

// Avatar (Orange glow)
linear-gradient(135deg, #F97316 0%, #EA580C 100%)
```

---

## 🚀 Quick Import

```typescript
// Individual colors
import { accent, boltGold, bgDark } from '@/lib/design-system';

// Entire system
import designSystem from '@/lib/design-system';

// Utilities
import { getBrutalistShadow, gradients } from '@/lib/design-system';
```

---

## 🎯 Tailwind Classes

```tsx
<button className="bg-accent hover:bg-accent-hover shadow-brutalist-md hover:shadow-brutalist-xl">
  Button
</button>

<div className="bg-bg-dark text-text-primary font-display">
  Dashboard
</div>

<div className="bg-gradient-aurora rounded-brutalist-lg">
  Aurora Effect
</div>
```

---

## 💅 Component Presets

```typescript
import { componentStyles } from '@/lib/design-system';

// Apply preset
<button style={componentStyles.button.primary}>
  Primary Button
</button>

<div style={componentStyles.card}>
  Card
</div>
```

---

## 🎨 Common Patterns

### Button (Brutalist)
```tsx
className="bg-accent text-white border-2 border-brutalist-black shadow-brutalist-md hover:shadow-brutalist-xl rounded-brutalist-md font-display font-bold px-6 py-3 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutalist-sm"
```

### Card
```tsx
className="bg-bg-card border-2 border-brutalist-black shadow-brutalist-lg rounded-brutalist-lg p-6"
```

### Input
```tsx
className="bg-bg-dark text-text-primary border-2 border-brutalist-black rounded-brutalist-md px-4 py-3 font-body focus:border-accent focus:outline-none"
```

### Link
```tsx
className="text-accent hover:text-accent-hover font-display font-semibold underline underline-offset-2"
```

---

## 📱 Responsive Utilities

```tsx
// Mobile-first approach
<div className="bg-accent md:bg-accent-hover lg:shadow-brutalist-xl">
  Responsive Element
</div>
```

---

## 🔧 Utility Functions

```typescript
// Get shadow
getBrutalistShadow('lg') // → "4px 4px 0 #1A1A1A"

// Get accent with opacity
getAccentColor(0.2) // → "rgba(255, 107, 53, 0.2)"

// Get aurora with opacity
getAuroraGradient(0.5) // → Semi-transparent aurora
```

---

## 🎯 File Locations

```
frontend/
├── src/
│   ├── lib/
│   │   └── design-system.ts          ← Main constants
│   └── examples/
│       └── design-system-usage.tsx   ← Usage examples
├── tailwind.config.ts                ← Tailwind integration
└── docs/
    └── DESIGN_SYSTEM.md              ← Full documentation
```

---

## 🚦 Status & Feedback Colors

```typescript
// Success
bg: '#10B981'
use: "Link created!", "Upload complete"

// Warning  
bg: '#F59E0B'
use: "Approaching limit", "Review needed"

// Error
bg: '#EF4444'
use: "Failed to save", "Invalid URL"
```

---

## ⚡ Quick Copy Snippets

### Primary Button
```tsx
<button className="bg-accent hover:bg-accent-hover text-white border-2 border-brutalist shadow-brutalist-md hover:shadow-brutalist-xl rounded-brutalist-md font-display font-bold px-6 py-3">
  Get Started
</button>
```

### Card
```tsx
<div className="bg-bg-card border-2 border-brutalist shadow-brutalist-lg rounded-brutalist-lg p-6">
  Content
</div>
```

### URL Display
```tsx
<code className="bg-bg-dark text-accent font-mono text-sm px-3 py-2 rounded-brutalist-sm border-2 border-brutalist">
  dashdig.com/summer-sale
</code>
```

---

## 📐 Spacing Scale

```
xs:  4px
sm:  8px
md:  16px
lg:  24px
xl:  32px
2xl: 48px
3xl: 64px
```

---

## 🎨 Color Usage Guide

| Element | Color | Use Case |
|---------|-------|----------|
| **CTA Buttons** | `accent` | Primary actions |
| **Lightning Bolt** | `boltGold` | Brand icon (ALWAYS solid) |
| **Borders** | `black` | All brutalist borders |
| **Dashboard BG** | `bgDark` | Main background |
| **Cards** | `bgCard` | Container backgrounds |
| **Headings** | `textPrimary` | Main headings |
| **Body Text** | `textSecondary` | Paragraphs |
| **Links** | `accent` | Clickable links |
| **Success** | `success` | Confirmations |
| **Error** | `error` | Error messages |

---

## 🎯 Remember

1. **Lightning bolt = ALWAYS solid gold** (`#FFCC33`)
2. **Borders = ALWAYS 2px black** (`#1A1A1A`)
3. **Shadows = ALWAYS hard/offset** (no blur)
4. **Buttons = ALWAYS font-display** (Space Grotesk)
5. **URLs = ALWAYS font-mono** (JetBrains Mono)

---

**Quick Access:** Bookmark this file for instant reference! 🔖



