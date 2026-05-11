# Cross-Validation Report: nexus-current-review

## Artifact
- **Type:** MD
- **File:** C:/Users/Bonbon/AppData/Local/Temp/nexus-current-review.md
- **Review Date:** 2026-05-11
- **Models Reviewed:** DeepSeek

## Summary

| Model | Response Time | Status |
|-------|--------------|--------|
| DeepSeek | 41858ms | Issues Found |

## Detailed Reviews

### DeepSeek (deepseek-chat)

## Technical Review: Nexus Documentation Artifacts

### Critical Issues

- **Missing CAPABILITY.md reference without fallback** — The document references `docs/CAPABILITY.md` in multiple places (Fallback Rule, Cross-Validation Layer 1) but this file is not included in the artifact set. If this file does not exist in the actual project, all references to it become orphaned and the Fallback Rule becomes undefined, creating a critical process gap.

  **Suggested fix**: Either include `docs/CAPABILITY.md` in full, or inline the complete Fallback Rule specification into the Workflows document. Remove or replace all external references that cannot be verified.

- **Cross-Validation script references models that may not exist** — The script example (`tools/cross-validate.js`) references `deepseek` and `kimi` models. These models may not be available or may have different API interfaces than assumed. The script assumes identical prompt templates work for all models, which is incorrect for models with different API schemas (e.g., DeepSeek uses OpenAI-compatible API but with different model names).

  **Suggested fix**: Remove ambiguous model references or provide explicit, verifiable API configuration for each supported model. Document which models have been tested and validated with the script. Add a configuration validation step before execution.

- **Context window token counting is unreliable** — The document repeatedly uses line counts as proxies for token counts (800 lines, 1200 lines absolute maximum). TypeScript with complex generics can have 2-3x the token density of prose. A 500-line TypeScript file with deep generics and JSDoc annotations could easily exceed 200K tokens, while 1200 lines of simple Markdown might be under 50K tokens.

  **Suggested fix**: Replace line-count heuristics with actual token counting guidance. Provide a simple script or tool reference that can count tokens accurately. Document that line counts are indicators, not guarantees, and provide a method to verify token counts before session start.

### High Issues

- **Artifact Quality Standard contradicts itself on simplicity** — The document specifies "Specs and designs must not exceed 800 lines" under the Simple dimension, but the Scale section states "Pure prose documents can be larger — up to ~2000 lines." These conflicting rules will lead to confusion about which limit applies to a given document.

  **Suggested fix**: Reconcile the two limits into a single, consistent rule. Either raise the Artifact Quality limit to match the Scale document, or define separate limits for code-heavy vs. prose-heavy documents with clear classification criteria.

- **Review protocol contradicts cognitive load ratio target** — The Review Protocol limits human review to 200 lines per session ("Human has read and understands the code (limit: 200 lines per review session)"), but the Metrics section's Implementation phase target is 30-120 minutes. A 200-line review could take 30-60 minutes, but if the Cognitive Load Ratio target is 40-60%, the human would need to be active for only 12-72 minutes of a 120-minute session. This creates an impossible constraint: long reviews force high cognitive load.

  **Suggested fix**: Either increase the 200-line review limit proportionally to match the 120-minute session max, or reduce the session max to 60 minutes when intense review is expected. Make the line limit explicit about what "one session" means in context of review.

- **State snapshot structure is brittle** — The Reproducibility section specifies `sessions/YYYY-MM-DD-feature-name/phase/` structure. A single day with 5 tasks across 3 features creates 15+ directories, all with duplicated spec/design copies. Over 6 months, this becomes thousands of files with massive disk duplication. There is no garbage collection or archival strategy.

  **Suggested fix**: Add a snapshot retention policy (e.g., "Keep last 3 months of active development, archive or delete older sessions"). Consider a more efficient structure: feature-level directories with phase subdirectories, but without copying unchanged spec/design files into every single session. Use git tags or references to the committed spec/design version, not physical copies.

- **Cross-Validation layers lack clear stopping criteria** — Layer 3 (adversarial cross-validation) says "Repeat until B finds no new critical issues or the human declares the risk acceptable." This is an infinite loop. Without a defined maximum iteration count, this could run indefinitely on sufficiently complex designs.

  **Suggested fix**: Specify a maximum iteration count (e.g., "3 rounds maximum") and an escalation path if convergence is not reached. Define what constitutes a "round" and when the human should intervene rather than continuing the automated loop.

### Medium Issues

- **Vague acceptance criteria detection is incomplete** — The Requirement checklist correctly catches "good", "fast", "user-friendly", "robust" as vague words. But many non-verifiable criteria use other vague patterns: "should", "could", "may", "etc.", "and/or", "some", "various". The Spec template also lacks an explicit list of prohibited vague words.

  **Suggested fix**: Expand the vague word detection list in both the Requirement checklist and the Spec template. Add a "Red Flag Words" section to the Spec template with examples of non-verifiable phrasing. Include patterns like "and so on", "for example (without exhaustive list)", "as appropriate".

- **Metrics section has circular dependencies** — The Rework Rate metric depends on "Review verdicts in session snapshots", but snapshot creation is only required for "Implementation, Testing, or Acceptance phases." If a task fails review during Implementation phase (which is in scope for snapshots), the verdict is captured. However, if a Light workflow change bypasses snapshot creation entirely, rework rate cannot be calculated. The Light workflow explicitly says "Snapshots: Optional for implementation."

  **Suggested fix**: Make the metric collection dependency chain explicit. Document that Light workflow tasks are excluded from Rework Rate calculation, or mandate snapshot creation for all tasks that go through review (even Light workflow).

- **Hotfix workflow lacks formal specification** — The Triage protocol defines Hotfix as a valid workflow level but provides minimal details: "Requirements: Bug report is the requirement. No spec template." This contradicts the core principle that "A spec is a contract." A bug report is rarely a complete spec. It lacks scope, non-goals, and verifiable acceptance criteria.

  **Suggested fix**: Define a lightweight hotfix template or minimum requirements. At minimum, require: (1) exact reproduction steps, (2) expected vs. actual behavior, (3) affected systems/users, (4) regression risks. Do not skip spec entirely; provide a minimal hotfix spec template.

- **Commit protocol lacks signature verification guidance** — The document specifies that git history is the audit trail but provides no guidance on commit signature verification (GPG/Sigstore). For an "engineering coordination layer" that treats git as the source of truth, unsigned commits are a significant integrity gap.

  **Suggested fix**: Add a recommendation or requirement for signed commits, especially for Acceptance phase merges to main. Provide instructions for setting up GPG key signing or SSH-based commit signing.

### Low Issues

- **Typo: "Red Zone" is undefined** — The Workflows document mentions "Red Zone" tasks in the Fallback Rule context: "If most tasks are Red Zone, the entire feature should be human-led." The term "Red Zone" appears to refer to tasks that trigger the Fallback Rule (AI fails twice), but this terminology is not defined anywhere in the document set.

  **Suggested fix**: Define "Red Zone" explicitly, or replace with the exact phrasing "tasks that have triggered the Fallback Rule" to avoid introducing undefined terminology.

- **Inconsistent use of "Light workflow" vs. "Light Workflow"** — The Triage Protocol uses "Light workflow", "Full workflow", and "Hotfix" as proper nouns. However, some documents use "light workflow" (lowercase). The Workflows document uses "Light" as a workflow level but doesn't capitalize it consistently.

  **Suggested fix**: Unify capitalization across all documents. Define an explicit naming convention for workflow levels (e.g., "Light Workflow", "Full Workflow", "Hotfix") and enforce it globally.

- **Missing guidance on session interruption** — The Session Protocol covers start, during, and end states, but has no protocol for interruption (e.g., human must leave mid-session, connection drops, power failure). The current guidance assumes sessions always complete normally.

  **Suggested fix**: Add an "Interruption" section to Session Protocol. Define how to save partial state, what to do on reconnection, and when to scrap a partially-complete session and restart fresh.

---

## Human Decision

- [ ] Reviewed all findings
- [ ] Merged unique issues into task tracker
- [ ] Resolved contradictions between models
- [ ] Final verdict: **Go** / **No-Go**

**Reasoning:** <human fills in>
