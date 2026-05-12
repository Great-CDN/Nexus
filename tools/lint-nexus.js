#!/usr/bin/env node

/**
 * Nexus Document Consistency Linter
 *
 * Checks that Nexus documents obey their own protocols:
 *   - No orphaned references (every `docs/...` link points to an existing file)
 *   - Line counts stay within threshold-classification limits
 *   - Checklist names in WORKFLOWS.md match definitions in CHECKLISTS.md
 *   - CLAUDE.md Document Index references only existing files
 *
 * Usage:
 *   node tools/lint-nexus.js
 *
 * Exit codes:
 *   0 - all checks passed
 *   1 - one or more errors found
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

// Thresholds from docs/protocols/threshold-classification.md
const THRESHOLDS = {
  mixedSoft: 800,
  mixedHard: 1200,
  proseSoft: 2000,
};

// Severity levels matching docs/protocols/definitions.md
const SEVERITY = { ERROR: 'error', WARN: 'warn' };

const issues = [];

function addIssue(file, line, severity, message) {
  issues.push({ file: file || '(global)', line: line || 0, severity, message });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getAllMarkdownFiles(dir, relativeTo = '') {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const rel = relativeTo ? `${relativeTo}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllMarkdownFiles(full, rel));
    } else if (entry.name.endsWith('.md')) {
      results.push(rel);
    }
  }
  return results;
}

function readLines(filePath) {
  const full = path.join(ROOT, filePath);
  if (!fs.existsSync(full)) return [];
  return fs.readFileSync(full, 'utf-8').split(/\r?\n/);
}

function isExampleLine(line) {
  const lower = line.toLowerCase();
  return (
    lower.includes('e.g.') ||
    lower.includes('example') ||
    lower.includes('例如') ||
    lower.includes('如 `docs/') ||
    lower.includes('e.g., `') ||
    lower.includes('is complete') ||
    lower.includes('is incomplete')
  );
}

function isPlaceholder(ref) {
  return ref.includes('<') || ref.includes('>') || ref.includes('*');
}

function isDirectoryRef(ref) {
  return ref.endsWith('/');
}

function stripSectionAnchor(ref) {
  const idx = ref.indexOf(' §');
  return idx >= 0 ? ref.slice(0, idx) : ref;
}

function normalizeRef(ref) {
  return ref.replace(/\\/g, '/');
}

// ---------------------------------------------------------------------------
// Check 1: Orphaned references
// ---------------------------------------------------------------------------

function checkOrphanedReferences() {
  const allMd = getAllMarkdownFiles(ROOT);

  // Regex to capture backtick-wrapped docs references and markdown links
  const backtickRe = /`docs\/[^`]+`/g;
  const linkRe = /\]\((docs\/[^)]+)\)/g;

  for (const file of allMd) {
    // Skip external review reports — they reference suggested files that may not exist yet
    if (file.startsWith('docs/reviews/')) continue;

    const lines = readLines(file);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNum = i + 1;

      // Collect refs from this line
      const refs = new Set();
      let m;
      while ((m = backtickRe.exec(line)) !== null) {
        refs.add(m[0].slice(1, -1)); // strip backticks
      }
      while ((m = linkRe.exec(line)) !== null) {
        refs.add(m[1]);
      }

      for (let ref of refs) {
        ref = normalizeRef(ref);
        const target = stripSectionAnchor(ref);

        if (isPlaceholder(target)) continue;
        if (isDirectoryRef(target)) continue;
        if (isExampleLine(line)) continue;

        const fullTarget = path.join(ROOT, target);
        if (!fs.existsSync(fullTarget)) {
          addIssue(file, lineNum, SEVERITY.ERROR, `Orphaned reference: \`${ref}\``);
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Check 2: Line counts
// ---------------------------------------------------------------------------

function checkLineCounts() {
  const checkedDirs = ['docs', 'docs/protocols', 'docs/templates'];
  for (const dir of checkedDirs) {
    const fullDir = path.join(ROOT, dir);
    if (!fs.existsSync(fullDir)) continue;
    const files = getAllMarkdownFiles(fullDir).filter(f => f.startsWith(dir + '/'));
    for (const file of files) {
      const lines = readLines(file);
      const count = lines.length;
      if (count > THRESHOLDS.mixedHard) {
        addIssue(file, 0, SEVERITY.ERROR,
          `File has ${count} lines, exceeding hard limit of ${THRESHOLDS.mixedHard}`);
      } else if (count > THRESHOLDS.mixedSoft) {
        addIssue(file, 0, SEVERITY.WARN,
          `File has ${count} lines, exceeding soft limit of ${THRESHOLDS.mixedSoft}`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Check 3: Checklist alignment between WORKFLOWS.md and CHECKLISTS.md
// ---------------------------------------------------------------------------

function checkChecklistAlignment() {
  const workflowsLines = readLines('docs/WORKFLOWS.md');
  const checklistsLines = readLines('docs/CHECKLISTS.md');

  // Extract referenced checklists from WORKFLOWS.md: "Run **CHECKLIST: Name**"
  const referenced = new Set();
  const refRe = /CHECKLIST:\s*(\w+)/g;
  for (const line of workflowsLines) {
    let m;
    while ((m = refRe.exec(line)) !== null) {
      referenced.add(m[1]);
    }
  }

  // Extract defined checklists from CHECKLISTS.md: "## CHECKLIST: Name"
  const defined = new Set();
  const defRe = /## CHECKLIST:\s*(\w+)/g;
  for (const line of checklistsLines) {
    let m;
    while ((m = defRe.exec(line)) !== null) {
      defined.add(m[1]);
    }
  }

  for (const name of referenced) {
    if (!defined.has(name)) {
      addIssue('docs/WORKFLOWS.md', 0, SEVERITY.ERROR,
        `References CHECKLIST: ${name} which is not defined in docs/CHECKLISTS.md`);
    }
  }

  // Note: We do not reverse-check (defined → referenced) because auxiliary
  // checklists like Feature Roadmap, Artifact Quality, and Context Loading
  // are referenced by other protocols and templates, not by WORKFLOWS.md.
}

// ---------------------------------------------------------------------------
// Check 4: CLAUDE.md Document Index completeness
// ---------------------------------------------------------------------------

function checkClaudeIndex() {
  const lines = readLines('CLAUDE.md');
  // Match table rows that contain a docs/... path in backticks
  const rowRe = /\|\s*`(docs\/[^`]+)`\s*\|/g;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let m;
    while ((m = rowRe.exec(line)) !== null) {
      const ref = normalizeRef(m[1]);
      const target = stripSectionAnchor(ref);

      if (isPlaceholder(target)) continue;
      if (isDirectoryRef(target)) continue;

      const fullTarget = path.join(ROOT, target);
      if (!fs.existsSync(fullTarget)) {
        addIssue('CLAUDE.md', i + 1, SEVERITY.ERROR,
          `Document Index references missing file: \`${ref}\``);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Reporter
// ---------------------------------------------------------------------------

function report() {
  const errors = issues.filter(i => i.severity === SEVERITY.ERROR);
  const warnings = issues.filter(i => i.severity === SEVERITY.WARN);

  if (issues.length === 0) {
    console.log('All Nexus consistency checks passed.');
    return 0;
  }

  // Group by file
  const byFile = {};
  for (const issue of issues) {
    byFile[issue.file] = byFile[issue.file] || [];
    byFile[issue.file].push(issue);
  }

  console.log(`\nNexus Consistency Report: ${errors.length} error(s), ${warnings.length} warning(s)\n`);

  for (const file of Object.keys(byFile).sort()) {
    console.log(`${file}`);
    for (const issue of byFile[file]) {
      const loc = issue.line > 0 ? `:${issue.line}` : '';
      const tag = issue.severity === SEVERITY.ERROR ? 'error' : 'warn ';
      console.log(`  ${tag}${loc}  ${issue.message}`);
    }
    console.log('');
  }

  return errors.length > 0 ? 1 : 0;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  checkOrphanedReferences();
  checkLineCounts();
  checkChecklistAlignment();
  checkClaudeIndex();
  process.exit(report());
}

main();
