# Branded Avatar Component Documentation

## ✅ Implementation Complete

A beautiful, branded avatar component with lightning bolt design has been fully integrated across the entire application!

---

## 🎨 Design Features

### Visual Elements

1. **Orange Gradient Background**
   - Gradient: `#F97316` → `#EA580C`
   - Matches Dashdig brand colors
   - Smooth 135° diagonal gradient

2. **Lightning Bolt Watermark**
   - Subtle background element at 20% opacity
   - Uses Lucide's `Zap` icon
   - Rotated 15° for dynamic effect
   - Amber/gold tint for premium feel

3. **Glass Effect**
   - Overlay with white gradient
   - Creates depth and dimension
   - Mix blend mode for realistic glass appearance

4. **Typography**
   - Bold white initials
   - Centered and prominent
   - Drop shadow for clarity
   - Wide letter spacing

5. **Interactive Elements**
   - Hover scale animation (105%)
   - Orange ring glow effect
   - Smooth transitions
   - Shadow with brand color

---

## 📦 Component API

### Basic Avatar

```tsx
import Avatar from '@/components/Avatar';

<Avatar 
  name="Narendra Trivedi"
  image={session?.user?.image}
  size="md"
  showImage={true}
/>
```

### Avatar Button (Clickable)

```tsx
import { AvatarButton } from '@/components/Avatar';

<AvatarButton 
  name="Narendra Trivedi"
  image={session?.user?.image}
  size="md"
  onClick={() => setIsDropdownOpen(true)}
/>
```

---

## 🔧 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | `'User'` | User's full name for initials generation |
| `image` | `string \| null` | `null` | URL to profile image (Google photo) |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Avatar size |
| `className` | `string` | `''` | Additional CSS classes |
| `showImage` | `boolean` | `true` | Whether to show profile image if available |
| `onClick` | `() => void` | - | Click handler (AvatarButton only) |

---

## 📏 Size Reference

| Size | Dimensions | Text Size | Use Case |
|------|------------|-----------|----------|
| `sm` | 32×32px (w-8 h-8) | text-xs | Small icons, lists |
| `md` | 40×40px (w-10 h-10) | text-sm | Header, sidebar |
| `lg` | 64×64px (w-16 h-16) | text-xl | Settings profile |
| `xl` | 80×80px (w-20 h-20) | text-2xl | Full profile pages |

---

## 🎯 Integration Points

### ✅ 1. Dashboard Header (Top Right)

**Location:** Header dropdown

```tsx
<AvatarButton
  name={currentUser.name}
  image={currentUser.avatar}
  size="md"
  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
/>
```

**Behavior:**
- Shows Google profile image if available
- Falls back to branded avatar with initials
- Clickable to open user dropdown menu
- Hover effect with ring glow

---

### ✅ 2. Sidebar (Bottom Left)

**Location:** User profile card in sidebar

```tsx
<Avatar 
  name={currentUser.name} 
  image={currentUser.avatar}
  size="md"
/>
```

**Display:**
- User avatar with name
- Plan type below
- Sign out button

---

### ✅ 3. Mobile Menu

**Location:** Slide-out mobile navigation

```tsx
<Avatar 
  name={currentUser.name} 
  image={currentUser.avatar}
  size="md"
/>
```

**Same styling** as desktop sidebar

---

### ✅ 4. Settings Page

**Location:** Settings → Profile tab

```tsx
<Avatar 
  name={currentUser.name} 
  image={currentUser.avatar}
  size="lg"
/>
```

**Features:**
- Larger size for prominence
- "Change Avatar" button next to it
- Helper text about profile image source

---

## 🔄 Initials Generation Logic

```typescript
const getInitials = (name: string) => {
  if (!name || name === 'User' || name === 'Guest User') return 'U';
  
  return name
    .trim()
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word[0].toUpperCase())
    .slice(0, 2)
    .join('');
};
```

### Examples:

| Name | Initials |
|------|----------|
| "Narendra Trivedi" | **NT** |
| "John Doe" | **JD** |
| "Mary Jane Watson" | **MJ** |
| "Alice" | **A** |
| "" or "User" | **U** |

---

## 🎨 Customization Options

### Option 1: Force Custom Avatar (Hide Google Image)

```tsx
<Avatar 
  name="Narendra Trivedi"
  image={session?.user?.image}
  size="md"
  showImage={false}  // Always show branded avatar
/>
```

**Use case:** Want consistent branding even when user has Google photo

---

### Option 2: Custom Size

```tsx
<Avatar 
  name="Narendra Trivedi"
  size="xl"
  className="border-4 border-slate-700"
/>
```

**Use case:** Special pages like full profile view

---

### Option 3: Add Custom Classes

```tsx
<Avatar 
  name="Narendra Trivedi"
  className="shadow-2xl border-2 border-orange-400"
/>
```

**Use case:** Special emphasis or effects

---

## 🎭 Visual States

### With Google Profile Image

```
┌─────────────┐
│  [Photo]    │  ← Shows actual Google photo
│  with ring  │     Orange ring border
└─────────────┘
```

### Without Image (Branded)

```
┌─────────────┐
│   ⚡ NT     │  ← Lightning watermark + Initials
│ (Gradient)  │     Orange gradient background
└─────────────┘
```

---

## 💅 Styling Details

### Colors
- **Primary Gradient:** `#F97316` → `#EA580C`
- **Lightning:** `#FCD34D` (amber-200)
- **Text:** White with drop shadow
- **Ring:** `rgba(249, 115, 22, 0.5)`

### Effects
- **Shadow:** `0 2px 8px rgba(249, 115, 22, 0.4)`
- **Inner Glow:** `inset 0 1px 1px rgba(255, 255, 255, 0.2)`
- **Hover Scale:** `scale(1.05)`
- **Glass Overlay:** `from-white/10 to-transparent`

---

## 🔍 Implementation Notes

### TypeScript Support
- Full TypeScript definitions
- Proper prop typing
- Exported interfaces

### Performance
- Lightweight component
- CSS-only animations
- No external dependencies (except Lucide)

### Accessibility
- Semantic HTML
- Alt text support
- ARIA labels on buttons
- Keyboard navigation friendly

---

## 🧪 Testing

### Visual Test Cases

1. **Google User with Photo**
   - Sign in with Google
   - Verify profile photo shows
   - Check orange ring border

2. **User without Photo**
   - Clear session
   - Verify branded avatar shows
   - Check initials are correct (NT)
   - Verify lightning bolt watermark visible

3. **Different Sizes**
   - Header: `md` (40×40px)
   - Sidebar: `md` (40×40px)
   - Settings: `lg` (64×64px)

4. **Hover Effects**
   - Hover over avatar in header
   - Verify scale animation
   - Check ring glow effect

---

## 🐛 Troubleshooting

### Avatar Not Showing

**Check:**
1. Component imported correctly
2. `name` prop passed
3. No CSS conflicts

### Initials Wrong

**Check:**
1. `currentUser.name` has correct value
2. `getInitials()` function working
3. Console log the name value

### Image Not Loading

**Check:**
1. `session.user.image` URL valid
2. CORS policy allows image
3. `showImage={true}` prop set

---

## 📚 Related Files

- **Component:** `/frontend/components/Avatar.tsx`
- **Usage:** `/frontend/app/page.jsx`
- **Tests:** (To be added)
- **Storybook:** (To be added)

---

## 🎉 Summary

The branded avatar component provides:
- ✅ Consistent visual identity across app
- ✅ Beautiful lightning bolt design
- ✅ Automatic initials generation
- ✅ Support for Google profile images
- ✅ Multiple size options
- ✅ Smooth animations and effects
- ✅ TypeScript support
- ✅ Fully responsive

Your avatars now look professional and match the Dashdig brand perfectly! 🚀

