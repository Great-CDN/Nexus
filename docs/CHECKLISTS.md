# Checklists

These checklists are the stop points defined in `docs/WORKFLOWS.md`. Do not proceed past a phase until the checklist is complete.

---

## CHECKLIST: Requirements

Run this before approving a `PRODUCT_SPEC.md`.

- [ ] Problem statement is clear and one paragraph.
- [ ] Scope is bounded with specific inclusions.
- [ ] Non-goals are explicit and specific.
- [ ] Acceptance criteria are verifiable (each answers "how do we know this is done?").
- [ ] No acceptance criterion uses vague words ("good", "fast", "user-friendly", "robust").
- [ ] Assumptions are listed.
- [ ] Dependencies are identified.
- [ ] Open questions are listed and have owners.
- [ ] Spec is plain Markdown, readable without tools.
- [ ] Human has read the entire spec and agrees with it.

---

## CHECKLIST: Design

Run this before approving a `DESIGN_DOC.md`.

- [ ] Every acceptance criterion from the spec is addressed in the design.
- [ ] Architecture choice is justified with tradeoffs (at least 2 options considered).
- [ ] Interface contracts are defined (types, schemas, function signatures).
- [ ] Data models are specified.
- [ ] Error handling strategy is defined.
- [ ] Task breakdown covers the full spec with no gaps.
- [ ] No task exceeds 2 hours of estimated work.
- [ ] Design does not introduce scope beyond the spec.
- [ ] Human understands every interface and can explain it.
- [ ] Human has approved the design.

---

## CHECKLIST: Implementation

Run this for every completed task.

- [ ] Automated checks pass: type check, lint, static analysis, tests.
- [ ] Code matches the approved design (or deviation is documented).
- [ ] Code implements the relevant acceptance criteria.
- [ ] No `any` types (TypeScript) or equivalent escape hatches without justification.
- [ ] Error paths are handled, not just happy paths.
- [ ] Tests exist and cover the acceptance criteria for this task.
- [ ] Tests pass.
- [ ] No unused variables, imports, or dead code.
- [ ] No console.log or debug code left in production code.
- [ ] Human has read and understands the code (limit: 200 lines per review session; if larger, review in chunks).
- [ ] Commit follows Conventional Commits format and references the task.

---

## CHECKLIST: Testing

Run this before proceeding to Acceptance.

- [ ] All unit tests pass.
- [ ] Integration tests pass for critical paths.
- [ ] Manual verification covers all UI/UX acceptance criteria.
- [ ] Edge cases are tested (empty input, maximum size, invalid format, network failure).
- [ ] No flaky tests (run test suite 3 times; results must be identical).
- [ ] Test coverage is documented (percentage is noted, not mandated).
- [ ] Bug list is compiled with severity (Critical / High / Medium / Low).
- [ ] No Critical or High bugs remain.
- [ ] Every acceptance criterion has a documented verification method in the test plan or traceability matrix.
- [ ] Human has performed manual verification.

---

## CHECKLIST: Acceptance

Run this before declaring a feature complete.

- [ ] Implementation matches the approved spec (no silent scope changes).
- [ ] Every acceptance criterion is verified with evidence (test output, screenshot, log).
- [ ] Design deviations are documented with justification.
- [ ] No critical technical debt introduced.
- [ ] Known technical debt is documented with priority.
- [ ] Documentation is updated (README, API docs, inline comments where non-obvious).
- [ ] Human has verified critical paths manually.
- [ ] Human makes explicit go / no-go decision (written down).

---

## CHECKLIST: Maintenance

Run this for every bug fix or small change.

- [ ] Change references an issue or spec update.
- [ ] Root cause is understood, not just symptom fixed.
- [ ] Fix is minimal (smallest change that resolves the issue).
- [ ] Tests are added or updated to prevent regression.
- [ ] Documentation is updated if behavior changed.
- [ ] Change log is updated.
- [ ] Human has reviewed the fix.
- [ ] Commit references the issue.

---

## CHECKLIST: Artifact Quality

Run this before approving any Nexus output document (spec, design, task, review, test plan, change log).

- [ ] **Accurate**: No vague qualifiers ("usually", "probably", "most"); named references are exact literals.
- [ ] **Accurate**: Assumptions are falsifiable; metrics have units and sources.
- [ ] **Complete**: Reader can derive what, why, who, when, where without asking questions.
- [ ] **Complete**: Boundaries (preconditions, postconditions) are explicit for every rule or process.
- [ ] **Complete**: No orphaned references; every cross-reference points to a specific section, file, or commit.
- [ ] **Simple**: One idea per paragraph; comparative data is in tables.
- [ ] **Simple**: No redundancy; no decorative language; artifact is under 800 lines.
- [ ] **Explicit**: Abbreviations expanded on first use; implicit assumptions are surfaced.
- [ ] **Explicit**: Every decision includes the constraint or requirement that drove it.
- [ ] **Explicit**: Error cases are described with the same detail as success paths.

Also run the template-specific Quality Checklist for the artifact type (see the template file).

---

## CHECKLIST: Context Loading

Run this at the start of every AI session.

- [ ] Current phase is stated.
- [ ] Spec reference is provided (path or pasted text).
- [ ] Design reference is provided (path or pasted text).
- [ ] Task is identified.
- [ ] Relevant existing code is pasted (types, interfaces, patterns).
- [ ] Hard constraints are stated explicitly.
- [ ] Single instruction for this session is the last item.
- [ ] Context fits within 1200 lines absolute maximum, ideally under 800 lines (or task is split).
