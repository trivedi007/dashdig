# Dashdig Logo Component

## ⚡ Overview

The official Dashdig logo component featuring the signature lightning bolt in an orange neo-brutalist box with the "DASHDIG" wordmark.

---

## 📁 Location

`/frontend/src/components/brand/Logo.tsx`

---

## 🎨 Visual Structure

```
┌────────────────────────────┐
│  ┌──────┐                 │
│  │  ⚡  │  DASHDIG         │  ← Logo text
│  └──────┘                 │
│     Orange box             │
│                            │
│  HUMANIZE • SHORTENIZE ... │  ← Tagline (optional)
└────────────────────────────┘
```

---

## 🚀 Quick Usage

### Basic Logo

```tsx
import Logo from '@/components/brand/Logo';

<Logo />
```

### With All Options

```tsx
<Logo 
  size="md"
  showTagline={true}
  variant="light"
  href="/"
  className="my-custom-class"
/>
```

### Convenience Variants

```tsx
import { 
  LogoSM, 
  LogoMD, 
  LogoLG,
  LogoWithTagline,
  LogoLight,
  LogoDark,
} from '@/components/brand/Logo';

<LogoSM />                    // Small size
<LogoMD />                    // Medium size (default)
<LogoLG />                    // Large size
<LogoWithTagline size="lg" /> // With tagline
<LogoLight />                 // White text (dark backgrounds)
<LogoDark />                  // Black text (light backgrounds)
```

---

## 📐 Size Specifications

| Size | Icon Box | Text Size | Tagline Size | Use Case |
|------|----------|-----------|--------------|----------|
| **sm** | 36×36px | 18px | 7px | Mobile headers, compact spaces |
| **md** | 44×44px | 24px | 9px | **Default** - Desktop header |
| **lg** | 48×48px | 26px | 10px | Hero sections, landing pages |

---

## 🎨 Variant Examples

### Light Variant (Dark Backgrounds)

```tsx
// For dark dashboard, dark hero sections
<Logo variant="light" />  // White "DASHDIG" text
```

**Output:**
```
┌──────┐
│  ⚡  │  DASHDIG (white)
└──────┘
  HUMANIZE • SHORTENIZE • URLS (orange)
```

### Dark Variant (Light Backgrounds)

```tsx
// For light landing pages, light sections
<Logo variant="dark" />  // Black "DASHDIG" text
```

**Output:**
```
┌──────┐
│  ⚡  │  DASHDIG (black)
└──────┘
  HUMANIZE • SHORTENIZE • URLS (orange)
```

---

## 🔗 Link Behavior

### As Navigation Link

```tsx
// Automatically wraps in Next.js Link
<Logo href="/" />
<Logo href="/dashboard" showTagline={true} />
```

### As Click Button

```tsx
// Wraps in button element
<Logo onClick={() => console.log('Logo clicked')} />
<Logo onClick={handleLogoClick} showTagline={true} />
```

### Static (No Interaction)

```tsx
// Just renders the logo without any wrapper
<Logo />
```

---

## 🎯 Real-World Examples

### 1. Navigation Header (Desktop)

```tsx
import Logo from '@/components/brand/Logo';

export function Header() {
  return (
    <header className="bg-bg-dark border-b-2 border-brutalist-black px-6 py-4">
      <Logo 
        size="md" 
        showTagline={false}
        variant="light"
        href="/"
      />
    </header>
  );
}
```

### 2. Landing Page Hero

```tsx
export function Hero() {
  return (
    <section className="bg-bg-cream py-24">
      <div className="text-center mb-8">
        <Logo 
          size="lg" 
          showTagline={true}
          variant="dark"
          className="mx-auto mb-6"
        />
        <h1 className="text-5xl font-display font-bold">
          The Smart URL Shortener
        </h1>
      </div>
    </section>
  );
}
```

### 3. Mobile Header

```tsx
export function MobileHeader() {
  return (
    <header className="md:hidden bg-bg-dark px-4 py-3">
      <Logo 
        size="sm" 
        showTagline={false}
        variant="light"
        href="/"
      />
    </header>
  );
}
```

### 4. Dashboard Sidebar

```tsx
export function Sidebar() {
  return (
    <aside className="bg-bg-dark border-r-2 border-brutalist-black p-4">
      <Logo 
        size="md" 
        showTagline={true}
        variant="light"
        onClick={() => router.push('/dashboard')}
        className="mb-8"
      />
      {/* Navigation items */}
    </aside>
  );
}
```

### 5. Footer

```tsx
export function Footer() {
  return (
    <footer className="bg-bg-dark border-t-2 border-brutalist-black py-12">
      <Logo 
        size="md" 
        showTagline={true}
        variant="light"
        href="/"
        className="mx-auto mb-6"
      />
      {/* Footer content */}
    </footer>
  );
}
```

### 6. Loading Screen

```tsx
export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center">
      <Logo 
        size="lg" 
        showTagline={true}
        variant="light"
        className="animate-pulse"
      />
    </div>
  );
}
```

---

## 🎨 Hover Effects

When the logo is interactive (has `href` or `onClick`):

### Default State
- Icon box shadow: `3px 3px 0 #1A1A1A`
- Transform: `translate(0, 0)`
- Text color: Based on `variant`

### Hover State
- Icon box shadow: `5px 5px 0 #1A1A1A` ✨
- Transform: `translate(-2px, -2px)` ✨
- Text color: `#FF6B35` (orange) ✨
- Transition: `all 0.2s ease`

---

## 📊 Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Logo size variant |
| `showTagline` | `boolean` | `false` | Show tagline below logo |
| `variant` | `'light' \| 'dark'` | `'light'` | Text color variant |
| `href` | `string` | - | Next.js Link href (makes it clickable) |
| `className` | `string` | `''` | Additional CSS classes |
| `onClick` | `() => void` | - | Click handler (if no href) |

---

## 🎨 Design Details

### Icon Box

```css
Background: #FF6B35 (accent orange)
Border: 2px solid #1A1A1A
Border-radius: 10px
Shadow: 3px 3px 0 #1A1A1A
Shadow (hover): 5px 5px 0 #1A1A1A
```

### Logo Text

```css
Font: Space Grotesk
Weight: 700 (Bold)
Color (light): #FFFFFF
Color (dark): #1A1A1A
Color (hover): #FF6B35
Letter-spacing: 0.02em
```

### Tagline

```css
Text: "HUMANIZE • SHORTENIZE • URLS"
Font: Space Grotesk
Weight: 600 (Semi-bold)
Color: #FF6B35 (always orange)
Letter-spacing: 0.08em
Transform: uppercase
```

---

## 🔧 Customization

### With Custom Animations

```tsx
<Logo 
  size="lg" 
  className="animate-bounce"
/>

<Logo 
  size="md" 
  className="hover:rotate-3 transition-transform"
/>
```

### With Custom Styles

```tsx
<Logo 
  size="md"
  className="drop-shadow-2xl"
/>
```

### Responsive Sizing

```tsx
// Small on mobile, large on desktop
<div className="block sm:hidden">
  <Logo size="sm" />
</div>
<div className="hidden sm:block">
  <Logo size="lg" />
</div>

// Or use Tailwind responsive classes
<Logo className="w-36 md:w-48" />
```

---

## 📱 Responsive Best Practices

### Mobile Header
```tsx
<Logo size="sm" showTagline={false} variant="light" href="/" />
```

### Desktop Header
```tsx
<Logo size="md" showTagline={false} variant="light" href="/" />
```

### Landing Page Hero
```tsx
<Logo size="lg" showTagline={true} variant="dark" />
```

### Dashboard Sidebar
```tsx
<Logo size="md" showTagline={true} variant="light" onClick={handleClick} />
```

---

## 🎯 Usage Guidelines

### When to Show Tagline

**Show tagline (showTagline={true}):**
- ✅ Landing page hero
- ✅ Auth pages (signin/signup)
- ✅ Footer
- ✅ First-time user onboarding
- ✅ Marketing materials

**Hide tagline (showTagline={false}):**
- ✅ Navigation headers
- ✅ Mobile layouts (space-constrained)
- ✅ Repeated logo placements
- ✅ Small spaces

### Variant Selection

**Light variant (white text):**
- ✅ Dark backgrounds (`bg-bg-dark`, `bg-bg-card`)
- ✅ Dashboard
- ✅ Dark hero sections
- ✅ Dark modals/overlays

**Dark variant (black text):**
- ✅ Light backgrounds (`bg-bg-cream`, white)
- ✅ Landing pages with light sections
- ✅ Light modals
- ✅ Print materials

---

## 🔍 Accessibility

The component includes:
- ✅ Semantic HTML
- ✅ `aria-label` on button variant
- ✅ Proper link semantics with Next.js Link
- ✅ Keyboard navigation support
- ✅ Screen reader friendly

---

## 🎨 Component Anatomy

```tsx
<Logo>
  └─ Wrapper (Link | button | div)
      └─ Container (flex)
          ├─ Icon Box
          │   └─ LightningBolt SVG
          │       - Solid gold fill
          │       - Black stroke
          └─ Text Container
              ├─ "DASHDIG" text
              └─ Tagline (optional)
```

---

## 🧪 Testing

```tsx
// Test all sizes
<div className="space-y-4">
  <Logo size="sm" />
  <Logo size="md" />
  <Logo size="lg" />
</div>

// Test variants
<div className="bg-bg-dark p-4">
  <Logo variant="light" showTagline={true} />
</div>
<div className="bg-white p-4">
  <Logo variant="dark" showTagline={true} />
</div>

// Test interaction
<Logo href="/" />          // As link
<Logo onClick={() => {}} /> // As button
<Logo />                    // Static
```

---

## 📊 Size Comparison

```
SMALL (36px)
┌────┐
│ ⚡ │ DASHDIG
└────┘

MEDIUM (44px) - Default
┌──────┐
│  ⚡  │ DASHDIG
└──────┘

LARGE (48px)
┌────────┐
│   ⚡   │ DASHDIG
└────────┘
```

---

## 🎯 Integration Examples

### Replace Old Logo in Header

```tsx
// OLD
<div className="flex items-center gap-2">
  <div className="w-10 h-10 bg-orange-500 rounded">
    <Zap />
  </div>
  <span>DASHDIG</span>
</div>

// NEW
<Logo size="md" variant="light" href="/" />
```

### Replace in Sidebar

```tsx
// OLD
<DashDigLogo onClick={handleClick} showTagline={true} />

// NEW
<Logo size="md" showTagline={true} variant="light" onClick={handleClick} />
```

---

## ✅ Quality Checklist

- ✅ Uses official LightningBolt component
- ✅ Imports colors from design system
- ✅ Full TypeScript support with interfaces
- ✅ JSDoc documentation
- ✅ Hover effects with smooth transitions
- ✅ Responsive size variants
- ✅ Color variants for light/dark backgrounds
- ✅ Next.js Link integration
- ✅ Click handler support
- ✅ Accessibility features
- ✅ Convenience variant exports
- ✅ No linter errors

---

## 🎨 Customization Examples

### With Drop Shadow

```tsx
<Logo className="drop-shadow-2xl" />
```

### With Rotation on Hover

```tsx
<Logo className="hover:rotate-2 transition-transform" />
```

### Centered

```tsx
<div className="flex justify-center">
  <Logo size="lg" showTagline={true} />
</div>
```

### In Flex Layout

```tsx
<div className="flex items-center justify-between">
  <Logo size="md" href="/" />
  <nav>{/* Navigation */}</nav>
</div>
```

---

## 🎯 Brand Guidelines

### Logo Minimum Size
- Never use smaller than `size="sm"`
- Maintain clear space around logo (minimum 20px)
- Ensure sufficient contrast with background

### Color Usage
- Icon box: ALWAYS `#FF6B35` (accent orange)
- Lightning bolt: ALWAYS `#FFCC33` (solid gold)
- Border/stroke: ALWAYS `#1A1A1A` (black)
- Text: White or black depending on background
- Tagline: ALWAYS `#FF6B35` (orange)

### Tagline Rules
- Text must be: "HUMANIZE • SHORTENIZE • URLS"
- Always uppercase
- Use bullet points (•) not other separators
- Keep consistent letter spacing

---

## 🔧 Props Reference

### size

Controls the overall dimensions of the logo.

```tsx
<Logo size="sm" />  // Compact - 36px icon
<Logo size="md" />  // Default - 44px icon
<Logo size="lg" />  // Prominent - 48px icon
```

### showTagline

Toggles the tagline display.

```tsx
<Logo showTagline={false} />  // Just logo
<Logo showTagline={true} />   // Logo + tagline
```

### variant

Controls text color for different backgrounds.

```tsx
<Logo variant="light" />  // White text (dark BG)
<Logo variant="dark" />   // Black text (light BG)
```

### href

Makes the logo a clickable link.

```tsx
<Logo href="/" />              // Links to home
<Logo href="/dashboard" />     // Links to dashboard
```

### onClick

Adds click functionality.

```tsx
<Logo onClick={() => router.push('/')} />
<Logo onClick={handleLogoClick} />
```

### className

Adds custom CSS classes.

```tsx
<Logo className="mx-auto mb-8" />
<Logo className="drop-shadow-lg hover:scale-105" />
```

---

## 🎨 Hover Animation Details

When interactive (has `href` or `onClick`):

**Icon Box:**
```
Default:  shadow: 3px 3px 0 #1A1A1A, transform: translate(0, 0)
Hover:    shadow: 5px 5px 0 #1A1A1A, transform: translate(-2px, -2px)
```

**Text:**
```
Default:  color: #FFFFFF (light) or #1A1A1A (dark)
Hover:    color: #FF6B35 (orange)
```

**Transition:** All properties animate over `0.2s ease`

---

## 📝 Code Example: Complete Header

```tsx
import Logo from '@/components/brand/Logo';
import { accent, bgDark, black } from '@/lib/design-system';

export function SiteHeader() {
  return (
    <header 
      style={{
        backgroundColor: bgDark,
        borderBottom: `2px solid ${black}`,
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {/* Logo */}
      <Logo 
        size="md" 
        showTagline={false}
        variant="light"
        href="/"
      />
      
      {/* Navigation */}
      <nav className="flex gap-6">
        <a href="#features" className="text-text-secondary hover:text-accent">
          Features
        </a>
        <a href="#pricing" className="text-text-secondary hover:text-accent">
          Pricing
        </a>
      </nav>
      
      {/* CTA */}
      <button className="bg-accent text-white px-6 py-2 rounded-brutalist-md shadow-brutalist-md hover:shadow-brutalist-lg">
        Get Started
      </button>
    </header>
  );
}
```

---

## 🎯 Where to Use

### Primary Placements
1. **Site Header** - Top-left, links to home
2. **Dashboard Sidebar** - Top of sidebar, brand presence
3. **Auth Pages** - Centered, with tagline
4. **Landing Hero** - Large size with tagline
5. **Footer** - Centered or left-aligned

### Secondary Placements
- Email signatures
- Loading screens
- Error pages (404, 500)
- Splash screens
- Share cards (Open Graph images)

---

## ⚠️ Don'ts

❌ Don't modify the lightning bolt path
❌ Don't use gradients on the bolt (always solid gold)
❌ Don't change the icon box color from orange
❌ Don't alter the tagline text
❌ Don't use smaller than `size="sm"`
❌ Don't place on low-contrast backgrounds

---

## 🎉 Summary

The Logo component provides:
- ✅ Official Dashdig branding
- ✅ Consistent visual appearance
- ✅ Multiple size options
- ✅ Light/dark variants
- ✅ Interactive hover effects
- ✅ Next.js Link integration
- ✅ Responsive design support
- ✅ Full TypeScript support
- ✅ Accessibility features
- ✅ Production-ready quality

**Use this component everywhere you need the Dashdig logo!** ⚡🚀



