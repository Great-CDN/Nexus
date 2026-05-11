---
name: cross-validate
 description: "Run multi-model cross-validation on a spec, design, or code artifact. Use for high-stakes decisions: security-critical logic, architecture decisions, complex algorithms, or when a single-model review feels insufficient."
disable-model-invocation: true
allowed-tools: Read, Bash
---

## When to Use

- Before approving a security-critical design (auth, payment, privacy).
- After generating a complex architecture decision and before committing to it.
- When the primary model's review feels uncertain or shallow.
- The user explicitly asks for cross-validation, second opinion, or multi-model review.

## Process

### Step 1: Identify the Artifact

Ask the user which file to cross-validate. If they do not specify, suggest candidates based on recent work:

```
Which artifact should we cross-validate?
- docs/DESIGN_DOC.md (if a design was just generated)
- docs/specs/<feature>.SPEC.md (if validating requirements)
- src/path/to/file.ts (if validating critical code)
```

Validate that the file exists before proceeding.

### Step 2: Select Models

Ask which models to use. Default to two if the user is unsure.

```
Which models should run the independent review?
- claude  (Anthropic Claude — requires ANTHROPIC_API_KEY)
- gpt     (OpenAI GPT — requires OPENAI_API_KEY)
- gemini  (Google Gemini — requires GOOGLE_API_KEY)

Recommended pairs: claude + gpt, or claude + gemini.
```

### Step 3: Verify Environment (Security-Critical)

API keys are secrets. They must **never** be written into project files, committed to git, or pasted into the chat.

Check if the required API keys are available. The script searches in this order:
1. System environment variables
2. `~/.nexus/cross-validate.env`
3. `~/.config/nexus/cross-validate.env`

```bash
node tools/cross-validate.js --help 2>&1 | head -1 || echo "Script exists"
# Also verify env vars directly:
env | grep -E 'ANTHROPIC_API_KEY|OPENAI_API_KEY|GOOGLE_API_KEY' | sed 's/=.*/=***/'
```

If any required key is missing, stop and guide the user to configure it **outside the project**:

```
API key for <model> is not configured. 

Choose one of these secure options (both keep secrets out of git):

Option 1 — Shell environment variables (recommended for daily use):
  export ANTHROPIC_API_KEY=sk-ant-...
  export OPENAI_API_KEY=sk-...
  export GOOGLE_API_KEY=...
  # Add these to your shell profile (~/.bashrc, ~/.zshrc, or Windows system env)
  # so they persist across terminal sessions.

Option 2 — User-level env file:
  mkdir -p ~/.nexus
  cat > ~/.nexus/cross-validate.env <<'EOF'
  ANTHROPIC_API_KEY=sk-ant-...
  OPENAI_API_KEY=sk-...
  GOOGLE_API_KEY=...
  EOF
  chmod 600 ~/.nexus/cross-validate.env

Warning: Never create .env files inside this project directory.
The project gitignore does not protect against accidental commits
if the file is created in a subdirectory not covered by .gitignore.
```

Wait for the user to confirm they have configured the keys before proceeding.

### Step 4: Run Cross-Validation

Execute the tool with the selected models:

```bash
node tools/cross-validate.js <file> --models <model1,model2>
```

Wait for completion. The tool generates a report at `docs/reviews/cv-<artifact>-<timestamp>.md`.

### Step 5: Load and Summarize the Report

Read the generated report file and present a structured summary to the user:

1. **Response summary** — Which models found issues vs. declared clean.
2. **Unique findings per model** — What did each model catch that others missed?
3. **Overlapping findings** — What did multiple models agree on? (Higher confidence.)
4. **Contradictions** — Did models disagree? Flag for human resolution.

### Step 6: Guide Human Decision

Do not make the decision. Present the findings and ask:

```
Based on the cross-validation report:
- [ ] Critical issues found: [list]
- [ ] High issues found: [list]
- [ ] Unique insights: [list]
- [ ] Disagreements between models: [list]

What would you like to do?
1. Fix the issues and re-run cross-validation.
2. Accept the artifact with documented risks.
3. Escalate to human-only review (Red Zone fallback).
```

## Rules

- **Never skip the environment check.** Calling the tool with a missing API key wastes time.
- **Never attribute the artifact to AI in the summary.** The report is already anonymized by the tool; do not undo that.
- **When guiding manual fallback, explicitly warn the user to strip generation metadata.** Isolation is broken if the reviewer knows the artifact was AI-generated.
- **Never decide for the human.** The skill summarizes; the human integrates and decides.
- **One artifact per run.** If the user wants to validate multiple files, run sequentially, not in parallel.
- **Preserve the raw report.** Always reference the generated report file path so the user can read the full text.
