#!/usr/bin/env node

/**
 * Generate WordPress.org Plugin Assets
 * 
 * This script generates PNG and JPG versions of plugin assets
 * using Puppeteer for HTML rendering and Sharp for image processing.
 * 
 * Requirements:
 * npm install puppeteer sharp
 */

const puppeteer = require('puppeteer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = __dirname;
const OUTPUT_DIR = path.join(ASSETS_DIR, 'output');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateBanner() {
  console.log('🎨 Generating banner (1544x500px)...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1544, height: 500 });
  
  const htmlPath = path.join(ASSETS_DIR, 'banner-template.html');
  await page.goto(`file://${htmlPath}`);
  
  // Wait for fonts and rendering
  await page.waitForTimeout(1000);
  
  // Generate PNG
  const pngBuffer = await page.screenshot({
    type: 'png',
    fullPage: false,
    clip: { x: 0, y: 0, width: 1544, height: 500 }
  });
  
  // Optimize PNG
  const optimizedPng = await sharp(pngBuffer)
    .png({ quality: 90, compressionLevel: 9 })
    .toBuffer();
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'banner-1544x500.png'), optimizedPng);
  console.log('✅ Created banner-1544x500.png');
  
  // Generate JPG
  const optimizedJpg = await sharp(pngBuffer)
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'banner-1544x500.jpg'), optimizedJpg);
  console.log('✅ Created banner-1544x500.jpg');
  
  await browser.close();
}

async function generateIcon() {
  console.log('🎨 Generating icon (256x256px)...');
  
  const svgPath = path.join(ASSETS_DIR, 'icon-256x256.svg');
  const svgBuffer = fs.readFileSync(svgPath);
  
  // Generate PNG
  const pngBuffer = await sharp(svgBuffer)
    .resize(256, 256)
    .png({ quality: 100 })
    .toBuffer();
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'icon-256x256.png'), pngBuffer);
  console.log('✅ Created icon-256x256.png');
  
  // Generate JPG (with white background for transparency)
  const jpgBuffer = await sharp(svgBuffer)
    .resize(256, 256)
    .jpeg({ quality: 90, mozjpeg: true })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .toBuffer();
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'icon-256x256.jpg'), jpgBuffer);
  console.log('✅ Created icon-256x256.jpg');
  
  // Also generate 128x128 for reference
  const icon128 = await sharp(svgBuffer)
    .resize(128, 128)
    .png({ quality: 100 })
    .toBuffer();
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'icon-128x128.png'), icon128);
  console.log('✅ Created icon-128x128.png (reference)');
}

async function generateScreenshots() {
  console.log('🎨 Generating screenshots...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const screenshots = [
    { name: 'dashboard', file: 'screenshot-dashboard.html', output: 'screenshot-1.png' },
    { name: 'settings', file: 'screenshot-settings.html', output: 'screenshot-2.png' },
    { name: 'url-shortener', file: 'screenshot-url-shortener.html', output: 'screenshot-3.png' }
  ];
  
  for (const screenshot of screenshots) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    const htmlPath = path.join(ASSETS_DIR, screenshot.file);
    await page.goto(`file://${htmlPath}`);
    
    // Wait for rendering
    await page.waitForTimeout(1000);
    
    // Generate PNG (screenshot should be at least 1200px wide)
    const pngBuffer = await page.screenshot({
      type: 'png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });
    
    // Optimize PNG
    const optimizedPng = await sharp(pngBuffer)
      .resize(1600, 900) // Resize to reasonable size while maintaining aspect ratio
      .png({ quality: 85, compressionLevel: 9 })
      .toBuffer();
    
    fs.writeFileSync(path.join(OUTPUT_DIR, screenshot.output), optimizedPng);
    console.log(`✅ Created ${screenshot.output}`);
    
    await page.close();
  }
  
  await browser.close();
}

async function checkFileSizes() {
  console.log('\n📊 File sizes:');
  const files = fs.readdirSync(OUTPUT_DIR);
  
  for (const file of files) {
    const filePath = path.join(OUTPUT_DIR, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    if (stats.size > 200 * 1024) {
      console.log(`⚠️  ${file}: ${sizeKB} KB (${sizeMB} MB) - Consider optimizing`);
    } else {
      console.log(`✅ ${file}: ${sizeKB} KB`);
    }
  }
}

async function main() {
  console.log('🚀 Starting asset generation...\n');
  
  try {
    await generateBanner();
    await generateIcon();
    await generateScreenshots();
    await checkFileSizes();
    
    console.log('\n✨ Asset generation complete!');
    console.log(`📁 Output directory: ${OUTPUT_DIR}`);
    console.log('\n📝 Next steps:');
    console.log('1. Review the generated files in the output directory');
    console.log('2. Copy banner-1544x500.png and icon-256x256.png to your plugin root');
    console.log('3. Upload to WordPress.org plugin repository');
    
  } catch (error) {
    console.error('❌ Error generating assets:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { generateBanner, generateIcon, generateScreenshots };

