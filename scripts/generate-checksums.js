#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = path.resolve(__dirname, '..');
const outputFile = path.join(rootDir, 'CHECKSUMS.sha256');

function getFiles(dir, baseDir = '') {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file === '.DS_Store' || file === 'CHECKSUMS.sha256' || file.endsWith('.zip') || file.endsWith('.iso') || file.endsWith('.dmg')) {
      continue;
    }
    const fullPath = path.join(dir, file);
    const relPath = path.join(baseDir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, relPath));
    } else {
      results.push(relPath);
    }
  }
  return results;
}

function generateChecksums() {
  const files = getFiles(rootDir).sort();
  const lines = [];

  for (const relPath of files) {
    const fullPath = path.join(rootDir, relPath);
    const buffer = fs.readFileSync(fullPath);
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    lines.push(`${hash}  ${relPath}`);
  }

  fs.writeFileSync(outputFile, lines.join('\n') + '\n', 'utf8');
  console.log(`✓ Generated cryptographic SHA-256 manifest (${files.length} files signed).`);
}

if (require.main === module) {
  generateChecksums();
}

module.exports = generateChecksums;

