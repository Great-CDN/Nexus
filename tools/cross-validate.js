#!/usr/bin/env node

/**
 * Nexus Cross-Validation Tool
 *
 * Reads a local artifact file, sends it to multiple LLM APIs in parallel
 * with isolated review prompts, and generates a structured Markdown report.
 *
 * Usage:
 *   node tools/cross-validate.js <file> --models claude,gpt
 *   node tools/cross-validate.js <file> --models claude,gpt,gemini --out reports/
 *
 * Environment variables:
 *   ANTHROPIC_API_KEY  - Required for --models claude
 *   OPENAI_API_KEY     - Required for --models gpt
 *   GOOGLE_API_KEY     - Required for --models gemini
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const PROVIDERS = {
  claude: {
    name: 'Claude (Anthropic)',
    host: 'api.anthropic.com',
    path: '/v1/messages',
    envKey: 'ANTHROPIC_API_KEY',
    model: 'claude-sonnet-4-6',
    maxTokens: 4096,
    buildRequest: (apiKey, content) => ({
      model: PROVIDERS.claude.model,
      max_tokens: PROVIDERS.claude.maxTokens,
      system: REVIEW_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: content }],
    }),
    parseResponse: (body) => body.content?.[0]?.text || '(no response)',
    buildHeaders: (apiKey) => ({
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    }),
  },
  gpt: {
    name: 'GPT (OpenAI)',
    host: 'api.openai.com',
    path: '/v1/chat/completions',
    envKey: 'OPENAI_API_KEY',
    model: 'gpt-4.5',
    maxTokens: 4096,
    buildRequest: (apiKey, content) => ({
      model: PROVIDERS.gpt.model,
      max_tokens: PROVIDERS.gpt.maxTokens,
      messages: [
        { role: 'system', content: REVIEW_SYSTEM_PROMPT },
        { role: 'user', content: content },
      ],
    }),
    parseResponse: (body) => body.choices?.[0]?.message?.content || '(no response)',
    buildHeaders: (apiKey) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    }),
  },
  gemini: {
    name: 'Gemini (Google)',
    host: 'generativelanguage.googleapis.com',
    path: (apiKey) => `/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
    envKey: 'GOOGLE_API_KEY',
    model: 'gemini-2.5-pro',
    maxTokens: 4096,
    buildRequest: (apiKey, content) => ({
      contents: [{ parts: [{ text: `${REVIEW_SYSTEM_PROMPT}\n\n${content}` }] }],
      generationConfig: { maxOutputTokens: PROVIDERS.gemini.maxTokens },
    }),
    parseResponse: (body) => body.candidates?.[0]?.content?.parts?.[0]?.text || '(no response)',
    buildHeaders: () => ({ 'Content-Type': 'application/json' }),
  },
};

const REVIEW_SYSTEM_PROMPT = `You are an experienced senior software engineer conducting a technical review.

You are reviewing the following artifact. Do not make assumptions about who wrote it or how it was created. Evaluate it purely on its technical merits.

Your task:
1. Identify any security vulnerabilities, logic errors, edge case omissions, or ambiguities.
2. Check for consistency, correctness, and maintainability issues.
3. For each issue found, provide: a brief description, severity (Critical/High/Medium/Low), and a suggested fix.

Format your response as a Markdown list. If you find no issues, explicitly state: "No issues found."`;

// ---------------------------------------------------------------------------
// CLI Argument Parsing
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { models: [], outDir: 'docs/reviews', file: null };

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--models' && i + 1 < argv.length) {
      args.models = argv[++i].split(',').map((m) => m.trim().toLowerCase());
    } else if (arg === '--out' && i + 1 < argv.length) {
      args.outDir = argv[++i];
    } else if (!arg.startsWith('--')) {
      args.file = arg;
    }
  }

  return args;
}

function showUsage() {
  console.log(`Usage: node tools/cross-validate.js <file> --models <model1,model2> [--out <dir>]

Models:
  claude  - Anthropic Claude (requires ANTHROPIC_API_KEY)
  gpt     - OpenAI GPT (requires OPENAI_API_KEY)
  gemini  - Google Gemini (requires GOOGLE_API_KEY)

Examples:
  node tools/cross-validate.js docs/DESIGN_DOC.md --models claude,gpt
  node tools/cross-validate.js src/auth.ts --models claude,gpt,gemini --out reports/`);
}

// ---------------------------------------------------------------------------
// HTTP Request Utility
// ---------------------------------------------------------------------------

function postJSON(host, pathOrFn, headers, payload) {
  return new Promise((resolve, reject) => {
    const pathStr = typeof pathOrFn === 'function' ? pathOrFn() : pathOrFn;
    const postData = JSON.stringify(payload);

    const options = {
      hostname: host,
      path: pathStr,
      method: 'POST',
      headers: {
        ...headers,
        'Content-Length': Buffer.byteLength(postData),
      },
      timeout: 120000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}: ${parsed.error?.message || data}`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(new Error(`Invalid JSON response: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timeout')); });
    req.write(postData);
    req.end();
  });
}

// ---------------------------------------------------------------------------
// Core Logic
// ---------------------------------------------------------------------------

async function reviewWithProvider(providerKey, fileContent, apiKey) {
  const provider = PROVIDERS[providerKey];
  const payload = provider.buildRequest(apiKey, fileContent);
  const headers = provider.buildHeaders(apiKey);
  const pathValue = typeof provider.path === 'function' ? () => provider.path(apiKey) : provider.path;

  const start = Date.now();
  const response = await postJSON(provider.host, pathValue, headers, payload);
  const elapsed = Date.now() - start;

  return {
    provider: providerKey,
    providerName: provider.name,
    model: provider.model,
    elapsedMs: elapsed,
    content: provider.parseResponse(response),
  };
}

function generateReport(artifactPath, results) {
  const timestamp = new Date().toISOString().replace(/[:T]/g, '-').split('.')[0];
  const basename = path.basename(artifactPath, path.extname(artifactPath));
  const artifactType = path.extname(artifactPath).replace('.', '').toUpperCase() || 'DOCUMENT';

  let md = `# Cross-Validation Report: ${basename}\n\n`;
  md += `## Artifact\n`;
  md += `- **Type:** ${artifactType}\n`;
  md += `- **File:** ${artifactPath}\n`;
  md += `- **Review Date:** ${new Date().toISOString().split('T')[0]}\n`;
  md += `- **Models Reviewed:** ${results.map((r) => r.providerName).join(', ')}\n\n`;

  md += `## Summary\n\n`;
  md += `| Model | Response Time | Status |\n`;
  md += `|-------|--------------|--------|\n`;
  for (const r of results) {
    const status = r.content.includes('No issues found') ? 'Clean' : 'Issues Found';
    md += `| ${r.providerName} | ${r.elapsedMs}ms | ${status} |\n`;
  }
  md += `\n`;

  md += `## Detailed Reviews\n\n`;
  for (const r of results) {
    md += `### ${r.providerName} (${r.model})\n\n`;
    md += `${r.content}\n\n`;
    md += `---\n\n`;
  }

  md += `## Human Decision\n\n`;
  md += `- [ ] Reviewed all findings\n`;
  md += `- [ ] Merged unique issues into task tracker\n`;
  md += `- [ ] Resolved contradictions between models\n`;
  md += `- [ ] Final verdict: **Go** / **No-Go**\n`;
  md += `\n`;
  md += `**Reasoning:** <human fills in>\n`;

  return { filename: `cv-${basename}-${timestamp}.md`, content: md };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv);

  if (!args.file || args.models.length === 0) {
    showUsage();
    process.exit(1);
  }

  // Verify file exists
  if (!fs.existsSync(args.file)) {
    console.error(`Error: File not found: ${args.file}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(args.file, 'utf-8');

  // Validate requested models and API keys
  const tasks = [];
  for (const model of args.models) {
    const provider = PROVIDERS[model];
    if (!provider) {
      console.error(`Error: Unknown model "${model}". Supported: claude, gpt, gemini`);
      process.exit(1);
    }
    const apiKey = process.env[provider.envKey];
    if (!apiKey) {
      console.error(`Error: ${provider.envKey} is not set. Required for --models ${model}`);
      process.exit(1);
    }
    tasks.push(reviewWithProvider(model, fileContent, apiKey));
  }

  console.log(`Cross-validating ${args.file} with ${args.models.join(', ')}...`);

  // Run reviews in parallel
  const results = await Promise.all(tasks);

  // Generate report
  const report = generateReport(args.file, results);
  const outPath = path.resolve(args.outDir, report.filename);

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, report.content, 'utf-8');

  console.log(`\nReport written to: ${outPath}`);
  console.log(`\nNext steps:`);
  console.log(`  1. Read the report.`);
  console.log(`  2. Merge unique findings into your task tracker.`);
  console.log(`  3. Resolve contradictions between models.`);
  console.log(`  4. Make a Go / No-Go decision.`);
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
