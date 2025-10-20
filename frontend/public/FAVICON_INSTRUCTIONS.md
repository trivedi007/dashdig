# Dashdig Favicon Instructions

## Generated Files

The following favicon files should be created:

### SVG (Vector - Best Quality)
✅ **favicon.svg** - Already created! This is the main favicon.

### PNG Files Needed
To generate PNG files from the SVG:

1. **Option A: Use Online Tool**
   - Go to https://realfavicongenerator.net/
   - Upload the favicon.svg file
   - Download all generated sizes

2. **Option B: Use ImageMagick**
   ```bash
   # Install ImageMagick
   brew install imagemagick  # macOS
   
   # Generate PNG files
   convert -background none -resize 16x16 favicon.svg favicon-16x16.png
   convert -background none -resize 32x32 favicon.svg favicon-32x32.png
   convert -background none -resize 32x32 favicon.svg favicon.png
   convert -background none -resize 180x180 favicon.svg apple-touch-icon.png
   convert -background none -resize 192x192 favicon.svg icon-192x192.png
   convert -background none -resize 512x512 favicon.svg icon-512x512.png
   
   # Create ICO file
   convert favicon-16x16.png favicon-32x32.png favicon.ico
   ```

3. **Option C: Use Canvas in Browser**
   - Open public/generate-favicons.html in your browser
   - Click the download buttons for each size

## Files Created
✅ favicon.svg (vector, works in modern browsers)
⏳ favicon.ico (16x16, 32x32 - for older browsers)
⏳ favicon.png (32x32 - fallback)
⏳ apple-touch-icon.png (180x180 - for iOS)
⏳ icon-192x192.png (192x192 - for Android)
⏳ icon-512x512.png (512x512 - for PWA)

## Colors Used
- Primary: #FF6B35
- Secondary: #F7931E
- Stroke: #E85A2A
- Gradient: #FF6B35 → #F7931E

## Lightning Bolt Path
The lightning bolt is drawn using these coordinates:
M 60,10 L 30,50 L 45,50 L 40,90 L 70,40 L 55,40 Z

This creates a classic lightning bolt shape that matches the ⚡ emoji used in the logo.
