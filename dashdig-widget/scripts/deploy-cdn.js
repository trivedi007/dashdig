#!/usr/bin/env node

/**
 * DashDig Widget CDN Deployment Script
 * 
 * Deploys widget bundles to CloudFlare R2 with:
 * - SRI (Subresource Integrity) hash generation
 * - Automatic Gzip and Brotli compression
 * - Versioned and latest URLs
 * - Proper cache headers
 */

require('dotenv').config({ path: '.env.local' });
const { S3Client, PutObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');
const zlib = require('zlib');

// Configuration
const config = {
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  endpoint: process.env.R2_ENDPOINT,
  bucketName: process.env.R2_BUCKET_NAME || 'dashdig-widget-cdn',
  region: 'auto',
};

// Validate configuration
function validateConfig() {
  const missing = [];
  if (!config.accessKeyId) missing.push('R2_ACCESS_KEY_ID');
  if (!config.secretAccessKey) missing.push('R2_SECRET_ACCESS_KEY');
  if (!config.endpoint) missing.push('R2_ENDPOINT');
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables in .env.local:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\nPlease add these to your .env.local file.');
    process.exit(1);
  }
}

// Initialize S3 client for R2
const s3Client = new S3Client({
  region: config.region,
  endpoint: config.endpoint,
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
});

// Get package version
function getVersion() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return packageJson.version;
}

// Calculate SRI hash
function calculateSRIHash(content) {
  const hash = crypto.createHash('sha384').update(content).digest('base64');
  return `sha384-${hash}`;
}

// Compress content
function compressContent(content) {
  return {
    gzip: zlib.gzipSync(content),
    brotli: zlib.brotliCompressSync(content),
  };
}

// Get file size in KB
function getFileSize(content) {
  return (content.length / 1024).toFixed(2);
}

// Upload file to R2
async function uploadFile(key, content, contentType, cacheControl, metadata = {}) {
  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: key,
    Body: content,
    ContentType: contentType,
    CacheControl: cacheControl,
    Metadata: metadata,
  });

  try {
    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error(`   ❌ Failed to upload ${key}:`, error.message);
    return false;
  }
}

// Check if bucket is accessible
async function checkBucketAccess() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: config.bucketName,
      MaxKeys: 1,
    });
    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('❌ Cannot access R2 bucket:', error.message);
    console.error('\nPlease verify:');
    console.error('1. Bucket exists in CloudFlare R2');
    console.error('2. API credentials are correct');
    console.error('3. Endpoint URL is correct');
    return false;
  }
}

// Build production bundles
function buildProduction() {
  console.log('🔨 Building production bundles...');
  try {
    execSync('npm run build:prod', { stdio: 'inherit' });
    console.log('✅ Build complete\n');
    return true;
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    return false;
  }
}

// Process and upload files
async function processAndUploadFiles(version) {
  const distDir = path.join(__dirname, '../dist');
  const integrityDir = path.join(__dirname, '../.cdn-integrity');
  
  // Create integrity directory
  if (!fs.existsSync(integrityDir)) {
    fs.mkdirSync(integrityDir, { recursive: true });
  }

  const integrityFile = path.join(integrityDir, 'hashes.txt');
  let integrityContent = `# SRI Hashes - Generated ${new Date().toISOString()}\n\n`;

  console.log('📦 Processing files...\n');

  // Get all .js files from dist (excluding .map files)
  const files = fs.readdirSync(distDir)
    .filter(file => file.endsWith('.js') && !file.endsWith('.map.js'));

  for (const file of files) {
    const filePath = path.join(distDir, file);
    const content = fs.readFileSync(filePath);
    const sriHash = calculateSRIHash(content);
    
    console.log(`📄 ${file} (${getFileSize(content)} KB)`);
    console.log(`  🔐 SRI: ${sriHash}`);
    
    // Save to integrity file
    integrityContent += `${file}: ${sriHash}\n`;

    // Compress
    console.log('  📦 Compressing...');
    const compressed = compressContent(content);
    console.log(`     Gzip: ${getFileSize(compressed.gzip)} KB`);
    console.log(`     Brotli: ${getFileSize(compressed.brotli)} KB`);

    // Upload versioned files
    const versionedKey = `v${version}/${file}`;
    console.log(`  ☁️  Uploading to /${versionedKey}...`);
    await uploadFile(
      versionedKey,
      content,
      'application/javascript; charset=utf-8',
      'public, max-age=31536000, immutable',
      { sri: sriHash }
    );

    // Upload compressed versions
    await uploadFile(
      `${versionedKey}.gz`,
      compressed.gzip,
      'application/javascript; charset=utf-8',
      'public, max-age=31536000, immutable',
      { 'content-encoding': 'gzip', sri: sriHash }
    );

    await uploadFile(
      `${versionedKey}.br`,
      compressed.brotli,
      'application/javascript; charset=utf-8',
      'public, max-age=31536000, immutable',
      { 'content-encoding': 'br', sri: sriHash }
    );

    // Upload latest version
    const latestKey = `latest/${file}`;
    console.log(`  ☁️  Uploading to /${latestKey}...`);
    await uploadFile(
      latestKey,
      content,
      'application/javascript; charset=utf-8',
      'public, max-age=300',
      { sri: sriHash }
    );

    // Upload compressed latest versions
    await uploadFile(
      `${latestKey}.gz`,
      compressed.gzip,
      'application/javascript; charset=utf-8',
      'public, max-age=300',
      { 'content-encoding': 'gzip', sri: sriHash }
    );

    await uploadFile(
      `${latestKey}.br`,
      compressed.brotli,
      'application/javascript; charset=utf-8',
      'public, max-age=300',
      { 'content-encoding': 'br', sri: sriHash }
    );

    console.log('');
  }

  // Upload source maps
  console.log('📍 Uploading source maps...');
  const mapFiles = fs.readdirSync(distDir)
    .filter(file => file.endsWith('.js.map')); // More specific filter

  for (const file of mapFiles) {
    const filePath = path.join(distDir, file);
    const content = fs.readFileSync(filePath);
    
    console.log(`  ☁️  ${file}`);
    
    // Upload to versioned path
    await uploadFile(
      `v${version}/${file}`,
      content,
      'application/json',
      'no-cache'
    );

    // Upload to latest path
    await uploadFile(
      `latest/${file}`,
      content,
      'application/json',
      'no-cache'
    );
  }

  // Save integrity hashes
  fs.writeFileSync(integrityFile, integrityContent);
  console.log(`\n🔐 Saving SRI hashes...`);
  console.log(`  ✅ Saved to .cdn-integrity/hashes.txt\n`);

  return true;
}

// Main deployment function
async function deploy() {
  console.log('🚀 DashDig Widget CDN Deployment');
  console.log('================================\n');

  // Validate config
  validateConfig();

  // Get version
  const version = getVersion();
  console.log(`📦 Version: ${version}\n`);

  // Check bucket access
  console.log('🔍 Checking R2 bucket access...');
  const hasAccess = await checkBucketAccess();
  if (!hasAccess) {
    process.exit(1);
  }
  console.log(`✅ Connected to R2 bucket: ${config.bucketName}\n`);

  // Build production bundles
  const buildSuccess = buildProduction();
  if (!buildSuccess) {
    process.exit(1);
  }

  // Process and upload files
  const uploadSuccess = await processAndUploadFiles(version);
  if (!uploadSuccess) {
    process.exit(1);
  }

  // Success message
  console.log('✅ Deployment Complete!\n');
  console.log('📍 Your widget is now available at:');
  
  // Determine CDN URL (use custom domain if configured, otherwise show both)
  const customDomain = process.env.CDN_CUSTOM_DOMAIN || 'cdn.dashdig.com';
  const r2Domain = config.endpoint.replace('https://', '').replace('.r2.cloudflarestorage.com', '');
  
  console.log(`   Versioned: https://${customDomain}/v${version}/dashdig.min.js`);
  console.log(`   Latest:    https://${customDomain}/latest/dashdig.min.js\n`);
  
  console.log('🔐 SRI hashes saved to: .cdn-integrity/hashes.txt\n');
}

// Run deployment
deploy().catch(error => {
  console.error('❌ Deployment failed:', error);
  process.exit(1);
});
