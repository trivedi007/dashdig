# 🎨 URLs Table - Visual Reference

## Complete Table Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [🔍 Search URLs...]                           [+ Create New URL]            │
├──┬────────────┬───────────────────────────┬────────┬────────────┬──────────┤
│☐│Short URL   │Original URL               │Clicks  │Created     │Actions   │
├──┼────────────┼───────────────────────────┼────────┼────────────┼──────────┤
│☐│summer-sale │https://example.com/produ..│ 1,234  │Nov 2, 2024 │📋 ✏️ 🗑️ │
│ │(orange)    │(gray, 60 chars)           │(16px)  │(gray)      │12px gap  │
│ │(bold)      │(tooltip shows full)       │(bold)  │            │          │
├──┼────────────┼───────────────────────────┼────────┼────────────┼──────────┤
│☐│winter-2024 │https://mysite.com/long... │  567   │Nov 1, 2024 │📋 ✏️ 🗑️ │
│ │            │                           │        │            │          │
└──┴────────────┴───────────────────────────┴────────┴────────────┴──────────┘
           Hover: Background changes to #F9FAFB
```

---

## Component Details

### **1. Search Box**
```
┌──────────────────────────────────────┐
│ 🔍  Search URLs...                   │  ← fa-search icon (gray)
│     ↑                                │
│     10px padding                     │
│                                      │
│  Border: #E2E8F0 (slate-300)        │
│  Focus: Orange ring + orange border │
│  Radius: 8px                         │
└──────────────────────────────────────┘
```

**CSS:**
```css
.search-input {
  padding-left: 40px;  /* Icon space */
  border-radius: 8px;
  border: 1px solid #E2E8F0;
}

.search-input:focus {
  border-color: #FF6B35;
  ring: 2px #FF6B35;
}
```

---

### **2. Create New URL Button**
```
┌─────────────────────────┐
│  +  Create New URL      │  ← fa-plus icon + text
│                         │
│  BG: #FF6B35 (orange)  │
│  Hover: #E85A2A        │
│  Active: #D64E1F       │
│  Shadow: subtle        │
└─────────────────────────┘
```

**States:**
- **Default:** Orange (#FF6B35)
- **Hover:** Darker orange (#E85A2A)
- **Active:** Even darker (#D64E1F)
- **Shadow:** 0 1px 2px rgba(0,0,0,0.05)

---

### **3. Table Header**
```
┌──┬────────────┬─────────────────┬────────┬──────────┬─────────┐
│☐│Short URL ↕ │Original URL     │Clicks ↕│Created ↕ │Actions  │
│ │(sortable)  │                 │(sort)  │(sort)    │         │
└──┴────────────┴─────────────────┴────────┴──────────┴─────────┘
```

**Styling:**
- Background: #F8F9FA (gray-50)
- Text: #334155 (slate-700)
- Font: 12px, bold, uppercase
- Letter-spacing: 0.05em
- Border-bottom: 2px solid #E2E8F0

---

### **4. Table Row (Default)**
```
┌──┬────────────┬─────────────────────────────┬────────┬──────────┬─────────┐
│☐│summer-sale │https://example.com/product..│ 1,234  │Nov 2, 24 │📋 ✏️ 🗑️│
│ │            │                             │        │          │         │
│ │Orange      │Gray (#6C757D)               │Bold    │Gray      │Gray→Clr │
│ │Bold        │Truncate@60                  │16px    │         │         │
└──┴────────────┴─────────────────────────────┴────────┴──────────┴─────────┘
```

**Alternating rows:**
- Even: White (#FFFFFF)
- Odd: Slate-50 (#F8FAFC)

---

### **5. Table Row (Hover)**
```
┌──┬────────────┬─────────────────────────────┬────────┬──────────┬─────────┐
│☐│summer-sale │https://example.com/product..│ 1,234  │Nov 2, 24 │📋 ✏️ 🗑️│
│ │ (underline)│ (shows tooltip)             │        │          │(colored)│
└──┴────────────┴─────────────────────────────┴────────┴──────────┴─────────┘
       ↑
   Background: #F9FAFB
```

**Hover effects:**
- Row background: #F9FAFB
- Short URL: Underline appears
- Original URL: Tooltip shows full URL
- Actions: Icons change color

---

### **6. Short URL Column**
```
summer-sale
-----------
Color: #FF6B35 (orange)
Font: monospace (font-mono)
Weight: bold
Size: 14px
Hover: underline
Link: Clickable → Analytics
```

**Visual:**
```
Normal:  summer-sale
Hover:   summer-sale
         -----------
```

---

### **7. Original URL Column**
```
https://example.com/very-long-url-that-exceeds-sixty-characters...
-----------------------------------------------------------------
Color: #6C757D (gray)
Font: sans-serif
Size: 14px
Truncate: 60 characters
Tooltip: Full URL on hover
Cursor: help (question mark)
```

**Example:**
```
Display:  https://example.com/very-long-url-that-exceeds-sixty...
Tooltip:  https://example.com/very-long-url-that-exceeds-sixty-characters-and-continues-here
```

---

### **8. Clicks Column**
```
1,234
-----
Color: #0F172A (slate-900)
Font: sans-serif
Weight: bold
Size: 16px
Format: Comma-separated
```

**Examples:**
- 0 → 0
- 123 → 123
- 1234 → 1,234
- 1234567 → 1,234,567

---

### **9. Created Date Column**
```
Nov 2, 2024
-----------
Color: #6C757D (gray)
Font: sans-serif
Size: 14px
Format: MMM d, yyyy
```

**Examples:**
- Nov 2, 2024
- Dec 15, 2024
- Jan 1, 2025

---

### **10. Action Buttons**
```
Default:  📋    ✏️    🗑️
         (gray) (gray)(gray)

Hover:    📋    ✏️    🗑️
        (orange)(orange)(red)
```

**Specifications:**

| Button | Icon | Size | Default | Hover | Function |
|--------|------|------|---------|-------|----------|
| Copy | fa-copy | 16px | #6C757D | #FF6B35 | Copy URL |
| Edit | fa-edit | 16px | #6C757D | #FF6B35 | View analytics |
| Delete | fa-trash | 16px | #6C757D | #DC2626 | Delete URL |

**Spacing:** 12px between icons (gap-3)

**Layout:**
```
[📋]  ←12px→  [✏️]  ←12px→  [🗑️]
```

---

## Empty States

### **No URLs Created**
```
┌────────────────────────────────────────┐
│                                        │
│                                        │
│              🔗                        │
│           (large icon)                 │
│                                        │
│        No URLs created yet             │
│                                        │
│  Start shortening URLs and track      │
│  your analytics. Create your first    │
│  smart link now!                      │
│                                        │
│    [+ Create your first URL]          │
│                                        │
└────────────────────────────────────────┘
```

**Icon:** fa-link, 60px, #CBD5E1 (slate-300)

**Button:**
- Background: #FF6B35
- Text: White
- Icon: fa-plus
- Hover: #E85A2A

---

### **No Search Results**
```
┌────────────────────────────────────────┐
│                                        │
│                                        │
│              🔍                        │
│           (large icon)                 │
│                                        │
│           No URLs found                │
│                                        │
│  No URLs match "example". Try a       │
│  different search term.                │
│                                        │
│         [Clear search]                 │
│                                        │
└────────────────────────────────────────┘
```

**Icon:** fa-search, 60px, #CBD5E1 (slate-300)

**Button:**
- Background: #F1F5F9 (slate-100)
- Text: #334155 (slate-700)
- Hover: #E2E8F0 (slate-200)

---

## Color Palette Quick Reference

### **Text Colors:**
```css
--orange:        #FF6B35  /* Short URLs, buttons */
--orange-hover:  #E85A2A  /* Button hover */
--orange-active: #D64E1F  /* Button active */
--gray-text:     #6C757D  /* Original URL, date */
--dark-text:     #0F172A  /* Clicks, headings */
--red-delete:    #DC2626  /* Delete hover */
```

### **Background Colors:**
```css
--white:         #FFFFFF  /* Rows (even) */
--slate-50:      #F8FAFC  /* Rows (odd) */
--hover-bg:      #F9FAFB  /* Row hover */
--gray-50:       #F8F9FA  /* Header */
```

### **Border Colors:**
```css
--border:        #E2E8F0  /* Table borders */
--border-dark:   #CBD5E1  /* Darker borders */
```

---

## Typography Scale

```
Heading:     20px, bold
Table Header: 12px, bold, uppercase
Short URL:    14px, bold, monospace
Original URL: 14px, regular
Clicks:       16px, bold
Date:         14px, regular
Actions:      16px (icon size)
```

---

## Spacing System

```
Table padding:  24px (px-6)
Row padding:    16px vertical (py-4)
Icon spacing:   12px (gap-3)
Input padding:  10px vertical (py-2.5)
Button padding: 10px vertical, 16px horizontal
```

---

## Border Radius

```
Search box:   8px
Buttons:      8px
Table:        12px (outer container)
```

---

## Shadows

```
Button:       0 1px 2px rgba(0,0,0,0.05)
Table:        0 1px 3px rgba(0,0,0,0.1)
Focus ring:   0 0 0 2px #FF6B35
```

---

## Responsive Breakpoints

### **Desktop (1024px+):**
- Full table visible
- All columns shown
- 12px icon spacing

### **Tablet (768px - 1023px):**
- Horizontal scroll enabled
- All columns shown
- Slightly reduced padding

### **Mobile (< 768px):**
- Stack columns vertically
- Hide less important columns
- Touch-friendly buttons (44px min)

---

## Animation Timing

```css
Hover:      200ms ease
Focus:      150ms ease
Row fade:   300ms ease
Modal:      200ms ease-in-out
```

---

## Accessibility

### **ARIA Labels:**
```html
<button aria-label="Copy link">...</button>
<button aria-label="View analytics">...</button>
<button aria-label="Delete URL">...</button>
```

### **Keyboard Navigation:**
- Tab through action buttons
- Enter to activate
- Escape to close modals

### **Screen Reader:**
- Checkbox states announced
- Action button purposes clear
- Table structure semantic

---

## Browser Support

✅ Chrome 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Edge 90+  
✅ Mobile browsers

---

## Print Styles

```css
@media print {
  .action-buttons { display: none; }
  .search-box { display: none; }
  table { width: 100%; }
}
```

---

**Visual Reference Version:** 1.0  
**Last Updated:** 2024  
**Design System:** Dashdig Dashboard


