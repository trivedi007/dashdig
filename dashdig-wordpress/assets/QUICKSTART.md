# Quick Start Guide - WordPress.org Plugin Assets

Generate professional WordPress.org plugin assets in 3 simple steps!

## Step 1: Install Dependencies

```bash
cd dashdig-wordpress/assets
npm install
```

This installs:
- **Puppeteer**: For rendering HTML templates to images
- **Sharp**: For image optimization and format conversion

## Step 2: Generate Assets

```bash
npm run generate
```

Or directly:
```bash
node generate-assets.js
```

## Step 3: Use Generated Files

The script creates optimized PNG and JPG files in the `output/` directory:

### Required Files (WordPress.org):
- `banner-1544x500.png` - Main plugin banner
- `icon-256x256.png` - Plugin icon

### Optional Files:
- `screenshot-1.png` - Dashboard screenshot
- `screenshot-2.png` - Settings screenshot  
- `screenshot-3.png` - URL Shortener screenshot

### Copy to Plugin Root

Copy the required files to your plugin root directory:

```bash
cp output/banner-1544x500.png ../banner-1544x500.png
cp output/icon-256x256.png ../icon-256x256.png
cp output/screenshot-*.png ../  # Optional screenshots
```

## File Sizes

All files are automatically optimized to be under 200KB:
- Banner: ~150-180KB
- Icon: ~15-25KB
- Screenshots: ~120-180KB each

## Troubleshooting

### "puppeteer not found"
```bash
npm install puppeteer sharp
```

### Images are too large
The script automatically optimizes, but if needed:
- Adjust quality settings in `generate-assets.js`
- Use external tools like ImageOptim or TinyPNG

### Banner looks blurry
- Ensure HTML template renders at exact 1544x500px
- Check browser zoom level (should be 100%)
- Verify fonts are loaded

## Manual Generation (Alternative)

If you prefer not to use the script:

1. **Banner**: Open `banner-template.html` in Chrome, set viewport to 1544x500px, take screenshot
2. **Icon**: Open `icon-256x256.svg` in Inkscape/Illustrator, export as PNG at 256x256px
3. **Screenshots**: Open HTML templates in browser, take screenshots at 1920x1080px

## Next Steps

1. ✅ Generate assets using the script
2. ✅ Copy files to plugin root
3. ✅ Test plugin in WordPress
4. ✅ Submit to WordPress.org

For detailed information, see [README.md](README.md).


