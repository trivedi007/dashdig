#!/usr/bin/env node

/**
 * Generate SRI (Subresource Integrity) hashes for CDN deployment
 * Creates HTML snippets with integrity attributes for secure loading
 */

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Files to generate SRI hashes for
const FILES = [
  'dist/dashdig.min.js',
  'dist/dashdig.esm.js',
  'dist/dashdig-react.min.js',
  'dist/dashdig-react.esm.js'
];

/**
 * Generate SRI hash for a file
 * @param {string} filePath - Path to file
 * @param {string} algorithm - Hash algorithm (sha256, sha384, sha512)
 * @returns {string} SRI hash in format: algorithm-base64hash
 */
function generateSRIHash(filePath, algorithm = 'sha384') {
  const fileContent = fs.readFileSync(filePath);
  const hash = crypto
    .createHash(algorithm)
    .update(fileContent)
    .digest('base64');
  
  return `${algorithm}-${hash}`;
}

/**
 * Get file size in bytes and human-readable format
 * @param {string} filePath - Path to file
 * @returns {object} File size info
 */
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  const bytes = stats.size;
  
  let readable;
  if (bytes < 1024) {
    readable = `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    readable = `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    readable = `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  
  return { bytes, readable };
}

/**
 * Get gzipped size
 * @param {string} filePath - Path to file
 * @returns {object} Gzipped size info
 */
function getGzippedSize(filePath) {
  const { execSync } = require('child_process');
  
  try {
    const gzippedBytes = parseInt(
      execSync(`gzip -c ${filePath} | wc -c`).toString().trim(),
      10
    );
    
    let readable;
    if (gzippedBytes < 1024) {
      readable = `${gzippedBytes} B`;
    } else if (gzippedBytes < 1024 * 1024) {
      readable = `${(gzippedBytes / 1024).toFixed(2)} KB`;
    } else {
      readable = `${(gzippedBytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    
    return { bytes: gzippedBytes, readable };
  } catch (error) {
    return { bytes: 0, readable: 'N/A' };
  }
}

/**
 * Generate CDN URL for a file
 * @param {string} fileName - Name of the file
 * @returns {string} CDN URL
 */
function generateCDNUrl(fileName) {
  return `https://cdn.dashdig.com/widget/v1/${fileName}`;
}

/**
 * Main function
 */
function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  DashDig Widget - SRI Hash Generator');
  console.log('═══════════════════════════════════════════════════════\n');

  const results = [];
  
  // Generate SRI hashes for all files
  FILES.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  Warning: ${filePath} not found. Run build first.`);
      return;
    }
    
    const fileName = path.basename(filePath);
    const sriHash = generateSRIHash(filePath);
    const size = getFileSize(filePath);
    const gzippedSize = getGzippedSize(filePath);
    const cdnUrl = generateCDNUrl(fileName);
    
    results.push({
      fileName,
      filePath,
      sriHash,
      size,
      gzippedSize,
      cdnUrl
    });
  });
  
  // Print results
  console.log('📦 Bundle Information:\n');
  
  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.fileName}`);
    console.log(`   Size: ${result.size.readable} (${result.gzippedSize.readable} gzipped)`);
    console.log(`   SRI:  ${result.sriHash}`);
    console.log();
  });
  
  console.log('═══════════════════════════════════════════════════════');
  console.log('  CDN Integration Snippets');
  console.log('═══════════════════════════════════════════════════════\n');
  
  // Generate HTML snippets
  results.forEach(result => {
    if (result.fileName.includes('react')) {
      console.log(`<!-- React Integration -->`);
      console.log(`<script src="${result.cdnUrl}"`);
      console.log(`        integrity="${result.sriHash}"`);
      console.log(`        crossorigin="anonymous"></script>\n`);
    } else if (result.fileName.includes('.min.js')) {
      console.log(`<!-- Vanilla JavaScript (Auto-init) -->`);
      console.log(`<script src="${result.cdnUrl}"`);
      console.log(`        data-dashdig-key="your-api-key-here"`);
      console.log(`        integrity="${result.sriHash}"`);
      console.log(`        crossorigin="anonymous"></script>\n`);
    } else if (result.fileName.includes('.esm.js')) {
      console.log(`<!-- ES Module Import -->`);
      console.log(`<script type="module">`);
      console.log(`  import Dashdig from '${result.cdnUrl}';`);
      console.log(`  // Note: SRI not supported for ES modules in all browsers`);
      console.log(`  // Use module script with integrity="${result.sriHash}"`);
      console.log(`</script>\n`);
    }
  });
  
  console.log('═══════════════════════════════════════════════════════\n');
  
  // Save to file
  const outputPath = path.join(__dirname, '../SRI-HASHES.md');
  let markdown = `# DashDig Widget - SRI Hashes\n\n`;
  markdown += `Generated: ${new Date().toISOString()}\n\n`;
  markdown += `## Bundle Information\n\n`;
  
  results.forEach(result => {
    markdown += `### ${result.fileName}\n\n`;
    markdown += `- **File**: \`${result.filePath}\`\n`;
    markdown += `- **Size**: ${result.size.readable} (${result.gzippedSize.readable} gzipped)\n`;
    markdown += `- **CDN URL**: \`${result.cdnUrl}\`\n`;
    markdown += `- **SRI Hash**: \`${result.sriHash}\`\n\n`;
  });
  
  markdown += `## CDN Integration\n\n`;
  
  markdown += `### Vanilla JavaScript (Auto-init)\n\n`;
  markdown += `\`\`\`html\n`;
  const vanillaFile = results.find(r => r.fileName === 'dashdig.min.js');
  if (vanillaFile) {
    markdown += `<script src="${vanillaFile.cdnUrl}"\n`;
    markdown += `        data-dashdig-key="your-api-key-here"\n`;
    markdown += `        integrity="${vanillaFile.sriHash}"\n`;
    markdown += `        crossorigin="anonymous"></script>\n`;
  }
  markdown += `\`\`\`\n\n`;
  
  markdown += `### React Integration\n\n`;
  markdown += `\`\`\`html\n`;
  const reactFile = results.find(r => r.fileName === 'dashdig-react.min.js');
  if (reactFile) {
    markdown += `<script src="${reactFile.cdnUrl}"\n`;
    markdown += `        integrity="${reactFile.sriHash}"\n`;
    markdown += `        crossorigin="anonymous"></script>\n`;
  }
  markdown += `\`\`\`\n\n`;
  
  markdown += `### ES Module\n\n`;
  markdown += `\`\`\`html\n`;
  const esmFile = results.find(r => r.fileName === 'dashdig.esm.js');
  if (esmFile) {
    markdown += `<script type="module">\n`;
    markdown += `  import Dashdig from '${esmFile.cdnUrl}';\n`;
    markdown += `  // ES modules with SRI requires 'integrity' attribute support\n`;
    markdown += `</script>\n`;
  }
  markdown += `\`\`\`\n\n`;
  
  markdown += `## Security Notes\n\n`;
  markdown += `1. **SRI (Subresource Integrity)** ensures that files loaded from CDNs haven't been tampered with.\n`;
  markdown += `2. Always use \`crossorigin="anonymous"\` attribute with SRI.\n`;
  markdown += `3. Update SRI hashes after every new build/release.\n`;
  markdown += `4. ES module integrity support varies by browser. Use UMD bundles for maximum compatibility.\n\n`;
  
  markdown += `## Verification\n\n`;
  markdown += `To verify a file's integrity:\n\n`;
  markdown += `\`\`\`bash\n`;
  markdown += `# Generate hash locally\n`;
  markdown += `cat dist/dashdig.min.js | openssl dgst -sha384 -binary | openssl base64 -A\n\n`;
  markdown += `# Compare with SRI hash (without 'sha384-' prefix)\n`;
  markdown += `\`\`\`\n\n`;
  
  markdown += `## NPM Package\n\n`;
  markdown += `For bundler-based projects, install via NPM:\n\n`;
  markdown += `\`\`\`bash\n`;
  markdown += `npm install @dashdig/widget\n`;
  markdown += `\`\`\`\n\n`;
  markdown += `No SRI needed for NPM packages as they're verified through package integrity checks.\n`;
  
  fs.writeFileSync(outputPath, markdown);
  
  console.log(`✅ SRI hashes saved to: ${outputPath}\n`);
  
  // Generate JSON for programmatic access
  const jsonPath = path.join(__dirname, '../dist/sri-hashes.json');
  const jsonData = {
    generated: new Date().toISOString(),
    files: results.map(r => ({
      fileName: r.fileName,
      cdnUrl: r.cdnUrl,
      sriHash: r.sriHash,
      size: r.size.bytes,
      gzippedSize: r.gzippedSize.bytes
    }))
  };
  
  fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
  console.log(`✅ JSON output saved to: ${jsonPath}\n`);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateSRIHash, getFileSize, getGzippedSize };




