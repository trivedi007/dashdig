# Dashdig Design System - Neo-Brutalist Theme

## 📁 Location
`/frontend/src/lib/design-system.ts`

---

## 🎨 Color Palette

### Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Accent Orange** | `#FF6B35` | Primary buttons, CTAs, links, hover states |
| **Accent Hover** | `#E55A2B` | Button hover, active states |
| **Bolt Gold** | `#FFCC33` | Lightning bolt fill (always solid) |
| **Brutalist Black** | `#1A1A1A` | Borders, shadows, strokes |

### Backgrounds

| Color | Hex | Usage |
|-------|-----|-------|
| **BG Dark** | `#0F0F1A` | Dashboard main background |
| **BG Card** | `#1A1A2E` | Cards on dark backgrounds |
| **BG Cream** | `#FDF8F3` | Landing page background |

### Text Colors (Dark Mode)

| Color | Hex | Usage |
|-------|-----|-------|
| **Text Primary** | `#FFFFFF` | Headings, primary text |
| **Text Secondary** | `#A0A0B8` | Secondary text, labels |
| **Text Muted** | `#6B6B80` | Disabled, helper text |

### Text Colors (Light Mode)

| Color | Hex | Usage |
|-------|-----|-------|
| **Text Primary Light** | `#1A1A1A` | Headings on light backgrounds |
| **Text Secondary Light** | `#6B7280` | Secondary text on light |

### Status Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Success** | `#10B981` | Success messages, active badges |
| **Warning** | `#F59E0B` | Warnings, pending states |
| **Error** | `#EF4444` | Errors, destructive actions |

### Aurora Gradient

| Stop | Hex | Position |
|------|-----|----------|
| **Start (Indigo)** | `#4F46E5` | 0% |
| **Mid (Purple)** | `#7C3AED` | 50% |
| **End (Pink)** | `#EC4899` | 100% |

---

## ✍️ Typography

| Type | Font Family | Usage |
|------|-------------|-------|
| **Display** | Space Grotesk | Headings, logo, buttons |
| **Body** | Inter | Body text, paragraphs |
| **Mono** | JetBrains Mono | URLs, code blocks, API keys |

---

## 🌑 Neo-Brutalist Shadows

| Size | Shadow | Usage |
|------|--------|-------|
| **Small** | `2px 2px 0 #1A1A1A` | Small cards, inputs |
| **Medium** | `3px 3px 0 #1A1A1A` | Buttons, medium cards |
| **Large** | `4px 4px 0 #1A1A1A` | Large cards, modals |
| **XL** | `6px 6px 0 #1A1A1A` | Hover states, emphasis |

---

## 📐 Borders

| Property | Value | Usage |
|----------|-------|-------|
| **Border Width** | `2px` | All brutalist borders |
| **Border Color** | `#1A1A1A` | Default border color |
| **Radius Small** | `6px` | Small elements |
| **Radius Medium** | `8px` | Buttons, inputs |
| **Radius Large** | `12px` | Cards |
| **Radius XL** | `16px` | Modals, large containers |

---

## 🚀 Usage Examples

### Import Individual Colors

```typescript
import { accent, boltGold, bgDark } from '@/lib/design-system';

const buttonStyle = {
  backgroundColor: accent,
  color: '#FFFFFF',
};
```

### Import Entire System

```typescript
import { designSystem } from '@/lib/design-system';

const theme = designSystem.colors.accent;
const font = designSystem.typography.fontDisplay;
```

### Use in Tailwind Classes

```tsx
// After extending tailwind.config.ts
<button className="bg-accent text-white shadow-brutalist-md hover:shadow-brutalist-xl">
  Click Me
</button>

<div className="bg-bg-dark text-text-primary font-display">
  Dashboard
</div>

<div className="bg-gradient-aurora rounded-brutalist-lg">
  Aurora Effect
</div>
```

### Generate CSS Custom Properties

```typescript
import { generateCSSCustomProperties } from '@/lib/design-system';

// In a global CSS file or component
const cssVars = generateCSSCustomProperties();

// In your globals.css:
// Paste the output or inject dynamically
```

### Use Gradients

```typescript
import { gradients } from '@/lib/design-system';

<div style={{ background: gradients.aurora }}>
  Aurora Background
</div>

<button style={{ background: gradients.accent }}>
  Accent Button
</button>
```

### Get Brutalist Shadow

```typescript
import { getBrutalistShadow } from '@/lib/design-system';

const cardStyle = {
  boxShadow: getBrutalistShadow('lg'),
};
```

---

## 🎨 Design Patterns

### Neo-Brutalist Button

```tsx
<button 
  className="bg-accent text-white border-2 border-brutalist-black shadow-brutalist-md hover:shadow-brutalist-xl rounded-brutalist-md font-display font-bold transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutalist-sm"
>
  Click Me
</button>
```

### Neo-Brutalist Card

```tsx
<div className="bg-bg-card border-2 border-brutalist-black shadow-brutalist-lg rounded-brutalist-lg p-6">
  <h2 className="font-display text-text-primary">Card Title</h2>
  <p className="font-body text-text-secondary">Card content</p>
</div>
```

### Aurora Gradient Background

```tsx
<div className="bg-gradient-aurora text-white p-8">
  <h1 className="font-display text-4xl">Aurora Effect</h1>
</div>
```

### Lightning Bolt (Always Solid Gold)

```tsx
import { Zap } from 'lucide-react';

<Zap 
  className="w-8 h-8 text-bolt-gold fill-bolt-gold" 
  style={{ fill: boltGold }}  // Ensure solid gold
/>
```

---

## 📦 Tailwind Config Integration

The design system automatically extends your Tailwind config:

```typescript
// tailwind.config.ts
import { tailwindExtend } from "./src/lib/design-system";

export default {
  theme: {
    extend: {
      ...tailwindExtend,
      // Your custom additions
    },
  },
};
```

### Available Tailwind Classes

After integration, you get:

**Colors:**
- `bg-accent`, `text-accent`, `border-accent`
- `bg-accent-hover`, `hover:bg-accent-hover`
- `text-bolt-gold`, `fill-bolt-gold`
- `bg-bg-dark`, `bg-bg-card`, `bg-bg-cream`
- `text-text-primary`, `text-text-secondary`, `text-text-muted`
- `bg-success`, `bg-warning`, `bg-error`
- `bg-aurora-indigo`, `bg-aurora-purple`, `bg-aurora-pink`

**Fonts:**
- `font-display` → Space Grotesk
- `font-body` → Inter
- `font-mono` → JetBrains Mono

**Shadows:**
- `shadow-brutalist-sm`
- `shadow-brutalist-md`
- `shadow-brutalist-lg`
- `shadow-brutalist-xl`

**Border Radius:**
- `rounded-brutalist-sm` (6px)
- `rounded-brutalist-md` (8px)
- `rounded-brutalist-lg` (12px)
- `rounded-brutalist-xl` (16px)

**Border:**
- `border-brutalist` (2px width)
- `border-brutalist-black`

---

## 🎯 Component Presets

Use pre-built component styles:

```typescript
import { componentStyles } from '@/lib/design-system';

// Button
<button style={componentStyles.button.primary}>
  Primary Button
</button>

// Card
<div style={componentStyles.card}>
  Card Content
</div>

// Input
<input style={componentStyles.input} />
```

---

## 🔧 Utility Functions

### getBrutalistShadow(size)

```typescript
import { getBrutalistShadow } from '@/lib/design-system';

const shadow = getBrutalistShadow('lg'); // "4px 4px 0 #1A1A1A"
```

### getAuroraGradient(opacity)

```typescript
import { getAuroraGradient } from '@/lib/design-system';

const gradient = getAuroraGradient(0.5); // Aurora with 50% opacity
```

### getAccentColor(opacity)

```typescript
import { getAccentColor } from '@/lib/design-system';

const semiTransparent = getAccentColor(0.2); // rgba(255, 107, 53, 0.2)
```

---

## 📱 Responsive Design

All values work seamlessly with Tailwind's responsive prefixes:

```tsx
<button className="bg-accent md:bg-accent-hover lg:shadow-brutalist-xl">
  Responsive Button
</button>
```

---

## 🎨 CSS Custom Properties

Generate CSS variables for global use:

```typescript
import { generateCSSCustomProperties } from '@/lib/design-system';

// Add to globals.css
const cssVars = generateCSSCustomProperties();

// Or inject in _document.tsx
<style dangerouslySetInnerHTML={{ __html: cssVars }} />
```

Then use in CSS:

```css
.my-component {
  background: var(--color-accent);
  color: var(--text-primary);
  box-shadow: var(--shadow-md);
  font-family: var(--font-display);
}
```

---

## 🌟 Design Principles

### Neo-Brutalism

1. **Bold Borders** - Always 2px solid black
2. **Hard Shadows** - Offset shadows, no blur
3. **No Gradients** (except aurora and accent)
4. **High Contrast** - Clear visual hierarchy
5. **Geometric** - Clean lines and angles

### Lightning Bolt Rules

⚡ **ALWAYS use solid gold** (`#FFCC33`)
- Never use gradients on the bolt
- Always fill the entire icon
- Keep it prominent and recognizable

```tsx
// ✅ CORRECT
<Zap className="text-bolt-gold fill-bolt-gold" />

// ❌ WRONG
<Zap className="text-gradient fill-gradient" />
```

---

## 📚 File Structure

```
frontend/
├── src/
│   └── lib/
│       └── design-system.ts       ← Design system constants
├── tailwind.config.ts             ← Tailwind integration
└── app/
    └── globals.css                ← CSS custom properties
```

---

## 🎉 Summary

Your design system provides:
- ✅ **Consistent color palette** across all components
- ✅ **Neo-brutalist shadows** for depth
- ✅ **Typography hierarchy** with premium fonts
- ✅ **Tailwind integration** for easy class usage
- ✅ **CSS custom properties** for global styles
- ✅ **TypeScript types** for type safety
- ✅ **Utility functions** for dynamic styles
- ✅ **Component presets** for rapid development

**Your Dashdig brand is now systematized and ready to scale!** 🚀



