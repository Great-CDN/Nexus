## Triage Protocol

Not every change needs the full 6-phase workflow. Use this protocol to decide which intensity level applies.

### Levels

#### Full Workflow

Use for: new features, major refactors, architectural changes.

All 6 phases. All checklists. All snapshots.

#### Light Workflow

Use for: small enhancements, UI tweaks, adding a field to a form, routine dependency updates.

- **Specify**: Use `docs/templates/spec-light.md`. One paragraph, 2-3 ACs maximum.
- **Design**: Use `docs/templates/design-light.md`. One paragraph approach + interface sketch.
- **Execute**: One task, one session. No formal task template needed.
  - Review standard: "Human has scanned the diff for obvious errors" (vs. full execution-path trace for Full Workflow).
  - Automated checks (type check, lint, tests) still mandatory.
- **Verify**: Manual verification + existing test suite still passes.
- **Decide**: Written verdict for anything touching business logic or user-visible behavior; verbal "looks good" permitted only for changes that affect zero business logic paths and zero user-visible behavior (e.g., CSS color tweak, comment correction). When in doubt, use a written verdict.
- **Snapshots**: Optional for implementation. Diff in commit message is sufficient.

#### Hotfix

Use for: production bugs, security patches, critical broken functionality.

- **Specify**: Bug report is the requirement. Minimum contents: (1) exact reproduction steps, (2) expected vs. actual behavior, (3) affected scope / users, (4) regression risks. No formal spec template required for trivial fixes; use `docs/templates/spec-light.md` if the fix touches non-obvious logic.
- **Design**: Skip if the fix is obvious; one-sentence design if not.
- **Execute**: One task, one session (max 2 hours). If the hotfix exceeds this, split into logical subtasks (e.g., fix + validation) with separate sessions, and document the split in the change log.
- **Verify**: Reproduce the bug, apply fix, verify fix, check for regressions. Run the full test suite if possible.
- **Decide**: Verify the bug is fixed; verify no regressions.
- **Maintenance**: Change log entry mandatory.

### Decision Rules

| Question | Full | Light | Hotfix |
|----------|------|-------|--------|
| Does this change user-facing behavior? | Yes | Maybe | Yes (fixing broken) |
| Does this touch more than 3 files? | Yes | No | Maybe |
| Could this break existing functionality? | Yes | No | Yes |
| Does this require new types or interfaces? | Yes | No | No |
| Is there a production incident? | No | No | Yes |

If any row points to Full, use Full. If the change is a production incident, use Hotfix regardless of other rows.

### Anti-Patterns

- **Using Full for everything**: A button color change does not need a spec and design doc. This creates process fatigue.
- **Using Hotfix for features**: "I'll just call it a hotfix to skip the spec" — no. Hotfix is for broken production code, not for new work.
- **Skipping Testing on Light Workflow**: Even Light Workflow requires verification. The only thing that shrinks is documentation, not validation.
- **Snapshots for trivial changes**: If a change is one line and obviously correct, a snapshot is bureaucracy. The commit message is the audit trail.

---
