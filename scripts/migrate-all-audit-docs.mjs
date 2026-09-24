/**
 * Migration Script: HOP Audit Documentation
 * Moves historical audit reports from production/ to docs/audits/
 *
 * This script:
 * 1. Resolves the repository root safely
 * 2. Creates only missing directories
 * 3. Checks every target file before writing
 * 4. Never overwrites an existing file automatically
 * 5. Uses complete original reports only
 * 6. Reads every written file back from disk
 * 7. Verifies path, readability, and content
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Source and target mappings
const MAPPINGS = [
  // Phase 0 - Missing (not in source)
  // production/phase-1 -> docs/audits/phase-1
  { source: 'production/phase-1', target: 'docs/audits/phase-1', pattern: '*.md', type: 'phase-reports' },

  // Phase 2 - Complete
  { source: 'production/phase-2', target: 'docs/audits/phase-2', pattern: '*.md', type: 'phase-reports' },
  { source: 'production/phase-2', target: 'docs/audits/phase-2', pattern: '*.json', type: 'evidence' },

  // Phase 3 - Complete
  { source: 'production/phase-3', target: 'docs/audits/phase-3', pattern: '*.md', type: 'phase-reports' },
  { source: 'production/phase-3', target: 'docs/audits/phase-3', pattern: '*.json', type: 'evidence' },

  // Phase 4 - Complete
  { source: 'production/phase-4', target: 'docs/audits/phase-4', pattern: '*.md', type: 'phase-reports' },
  { source: 'production/phase-4', target: 'docs/audits/phase-4', pattern: '*.json', type: 'evidence' },

  // Phase 5 - Complete
  { source: 'production/phase-5', target: 'docs/audits/phase-5', pattern: '*.md', type: 'phase-reports' },

  // Phase 4.5 - Missing (not in source)
  // Phase 6-9 - Missing (not in source)

  // Root-level audit reports
  { source: '.', target: 'docs/audits', pattern: 'HOP_PRODUCTION_AUDIT.md', type: 'phase-reports' },
  { source: '.', target: 'docs/audits', pattern: 'MEDIA_INTEGRATION_AUDIT.md', type: 'phase-reports' },
  { source: '.', target: 'docs/audits', pattern: 'MEDIA_OPTIMIZATION_REPORT.md', type: 'phase-reports' },
  { source: '.', target: 'docs/audits', pattern: 'PERFORMANCE_BASELINE.md', type: 'phase-reports' },
  { source: '.', target: 'docs/audits', pattern: 'PHASE_2_14_MASTER_EXECUTION_TODO.md', type: 'master-plan' },
  { source: '.', target: 'docs/audits', pattern: 'PHASE_3_PATTERN_1_REPORT.md', type: 'pattern-reports' },
  { source: '.', target: 'docs/audits', pattern: 'PHASE_3_PATTERN_2_REPORT.md', type: 'pattern-reports' },
  { source: '.', target: 'docs/audits', pattern: 'PHASE_3_PATTERN_3_PLAN.md', type: 'pattern-reports' },
  { source: '.', target: 'docs/audits', pattern: 'PHASE_3_PATTERN_3_REPORT.md', type: 'pattern-reports' },

  // Cleanup reports
  { source: 'production/cleanup', target: 'docs/audits/cleanup', pattern: '*.md', type: 'phase-reports' },
  { source: 'production/cleanup', target: 'docs/audits/cleanup', pattern: '*.sql', type: 'sql' },
  { source: 'production/cleanup', target: 'docs/audits/cleanup/snapshots', pattern: '*.json', type: 'evidence' },
];

// Root-level audit reports to migrate
const ROOT_LEVEL_REPORTS = [
  'HOP_PRODUCTION_AUDIT.md',
  'MEDIA_INTEGRATION_AUDIT.md',
  'MEDIA_OPTIMIZATION_REPORT.md',
  'PERFORMANCE_BASELINE.md',
  'PHASE_2_14_MASTER_EXECUTION_TODO.md',
  'PHASE_3_PATTERN_1_REPORT.md',
  'PHASE_3_PATTERN_2_REPORT.md',
  'PHASE_3_PATTERN_3_PLAN.md',
  'PHASE_3_PATTERN_3_REPORT.md',
];

// Phase directories in production/
const PROD_PHASE_DIRS = [
  'phase-1',
  'phase-2',
  'phase-3',
  'phase-4',
  'phase-5',
];

/**
 * Check if a file matches a glob-like pattern
 */
function matchesPattern(filename, pattern) {
  if (pattern === '*.md' || pattern === '*.json' || pattern === '*.sql') {
    const ext = pattern.slice(1);
    return filename.endsWith(ext);
  }
  return filename === pattern;
}

/**
 * Recursively get all files in a directory
 */
function getFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results.push(...getFiles(fullPath));
    } else if (item.isFile()) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Get all files from source directory matching the pattern
 */
function getSourceFiles(sourcePath, pattern) {
  if (!fs.existsSync(sourcePath)) {
    console.log(`  ⚠ Source does not exist: ${sourcePath}`);
    return [];
  }

  if (fs.statSync(sourcePath).isFile()) {
    if (matchesPattern(path.basename(sourcePath), pattern)) {
      return [sourcePath];
    }
    return [];
  }

  // Directory - get all matching files recursively
  const allFiles = getFiles(sourcePath);
  return allFiles.filter(f => matchesPattern(path.basename(f), pattern));
}

/**
 * Get relative path from root
 */
function getRelativePath(filePath) {
  return path.relative(ROOT, filePath);
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('='.repeat(60));
  console.log('HOOP AUDIT DOCUMENTATION MIGRATION');
  console.log('='.repeat(60));
  console.log(`Repository Root: ${ROOT}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('');

  let totalFiles = 0;
  let migratedFiles = 0;
  let skippedFiles = 0;
  let errors = 0;

  // Process each mapping
  for (const mapping of MAPPINGS) {
    const sourceBase = path.join(ROOT, mapping.source);
    const targetBase = path.join(ROOT, mapping.target);

    console.log(`\nProcessing: ${mapping.source} -> ${mapping.target}`);

    // Get source files
    const sourceFiles = getSourceFiles(sourceBase, mapping.pattern);

    if (sourceFiles.length === 0) {
      console.log(`  ⚠ No files found matching pattern: ${mapping.pattern}`);
      continue;
    }

    for (const sourceFile of sourceFiles) {
      totalFiles++;

      // Calculate relative path for target
      const relativePath = sourceFile.replace(sourceBase + path.sep, '');
      const targetFile = path.join(targetBase, relativePath);

      // Check if target already exists
      if (fs.existsSync(targetFile)) {
        console.log(`  ⚠ SKIP: ${getRelativePath(targetFile)} (already exists)`);
        skippedFiles++;
        continue;
      }

      try {
        // Ensure target directory exists
        const targetDir = path.dirname(targetFile);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
          console.log(`  + Created directory: ${getRelativePath(targetDir)}`);
        }

        // Read source file
        const content = fs.readFileSync(sourceFile, 'utf-8');

        // Write to target
        fs.writeFileSync(targetFile, content, 'utf-8');

        // Verify write by reading back
        const verifyContent = fs.readFileSync(targetFile, 'utf-8');
        if (verifyContent !== content) {
          throw new Error('Content verification failed');
        }

        const stats = fs.statSync(targetFile);
        console.log(`  ✓ ${getRelativePath(targetFile)}`);
        console.log(`    Size: ${stats.size} bytes, Lines: ${content.split('\n').length}`);
        migratedFiles++;

      } catch (e) {
        console.error(`  ✗ ERROR: ${getRelativePath(sourceFile)}`);
        console.error(`    ${e.message}`);
        errors++;
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('MIGRATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total files found:  ${totalFiles}`);
  console.log(`Files migrated:     ${migratedFiles}`);
  console.log(`Files skipped (exist): ${skippedFiles}`);
  console.log(`Errors:             ${errors}`);
  console.log('');

  if (errors > 0) {
    console.log('❌ MIGRATION COMPLETED WITH ERRORS');
    process.exit(1);
  }

  console.log('✅ MIGRATION COMPLETED SUCCESSFULLY');
}

// Run migration
migrate().catch(e => {
  console.error('Migration failed:', e);
  process.exit(1);
});