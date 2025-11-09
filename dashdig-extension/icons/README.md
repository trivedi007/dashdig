# Dashdig Extension Icons

## 🎨 Current Icons

This folder contains the Dashdig extension icons in multiple sizes:

- `icon-16.png` - 16×16px (toolbar icon, small)
- `icon-32.png` - 32×32px (toolbar icon, retina)
- `icon-48.png` - 48×48px (extension management)
- `icon-128.png` - 128×128px (Chrome Web Store, large displays)

## ⚡ Brand Guidelines

### Design Specifications

- **Shape**: Lightning bolt ⚡
- **Background**: Orange gradient (#FF6B35 to #FF4500)
- **Foreground**: White lightning bolt
- **Corner Radius**: 24px (for 128px icon)
- **Style**: Modern, flat design with subtle shadow

### Color Palette

- **Primary Orange**: `#FF6B35`
- **Deep Orange**: `#FF4500`
- **White**: `#FFFFFF`

## 🔄 Regenerating Icons

If you need to update the icons with new branding:

### Method 1: Using the HTML Generator

1. Open `generate-icons.html` in your browser
2. Icons will be auto-generated
3. Right-click each preview and "Save Image As..."
4. Save with exact filenames: `icon-16.png`, `icon-32.png`, `icon-48.png`, `icon-128.png`
5. Replace existing files in this folder

### Method 2: Using Online SVG to PNG Converter

1. Use the `icon.svg` source file
2. Go to [CloudConvert](https://cloudconvert.com/svg-to-png) or similar
3. Convert to PNG at these sizes:
   - 16×16px → `icon-16.png`
   - 32×32px → `icon-32.png`
   - 48×48px → `icon-48.png`
   - 128×128px → `icon-128.png`
4. Download and replace files

### Method 3: Using ImageMagick (Command Line)

```bash
# Install ImageMagick if needed
brew install imagemagick  # macOS
# or: sudo apt-get install imagemagick  # Linux

# Generate all sizes from SVG
convert icon.svg -resize 16x16 icon-16.png
convert icon.svg -resize 32x32 icon-32.png
convert icon.svg -resize 48x48 icon-48.png
convert icon.svg -resize 128x128 icon-128.png
```

### Method 4: Using Node.js (sharp library)

```bash
# Install sharp
npm install sharp

# Create a script
node <<EOF
const sharp = require('sharp');
const sizes = [16, 32, 48, 128];

sizes.forEach(size => {
  sharp('icon.svg')
    .resize(size, size)
    .png()
    .toFile(\`icon-\${size}.png\`)
    .then(() => console.log(\`Generated icon-\${size}.png\`));
});
EOF
```

## 📐 SVG Source

The master source is `icon.svg` - a scalable vector graphic that can be rendered at any size.

### SVG Structure

```svg
<svg width="128" height="128" viewBox="0 0 128 128">
  <rect width="128" height="128" fill="#FF6B35" rx="24"/>
  <path d="M 70 20 L 45 70 H 60 L 58 108 L 83 58 H 68 L 70 20 Z" 
        fill="white" stroke="white" stroke-width="2"/>
</svg>
```

## 🖼️ Icon Specifications by Browser

### Chrome / Edge / Brave / Opera
- Uses: 16px, 32px, 48px, 128px
- Format: PNG with transparency
- Display: Toolbar (16/32), Management (48), Store (128)

### Firefox
- Uses: 16px, 32px, 48px, 128px
- Format: PNG with transparency
- Display: Toolbar (16/32), Add-ons page (48/128)

### Safari
- After conversion to Safari extension
- Uses: 32px, 48px, 64px, 96px, 128px, 256px, 512px
- Format: PNG with transparency

## ✅ Quality Checklist

When generating new icons, ensure:

- [ ] Background is solid orange (#FF6B35)
- [ ] Lightning bolt is crisp white
- [ ] Corners are rounded (ratio maintained)
- [ ] No jagged edges or artifacts
- [ ] Transparent areas properly handled
- [ ] All 4 sizes generated
- [ ] File sizes are reasonable (<20KB each)
- [ ] Files named exactly: `icon-16.png`, `icon-32.png`, `icon-48.png`, `icon-128.png`

## 🎯 Design Tips

1. **Keep it simple** - Icons should be recognizable at 16×16px
2. **High contrast** - White on orange ensures visibility
3. **Consistent branding** - Lightning bolt matches logo
4. **Scalable** - Works from 16px to 128px
5. **Memorable** - Orange ⚡ is distinctive

## 📱 Testing Your Icons

After generating new icons:

1. **Reload extension** in `chrome://extensions`
2. **Check toolbar** - Icon should be crisp at all zoom levels
3. **Check extensions page** - 48px icon should look good
4. **Check on dark backgrounds** - Orange should stand out
5. **Check on light backgrounds** - Still visible and attractive

## 🐛 Troubleshooting

**Icons not updating?**
- Hard refresh the extensions page (Cmd+Shift+R)
- Remove and reload the extension
- Clear browser cache

**Icons look blurry?**
- Ensure retina displays use 32px for 16px slots
- Check source SVG is crisp
- Regenerate with higher quality settings

**Wrong colors?**
- Verify SVG fill color is #FF6B35
- Check PNG has no color profile issues
- Use hex colors, not RGB variations

## 📦 File Sizes (Approximate)

- `icon-16.png`: ~600 bytes
- `icon-32.png`: ~2.5 KB
- `icon-48.png`: ~5 KB
- `icon-128.png`: ~14 KB
- `icon.svg`: ~800 bytes (master)

Total: ~22 KB for all icon assets

---

**Last Updated**: January 9, 2025
**Version**: 1.1.0
**Designer**: Dashdig Team

