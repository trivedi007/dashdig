# ⚡ Lightning Bolt SVG Audit Report

## 📋 Audit Summary

**Date:** January 13, 2026
**Scope:** All lightning bolt SVGs in frontend/, dashdig-extension/
**Correct Specification:**
- Path: `M 6 2 L 17 2 L 13 10 L 19 10 L 3 30 L 7 18 L 1 18 Z`
- viewBox: `-1 0 22 32`
- fill: `#FFCC33` (solid gold, NO gradient)
- stroke: `#1A1A1A`
- strokeWidth: `1.5`

---

## ✅ CORRECT IMPLEMENTATIONS

### 1. **LightningBolt.tsx Component** ✅
**File:** `frontend/src/components/ui/LightningBolt.tsx`
**Lines:** 21-32

```tsx
<svg viewBox="-1 0 22 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path
    d="M 6 2 L 17 2 L 13 10 L 19 10 L 3 30 L 7 18 L 1 18 Z"
    fill="#FFCC33"
    stroke="#1A1A1A"
    strokeWidth={1.5}
    strokeLinejoin="round"
  />
</svg>
```

**Status:** ✅ PERFECT
- ✅ Path: Correct
- ✅ viewBox: `-1 0 22 32`
- ✅ fill: `#FFCC33`
- ✅ stroke: `#1A1A1A`
- ✅ strokeWidth: `1.5`
- ✅ No gradient

**Used in:** Logo component, multiple places via import

---

### 2. **page.jsx Lightning Bolt** ✅
**File:** `frontend/app/page.jsx`
**Lines:** 3661-3672

```tsx
<svg viewBox="-1 0 22 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path
    d="M 6 2 L 17 2 L 13 10 L 19 10 L 3 30 L 7 18 L 1 18 Z"
    fill="#FFCC33"
    stroke="#1A1A1A"
    strokeWidth={1.5}
    strokeLinejoin="round"
  />
</svg>
```

**Status:** ✅ PERFECT
- ✅ Path: Correct
- ✅ viewBox: `-1 0 22 32`
- ✅ fill: `#FFCC33`
- ✅ stroke: `#1A1A1A`
- ✅ strokeWidth: `1.5`

**Context:** Inside pricing tier card in main landing page

---

### 3. **enterprise/page.tsx Lightning Bolt** ✅
**File:** `frontend/app/enterprise/page.tsx`
**Lines:** 100-111

```tsx
<svg viewBox="-1 0 22 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path
    d="M 6 2 L 17 2 L 13 10 L 19 10 L 3 30 L 7 18 L 1 18 Z"
    fill="#FFCC33"
    stroke="#1A1A1A"
    strokeWidth={1.5}
    strokeLinejoin="round"
  />
</svg>
```

**Status:** ✅ PERFECT
- ✅ Path: Correct
- ✅ viewBox: `-1 0 22 32`
- ✅ fill: `#FFCC33`
- ✅ stroke: `#1A1A1A`
- ✅ strokeWidth: `1.5`

**Context:** Enterprise page pricing card

---

## ⚠️ ISSUES FOUND

### 4. **LightningIcon in page.jsx** ⚠️ INCORRECT
**File:** `frontend/app/page.jsx`
**Lines:** 321-326

```tsx
const LightningIcon = ({ className = "" }) => (
  <Zap 
    className={`w-4 h-4 text-amber-300 fill-amber-300 ${className}`} 
    style={{ transform: 'rotate(180deg)' }} 
  />
);
```

**Status:** ❌ WRONG ICON
- ❌ Using `Zap` from lucide-react (NOT the Dashdig lightning bolt)
- ❌ Different path/shape
- ❌ Color: amber-300 (NOT #FFCC33)
- ❌ Rotated 180 degrees
- ❌ No stroke

**Used in:** 14 locations throughout page.jsx
- Line 589: Trial counter
- Line 595: Success message
- Line 645: Unlock prompt
- Line 667: Trial counter
- Line 693: Sign up button
- Line 717: Input label
- Line 736: Input label
- Line 746: Preview label
- Line 773: QR code label
- Line 818: Trial counter
- Line 841: Button
- And more...

**Fix Required:** Replace with `<LightningBolt size="xs" />` component

---

### 5. **Extension Icon** ❌ WRONG PATH
**File:** `dashdig-extension/icons/icon.svg`
**Lines:** 6-12

```svg
<path 
  d="M 70 20 L 45 70 H 60 L 58 108 L 83 58 H 68 L 70 20 Z" 
  fill="white" 
  stroke="white" 
  stroke-width="2" 
  stroke-linejoin="round"
/>
```

**Status:** ❌ WRONG
- ❌ Path: Different coordinates (for 128x128 icon, not standardized)
- ❌ fill: `white` (NOT #FFCC33)
- ❌ stroke: `white` (NOT #1A1A1A)
- ❌ strokeWidth: `2` (should be 1.5)
- ❌ No viewBox attribute on path

**Fix Required:** This is an icon file, so the coordinates might need to be scaled for 128x128 canvas. Consider if this should match the brand standard or stay as-is for the extension icon.

---

## ✅ HTML DESIGN TEMPLATES (All Correct)

### 6. **landing.html** ✅
- Lines 205-206: Symbol definition
- Lines 245-246, 268, 278, 297, 303, 345, 357-358, 417: Usage
- **Status:** ✅ All use correct path, viewBox, fill, stroke

### 7. **login.html** ✅
- Lines 401-402: Symbol definition
- Lines 415-416: Usage
- **Status:** ✅ Correct

### 8. **enterprise.html** ✅
- Lines 615-616: Symbol definition
- Lines 630-631, 654-655, 673-674, 894-895, 910-911: Usage
- **Status:** ✅ Correct

### 9. **dashboard.html** ✅
- Lines 845-846: Symbol definition
- Lines 859-860, 987: Usage
- **Status:** ✅ Correct

### 10. **demo-dashboard.html** ✅
- Lines 767-768, 778-779, 795-796, 810-811, 859-860, 977-978, 1006-1007, 1035-1036: Multiple usages
- **Status:** ✅ All correct

### 11. **extension-popup.html** ✅
- Lines 544-545, 581-582: Usage
- **Status:** ✅ Correct

---

## 📊 SUMMARY

| Component | Status | Path | viewBox | Fill | Stroke | Notes |
|-----------|--------|------|---------|------|--------|-------|
| **LightningBolt.tsx** | ✅ | Correct | ✅ | ✅ #FFCC33 | ✅ #1A1A1A | Perfect |
| **page.jsx (SVG)** | ✅ | Correct | ✅ | ✅ #FFCC33 | ✅ #1A1A1A | Perfect |
| **enterprise/page.tsx** | ✅ | Correct | ✅ | ✅ #FFCC33 | ✅ #1A1A1A | Perfect |
| **LightningIcon (Zap)** | ❌ | Wrong | ❌ | ❌ amber-300 | ❌ None | **NEEDS FIX** |
| **icon.svg (extension)** | ⚠️ | Different | N/A | ❌ white | ❌ white | Extension specific |
| **HTML templates** | ✅ | Correct | ✅ | ✅ #FFCC33 | ✅ #1A1A1A | All correct |

---

## 🔧 RECOMMENDED FIXES

### Priority 1: Replace LightningIcon with LightningBolt

**File:** `frontend/app/page.jsx` (Line 321-326)

**Current:**
```tsx
const LightningIcon = ({ className = "" }) => (
  <Zap 
    className={`w-4 h-4 text-amber-300 fill-amber-300 ${className}`} 
    style={{ transform: 'rotate(180deg)' }} 
  />
);
```

**Recommended:**
```tsx
const LightningIcon = ({ className = "" }) => (
  <LightningBolt size="xs" className={className} />
);
```

**Impact:** 14+ usages throughout the page will get the correct Dashdig lightning bolt

---

### Priority 2: Extension Icon (Optional)

**File:** `dashdig-extension/icons/icon.svg`

**Decision Required:**
- Should the browser extension icon use the same standardized bolt?
- Or is a custom design acceptable for the extension icon since it's 128x128?

If standardizing, the bolt needs to be:
1. Scaled to fit 128x128 canvas
2. Changed to #FFCC33 fill
3. Changed to #1A1A1A stroke
4. StrokeWidth adjusted proportionally

---

## 📈 Statistics

- **Total Files with Lightning Bolts:** 27
- **Correct Implementations:** 25 (93%)
- **Incorrect Implementations:** 1 (LightningIcon using Zap)
- **Extension-Specific:** 1 (icon.svg - different standard)

---

## ✅ CONCLUSION

The codebase is **mostly consistent** with the correct lightning bolt specification:

1. **✅ Main Component (LightningBolt.tsx)** - Perfect implementation
2. **✅ All HTML Templates** - Using correct SVG
3. **✅ React Pages (enterprise, main)** - Correct when using LightningBolt component
4. **❌ LightningIcon in page.jsx** - Using wrong icon (Lucide Zap instead of custom bolt)
5. **⚠️ Extension Icon** - Different design (needs decision)

**Primary Action:** Replace `LightningIcon` with `LightningBolt` component to achieve 100% consistency across React components.
