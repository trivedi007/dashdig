# Neo-Brutalist Button Components

## ⚡ Overview

A comprehensive button system for Dashdig featuring neo-brutalist styling with hard shadows, bold borders, and smooth animations.

---

## 📁 Location

`/frontend/src/components/ui/Button.tsx`

---

## 🎨 Button Variants

### 1. Primary (Main CTAs)

**Style:**
- Background: `#FF6B35` (accent orange)
- Text: `#FFFFFF` (white)
- Border: `2px solid #1A1A1A`
- Shadow: `4px 4px 0 #1A1A1A`

**Usage:**
```tsx
<Button variant="primary">Get Started Free</Button>
<Button variant="primary" size="lg">Sign Up Now</Button>
```

**Visual:**
```
┌─────────────────┐
│  Get Started    │  Orange background, white text
│                 │  Black border, hard shadow
└─────────────────┘
```

---

### 2. Secondary (Alternative Actions)

**Style:**
- Background: `transparent` → `#FF6B35` (on hover)
- Text: `#1A1A1A` → `#FFFFFF` (on hover)
- Border: `2px solid #1A1A1A`
- Shadow: `4px 4px 0 #1A1A1A`

**Usage:**
```tsx
<Button variant="secondary">Learn More</Button>
<Button variant="secondary" icon={<InfoIcon />}>Details</Button>
```

**Visual:**
```
┌─────────────────┐
│  Learn More     │  Transparent, fills orange on hover
│                 │  Black border, hard shadow
└─────────────────┘
```

---

### 3. Ghost (Minimal)

**Style:**
- Background: `transparent`
- Text: `#A0A0B8` → `#FF6B35` (on hover)
- Border: `none`
- Shadow: `none`

**Usage:**
```tsx
<Button variant="ghost" href="/login">Log in</Button>
<Button variant="ghost">Cancel</Button>
```

**Visual:**
```
Learn More  ← Just text, no border/shadow
```

---

### 4. Outline (Dark Theme)

**Style:**
- Background: `#0F0F1A` → `#1A1A2E` (on hover)
- Text: `#FFFFFF`
- Border: `2px solid #1A1A1A`
- Shadow: `4px 4px 0 #1A1A1A`

**Usage:**
```tsx
<Button variant="outline">Settings</Button>
<Button variant="outline" icon={<SettingsIcon />}>Configure</Button>
```

---

## 📏 Size Variants

| Size | Padding | Font Size | Icon Size | Use Case |
|------|---------|-----------|-----------|----------|
| **sm** | 8px 16px | 13px | 14px | Compact spaces, mobile |
| **md** | 12px 24px | 14px | 16px | **Default** - Most buttons |
| **lg** | 16px 32px | 16px | 18px | Hero CTAs, emphasis |

### Usage

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

---

## ⚡ Special: DigButton

**Pre-configured primary button with lightning bolt icon**

```tsx
import { DigButton } from '@/components/ui/Button';

<DigButton>DIG THIS!</DigButton>
<DigButton size="lg">Create Link Now</DigButton>
<DigButton href="/create">Quick Create</DigButton>
```

**Visual:**
```
┌──────────────────┐
│ ⚡ DIG THIS!     │  Lightning bolt + text
│                  │  Orange background, bold
└──────────────────┘
```

---

## 🚀 Usage Examples

### Basic Buttons

```tsx
import Button from '@/components/ui/Button';

// Primary CTA
<Button variant="primary" size="lg">
  Get Started Free
</Button>

// Secondary action
<Button variant="secondary">
  Learn More
</Button>

// Ghost link
<Button variant="ghost" href="/login">
  Log in
</Button>
```

### With Icons

```tsx
import { ArrowRight, Download, Plus } from 'lucide-react';

// Icon on left
<Button variant="primary" icon={<Plus />}>
  Create Link
</Button>

// Icon on right
<Button variant="secondary" iconRight={<ArrowRight />}>
  Continue
</Button>

// Both sides
<Button 
  variant="primary"
  icon={<Download />}
  iconRight={<ArrowRight />}
>
  Download Report
</Button>
```

### Loading State

```tsx
<Button variant="primary" loading={true}>
  Creating...
</Button>

// Automatically shows spinner and disables
<Button 
  variant="primary" 
  loading={isSubmitting}
  onClick={handleSubmit}
>
  Submit
</Button>
```

### Disabled State

```tsx
<Button variant="primary" disabled>
  Unavailable
</Button>

<Button variant="secondary" disabled icon={<Lock />}>
  Locked Feature
</Button>
```

### Full Width

```tsx
<Button variant="primary" fullWidth>
  Sign Up
</Button>

// Great for mobile layouts
<div className="w-full px-4">
  <Button variant="primary" fullWidth size="lg">
    Get Started
  </Button>
</div>
```

### As Link (Next.js)

```tsx
// Automatically uses Next.js Link
<Button variant="primary" href="/signup">
  Create Account
</Button>

<Button variant="ghost" href="/docs">
  Documentation
</Button>
```

### As Form Submit

```tsx
<form onSubmit={handleSubmit}>
  <input type="email" />
  <Button 
    type="submit" 
    variant="primary"
    loading={isSubmitting}
  >
    Subscribe
  </Button>
</form>
```

---

## 🎯 Convenience Components

### Pre-configured Variants

```tsx
import { 
  PrimaryButton,
  SecondaryButton,
  GhostButton,
  OutlineButton,
  DigButton,
} from '@/components/ui/Button';

<PrimaryButton>Primary</PrimaryButton>
<SecondaryButton>Secondary</SecondaryButton>
<GhostButton>Ghost</GhostButton>
<OutlineButton>Outline</OutlineButton>
<DigButton>DIG THIS!</DigButton>
```

### Pre-configured Sizes

```tsx
import { SmallButton, LargeButton } from '@/components/ui/Button';

<SmallButton variant="primary">Small</SmallButton>
<LargeButton variant="primary">Large</LargeButton>
```

---

## 🎨 Interactive States

### Hover State

**Effect:**
- Transform: `translate(-2px, -2px)` (lift up and left)
- Shadow: `4px 4px 0` → `6px 6px 0` (larger shadow)
- Primary text → Orange (on ghost variant)
- Transparent → Orange (on secondary variant)

**Transition:** `all 0.2s ease`

### Active/Click State

**Effect:**
- Transform: `translate(0, 0)` (pressed down)
- Shadow: `none` (flat against surface)
- Creates satisfying "click" feeling

### Disabled State

**Effect:**
- Opacity: `0.5`
- Cursor: `not-allowed`
- No hover effects
- No click events

### Loading State

**Effect:**
- Shows spinning loader icon
- Disables all interactions
- Replaces left icon with spinner
- Maintains button dimensions

---

## 📦 Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'outline'` | `'primary'` | Style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `icon` | `React.ReactNode` | - | Icon on the left |
| `iconRight` | `React.ReactNode` | - | Icon on the right |
| `loading` | `boolean` | `false` | Loading state |
| `disabled` | `boolean` | `false` | Disabled state |
| `fullWidth` | `boolean` | `false` | Expand to full width |
| `children` | `React.ReactNode` | - | Button text/content |
| `onClick` | `(e) => void` | - | Click handler |
| `href` | `string` | - | Next.js Link href |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Button type |
| `className` | `string` | `''` | Additional CSS classes |

---

## 🎯 Real-World Usage

### Hero CTA

```tsx
<section className="text-center py-24">
  <h1 className="text-6xl font-display font-bold mb-8">
    Humanize Your URLs
  </h1>
  <div className="flex gap-4 justify-center">
    <DigButton size="lg" href="/signup">
      Get Started Free
    </DigButton>
    <Button variant="secondary" size="lg" href="/demo">
      Watch Demo
    </Button>
  </div>
</section>
```

### Form Actions

```tsx
<form onSubmit={handleSubmit}>
  {/* Form fields */}
  <div className="flex gap-3 justify-end">
    <Button variant="ghost" onClick={onCancel}>
      Cancel
    </Button>
    <Button 
      variant="primary" 
      type="submit"
      loading={isSubmitting}
    >
      Save Changes
    </Button>
  </div>
</form>
```

### Dashboard Actions

```tsx
<div className="flex items-center gap-3">
  <DigButton icon={<Plus />}>
    New Link
  </DigButton>
  <Button variant="outline" icon={<Download />}>
    Export
  </Button>
  <Button variant="ghost" icon={<Filter />}>
    Filter
  </Button>
</div>
```

### Mobile Full Width

```tsx
<div className="px-4 space-y-3">
  <Button variant="primary" fullWidth size="lg">
    Sign Up
  </Button>
  <Button variant="ghost" fullWidth>
    Already have an account?
  </Button>
</div>
```

---

## 🎨 Variant Comparison

```tsx
<div className="space-y-4 p-8 bg-bg-dark">
  <Button variant="primary">Primary Button</Button>
  <Button variant="secondary">Secondary Button</Button>
  <Button variant="ghost">Ghost Button</Button>
  <Button variant="outline">Outline Button</Button>
  <DigButton>Dig Button</DigButton>
</div>
```

**Visual Output:**
```
[Get Started]     ← Orange background, white text, black shadow
[Learn More]      ← Transparent, fills orange on hover
Learn More        ← Text only, turns orange on hover
[Settings]        ← Dark background, white text, shadow
[⚡ DIG THIS!]    ← Orange + lightning bolt
```

---

## 🔧 Advanced Customization

### Custom Styling

```tsx
<Button 
  variant="primary"
  className="rounded-full uppercase tracking-wider"
>
  Custom Styled
</Button>
```

### With Tooltip

```tsx
<div className="relative group">
  <Button variant="ghost" icon={<HelpCircle />}>
    Help
  </Button>
  <div className="tooltip">Click for help</div>
</div>
```

### Button Group

```tsx
<div className="flex gap-2">
  <Button variant="outline" size="sm">Week</Button>
  <Button variant="primary" size="sm">Month</Button>
  <Button variant="outline" size="sm">Year</Button>
</div>
```

### Icon Only Button

```tsx
<Button 
  variant="ghost" 
  icon={<X />}
  aria-label="Close"
>
  {/* No text */}
</Button>
```

---

## 🎨 Neo-Brutalist Effects Breakdown

### Default → Hover → Active

```
DEFAULT:
┌─────────────┐
│   Button    │  shadow: 4px 4px 0
└─────────────┘  transform: translate(0, 0)
    └─────────┘  (shadow underneath)

HOVER:
  ┌─────────────┐
  │   Button    │  shadow: 6px 6px 0
  └─────────────┘  transform: translate(-2px, -2px)
      └───────────┘  (larger shadow, button lifts)

ACTIVE (CLICK):
┌─────────────┐
│   Button    │  shadow: none
└─────────────┘  transform: translate(0, 0)
                 (pressed flat)
```

---

## 🧪 Testing Examples

```tsx
// Test all variants
<div className="space-y-4">
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="outline">Outline</Button>
</div>

// Test all sizes
<div className="flex gap-4 items-center">
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
</div>

// Test states
<Button loading={true}>Loading...</Button>
<Button disabled>Disabled</Button>

// Test with icons
<Button icon={<Plus />}>With Icon</Button>
<Button iconRight={<ArrowRight />}>Icon Right</Button>
<Button icon={<Download />} iconRight={<ArrowRight />}>Both</Button>

// Test DigButton
<DigButton>DIG THIS!</DigButton>
<DigButton size="lg">Large Dig</DigButton>
```

---

## 📊 When to Use Each Variant

| Variant | Use Case | Example |
|---------|----------|---------|
| **Primary** | Main actions, CTAs | "Get Started", "Sign Up", "Create Link" |
| **Secondary** | Alternative actions | "Learn More", "View Details", "Cancel" |
| **Ghost** | Tertiary actions, links | "Skip", "Back", "Close", navigation links |
| **Outline** | Dark theme actions | Dashboard buttons, settings |
| **DigButton** | Quick actions, "magic" features | "DIG THIS!", "Generate", "Quick Create" |

---

## 🎯 Best Practices

### Do's ✅

- Use Primary for main CTAs (1 per section)
- Use Secondary for alternative actions
- Use Ghost for tertiary/less important actions
- Use DigButton for AI/quick action features
- Pair Primary + Secondary in hero sections
- Use loading state during async operations
- Use fullWidth on mobile for better tap targets
- Add descriptive text, not just "Click here"

### Don'ts ❌

- Don't use multiple Primary buttons in same section
- Don't use DigButton everywhere (dilutes specialness)
- Don't forget to handle loading states
- Don't make buttons too small on mobile
- Don't use disabled without explanation
- Don't nest buttons
- Don't override core brutalist styling

---

## 🔧 Props Reference

### variant

```tsx
<Button variant="primary">Most important action</Button>
<Button variant="secondary">Alternative action</Button>
<Button variant="ghost">Minimal action</Button>
<Button variant="outline">Dark theme action</Button>
```

### size

```tsx
<Button size="sm">Compact</Button>
<Button size="md">Default</Button>
<Button size="lg">Prominent</Button>
```

### icon / iconRight

```tsx
import { Plus, ArrowRight } from 'lucide-react';

<Button icon={<Plus />}>Add</Button>
<Button iconRight={<ArrowRight />}>Next</Button>
```

### loading

```tsx
const [loading, setLoading] = useState(false);

<Button 
  loading={loading}
  onClick={async () => {
    setLoading(true);
    await submitForm();
    setLoading(false);
  }}
>
  Submit
</Button>
```

### disabled

```tsx
<Button disabled>Not Available</Button>
<Button disabled={!isValid}>Submit</Button>
```

### fullWidth

```tsx
<Button fullWidth>Expand to Container Width</Button>
```

### href

```tsx
<Button href="/">Home</Button>
<Button href="/dashboard">Dashboard</Button>
```

### onClick

```tsx
<Button onClick={() => console.log('Clicked!')}>
  Click Me
</Button>

<Button onClick={handleSubmit}>
  Submit Form
</Button>
```

### type

```tsx
<Button type="submit">Submit</Button>
<Button type="reset">Reset Form</Button>
<Button type="button">Regular Button</Button>
```

---

## 🎨 Color Reference

### Primary Button
- **Default BG:** `#FF6B35`
- **Default Text:** `#FFFFFF`
- **Border:** `#1A1A1A`
- **Shadow:** `#1A1A1A`

### Secondary Button
- **Default BG:** `transparent`
- **Hover BG:** `#FF6B35`
- **Default Text:** `#1A1A1A`
- **Hover Text:** `#FFFFFF`

### Ghost Button
- **BG:** `transparent`
- **Default Text:** `#A0A0B8`
- **Hover Text:** `#FF6B35`

### Outline Button
- **Default BG:** `#0F0F1A`
- **Hover BG:** `#1A1A2E`
- **Text:** `#FFFFFF`

---

## 📱 Responsive Patterns

### Mobile-First Approach

```tsx
<Button 
  size="sm"           // Small on mobile
  className="md:text-base md:px-6"  // Larger on desktop
>
  Get Started
</Button>
```

### Adaptive Button Group

```tsx
<div className="flex flex-col sm:flex-row gap-3">
  <Button variant="primary" fullWidth className="sm:w-auto">
    Sign Up
  </Button>
  <Button variant="secondary" fullWidth className="sm:w-auto">
    Learn More
  </Button>
</div>
```

---

## 🎉 Summary

Your button system provides:
- ✅ 4 style variants (primary, secondary, ghost, outline)
- ✅ 3 size options (sm, md, lg)
- ✅ Loading and disabled states
- ✅ Icon support (left and right)
- ✅ Next.js Link integration
- ✅ Full width option
- ✅ Neo-brutalist styling
- ✅ Smooth hover animations
- ✅ Special DigButton variant
- ✅ 7+ convenience exports
- ✅ Full TypeScript support
- ✅ No linter errors

**Production-ready button components with perfect Dashdig branding!** 🚀⚡



