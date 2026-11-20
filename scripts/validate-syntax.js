#!/usr/bin/env node
/**
 * Automated Syntax & AST Validator for GSEA Teachers Hub
 * Ensures index.html contains 0 JavaScript syntax errors before packaging.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');
const indexPath = path.join(rootDir, 'index.html');

console.log('🔍 Running Pre-Package Syntax & AST Validation for Teachers Hub...');

if (!fs.existsSync(indexPath)) {
  console.error('✗ Error: index.html not found at', indexPath);
  process.exit(1);
}

const html = fs.readFileSync(indexPath, 'utf8');
const scriptMatches = [...html.matchAll(/<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi)];

if (scriptMatches.length === 0) {
  console.error('✗ Error: No <script> tags found in index.html!');
  process.exit(1);
}

let errorCount = 0;

scriptMatches.forEach((m, idx) => {
  const js = m[1];
  try {
    // Compile script in isolated context to detect syntax and AST errors
    new vm.Script(js, { filename: `index.html [script tag ${idx + 1}]` });
    console.log(`  ✓ Script tag ${idx + 1}: Syntax & AST OK (${js.length} chars)`);
  } catch (err) {
    console.error(`\n❌ SYNTAX ERROR in script tag ${idx + 1}:`);
    console.error(`  ${err.message}`);
    if (err.stack) {
      console.error(err.stack.split('\n').slice(0, 5).join('\n'));
    }
    errorCount++;
  }
});

if (errorCount > 0) {
  console.error(`\n🚨 Validation Failed: ${errorCount} script error(s) detected. Aborting build.`);
  process.exit(1);
}

console.log('✅ AST Syntax Validation Passed: 0 errors detected. Safe to package.\n');
