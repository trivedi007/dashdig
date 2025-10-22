/**
 * Generate PNG icons from SVG
 * Creates 16x16, 48x48, and 128x128 PNG icons
 * 
 * Note: This script provides browser-based generation instructions
 * since we can't use sharp or canvas in this environment
 */

const fs = require('fs');
const path = require('path');

console.log('📦 Icon Generation Instructions');
console.log('═'.repeat(60));
console.log('');

console.log('Since we need to generate PNG icons from SVG, here are two methods:');
console.log('');

console.log('METHOD 1: Online Converter (Easiest)');
console.log('─'.repeat(60));
console.log('1. Go to: https://svgtopng.com/');
console.log('2. Upload: dashdig-extension/icons/icon.svg');
console.log('3. Generate PNGs at:');
console.log('   - 16x16 → Save as icon16.png');
console.log('   - 48x48 → Save as icon48.png');
console.log('   - 128x128 → Save as icon128.png');
console.log('4. Place files in: dashdig-extension/icons/');
console.log('');

console.log('METHOD 2: Using GIMP/Photoshop/Inkscape');
console.log('─'.repeat(60));
console.log('1. Open icon.svg in image editor');
console.log('2. Export as PNG:');
console.log('   - 16x16 pixels → icon16.png');
console.log('   - 48x48 pixels → icon48.png');
console.log('   - 128x128 pixels → icon128.png');
console.log('3. Save to dashdig-extension/icons/');
console.log('');

console.log('METHOD 3: Browser-based (Recommended)');
console.log('─'.repeat(60));

// Create HTML file for browser-based conversion
const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Generate Dashdig Icons</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h1 {
      color: #FF6B35;
      margin-bottom: 10px;
    }
    .subtitle {
      color: #666;
      margin-bottom: 30px;
    }
    .preview {
      display: flex;
      gap: 30px;
      margin: 30px 0;
      flex-wrap: wrap;
    }
    .icon-preview {
      text-align: center;
    }
    canvas {
      border: 1px solid #ddd;
      background: white;
      border-radius: 8px;
    }
    .size-label {
      margin-top: 10px;
      font-weight: 600;
      color: #333;
    }
    button {
      background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      margin: 5px;
    }
    button:hover {
      opacity: 0.9;
    }
    .instructions {
      background: #FFF5F2;
      border-left: 4px solid #FF6B35;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .success {
      background: #D1FAE5;
      border-left: 4px solid #059669;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
      display: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>⚡ Dashdig Icon Generator</h1>
    <p class="subtitle">Generate PNG icons from SVG for the Chrome extension</p>
    
    <div class="instructions">
      <strong>Instructions:</strong>
      <ol>
        <li>Click "Generate All Icons" button below</li>
        <li>Three PNG files will download automatically</li>
        <li>Move them to <code>dashdig-extension/icons/</code> folder</li>
        <li>Icons ready for Chrome extension!</li>
      </ol>
    </div>
    
    <div class="preview">
      <div class="icon-preview">
        <canvas id="canvas16" width="16" height="16"></canvas>
        <div class="size-label">16x16</div>
        <button onclick="downloadIcon(16)">Download</button>
      </div>
      
      <div class="icon-preview">
        <canvas id="canvas48" width="48" height="48"></canvas>
        <div class="size-label">48x48</div>
        <button onclick="downloadIcon(48)">Download</button>
      </div>
      
      <div class="icon-preview">
        <canvas id="canvas128" width="128" height="128"></canvas>
        <div class="size-label">128x128</div>
        <button onclick="downloadIcon(128)">Download</button>
      </div>
    </div>
    
    <button onclick="generateAll()" style="width: 100%; padding: 16px; font-size: 16px;">
      🚀 Generate All Icons
    </button>
    
    <div id="success" class="success">
      ✓ All icons generated and downloaded! Check your Downloads folder.
    </div>
  </div>

  <script>
    const svgString = \`<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
      <circle cx="64" cy="64" r="60" fill="url(#gradient)" />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FF6B35;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#F7931E;stop-opacity:1" />
        </linearGradient>
      </defs>
      <path d="M 75 30 L 50 65 L 62 65 L 53 98 L 78 63 L 66 63 Z" 
            fill="white" 
            stroke="white" 
            stroke-width="2" 
            stroke-linejoin="round"/>
    </svg>\`;

    function renderIcon(size) {
      const canvas = document.getElementById(\`canvas\${size}\`);
      const ctx = canvas.getContext('2d');
      
      const img = new Image();
      const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = function() {
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        URL.revokeObjectURL(url);
      };
      
      img.src = url;
    }

    function downloadIcon(size) {
      const canvas = document.getElementById(\`canvas\${size}\`);
      canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = \`icon\${size}.png\`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }

    function generateAll() {
      downloadIcon(16);
      setTimeout(() => downloadIcon(48), 300);
      setTimeout(() => downloadIcon(128), 600);
      
      setTimeout(() => {
        document.getElementById('success').style.display = 'block';
      }, 1000);
    }

    // Render previews on load
    window.onload = function() {
      renderIcon(16);
      renderIcon(48);
      renderIcon(128);
    };
  </script>
</body>
</html>`;

// Write HTML file
const htmlPath = path.join(__dirname, 'icons', 'generate-icons.html');
fs.writeFileSync(htmlPath, htmlContent);

console.log('✅ Created: icons/generate-icons.html');
console.log('');
console.log('To generate icons:');
console.log('1. Open: dashdig-extension/icons/generate-icons.html');
console.log('2. Click "Generate All Icons"');
console.log('3. Icons will download automatically');
console.log('');
console.log('═'.repeat(60));

