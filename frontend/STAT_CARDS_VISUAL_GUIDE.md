# 🎨 Stat Cards Visual Guide

## Overview Page - Enhanced Stat Cards

---

## 📊 Complete Layout

```
┌───────────────────────────────────────────────────────────────────────┐
│  Dashboard Overview                                                    │
│  Track your link performance and analytics                            │
└───────────────────────────────────────────────────────────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  ⚪🔗          │  │  ⚪🖱️          │  │  ⚪📈          │  │  ⚪✓           │
│  +10 this week  │  │  +185 this week │  │  94.0% CTR      │  │  89% active     │
│                 │  │                 │  │                 │  │                 │
│  Total URLs     │  │  Total Clicks   │  │  Avg Clicks/URL │  │  Active Links   │
│  47             │  │  1,234          │  │  26             │  │  42             │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘
   ORANGE              BLUE                GREEN               PURPLE
  #FF6B35            #0066FF             #10B981             #8B5CF6
```

---

## 🎯 Individual Card Anatomy

### **Card Structure:**
```
┌──────────────────────────────────────────┐
│                                          │
│  ⚫ [Icon]              🔼 [Change]      │  ← Row 1: Icon + Change indicator
│                                          │
│  [Title]                                 │  ← Row 2: Metric title
│  [Value]                                 │  ← Row 3: Metric value (large)
│                                          │
└──────────────────────────────────────────┘
```

### **Dimensions:**
```
Card:
├─ Border-radius: 12px
├─ Border: 1px solid #E2E8F0
├─ Padding: 24px
├─ Background: White
└─ Shadow: 0 1px 3px rgba(0,0,0,0.1)

Icon Container:
├─ Size: 40px × 40px
├─ Shape: Perfect circle (border-radius: 50%)
├─ Background: Colored (brand-specific)
├─ Shadow: 0 2px 8px rgba(0,0,0,0.1)
└─ Icon: 20px, white, centered
```

---

## 🎨 Card 1: Total URLs

### **Visual Representation:**
```
┌──────────────────────────────────────────┐
│                                          │
│  ⚪ 🔗              🔼 +10 this week     │
│  [Orange]                                │
│                                          │
│  Total URLs                              │
│  47                                      │
│                                          │
└──────────────────────────────────────────┘
```

### **Specifications:**
```css
Icon: fa-link (chain/link symbol)
Icon Size: 20px
Icon Color: #FFFFFF (white)

Background Circle:
├─ Size: 40px × 40px
├─ Color: #FF6B35 (Orange)
├─ Shadow: 0 2px 8px rgba(0,0,0,0.1)
└─ Border-radius: 50%

Change Badge:
├─ Background: #F0FDF4 (green tint)
├─ Text: #16A34A (green)
├─ Icon: ↑ (up arrow)
└─ Text: "+10 this week"
```

### **Code:**
```tsx
<StatCard
  title="Total URLs"
  value={47}
  icon="fa-link"
  iconType="fontawesome"
  color="orange"
  change="+10 this week"
  changeType="positive"
/>
```

---

## 🎨 Card 2: Total Clicks

### **Visual Representation:**
```
┌──────────────────────────────────────────┐
│                                          │
│  ⚪ 🖱️              🔼 +185 this week    │
│  [Blue]                                  │
│                                          │
│  Total Clicks                            │
│  1,234                                   │
│                                          │
└──────────────────────────────────────────┘
```

### **Specifications:**
```css
Icon: fa-mouse-pointer (cursor/click symbol)
Icon Size: 20px
Icon Color: #FFFFFF (white)

Background Circle:
├─ Size: 40px × 40px
├─ Color: #0066FF (Blue)
├─ Shadow: 0 2px 8px rgba(0,0,0,0.1)
└─ Border-radius: 50%

Change Badge:
├─ Background: #F0FDF4 (green tint)
├─ Text: #16A34A (green)
├─ Icon: ↑ (up arrow)
└─ Text: "+185 this week"
```

### **Code:**
```tsx
<StatCard
  title="Total Clicks"
  value="1,234"
  icon="fa-mouse-pointer"
  iconType="fontawesome"
  color="blue"
  change="+185 this week"
  changeType="positive"
/>
```

---

## 🎨 Card 3: Avg Clicks/URL

### **Visual Representation:**
```
┌──────────────────────────────────────────┐
│                                          │
│  ⚪ 📈              94.0% CTR            │
│  [Green]                                 │
│                                          │
│  Avg Clicks/URL                          │
│  26                                      │
│                                          │
└──────────────────────────────────────────┘
```

### **Specifications:**
```css
Icon: fa-chart-line (trending up graph)
Icon Size: 20px
Icon Color: #FFFFFF (white)

Background Circle:
├─ Size: 40px × 40px
├─ Color: #10B981 (Green)
├─ Shadow: 0 2px 8px rgba(0,0,0,0.1)
└─ Border-radius: 50%

Change Badge:
├─ Background: #F1F5F9 (gray tint)
├─ Text: #64748B (gray)
├─ No icon (neutral)
└─ Text: "94.0% CTR"
```

### **Code:**
```tsx
<StatCard
  title="Avg Clicks/URL"
  value={26}
  icon="fa-chart-line"
  iconType="fontawesome"
  color="green"
  change="94.0% CTR"
  changeType="neutral"
/>
```

---

## 🎨 Card 4: Active Links

### **Visual Representation:**
```
┌──────────────────────────────────────────┐
│                                          │
│  ⚪ ✓               🔼 89% active        │
│  [Purple]                                │
│                                          │
│  Active Links                            │
│  42                                      │
│                                          │
└──────────────────────────────────────────┘
```

### **Specifications:**
```css
Icon: fa-circle-check (checkmark in circle)
Icon Size: 20px
Icon Color: #FFFFFF (white)

Background Circle:
├─ Size: 40px × 40px
├─ Color: #8B5CF6 (Purple)
├─ Shadow: 0 2px 8px rgba(0,0,0,0.1)
└─ Border-radius: 50%

Change Badge:
├─ Background: #F0FDF4 (green tint)
├─ Text: #16A34A (green)
├─ Icon: ↑ (up arrow)
└─ Text: "89% active"
```

### **Code:**
```tsx
<StatCard
  title="Active Links"
  value={42}
  icon="fa-circle-check"
  iconType="fontawesome"
  color="purple"
  change="89% active"
  changeType="positive"
/>
```

---

## 🎨 Color Palette

### **Icon Background Colors:**

```css
/* Card 1: Total URLs */
Orange: #FF6B35
RGB: rgb(255, 107, 53)
HSL: hsl(16, 100%, 60%)

/* Card 2: Total Clicks */
Blue: #0066FF
RGB: rgb(0, 102, 255)
HSL: hsl(216, 100%, 50%)

/* Card 3: Avg Clicks/URL */
Green: #10B981
RGB: rgb(16, 185, 129)
HSL: hsl(160, 84%, 39%)

/* Card 4: Active Links */
Purple: #8B5CF6
RGB: rgb(139, 92, 246)
HSL: hsl(258, 90%, 66%)
```

### **Change Badge Colors:**

```css
/* Positive (up/growth) */
Background: #F0FDF4 (green-50)
Text: #16A34A (green-600)
Border: transparent

/* Negative (down/decline) */
Background: #FEF2F2 (red-50)
Text: #DC2626 (red-600)
Border: transparent

/* Neutral (no change/info) */
Background: #F1F5F9 (slate-100)
Text: #64748B (slate-600)
Border: transparent
```

---

## 💡 Hover Effects

### **Card Hover:**
```css
Default State:
├─ Transform: translateY(0)
├─ Box-shadow: 0 1px 3px rgba(0,0,0,0.1)
└─ Transition: 200ms ease

Hover State:
├─ Transform: translateY(-3px)
├─ Box-shadow: 0 4px 12px rgba(0,0,0,0.08)
└─ Transition: 200ms ease
```

### **Animation:**
```tsx
// Framer Motion config
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
whileHover={{ y: -3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
transition={{ duration: 0.2 }}
```

---

## 📐 Responsive Behavior

### **Desktop (1024px+):**
```
┌──────────┬──────────┬──────────┬──────────┐
│  Card 1  │  Card 2  │  Card 3  │  Card 4  │
│  Orange  │  Blue    │  Green   │  Purple  │
└──────────┴──────────┴──────────┴──────────┘
       4 columns (25% each)
```

### **Tablet (768px - 1023px):**
```
┌────────────────┬────────────────┐
│  Card 1        │  Card 2        │
│  Orange        │  Blue          │
├────────────────┼────────────────┤
│  Card 3        │  Card 4        │
│  Green         │  Purple        │
└────────────────┴────────────────┘
       2 columns (50% each)
```

### **Mobile (< 768px):**
```
┌────────────────────────────────┐
│  Card 1                        │
│  Orange                        │
├────────────────────────────────┤
│  Card 2                        │
│  Blue                          │
├────────────────────────────────┤
│  Card 3                        │
│  Green                         │
├────────────────────────────────┤
│  Card 4                        │
│  Purple                        │
└────────────────────────────────┘
       1 column (100%)
```

---

## 🎯 Typography

### **Title (Metric Name):**
```css
font-family: Inter, sans-serif
font-size: 14px
font-weight: 500 (medium)
color: #64748B (slate-600)
margin-bottom: 8px
```

### **Value (Number):**
```css
font-family: Inter, sans-serif
font-size: 30px
font-weight: 700 (bold)
color: #0F172A (slate-900)
line-height: 1
```

### **Change Badge:**
```css
font-family: Inter, sans-serif
font-size: 12px
font-weight: 600 (semibold)
padding: 4px 10px
border-radius: 8px
display: inline-flex
align-items: center
gap: 4px
```

---

## 🔍 Accessibility

### **Color Contrast:**
```
Icon on Background:
├─ White (#FFFFFF) on Orange (#FF6B35): 3.04:1 ✓
├─ White (#FFFFFF) on Blue (#0066FF): 4.56:1 ✓
├─ White (#FFFFFF) on Green (#10B981): 2.61:1 ⚠️ (Large text OK)
└─ White (#FFFFFF) on Purple (#8B5CF6): 4.54:1 ✓

Title Text:
├─ Slate-600 (#64748B) on White: 7.03:1 ✓✓ AAA

Value Text:
└─ Slate-900 (#0F172A) on White: 16.90:1 ✓✓ AAA
```

### **Screen Reader:**
```html
<!-- Semantic structure -->
<div role="region" aria-label="Dashboard statistics">
  <div>
    <p>Total URLs</p>
    <p>47</p>
    <span>+10 this week</span>
  </div>
</div>
```

---

## 📦 Component Props

### **StatCard Interface:**
```typescript
interface StatCardProps {
  title: string              // e.g., "Total URLs"
  value: string | number     // e.g., 47 or "1,234"
  icon: string               // e.g., "fa-link"
  iconType?: 'fontawesome' | 'emoji'  // default: 'fontawesome'
  color?: 'orange' | 'blue' | 'green' | 'purple'  // default: 'orange'
  change?: string            // e.g., "+10 this week"
  changeType?: 'positive' | 'negative' | 'neutral'  // default: 'neutral'
}
```

### **Usage Example:**
```tsx
import { StatCard } from '@/components/cards/StatCard'

<StatCard
  title="Total URLs"
  value={47}
  icon="fa-link"
  iconType="fontawesome"
  color="orange"
  change="+10 this week"
  changeType="positive"
/>
```

---

## 🎨 Icon Alternatives

### **If you want to change icons:**

**Card 1 (Links):**
- `fa-link` (current) ← Chain link
- `fa-chain` ← Connected links
- `fa-paperclip` ← Attachment
- `fa-globe` ← World/Web

**Card 2 (Clicks):**
- `fa-mouse-pointer` (current) ← Cursor
- `fa-hand-pointer` ← Pointing hand
- `fa-cursor-click` ← Click action
- `fa-fingerprint` ← Unique clicks

**Card 3 (Analytics):**
- `fa-chart-line` (current) ← Line graph
- `fa-arrow-trend-up` ← Upward trend
- `fa-chart-bar` ← Bar chart
- `fa-chart-area` ← Area chart

**Card 4 (Active):**
- `fa-circle-check` (current) ← Check in circle
- `fa-check-circle` ← Alternative check
- `fa-bolt` ← Lightning/Active
- `fa-fire` ← Hot/Active

---

## 🚀 Quick Reference

### **Copy-Paste Ready Components:**

```tsx
// Orange - Total URLs
<StatCard
  title="Total URLs"
  value={47}
  icon="fa-link"
  iconType="fontawesome"
  color="orange"
  change="+10 this week"
  changeType="positive"
/>

// Blue - Total Clicks
<StatCard
  title="Total Clicks"
  value="1,234"
  icon="fa-mouse-pointer"
  iconType="fontawesome"
  color="blue"
  change="+185 this week"
  changeType="positive"
/>

// Green - Average
<StatCard
  title="Avg Clicks/URL"
  value={26}
  icon="fa-chart-line"
  iconType="fontawesome"
  color="green"
  change="94.0% CTR"
  changeType="neutral"
/>

// Purple - Active Links
<StatCard
  title="Active Links"
  value={42}
  icon="fa-circle-check"
  iconType="fontawesome"
  color="purple"
  change="89% active"
  changeType="positive"
/>
```

---

**📸 Screenshots recommended at these breakpoints:**
- 1920px (Desktop)
- 1024px (Laptop)
- 768px (Tablet)
- 375px (Mobile)

---

**Visual Guide Version:** 1.0  
**Last Updated:** 2024  
**Compatible with:** Font Awesome 6.5.1+

