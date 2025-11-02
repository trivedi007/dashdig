#!/usr/bin/env node

/**
 * Compression Script for DashDig Widget
 * 
 * Generates pre-compressed files using Gzip and Brotli compression
 * for all distribution files. This allows web servers to serve
 * pre-compressed files for better performance.
 * 
 * Usage: node scripts/compress.js
 * 
 * Outputs:
 * - .gz files (Gzip compression)
 * - .br files (Brotli compression)
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { promisify } = require('util');

// Promisify compression functions
const gzip = promisify(zlib.gzip);
const brotliCompress = promisify(zlib.brotliCompress);

// Configuration
const DIST_DIR = path.join(__dirname, '..', 'dist');
const FILE_EXTENSIONS = ['.js', '.css', '.json', '.html', '.svg'];

// Brotli compression options (maximum compression)
const BROTLI_OPTIONS = {
  params: {
    [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
    [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
    [zlib.constants.BROTLI_PARAM_SIZE_HINT]: 0
  }
};

// Gzip compression options (maximum compression)
const GZIP_OPTIONS = {
  level: zlib.constants.Z_BEST_COMPRESSION
};

/**
 * Get all files in a directory recursively
 * @param {string} dir - Directory path
 * @param {string[]} fileList - Accumulated file list
 * @returns {string[]} List of file paths
 */
function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Check if file should be compressed
 * @param {string} filePath - File path
 * @returns {boolean} Whether file should be compressed
 */
function shouldCompress(filePath) {
  const ext = path.extname(filePath);
  const filename = path.basename(filePath);
  
  // Skip already compressed files
  if (filename.endsWith('.gz') || filename.endsWith('.br')) {
    return false;
  }
  
  // Skip map files (optional - uncomment to skip)
  // if (filename.endsWith('.map')) {
  //   return false;
  // }
  
  return FILE_EXTENSIONS.includes(ext);
}

/**
 * Compress a file with Gzip
 * @param {string} filePath - File path
 * @returns {Promise<void>}
 */
async function compressGzip(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    const compressed = await gzip(content, GZIP_OPTIONS);
    const outputPath = `${filePath}.gz`;
    
    fs.writeFileSync(outputPath, compressed);
    
    const originalSize = content.length;
    const compressedSize = compressed.length;
    const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1);
    
    console.log(`  ✓ Gzip: ${path.basename(filePath)} (${formatBytes(originalSize)} → ${formatBytes(compressedSize)}, ${ratio}% reduction)`);
  } catch (error) {
    console.error(`  ✗ Gzip failed for ${filePath}:`, error.message);
  }
}

/**
 * Compress a file with Brotli
 * @param {string} filePath - File path
 * @returns {Promise<void>}
 */
async function compressBrotli(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    const compressed = await brotliCompress(content, BROTLI_OPTIONS);
    const outputPath = `${filePath}.br`;
    
    fs.writeFileSync(outputPath, compressed);
    
    const originalSize = content.length;
    const compressedSize = compressed.length;
    const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1);
    
    console.log(`  ✓ Brotli: ${path.basename(filePath)} (${formatBytes(originalSize)} → ${formatBytes(compressedSize)}, ${ratio}% reduction)`);
  } catch (error) {
    console.error(`  ✗ Brotli failed for ${filePath}:`, error.message);
  }
}

/**
 * Format bytes to human-readable string
 * @param {number} bytes - Number of bytes
 * @returns {string} Formatted string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Main compression function
 */
async function compressFiles() {
  console.log('🗜️  DashDig Widget Compression');
  console.log('================================\n');

  // Check if dist directory exists
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ Error: dist directory not found. Please run "npm run build" first.');
    process.exit(1);
  }

  // Get all files in dist directory
  const files = getFiles(DIST_DIR);
  const filesToCompress = files.filter(shouldCompress);

  if (filesToCompress.length === 0) {
    console.log('⚠️  No files found to compress.');
    return;
  }

  console.log(`📦 Found ${filesToCompress.length} file(s) to compress\n`);

  // Compress each file
  let successCount = 0;
  let errorCount = 0;

  for (const filePath of filesToCompress) {
    const relativePath = path.relative(DIST_DIR, filePath);
    console.log(`\n📄 Compressing: ${relativePath}`);
    
    try {
      await Promise.all([
        compressGzip(filePath),
        compressBrotli(filePath)
      ]);
      successCount++;
    } catch (error) {
      console.error(`  ✗ Error compressing ${relativePath}:`, error.message);
      errorCount++;
    }
  }

  // Summary
  console.log('\n================================');
  console.log('📊 Compression Summary');
  console.log('================================');
  console.log(`✓ Successfully compressed: ${successCount} file(s)`);
  if (errorCount > 0) {
    console.log(`✗ Failed: ${errorCount} file(s)`);
  }
  console.log('\n✅ Compression complete!');
}

// Run compression
compressFiles().catch(error => {
  console.error('\n❌ Compression failed:', error);
  process.exit(1);
});

