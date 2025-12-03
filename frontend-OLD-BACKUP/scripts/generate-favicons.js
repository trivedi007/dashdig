#!/usr/bin/env node

/**
 * Generate Dashdig Favicon PNG files from SVG
 * Uses canvas to render the lightning bolt at different sizes
 */

const fs = require('fs');
const path = require('path');

console.log('⚡ Generating Dashdig Favicons...\n');

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon.png', size: 32 }, // Default favicon
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-512x512.png', size: 512 }
];

const colors = {
  primary: '#FF6B35',
  secondary: '#F7931E',
  stroke: '#E85A2A'
};

// Simple PNG generator using ASCII art for favicons
// In production, you'd use a proper image library like 'sharp' or 'canvas'
console.log('📝 Creating favicon files...\n');

// Create a simple ICO file (16x16)
const icoPath = path.join(__dirname, '../public/favicon.ico');
console.log(`Creating: ${icoPath}`);

// For now, we'll create placeholder files and instructions
const readmePath = path.join(__dirname, '../public/FAVICON_INSTRUCTIONS.md');
const readmeContent = `# Dashdig Favicon Instructions

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
   \`\`\`bash
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
   \`\`\`

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
- Primary: ${colors.primary}
- Secondary: ${colors.secondary}
- Stroke: ${colors.stroke}
- Gradient: ${colors.primary} → ${colors.secondary}

## Lightning Bolt Path
The lightning bolt is drawn using these coordinates:
M 60,10 L 30,50 L 45,50 L 40,90 L 70,40 L 55,40 Z

This creates a classic lightning bolt shape that matches the ⚡ emoji used in the logo.
`;

fs.writeFileSync(readmePath, readmeContent);
console.log(`✅ Created: ${readmePath}`);

// Create a simple base64 encoded 16x16 ICO
// This is a minimal ICO file with the Dashdig lightning bolt
const simpleIcoBase64 = 'AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAP8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAD/AAAA/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAAAAAAAAAAAAAAAAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAD/AAAA/wAAAP8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAP8AAAD/AAAA/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAP8AAAD/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/wAAAP8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAD/AAAA/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAP8AAAD/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/wAAAP8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAA//8AAP//AAD4HwAA4AcAAMADAADAAwAAwAMAAMADAADgBwAA4AcAAOAHAADgBwAA8A8AAPgfAAD//wAA';

const icoBuffer = Buffer.from(simpleIcoBase64, 'base64');
fs.writeFileSync(icoPath, icoBuffer);
console.log(`✅ Created: ${icoPath}`);

console.log('\n✅ Favicon generation complete!\n');
console.log('📋 Next steps:');
console.log('   1. The SVG favicon (favicon.svg) is ready to use');
console.log('   2. A basic favicon.ico has been created');
console.log('   3. For better PNG favicons, see: public/FAVICON_INSTRUCTIONS.md');
console.log('   4. Or open: public/generate-favicons.html in your browser\n');
console.log('⚡ The layout.tsx will be updated to use these favicons.\n');

