#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const isoVolName = 'GSEA_TEACHERS';
const isoFilename = 'GSEA_Teachers_Offline.iso';
const isoPath = path.join(distDir, isoFilename);
const dmgFilename = 'GSEA_Teachers_Mac.dmg';
const dmgPath = path.join(distDir, dmgFilename);

console.log('💿 Starting GSEA Faculty Hub Offline Disk Image Packaging...\n');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 1. Build minified CSS
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

// 2. Generate Checksums
const generateChecksums = require('./generate-checksums');
generateChecksums();

// 3. Stage offline assets
const stagingDir = path.join(distDir, '_iso_stage');
if (fs.existsSync(stagingDir)) {
  fs.rmSync(stagingDir, { recursive: true, force: true });
}
fs.mkdirSync(stagingDir, { recursive: true });

console.log('📋 Staging compiled offline assets...');
const stageItems = [
  'index.html',
  'output.css',
  'images',
  'imsmanifest.xml',
  'COPYRIGHT.md',
  'CHECKSUMS.sha256'
];

for (const item of stageItems) {
  const src = path.join(rootDir, item);
  const dest = path.join(stagingDir, item);
  if (fs.existsSync(src)) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      fs.cpSync(src, dest, { recursive: true });
    } else {
      fs.copyFileSync(src, dest);
    }
  }
}

// 4. Create Universal Hybrid ISO
console.log('🗜️  Generating Universal Hybrid ISO (Windows Joliet + Mac UDF/ISO)...');
if (fs.existsSync(isoPath)) fs.unlinkSync(isoPath);

try {
  const isoCmd = `hdiutil makehybrid -o "${isoPath}" "${stagingDir}" -iso -joliet -udf -default-volume-name "${isoVolName}" -quiet`;
  execSync(isoCmd, { stdio: 'inherit' });

  // Copy to root folder
  const rootIso = path.join(rootDir, isoFilename);
  if (fs.existsSync(rootIso)) fs.unlinkSync(rootIso);
  fs.copyFileSync(isoPath, rootIso);

  const isoStats = fs.statSync(isoPath);
  const isoMB = (isoStats.size / (1024 * 1024)).toFixed(2);
  console.log(`✓ Universal ISO built: ${isoPath} (${isoMB} MB)\n`);
} catch (err) {
  console.error('✗ Failed to generate ISO:', err.message);
  process.exit(1);
}

// 5. Create Native Mac DMG
console.log('🍏 Generating Native Apple Mac DMG (Instant Finder auto-open)...');
if (fs.existsSync(dmgPath)) fs.unlinkSync(dmgPath);

const tempDmg = path.join(distDir, '_temp.dmg');
if (fs.existsSync(tempDmg)) fs.unlinkSync(tempDmg);

try {
  execSync(`hdiutil create -srcfolder "${stagingDir}" -volname "${isoVolName}" -fs HFS+ -fsargs "-c c=64,a=16,e=16" -format UDRW "${tempDmg}" -quiet`);
  execSync(`hdiutil convert "${tempDmg}" -format UDZO -imagekey zlib-level=9 -o "${dmgPath}" -quiet`);
  if (fs.existsSync(tempDmg)) fs.unlinkSync(tempDmg);

  // Copy to root folder
  const rootDmg = path.join(rootDir, dmgFilename);
  if (fs.existsSync(rootDmg)) fs.unlinkSync(rootDmg);
  fs.copyFileSync(dmgPath, rootDmg);

  const dmgStats = fs.statSync(dmgPath);
  const dmgMB = (dmgStats.size / (1024 * 1024)).toFixed(2);
  console.log(`✓ Apple Mac DMG built: ${dmgPath} (${dmgMB} MB)\n`);
} catch (err) {
  console.warn('⚠️ DMG generation had warning:', err.message);
}

// Clean staging directory
if (fs.existsSync(stagingDir)) {
  fs.rmSync(stagingDir, { recursive: true, force: true });
}

console.log('✅ Offline Packages created successfully!');
console.log(`📍 Universal ISO: ./${isoFilename}`);
console.log(`📍 Native Mac DMG: ./${dmgFilename}`);
console.log('🔒 Both are 100% write-protected and mount as read-only virtual drives.\n');

