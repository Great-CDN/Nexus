# Reproducibility and Traceability

Nexus aims to make AI collaboration **traceable** — meaning every decision, input, and output can be audited and replayed from documents, regardless of when or by whom the work was done. This document defines the mechanisms that make that possible.

> **Terminology note**: `docs/BOUNDARY_CONDITIONS.md` §1 establishes that true deterministic reproducibility (identical tokens on replay) is impossible with LLMs. What this document describes is **traceability** — a complete audit trail that lets anyone reconstruct what happened and why. We retain "Reproducibility" in the filename and some headings for discoverability, but the operational concept is traceability.

## What Traceability Means Here

Traceability in Nexus does not mean "AI produces identical token sequences every time." That is impossible with current language models. It means:

1. **Deterministic inputs**: The human-AI context package is complete and unambiguous.
2. **Locked environment**: The model and parameters are known and recorded.
3. **Verifiable outputs**: The result can be checked against the spec without relying on memory.
4. **Re-playable process**: Another person (or future you) can pick up the spec and continue without asking "what did we decide?"

## Mechanisms

### 1. State Snapshot

A state snapshot is a frozen record of everything needed to trace a session. It is stored alongside the project, not in AI memory.

#### What Goes Into a Snapshot

For every session, record:

```
sessions/
  YYYY-MM-DD-feature-name/
    02-specify/
      context.md          # The context package loaded at session start
      spec-v1.md          # The spec as it existed at session start
      output.md           # AI output (if text)
      diff.patch          # Code changes (if any)
      verdict.md          # Human review verdict
    03-design/
      context.md
      spec-v1.md          # Spec referenced (copy, not link)
      design-v1.md
      output.md
      verdict.md
    04-execute/
      context.md
      spec-v1.md
      design-v1.md
      task-T1.md
      diff.patch
      verdict.md
      # For multi-task implementation, subdirectories per task (T1/, T2/)
      # are acceptable to keep snapshots organized.
```

#### Snapshot Rules

- **Never link, always copy**. Snapshots contain copies of specs and designs, not references. This ensures the snapshot remains valid even if the source document changes.
- **One snapshot per session**. Do not combine multiple sessions into one snapshot.
- **Snapshots are append-only**. Once recorded, a snapshot is never modified. If you revisit a phase, create a new snapshot with an incremented version (e.g., `spec-v2.md`).
- **Verdict is mandatory**. Every snapshot ends with a written verdict: approved, rejected, or approved with notes.
- **Retention policy**. Archive or delete sessions older than 3 months. For long-running projects, consider referencing committed spec/design versions by git hash instead of physical copies once a feature is accepted.

### 2. Environment Locking

The AI model and its parameters are part of the traceability environment. Record them.

#### What to Record

| Element | How to Record | Example |
|---------|--------------|---------|
| Model ID | Note the exact model name | `claude-sonnet-4-6` |
| Claude Code version | `claude --version` or app version | `Claude Code 0.2.45` |
| Date | ISO 8601 | `2026-05-11` |
| Temperature | If exposed in settings | Usually not configurable in Claude Code |
| Context window limit | Known from documentation | ~200K tokens for Claude 4 |

Record these in the session's `context.md` under an `Environment` section.

#### Limitations

- **Model updates are opaque**. Anthropic may update a model without changing its name. You cannot lock this.
- **Temperature is usually not exposed**. Claude Code does not typically let you set temperature.
- **Context window truncation is invisible**. When context exceeds the limit, the model silently truncates. This is why the context packaging line limits exist — they are heuristics aligned with the Context Packaging Protocol, not a guarantee. See `docs/protocols/context-packaging.md` and `docs/protocols/threshold-classification.md` for the exact thresholds.

**Implication**: Traceability does not imply reproducibility. The goal is to preserve a complete audit trail, not to guarantee identical output on replay.

### 3. Output Validation

Every AI-generated artifact must be validated against its spec, not just reviewed for plausibility.

#### Validation Methods

| Artifact | Validation Method |
|----------|-------------------|
| Spec | Checklist against `docs/templates/spec.md` mandatory sections |
| Design | Trace every acceptance criterion to a design element |
| Code | Compile/typecheck + tests pass + diff review |
| Tests | Run suite; verify each AC has at least one test |
| Review Report | Check that every issue has severity, location, and resolution |

#### Validation Record

Validation results are part of the snapshot. A session without a validation record is incomplete.

### 4. Context Completeness Check

Before starting any session, run this check:

- [ ] Spec version is stated (e.g., "using spec-v2").
- [ ] Design version is stated (e.g., "using design-v1").
- [ ] All referenced code is pasted, not named.
- [ ] Task ID from design breakdown is identified.
- [ ] Constraints are listed explicitly.
- [ ] The single instruction is the last item in the context.

If any item is missing, the session is not traceable. Do not proceed.

## Practical Workflow

### For New Projects

1. Create a `sessions/` directory at project root.
2. For every session, create a dated subdirectory.
3. Copy the relevant spec and design into the session directory before starting.
4. After the session, save the output and verdict.
5. Commit `sessions/` along with code changes.

### For Existing Projects (like GreatCDN)

1. Retroactively create snapshots for the current state: copy the current spec/design into `sessions/YYYY-MM-DD-initial/`.
2. Going forward, create per-session snapshots.
3. Do not try to retroactively snapshot past work — the value is in future traceability.

## Tradeoffs

| Benefit | Cost |
|---------|------|
| Full audit trail of decisions | Disk space and minor overhead per session |
| Ability to restart from any point | Must maintain snapshot discipline |
| Protection against model drift | Cannot eliminate drift entirely |
| New contributors can catch up | Requires reading snapshots, not just code |

## When to Skip Snapshots

Never skip snapshots for Execute, Verify, or Decide phases.

For Maintenance fixes, use **minimal snapshots**:
- One-line fixes with no spec impact: `diff.patch` + one-line description in `context.md` is sufficient.
- Dependency updates: `package.json` diff + `npm audit` output.
- Documentation-only fixes: `diff.patch` only.

The goal is auditability, not bureaucracy. If the cost of the snapshot exceeds the value of knowing what changed, reduce the snapshot.

## Anti-Patterns

- **Relying on conversation history**: "Claude should remember from yesterday" — no. The snapshot is the memory.
- **Moving specs without versioning**: Editing a spec in place destroys the ability to trace past sessions.
- **Skipping verdicts**: A session without a verdict is unfinished work, not a completed step.
