# Dashboard Header - Visual Guide

## 🎨 Layout Overview

```
┌────────────────────────────────────────────────────────────────────────────┐
│  HEADER (64px height, fixed top, white background)                        │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  [☰]  [⚡ Dashdig]              [+ Create New URL]  [🔔]  [👤 ▼]        │
│   ^        ^                              ^              ^       ^         │
│   |        |                              |              |       |         │
│  Menu    Logo                          Button        Notify   User        │
│ (mobile) (clickable)                  (primary)     (badge) (dropdown)    │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

## 📐 Detailed Component Breakdown

### 1. Mobile Menu Toggle (< 1024px only)

```
┌────────┐
│   ☰    │  40x40px
│        │  Border: 1px solid #CBD5E1
│        │  Rounded: 8px
└────────┘  Hover: Light gray background
```

**States:**
- Default: Gray border, white bg
- Hover: Light gray bg
- Active: Darker gray

### 2. Logo

```
┌──────────────────────────┐
│  ┌────┐                  │
│  │ ⚡ │  Dashdig         │  Icon: 40x40px, rounded
│  └────┘                  │  Text: 20px, bold
└──────────────────────────┘  Color: #FF6B35
```

**Hover Effect:**
- Icon background: #FF6B35 → #E85A2A
- Text color: #FF6B35 → #E85A2A

### 3. Create New URL Button

```
Desktop:
┌───────────────────────────┐
│  +  Create New URL        │  Height: 40px
└───────────────────────────┘  Padding: 8px 16px
                              Background: #FF6B35

Mobile:
┌──────┐
│  +   │  Icon only, 40x40px
└──────┘  Square button
```

**States:**
- Default: `#FF6B35`
- Hover: `#E85A2A`
- Active: `#D64E1F`

### 4. Notifications Icon

```
┌──────┐
│  🔔  │  40x40px
│   ●  │  Red dot (10px) when unread
└──────┘  Position: top-right corner
```

**Badge:**
```css
Width: 10px
Height: 10px
Background: #EF4444 (red)
Ring: 2px white
Position: Absolute top-1 right-1
```

**Dropdown:**
```
┌─────────────────────────────────────┐
│ Notifications      Mark all read    │
├─────────────────────────────────────┤
│ ● New URL created                   │
│   Your link "summer-sale" is live   │
│   2m ago                             │
├─────────────────────────────────────┤
│ ● Milestone reached                 │
│   You hit 10,000 total clicks!      │
│   1h ago                             │
├─────────────────────────────────────┤
│   API key expires soon              │
│   Renew your API key in 7 days      │
│   3h ago                             │
├─────────────────────────────────────┤
│     View all notifications →        │
└─────────────────────────────────────┘

Width: 320px
Max-height: 384px (scrollable)
```

### 5. User Avatar & Dropdown

```
Avatar:
┌──────┐
│  U   │  40px circle
└──────┘  Gradient: #FF6B35 to #E85A2A
          Ring: 2px #E5E7EB
          Initial: First letter of username

With Chevron (desktop):
┌──────────┐
│  U   ▼  │  
└──────────┘
```

**Dropdown Menu:**
```
┌──────────────────────────────┐
│  User Name                   │  User info
│  user@example.com            │  (not clickable)
├──────────────────────────────┤
│  👤  Profile                 │  Links
│  ⚙️  Settings                │
│  💳  Billing                 │
├──────────────────────────────┤  Divider
│  🚪  Logout                  │  Red text
└──────────────────────────────┘

Width: 256px
Padding: 8px 0
Item padding: 10px 16px
```

## 📱 Responsive Breakpoints

### Mobile (< 768px)

```
┌──────────────────────────────────────────┐
│ [☰] [⚡]        [+]  [🔔]  [U]          │
└──────────────────────────────────────────┘
  ^    ^          ^    ^     ^
  |    |          |    |     |
 Menu Logo     Icon Notif User
      only     only
```

### Tablet (768px - 1024px)

```
┌──────────────────────────────────────────────────────────┐
│ [☰] [⚡ Dashdig]  [+ Create New URL]  [🔔]  [U ▼]      │
└──────────────────────────────────────────────────────────┘
  ^         ^                 ^               ^      ^
  |         |                 |               |      |
 Menu    Full logo        Full text        Notif  User
```

### Desktop (> 1024px)

```
┌─────────────────────────────────────────────────────────────────┐
│ [⚡ Dashdig]            [+ Create New URL]  [🔔]  [U ▼]        │
└─────────────────────────────────────────────────────────────────┘
     ^                            ^               ^      ^
     |                            |               |      |
  Logo only                   Full text        Notif  User
(no menu button)
```

## 🎨 Color Palette

### Primary Colors
```
Orange Primary:  #FF6B35  ████
Orange Hover:    #E85A2A  ████
Orange Active:   #D64E1F  ████
```

### Text Colors
```
Primary Text:    #1F2937  ████
Secondary Text:  #6C757D  ████
Muted Text:      #9CA3AF  ████
White:           #FFFFFF  ████
Red (Logout):    #DC2626  ████
```

### Background Colors
```
White:           #FFFFFF  ████
Light Gray:      #F9FAFB  ████
Slate:           #F1F5F9  ████
```

### Border Colors
```
Border:          #E5E7EB  ████
Light Border:    #F3F4F6  ████
```

## 🎯 Hover & Active States

### Logo
```
Default:  [⚡] Dashdig  (Orange: #FF6B35)
Hover:    [⚡] Dashdig  (Darker: #E85A2A)
```

### Create Button
```
Default:  [+ Create New URL]  (bg: #FF6B35)
Hover:    [+ Create New URL]  (bg: #E85A2A)
Active:   [+ Create New URL]  (bg: #D64E1F)
```

### Notifications
```
Default:  [🔔]         (gray border)
Hover:    [🔔]         (light gray bg)
Active:   [🔔]         (dropdown open)
          └──────────┘
```

### User Menu
```
Default:  [U ▼]       (white bg)
Hover:    [U ▼]       (80% opacity)
Active:   [U ▼]       (dropdown open)
          └────────┘
```

### Dropdown Items
```
Default:  👤 Profile   (white bg)
Hover:    👤 Profile   (light gray bg: #F8FAFC)
```

### Logout (Special)
```
Default:  🚪 Logout    (text: #DC2626)
Hover:    🚪 Logout    (bg: #FEE2E2, light red)
```

## 📏 Spacing & Sizing

### Header Container
```
Height: 64px (h-16)
Padding X: 16px (sm), 24px (md), 32px (lg)
Gap between items: 12px
```

### Logo
```
Icon: 40x40px
Gap between icon & text: 8px
Text size: 20px (text-xl)
```

### Buttons
```
Height: 40px (h-10)
Padding: 8px 16px (py-2 px-4)
Border radius: 8px (rounded-lg)
Font size: 14px (text-sm)
```

### Avatar
```
Size: 40x40px
Border radius: 50% (rounded-full)
Ring: 2px
Font size: 14px (text-sm)
```

### Dropdowns
```
Notifications: 320px wide
User menu: 256px wide
Border radius: 12px (rounded-xl)
Padding: 8px 0 (py-2)
Item padding: 10px 16px (py-2.5 px-4)
```

## 🎬 Animation Specs

### Dropdown Entrance
```
Initial:  opacity: 0, translateY: -10px
Animate:  opacity: 1, translateY: 0
Duration: 200ms
Easing:   ease-out
```

### Dropdown Exit
```
Exit:     opacity: 0, translateY: -10px
Duration: 200ms
Easing:   ease-in
```

### Chevron Rotation
```
Closed:   rotate: 0deg
Open:     rotate: 180deg
Duration: 200ms
Easing:   ease-in-out
```

### Button Hover
```
Transform: translateY(-1px)
Shadow:    increase shadow
Duration:  200ms
```

## 🔍 Z-Index Hierarchy

```
Layer 6: Dropdown menus       (z-index: auto, appear above header)
Layer 5: Header               (z-index: 50)
Layer 4: Sidebar backdrop     (z-index: 40)
Layer 3: Sidebar              (z-index: 40)
Layer 2: Main content         (z-index: 0)
Layer 1: Background           (z-index: 0)
```

## 📊 Component Hierarchy

```
DashboardHeader
├── Left Section
│   ├── Mobile Menu Toggle (< lg)
│   └── Logo (Link)
│       ├── Icon (div)
│       └── Text (span)
└── Right Section
    ├── Create Button (Link)
    │   ├── Plus Icon (svg)
    │   └── Text (span, hidden on mobile)
    ├── Notifications (div)
    │   ├── Bell Button
    │   │   ├── Bell Icon (svg)
    │   │   └── Badge (span)
    │   └── Dropdown (motion.div)
    │       ├── Header
    │       ├── List
    │       └── Footer
    └── User Menu (div)
        ├── Avatar Button
        │   ├── Avatar (div)
        │   └── Chevron (svg)
        └── Dropdown (motion.div)
            ├── User Info
            ├── Menu Items
            ├── Divider
            └── Logout
```

## 📱 Touch Targets (Mobile)

All interactive elements meet the minimum 44x44px touch target size:

```
Mobile Menu:        40x40px + 4px padding = 48x48px ✓
Logo:              40x40px (entire logo area clickable)
Create Button:      40x40px (icon mode)
Notifications:      40x40px ✓
User Avatar:        40x40px ✓
Dropdown Items:     Full width x 40px height ✓
```

## ♿ Accessibility Annotations

```
┌────────────────────────────────────────────────┐
│  [☰]aria-label="Toggle menu"                  │
│                                                │
│  [⚡ Dashdig]role="link"                      │
│                                                │
│  [🔔]aria-label="Notifications"               │
│      role="button"                             │
│                                                │
│  [U]aria-label="User menu"                    │
│     role="button"                              │
│     aria-expanded="true/false"                 │
└────────────────────────────────────────────────┘
```

## 🎨 CSS Custom Properties (Used)

```css
var(--primary-orange)       /* #FF6B35 */
var(--primary-orange-hover) /* #E85A2A */
var(--text-primary)         /* #1F2937 */
var(--text-secondary)       /* #6C757D */
var(--border-color)         /* #E5E7EB */
var(--shadow-sm)            /* 0 1px 3px rgba(0,0,0,0.1) */
```

## 🔄 State Diagram

```
Header States:
├── Default (all closed)
├── Notifications Open
│   ├── Dropdown visible
│   └── Click outside → Close
├── User Menu Open
│   ├── Dropdown visible
│   └── Click outside → Close
└── Mobile Menu Active
    └── Sidebar slides in
```

## 💡 Quick Reference Card

| Element | Size | Color | Action |
|---------|------|-------|--------|
| Header | 64px H | White | Fixed top |
| Logo | 40px | Orange | → /dashboard |
| Create Btn | 40px H | Orange | → Create link |
| Notification | 40px | Gray | Open dropdown |
| Avatar | 40px ⌀ | Gradient | Open menu |
| Dropdown | Auto | White | Shadow-xl |

---

**Visual Guide for DashboardHeader Component**  
**Version 1.0.0** | Last Updated: 2024


