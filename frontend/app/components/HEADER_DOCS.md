# Dashboard Header Component Documentation

## 📋 Overview

The `DashboardHeader` is a professional, responsive header component for the Dashdig dashboard with user menu, notifications, and quick actions.

## 📁 File Location

```
/app/components/DashboardHeader.tsx
```

## 🎨 Features

### ✅ **Fixed Top Header**
- Height: 64px (4rem)
- White background with subtle border and shadow
- Fixed position, stays at top when scrolling
- Z-index: 50 (appears above other content)

### ✅ **Left Side**
- **Mobile Menu Toggle** (< 1024px)
  - Hamburger icon button
  - Triggers sidebar on mobile
  - Hidden on desktop

- **Logo**
  - Clickable, links to `/dashboard`
  - Orange lightning bolt icon
  - "Dashdig" text (hidden on small screens)
  - Hover effect (darker orange)

### ✅ **Right Side**
- **Create New URL Button**
  - Primary orange button
  - Shows icon only on mobile
  - Full text on desktop: "Create New URL"
  - Links to dashboard link creation

- **Notifications Icon**
  - Bell icon with badge indicator
  - Red dot shows when there are unread notifications
  - Dropdown menu with notification list
  - Mark all as read functionality
  - Link to full notifications page

- **User Avatar & Dropdown**
  - Circular avatar with user initial
  - Gradient orange background
  - Dropdown with:
    - User info (name, email)
    - Profile link
    - Settings link
    - Billing link
    - Divider
    - Logout (red text)

## 🔧 Usage

### Basic Implementation

```tsx
import { DashboardHeader } from '../components/DashboardHeader'

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  return (
    <div>
      <DashboardHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      {/* Rest of layout */}
    </div>
  )
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onMenuToggle` | `() => void` | No | Callback function for mobile menu toggle |

### Layout Integration

The header is designed to work with a fixed positioning system:

```tsx
<div className="pt-16"> {/* Account for 64px header */}
  <DashboardHeader />
  <Sidebar className="top-16" /> {/* Starts below header */}
  <MainContent />
</div>
```

## 🎨 Styling Specifications

### Header Bar
```css
Height: 64px (h-16)
Background: white
Border-bottom: 1px solid #E5E7EB
Box-shadow: 0 1px 3px rgba(0,0,0,0.1)
Position: fixed top-0
Z-index: 50
```

### Logo
```css
Icon: 40x40px, rounded-lg, bg-[#FF6B35]
Text: text-xl, font-bold, text-[#FF6B35]
Hover: bg-[#E85A2A], text-[#E85A2A]
```

### Create Button
```css
Background: #FF6B35
Hover: #E85A2A
Active: #D64E1F
Padding: 8px 16px
Border-radius: 8px
Font: 14px, semibold
```

### Notifications
```css
Button: 40x40px, border, rounded-lg
Badge: 10px red dot, positioned top-right
Dropdown: 320px width, white, shadow-xl
```

### User Dropdown
```css
Avatar: 40px circle, gradient orange
Dropdown: 256px width, white, shadow-xl
Menu items: hover bg-slate-50
Logout: text-red-600, hover bg-red-50
```

## 📱 Responsive Behavior

### Mobile (< 768px)
- Show hamburger menu button
- Hide logo text, show icon only
- Show button icon only ("Create New URL" text hidden)
- User dropdown still functional

### Tablet (768px - 1024px)
- Show hamburger menu button
- Show full logo with text
- Show full button text
- All features visible

### Desktop (> 1024px)
- Hide hamburger menu button
- Show all features
- Full functionality

## 🔔 Notifications System

### Structure
```typescript
interface Notification {
  id: number
  title: string
  message: string
  time: string
  read: boolean
}
```

### Current Notifications (Mock Data)
- New URL created
- Milestone reached
- API key expires soon

### Customization
To connect to real notifications:
1. Replace mock data with API call
2. Use `useState` to manage notification state
3. Add mutation for marking as read
4. Subscribe to real-time updates (websocket)

```tsx
// Example API integration
useEffect(() => {
  async function fetchNotifications() {
    const response = await fetch('/api/notifications')
    const data = await response.json()
    setNotifications(data)
  }
  fetchNotifications()
}, [])
```

## 👤 User Menu System

### Menu Items
```typescript
const menuItems = [
  { label: 'Profile', icon: '👤', href: '/dashboard/profile' },
  { label: 'Settings', icon: '⚙️', href: '/dashboard/settings' },
  { label: 'Billing', icon: '💳', href: '/dashboard/billing' },
]
```

### User Info
User name and email are loaded from `localStorage`:
- `userName`: Display name
- `userEmail`: User's email address

### Logout Function
```typescript
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userName')
  localStorage.removeItem('userEmail')
  router.push('/')
}
```

## 🎯 Customization Guide

### Changing Colors
```tsx
// Primary button color
className="bg-[#FF6B35] hover:bg-[#E85A2A]"

// Change to blue:
className="bg-blue-600 hover:bg-blue-700"
```

### Adding Menu Items
```tsx
const menuItems = [
  { label: 'Profile', icon: '👤', href: '/dashboard/profile' },
  { label: 'Settings', icon: '⚙️', href: '/dashboard/settings' },
  { label: 'Billing', icon: '💳', href: '/dashboard/billing' },
  { label: 'Help', icon: '❓', href: '/dashboard/help' }, // New item
]
```

### Changing Avatar Style
```tsx
// Current: Gradient with initial
<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] text-white font-semibold text-sm">
  {userName.charAt(0).toUpperCase()}
</div>

// Alternative: Image
<img 
  src={userAvatar} 
  alt={userName}
  className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-200"
/>
```

### Customizing Notifications Badge
```tsx
// Current: Red dot
{hasNewNotifications && (
  <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
)}

// Alternative: Count badge
{notificationCount > 0 && (
  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
    {notificationCount}
  </span>
)}
```

## 🔄 State Management

### Local State
```typescript
const [dropdownOpen, setDropdownOpen] = useState(false)
const [notificationsOpen, setNotificationsOpen] = useState(false)
const [hasNewNotifications, setHasNewNotifications] = useState(true)
const [userName, setUserName] = useState('User')
const [userEmail, setUserEmail] = useState('user@example.com')
```

### Click Outside Detection
```typescript
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false)
    }
  }
  document.addEventListener('mousedown', handleClickOutside)
  return () => document.removeEventListener('mousedown', handleClickOutside)
}, [])
```

## 🎬 Animations

Using Framer Motion for smooth animations:

### Dropdown Animation
```typescript
<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{ duration: 0.2 }}
>
  {/* Dropdown content */}
</motion.div>
```

### Chevron Rotation
```typescript
<svg className={`transition ${dropdownOpen ? 'rotate-180' : ''}`}>
  {/* Chevron icon */}
</svg>
```

## ♿ Accessibility

### ARIA Labels
```tsx
<button aria-label="Toggle menu">
<button aria-label="Notifications">
<button aria-label="User menu">
```

### Keyboard Navigation
- All buttons are keyboard accessible
- Dropdowns close on `Escape` key (handled by Framer Motion)
- Focus states clearly visible

### Screen Readers
- Semantic HTML (`<header>`, `<nav>`, `<button>`)
- Proper ARIA labels
- Logical tab order

## 🐛 Troubleshooting

### Header overlaps content
```tsx
// Solution: Add padding-top to main container
<div className="pt-16">
  {/* Content */}
</div>
```

### Dropdown cuts off on mobile
```tsx
// Ensure parent doesn't have overflow-hidden
// Use fixed positioning for dropdowns
className="fixed right-4 top-16"
```

### Notifications not updating
```tsx
// Add key prop to force re-render
{notifications.map(notif => (
  <div key={notif.id}>
    {/* Notification */}
  </div>
))}
```

### Avatar not showing initial
```tsx
// Check userName is loaded
useEffect(() => {
  const name = localStorage.getItem('userName') || 'User'
  setUserName(name)
}, [])
```

## 📊 Performance

### Optimization Tips
1. **Memoize callbacks**
   ```tsx
   const handleMenuToggle = useCallback(() => {
     setSidebarOpen(!sidebarOpen)
   }, [sidebarOpen])
   ```

2. **Lazy load notifications**
   ```tsx
   const { data: notifications } = useQuery(['notifications'], fetchNotifications, {
     enabled: notificationsOpen
   })
   ```

3. **Debounce search** (if adding search)
   ```tsx
   const debouncedSearch = useMemo(
     () => debounce(handleSearch, 300),
     []
   )
   ```

## 🔗 Related Components

- **Sidebar**: `/app/dashboard/layout.tsx`
- **Button styles**: `/styles/dashboard.css`
- **Notifications page**: `/app/dashboard/notifications/page.tsx` (to be created)
- **Profile page**: `/app/dashboard/profile/page.tsx` (to be created)

## 📚 Dependencies

```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "framer-motion": "^10.0.0"
}
```

## 🎯 Future Enhancements

### Planned Features
- [ ] Real-time notification system (WebSocket)
- [ ] Search functionality in header
- [ ] Theme switcher (light/dark mode)
- [ ] Language selector
- [ ] Command palette (Cmd/Ctrl + K)
- [ ] Notification preferences
- [ ] User avatar upload

### Implementation Ideas

**Search Bar:**
```tsx
<div className="hidden lg:flex flex-1 max-w-md mx-8">
  <input
    type="search"
    placeholder="Search..."
    className="w-full px-4 py-2 border rounded-lg"
  />
</div>
```

**Theme Switcher:**
```tsx
<button onClick={toggleTheme}>
  {theme === 'dark' ? '🌙' : '☀️'}
</button>
```

**Command Palette:**
```tsx
<button onClick={openCommandPalette} className="flex items-center gap-2">
  <kbd>⌘K</kbd>
</button>
```

## 💡 Best Practices

1. **Keep header lightweight** - Avoid heavy computations
2. **Use semantic HTML** - Proper `<header>`, `<nav>` tags
3. **Mobile-first** - Design for mobile, enhance for desktop
4. **Consistent spacing** - Use design system tokens
5. **Accessible** - ARIA labels, keyboard navigation
6. **Performance** - Memoize callbacks, lazy load data
7. **Error handling** - Graceful fallbacks for missing data

---

**Created for Dashdig Dashboard** | Version 1.0.0  
**Component**: DashboardHeader.tsx  
**Last Updated**: 2024


