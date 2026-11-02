#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const destDir = path.join(os.homedir(), 'Documents', 'moodle_backups', 'GSEA_teachers');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const year = now.getFullYear();
const month = pad(now.getMonth() + 1);
const day = pad(now.getDate());
const hours = pad(now.getHours());
const minutes = pad(now.getMinutes());
const seconds = pad(now.getSeconds());

let timestamp = `${year}-${month}-${day}_${hours}h${minutes}`;
let zipFilename = `GSEA_Teachers_backup_${timestamp}.zip`;
let zipFilePath = path.join(destDir, zipFilename);

if (fs.existsSync(zipFilePath)) {
  timestamp = `${year}-${month}-${day}_${hours}h${minutes}m${seconds}s`;
  zipFilename = `GSEA_Teachers_backup_${timestamp}.zip`;
  zipFilePath = path.join(destDir, zipFilename);
}

console.log(`\n📦 Creating full backup for GSEA Faculty Hub...`);
console.log(`📂 Source:      ${rootDir}`);
console.log(`📍 Destination: ${destDir}`);
console.log(`🏷️  Archive:     ${zipFilename}\n`);

try {
  const zipCmd = `zip -r -q "${zipFilePath}" . -x "*.DS_Store" "*node_modules*" "*.git*" "*dist*" "*.zip" "*.iso" "*.dmg"`;
  execSync(zipCmd, { cwd: rootDir, stdio: 'inherit' });

  const stats = fs.statSync(zipFilePath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log(`✅ Backup successfully created!`);
  console.log(`📁 File: ${zipFilePath}`);
  console.log(`⚖️  Size: ${sizeMB} MB`);
  console.log(`⏰ Timestamp: ${now.toLocaleString()}\n`);
} catch (err) {
  console.error(`✗ Backup failed:`, err.message);
  process.exit(1);
}

