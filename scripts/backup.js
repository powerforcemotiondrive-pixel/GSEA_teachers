#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const defaultSem = path.basename(rootDir).toLowerCase().includes('semester_3') 
  ? 'semester3' 
  : (path.basename(rootDir).toLowerCase().includes('semester_2') 
    ? 'semester2' 
    : (path.basename(rootDir).toLowerCase().includes('teachers') ? 'teachers' : 'semester1'));
const arg = (process.argv[2] || defaultSem).toLowerCase().trim();

function runBackup(target) {
  let targetFolder = 'GSEA_semester_1';
  let label = 'Semester 1';
  let zipPrefix = 'GSEA_Semester_1';

  if (target === '3' || target === 'semester3' || target === 'backup3') {
    targetFolder = 'GSEA_semester_3';
    label = 'Semester 3';
    zipPrefix = 'GSEA_Semester_3';
  } else if (target === '2' || target === 'semester2' || target === 'backup2') {
    targetFolder = 'GSEA_semester_2';
    label = 'Semester 2';
    zipPrefix = 'GSEA_Semester_2';
  } else if (target === 'teachers' || target === 'backupt' || target === 't' || target === 'teacher' || target === 'teachershub') {
    targetFolder = 'GSEA_teachers';
    label = 'Teachers Hub';
    zipPrefix = 'GSEA_Teachers';
  } else {
    targetFolder = 'GSEA_semester_1';
    label = 'Semester 1';
    zipPrefix = 'GSEA_Semester_1';
  }

  const sourceDirCandidate = path.join(os.homedir(), 'Documents', targetFolder);
  const sourceDir = fs.existsSync(sourceDirCandidate) ? sourceDirCandidate : rootDir;
  const destDir = path.join(os.homedir(), 'Documents', 'moodle_backups', targetFolder);

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
  let zipFilename = `${zipPrefix}_backup_${timestamp}.zip`;
  let zipFilePath = path.join(destDir, zipFilename);

  if (fs.existsSync(zipFilePath)) {
    timestamp = `${year}-${month}-${day}_${hours}h${minutes}m${seconds}s`;
    zipFilename = `${zipPrefix}_backup_${timestamp}.zip`;
    zipFilePath = path.join(destDir, zipFilename);
  }

  console.log(`\n📦 Creating full backup for GSEA ${label}...`);
  console.log(`📂 Source:      ${sourceDir}`);
  console.log(`📍 Destination: ${destDir}`);
  console.log(`🏷️  Archive:     ${zipFilename}\n`);

  try {
    const zipCmd = `zip -r -q "${zipFilePath}" . -x "*.DS_Store" "*node_modules*" "*.git*" "*dist*" "*.zip" "*.iso" "*.dmg"`;
    execSync(zipCmd, { cwd: sourceDir, stdio: 'inherit' });

    const stats = fs.statSync(zipFilePath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log(`✅ Backup successfully created!`);
    console.log(`📁 File: ${zipFilePath}`);
    console.log(`⚖️  Size: ${sizeMB} MB`);
    console.log(`⏰ Timestamp: ${now.toLocaleString()}\n`);
  } catch (err) {
    console.error(`✗ Backup failed for ${label}:`, err.message);
    process.exit(1);
  }
}

if (arg === 'all' || arg === 'backup:all' || arg === 'backupall') {
  ['semester1', 'semester2', 'semester3', 'teachers'].forEach(t => runBackup(t));
} else {
  runBackup(arg);
}
