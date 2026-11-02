#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const zipOutput = path.join(distDir, 'GSEA_Teachers_SCORM.zip');

console.log('📦 Starting GSEA Faculty Hub SCORM Packaging...\n');

// 1. Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 2. Build minified Tailwind CSS
console.log('🎨 Compiling Tailwind CSS (minified)...');
try {
  execSync('npx @tailwindcss/cli -i ./src/input.css -o ./output.css --minify', {
    cwd: rootDir,
    stdio: 'inherit'
  });
  console.log('✓ output.css compiled successfully.\n');
} catch (err) {
  console.error('✗ Failed to compile Tailwind CSS:', err.message);
  process.exit(1);
}

// 3. Validate imsmanifest.xml file references
console.log('🔍 Validating imsmanifest.xml resources...');
const manifestPath = path.join(rootDir, 'imsmanifest.xml');
if (!fs.existsSync(manifestPath)) {
  console.error('✗ Error: imsmanifest.xml not found!');
  process.exit(1);
}

const manifestContent = fs.readFileSync(manifestPath, 'utf8');
const fileMatches = manifestContent.match(/<file href="([^"]+)"/g) || [];
let missingFiles = 0;

for (const match of fileMatches) {
  const filePath = match.replace('<file href="', '').replace('"', '');
  const absolutePath = path.join(rootDir, filePath);
  if (!fs.existsSync(absolutePath)) {
    console.warn(`  ⚠️ Warning: Manifest references missing file: ${filePath}`);
    missingFiles++;
  }
}

if (missingFiles === 0) {
  console.log(`✓ All ${fileMatches.length} files in imsmanifest.xml verified.\n`);
} else {
  console.log(`⚠️ ${missingFiles} file(s) referenced in manifest are missing on disk.\n`);
}

// 4. Generate Cryptographic SHA-256 Manifest
const generateChecksums = require('./generate-checksums');
generateChecksums();

// 5. Create SCORM Zip archive
console.log('🗜️  Bundling SCORM package into dist/GSEA_Teachers_SCORM.zip...');
if (fs.existsSync(zipOutput)) {
  fs.unlinkSync(zipOutput);
}

const includeList = [
  'imsmanifest.xml',
  'COPYRIGHT.md',
  'CHECKSUMS.sha256',
  'index.html',
  'output.css',
  'images'
].filter(item => fs.existsSync(path.join(rootDir, item)));

try {
  const cmd = `zip -r -q "${zipOutput}" ${includeList.join(' ')} -x "*.DS_Store" "*node_modules*" "*.git*"`;
  execSync(cmd, { cwd: rootDir, stdio: 'inherit' });

  // Also copy to root folder for convenient access
  const rootZip = path.join(rootDir, 'GSEA_Teachers_SCORM.zip');
  if (fs.existsSync(rootZip)) {
    fs.unlinkSync(rootZip);
  }
  fs.copyFileSync(zipOutput, rootZip);

  const stats = fs.statSync(zipOutput);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`\n✅ Package created successfully!`);
  console.log(`📍 Output 1: dist/GSEA_Teachers_SCORM.zip (${sizeMB} MB)`);
  console.log(`📍 Output 2: ./GSEA_Teachers_SCORM.zip (${sizeMB} MB)`);
  console.log(`🚀 Ready for upload to ENAC Moodle / eCampus.\n`);
} catch (err) {
  console.error('✗ Failed to create zip package:', err.message);
  process.exit(1);
}

