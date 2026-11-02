#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const zipOutput = path.join(distDir, 'GSEA_Teachers_SCORM.zip');
const stagingDir = path.join(distDir, '_scorm_stage');
const privateMapPath = path.join(rootDir, 'students.private.json');

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

// 5. Stage files for packaging with Student Name Injection
console.log('📋 Staging files for SCORM packaging...');
if (fs.existsSync(stagingDir)) {
  fs.rmSync(stagingDir, { recursive: true, force: true });
}
fs.mkdirSync(stagingDir, { recursive: true });

const includeList = [
  'imsmanifest.xml',
  'COPYRIGHT.md',
  'CHECKSUMS.sha256',
  'index.html',
  'output.css',
  'images'
].filter(item => fs.existsSync(path.join(rootDir, item)));

for (const item of includeList) {
  const src = path.join(rootDir, item);
  const dest = path.join(stagingDir, item);
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.cpSync(src, dest, { recursive: true });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// 6. Perform student name injection on staged index.html
if (fs.existsSync(privateMapPath)) {
  try {
    const raw = fs.readFileSync(privateMapPath, 'utf8');
    const studentMap = JSON.parse(raw);
    const cleanMap = {};
    for (const [k, v] of Object.entries(studentMap)) {
      if (!k.startsWith('_')) cleanMap[k] = v;
    }
    const count = Object.keys(cleanMap).length;
    if (count > 0) {
      const stagedIndex = path.join(stagingDir, 'index.html');
      let indexContent = fs.readFileSync(stagedIndex, 'utf8');
      const mapRegex = /\/\* --- STUDENT_NAMES_MAP_START --- \*\/[\s\S]*?\/\* --- STUDENT_NAMES_MAP_END --- \*\//;
      if (mapRegex.test(indexContent)) {
        indexContent = indexContent.replace(
          mapRegex,
          `/* --- STUDENT_NAMES_MAP_START --- */\n    const PRIVATE_STUDENT_NAMES = ${JSON.stringify(cleanMap, null, 2)};\n    /* --- STUDENT_NAMES_MAP_END --- */`
        );
        fs.writeFileSync(stagedIndex, indexContent, 'utf8');
        console.log(`🔒 Injected real student names into staged SCORM package (${count} student mappings).`);
      }
    }
  } catch (err) {
    console.warn('⚠️ Warning: Failed to parse students.private.json:', err.message);
  }
} else {
  console.log('ℹ️ Notice: students.private.json not present. SCORM package will use anonymous IDs.');
}

// 7. Create SCORM Zip archive
console.log('🗜️  Bundling SCORM package into dist/GSEA_Teachers_SCORM.zip...');
if (fs.existsSync(zipOutput)) {
  fs.unlinkSync(zipOutput);
}

try {
  const cmd = `zip -r -q "${zipOutput}" . -x "*.DS_Store" "*node_modules*" "*.git*"`;
  execSync(cmd, { cwd: stagingDir, stdio: 'inherit' });

  // Also copy to root folder for convenient access
  const rootZip = path.join(rootDir, 'GSEA_Teachers_SCORM.zip');
  if (fs.existsSync(rootZip)) {
    fs.unlinkSync(rootZip);
  }
  fs.copyFileSync(zipOutput, rootZip);

  // Clean staging
  if (fs.existsSync(stagingDir)) {
    fs.rmSync(stagingDir, { recursive: true, force: true });
  }

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
