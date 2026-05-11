#!/usr/bin/env node

/**
 * Rough token counter for context size estimation.
 *
 * This is not a precise tokenizer. It provides a fast, dependency-free
 * estimate to check whether a context package is within safe limits.
 *
 * Heuristic:
 *   - English / code: ~1 token per 4 characters
 *   - CJK (Chinese, Japanese, Korean): ~1 token per 1.5 characters
 *
 * Usage:
 *   node tools/count-tokens.js <file>
 *   cat file.md | node tools/count-tokens.js
 */

const fs = require('fs');

function estimateTokens(text) {
  let tokens = 0;
  for (const char of text) {
    const code = char.charCodeAt(0);
    // CJK Unified Ideographs, Hiragana, Katakana, Hangul
    const isCJK = (code >= 0x4e00 && code <= 0x9fff)
      || (code >= 0x3040 && code <= 0x309f)
      || (code >= 0x30a0 && code <= 0x30ff)
      || (code >= 0xac00 && code <= 0xd7af);
    tokens += isCJK ? 0.67 : 0.25; // 1/1.5 ≈ 0.67, 1/4 = 0.25
  }
  return Math.ceil(tokens);
}

function main() {
  const file = process.argv[2];
  const text = file && file !== '-'
    ? fs.readFileSync(file, 'utf-8')
    : fs.readFileSync(0, 'utf-8'); // stdin

  const tokens = estimateTokens(text);
  const lines = text.split(/\r?\n/).length;

  console.log(`Lines:     ${lines}`);
  console.log(`Tokens:    ${tokens}`);
  console.log(`Status:    ${tokens > 120000 ? 'WARNING — likely exceeds context window' : tokens > 80000 ? 'CAUTION — near context limit' : 'OK'}`);
}

main();
