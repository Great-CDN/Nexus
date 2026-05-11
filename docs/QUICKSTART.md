# Quickstart

Get from zero to your first Nexus session in 5 minutes.

## Prerequisites

- Claude Code installed and authenticated.
- This project opened as the working directory.

## Step 1: Load Context (30 seconds)

At the start of **every** session, load the context package:

1. State the phase: "We are in [Requirements / Design / Implementation / Testing / Acceptance / Maintenance]."
2. Provide the spec path (e.g., `docs/specs/auth-refactor.SPEC.md`).
3. Provide the design path if past Requirements.
4. Paste relevant code (types, interfaces, existing patterns).

Do not say "as we discussed earlier." Paste the text.

## Step 2: Pick Your Workflow Intensity (30 seconds)

| If your change is... | Use |
|----------------------|-----|
| New feature, architecture change, or security-critical logic | **Full Workflow** |
| Small enhancement, UI tweak, adding a field, dependency update | **Light Workflow** |
| Production bug or security patch | **Hotfix Workflow** |

Full Workflow = all 6 phases + all checklists + snapshots.
Light Workflow = spec-light + design-light + one task + manual verification.
Hotfix = bug report → minimal fix → verify → change log.

## Step 3: Run the Phase

### Full Workflow — First Feature

```
Phase 1: Requirements
  → Use template: docs/templates/spec.md
  → Output: PRODUCT_SPEC.md
  → Stop: CHECKLIST: Requirements (docs/CHECKLISTS.md)

Phase 2: Design
  → Use template: docs/templates/design.md
  → Output: DESIGN_DOC.md
  → Stop: CHECKLIST: Design

Phase 3: Implementation
  → One task per session. Use docs/templates/task.md.
  → Commit after every task (Conventional Commits).
  → Stop: CHECKLIST: Implementation per task

Phase 4: Testing
  → Use template: docs/templates/test-plan.md
  → Stop: CHECKLIST: Testing

Phase 5: Acceptance
  → Use template: docs/templates/review.md
  → Stop: CHECKLIST: Acceptance

Phase 6: Maintenance
  → Use template: docs/templates/change-log.md
  → Stop: CHECKLIST: Maintenance
```

### Light Workflow — Quick Change

```
1. Write a one-paragraph spec with 2-3 acceptance criteria
   → Use docs/templates/spec-light.md

2. Write a one-paragraph design with an interface sketch
   → Use docs/templates/design-light.md

3. Implement in one session. Run automated checks.

4. Manual verification + existing tests still pass.

5. Verbal "looks good" only for zero-business-logic changes.
   Everything else gets a written verdict.
```

## Step 4: Use the Tools

| Tool | When |
|------|------|
| `node tools/cross-validate.js <file> --models deepseek,gpt` | Before accepting a design or spec, cross-validate with multiple models |
| `node tools/count-tokens.js <file>` | Check if your context package is near the limit |

## The Absolute Rules

Break these and the output is invalid:

1. **Spec > Prompt** — Never generate code without a spec reference.
2. **Workflow > Chat** — One phase, one task, one session.
3. **Review > Generation** — Automate what machines can check first; human review is for architecture and logic.
4. **Explicit Context > Implicit Memory** — Load context at every session start.
5. **Small Context > Large Context** — >800 lines = warning; >1200 lines = must split.
6. **Human Final Judgment** — AI proposes; human decides.

## What to Read Next

- `docs/PHILOSOPHY.md` — Why these rules exist.
- `docs/PROTOCOLS.md` — How to write specs, package context, commit, branch.
- `docs/WORKFLOWS.md` — What each phase requires.
- `docs/WORKED_EXAMPLE.md` — A real feature walked through all 6 phases.

## Common First-Timer Mistakes

- **Skipping the spec.** "It is a small change, I will just describe it." No. Write the spec. It takes 5 minutes and prevents 30 minutes of rework.
- **Mixing phases in one session.** Do not design while implementing. End the session, start a new one.
- **Reviewing too much at once.** 200 lines or 30 minutes per chunk. If the diff is larger, review in chunks.
- **Trusting cross-validation blindly.** Cross-validation finds more errors; it does not find human conceptual errors. Human final judgment still applies.
