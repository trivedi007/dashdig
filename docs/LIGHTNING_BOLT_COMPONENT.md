# Lightning Bolt Component - Official Dashdig Icon

## ⚡ Overview

The Lightning Bolt is Dashdig's signature brand icon - a 7-point bolt with flat top and southwest-pointing bottom. It represents speed, power, and instant URL transformation.

---

## 📁 Location

`/frontend/src/components/ui/LightningBolt.tsx`

---

## 🎨 Design Specifications

### SVG Path (Official)
```
M 6 2 L 17 2 L 13 10 L 19 10 L 3 30 L 7 18 L 1 18 Z
```

**⚠️ CRITICAL:** This path must NEVER be modified. It's the official Dashdig bolt shape.

### Colors (Non-Negotiable)

| Element | Color | Value |
|---------|-------|-------|
| **Fill** | Solid Gold | `#FFCC33` |
| **Stroke** | Brutalist Black | `#1A1A1A` |
| **Stroke Width** | - | `1.5px` |

**❌ NEVER use gradients on the lightning bolt**

---

## 📏 Size Variants

| Size | Dimensions | Use Case |
|------|------------|----------|
| `xs` | 12×16px | Small icons, badges |
| `sm` | 14×18px | Inline text icons |
| `md` | 20×24px | **Default** - Buttons, cards |
| `lg` | 24×28px | Headers, prominent placement |
| `xl` | 28×32px | Hero sections, large displays |

---

## 🚀 Usage

### Basic Import

```tsx
import LightningBolt from '@/components/ui/LightningBolt';

// Or named import
import { LightningBolt } from '@/components/ui/LightningBolt';
```

### Basic Usage

```tsx
// Default size (md - 20×24px)
<LightningBolt />

// Specify size
<LightningBolt size="lg" />

// With custom classes
<LightningBolt size="xl" className="animate-pulse" />
```

### Convenience Components

```tsx
import { 
  LightningBoltXS,
  LightningBoltSM,
  LightningBoltMD,
  LightningBoltLG,
  LightningBoltXL,
} from '@/components/ui/LightningBolt';

<LightningBoltXS />  // 12×16px
<LightningBoltSM />  // 14×18px
<LightningBoltMD />  // 20×24px
<LightningBoltLG />  // 24×28px
<LightningBoltXL />  // 28×32px
```

---

## 🎯 Common Use Cases

### 1. Logo Component

```tsx
function DashdigLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-accent p-2 rounded-brutalist-md">
        <LightningBolt size="lg" />
      </div>
      <span className="font-display text-2xl font-bold">DASHDIG</span>
    </div>
  );
}
```

### 2. Button Icon

```tsx
<button className="bg-accent text-white px-6 py-3 flex items-center gap-2">
  <LightningBolt size="sm" />
  <span>Quick Action</span>
</button>
```

### 3. Loading Indicator

```tsx
<LightningBolt size="md" className="animate-pulse" />
```

### 4. Avatar Watermark

```tsx
function BrandedAvatar() {
  return (
    <div className="relative w-16 h-16 bg-gradient-orange-glow rounded-full">
      {/* Lightning watermark at 40% opacity */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40">
        <LightningBolt size="sm" />
      </div>
      {/* User initials */}
      <span className="relative z-10">NT</span>
    </div>
  );
}
```

### 5. Feature Icon

```tsx
<div className="flex items-center gap-3">
  <div className="w-12 h-12 bg-accent rounded-brutalist-md flex items-center justify-center">
    <LightningBolt size="md" />
  </div>
  <div>
    <h3 className="font-display font-bold">AI-Powered</h3>
    <p className="text-text-secondary">Lightning-fast URL generation</p>
  </div>
</div>
```

### 6. Empty State

```tsx
<div className="text-center py-12">
  <LightningBolt size="xl" className="mx-auto mb-4 opacity-50" />
  <h3 className="font-display text-xl">No links yet</h3>
  <p className="text-text-secondary">Create your first link to get started</p>
</div>
```

---

## 🎨 Styling Options

### With Tailwind Classes

```tsx
<LightningBolt 
  size="lg" 
  className="drop-shadow-lg hover:scale-110 transition-transform" 
/>
```

### With Inline Styles

```tsx
<LightningBolt 
  size="md"
  className="custom-bolt"
  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
/>
```

### Animated

```tsx
// Pulse
<LightningBolt className="animate-pulse" />

// Spin
<LightningBolt className="animate-spin" />

// Bounce
<LightningBolt className="animate-bounce" />
```

---

## ⚠️ Important Rules

### ✅ DO

- ✅ Use solid gold fill (`#FFCC33`)
- ✅ Keep black stroke outline
- ✅ Use provided size variants
- ✅ Add custom animations/transitions
- ✅ Use in logos, buttons, icons
- ✅ Import from design system colors

### ❌ DON'T

- ❌ Modify the SVG path
- ❌ Use gradients on the bolt
- ❌ Change the fill color
- ❌ Remove the stroke outline
- ❌ Alter the viewBox
- ❌ Use bitmap images of the bolt

---

## 🎯 Size Reference

Visual comparison:

```
XS  ⚡ (12×16px)  - Tiny badge icons
SM  ⚡ (14×18px)  - Inline with text
MD  ⚡ (20×24px)  - Default button size
LG  ⚡ (24×28px)  - Header icons
XL  ⚡ (28×32px)  - Hero sections
```

---

## 🔧 Technical Details

### ViewBox Explanation

`viewBox="-1 0 22 32"`

- `-1` (x): Slight left offset for centering
- `0` (y): No top offset
- `22` (width): Path width + padding
- `32` (height): Path height from top to bottom

This ensures the bolt is perfectly centered in all sizes.

### Stroke Properties

- **Width:** `1.5px` - Balanced outline
- **Linejoin:** `round` - Smooth corners
- **Color:** `#1A1A1A` - Brutalist black

---

## 📦 Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size variant |
| `className` | `string` | `''` | Additional CSS classes |

---

## 🎨 Integration with Design System

The component automatically imports colors from the design system:

```typescript
import { boltGold, black } from '../../lib/design-system';

// Used in the SVG
fill={boltGold}        // #FFCC33
stroke={black}         // #1A1A1A
```

This ensures:
- ✅ Consistent branding
- ✅ Centralized color management
- ✅ Easy global updates

---

## 🌟 Real-World Examples

### Logo

```tsx
import LightningBolt from '@/components/ui/LightningBolt';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-accent p-2 rounded-lg border-2 border-brutalist-black">
        <LightningBolt size="lg" />
      </div>
      <div>
        <span className="font-display text-2xl font-bold">DASHDIG</span>
        <p className="text-xs text-text-secondary">HUMANIZE • SHORTENIZE • URLS</p>
      </div>
    </div>
  );
}
```

### Feature Card

```tsx
<div className="bg-bg-card border-2 border-brutalist-black rounded-brutalist-lg p-6 shadow-brutalist-lg">
  <LightningBolt size="md" className="mb-4" />
  <h3 className="font-display text-xl font-bold mb-2">Lightning Fast</h3>
  <p className="text-text-secondary">Generate shortened URLs in milliseconds</p>
</div>
```

### CTA Button

```tsx
<button className="bg-accent hover:bg-accent-hover text-white border-2 border-brutalist-black shadow-brutalist-md hover:shadow-brutalist-xl rounded-brutalist-md px-6 py-3 font-display font-bold flex items-center gap-2 transition-all">
  <LightningBolt size="sm" />
  <span>Create Link Now</span>
</button>
```

### Loading State

```tsx
<div className="flex items-center gap-3">
  <LightningBolt size="md" className="animate-pulse" />
  <span className="font-body text-text-secondary">
    Generating AI-powered URL...
  </span>
</div>
```

---

## 🧪 Testing

```tsx
// Test all sizes
<div className="flex items-center gap-4">
  <LightningBolt size="xs" />
  <LightningBolt size="sm" />
  <LightningBolt size="md" />
  <LightningBolt size="lg" />
  <LightningBolt size="xl" />
</div>

// Test with animations
<LightningBolt size="lg" className="animate-bounce" />

// Test with custom styling
<LightningBolt size="md" className="opacity-50 hover:opacity-100 transition-opacity" />
```

---

## 📐 Exact Dimensions

| Size | Width | Height | Aspect Ratio |
|------|-------|--------|--------------|
| XS | 12px | 16px | 3:4 |
| SM | 14px | 18px | 7:9 |
| MD | 20px | 24px | 5:6 |
| LG | 24px | 28px | 6:7 |
| XL | 28px | 32px | 7:8 |

---

## 🎯 Brand Guidelines

### When to Use

✅ **DO use the lightning bolt for:**
- Logo and branding
- "Quick action" buttons
- Speed/performance features
- AI-powered features
- Loading indicators
- Empty states
- Feature highlights

❌ **DON'T use for:**
- Navigation icons (use standard icons)
- Form validation (use check/x icons)
- Generic decorations (overuse dilutes brand)

### Placement

**Primary Locations:**
1. Logo (top-left)
2. CTA buttons
3. "AI-powered" feature callouts
4. Avatar watermarks (subtle)
5. Loading states

**Avoid:**
- Don't use in every button
- Don't use as bullet points
- Don't use in body text

---

## 🎨 Color Variations (When Absolutely Needed)

While the bolt should **always be gold**, here are acceptable variations for special cases:

```tsx
// Default (ALWAYS use this)
<LightningBolt />  // Gold with black stroke

// On dark backgrounds (if gold is too bright)
// Use opacity instead of changing color
<LightningBolt className="opacity-80" />

// Disabled state
<LightningBolt className="opacity-40 grayscale" />
```

**Never change the fill color from `#FFCC33`!**

---

## 🔄 Migration Guide

If you're currently using `lucide-react`'s `Zap` icon:

```tsx
// OLD
import { Zap } from 'lucide-react';
<Zap className="text-yellow-400" />

// NEW
import LightningBolt from '@/components/ui/LightningBolt';
<LightningBolt size="md" />
```

**Benefits:**
- ✅ Consistent Dashdig brand shape
- ✅ Proper sizing variants
- ✅ Correct colors automatically
- ✅ Better visual consistency

---

## 📊 Performance

- **Inline SVG:** No external requests
- **No dependencies:** Pure React component
- **Lightweight:** ~1KB uncompressed
- **Tree-shakeable:** Import only what you need
- **SSR-compatible:** Works with Next.js

---

## 🎉 Summary

Your Lightning Bolt component:
- ✅ Official Dashdig 7-point bolt shape
- ✅ Always solid gold (`#FFCC33`)
- ✅ Black stroke outline for contrast
- ✅ 5 size variants (xs to xl)
- ✅ Full TypeScript support
- ✅ Convenience exports for each size
- ✅ JSDoc documentation
- ✅ Design system integration
- ✅ Zero dependencies
- ✅ Production-ready

**Use it everywhere to reinforce the Dashdig brand!** ⚡🚀



