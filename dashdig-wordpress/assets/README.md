# WordPress.org Plugin Assets

Professional assets for Dashdig Analytics WordPress plugin submission.

## Required Files

### 1. Banner (1544x500px)
- **File**: `banner-1544x500.png` (or `.jpg`)
- **Purpose**: Main plugin banner displayed on WordPress.org
- **Design**: Orange gradient background with lightning bolt logo and tagline

### 2. Icon (256x256px)
- **File**: `icon-256x256.png` (or `.jpg`)
- **Purpose**: Plugin icon displayed in WordPress admin and plugin directory
- **Design**: Orange circle with white lightning bolt

### 3. Screenshots (Optional)
- **Files**: `screenshot-1.png` through `screenshot-3.png`
- **Purpose**: Showcase plugin features in WordPress.org listing
- **Screenshots included**:
  1. Dashboard overview with analytics (screenshot-1.png)
  2. Settings page (screenshot-2.png)
  3. URL shortening interface (screenshot-3.png)

## Brand Guidelines

- **Primary Color**: `#FF6B35` (Orange)
- **Secondary Color**: `#F9541C` (Darker Orange)
- **Logo**: Lightning bolt (⚡) symbol
- **Tagline**: "AI-Powered URL Analytics for WordPress"
- **Style**: Modern, clean, professional SaaS aesthetic

## Generating Assets

### Option 1: Automated Script (Recommended)

1. Install dependencies:
```bash
npm install puppeteer sharp
```

2. Run the generation script:
```bash
node generate-assets.js
```

3. Find generated files in the `output/` directory

### Option 2: Manual Generation

1. **Banner**:
   - Open `banner-template.html` in a browser
   - Use browser DevTools to set viewport to 1544x500px
   - Take screenshot or use browser's print-to-PDF feature
   - Convert to PNG/JPG and optimize

2. **Icon**:
   - Open `icon-256x256.svg` in a vector graphics editor (Inkscape, Illustrator, etc.)
   - Export as PNG at 256x256px
   - For JPG version, add white background first

3. **Screenshots**:
   - HTML templates are provided: `screenshot-dashboard.html`, `screenshot-settings.html`, `screenshot-url-shortener.html`
   - Open in browser and take screenshots, or use the generation script
   - Ensure they're at least 1200px wide
   - Optimize file sizes to <200KB each

## File Size Optimization

All assets should be optimized for web:
- **Target size**: <200KB per file
- **PNG**: Use compression level 9
- **JPG**: Use quality 85-90 with mozjpeg

### Using ImageMagick (if available):
```bash
# Optimize PNG
convert banner-1544x500.png -strip -quality 90 banner-1544x500-optimized.png

# Optimize JPG
convert banner-1544x500.jpg -strip -quality 85 -sampling-factor 4:2:0 banner-1544x500-optimized.jpg
```

### Using Sharp (Node.js):
```javascript
const sharp = require('sharp');

// PNG optimization
await sharp('banner-1544x500.png')
  .png({ quality: 90, compressionLevel: 9 })
  .toFile('banner-1544x500-optimized.png');

// JPG optimization
await sharp('banner-1544x500.jpg')
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile('banner-1544x500-optimized.jpg');
```

## WordPress.org Requirements

### Banner Requirements:
- **Dimensions**: Exactly 1544x500 pixels
- **Format**: PNG or JPG
- **File size**: Recommended <200KB
- **Content**: Should clearly show plugin name and purpose

### Icon Requirements:
- **Dimensions**: Exactly 256x256 pixels
- **Format**: PNG (preferred) or JPG
- **File size**: Recommended <50KB
- **Design**: Should be recognizable at small sizes (128x128px)

### Screenshot Requirements:
- **Dimensions**: Minimum 1200px wide, 4:3 or 16:9 aspect ratio
- **Format**: PNG or JPG
- **File size**: Recommended <200KB each
- **Naming**: `screenshot-1.png`, `screenshot-2.png`, etc.
- **Content**: Should showcase actual plugin functionality

## File Structure

```
dashdig-wordpress/
├── assets/
│   ├── README.md (this file)
│   ├── generate-assets.js
│   ├── banner-template.html
│   ├── icon-256x256.svg
│   └── output/
│       ├── banner-1544x500.png
│       ├── banner-1544x500.jpg
│       ├── icon-256x256.png
│       └── icon-256x256.jpg
├── banner-1544x500.png (copy here for plugin)
├── icon-256x256.png (copy here for plugin)
└── screenshot-1.png (optional)
```

## WordPress.org Submission

When submitting to WordPress.org:

1. Place `banner-1544x500.png` in the plugin root directory
2. Place `icon-256x256.png` in the plugin root directory
3. Add screenshots to the plugin root (optional but recommended)
4. WordPress.org will automatically detect and use these files

## Troubleshooting

### Script fails with "puppeteer not found"
- Run `npm install puppeteer sharp` in the assets directory

### Generated images are too large
- Adjust quality settings in `generate-assets.js`
- Use additional optimization tools (ImageOptim, TinyPNG, etc.)

### Banner looks blurry
- Ensure HTML template is rendered at exact 1544x500px
- Check that fonts are loaded properly
- Use high-DPI screenshots if needed

### Icon has transparency issues
- PNG format supports transparency (preferred)
- JPG format requires white background (already handled in script)

## Support

For issues or questions about asset generation, please refer to:
- [WordPress.org Plugin Assets Guide](https://developer.wordpress.org/plugins/wordpress-org/plugin-assets/)
- [WordPress.org Plugin Handbook](https://developer.wordpress.org/plugins/)

