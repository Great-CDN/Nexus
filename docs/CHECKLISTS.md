# Checklists

These checklists are the stop points defined in `docs/WORKFLOWS.md`. Do not proceed past a phase until the checklist is complete.

---

## CHECKLIST: Specify

Run this before approving a `PRODUCT_SPEC.md`.

- [ ] Problem statement is clear and one paragraph.
- [ ] Scope is bounded with specific inclusions.
- [ ] Non-goals are explicit and specific.
- [ ] Acceptance criteria are verifiable (each answers "how do we know this is done?").
- [ ] No acceptance criterion uses vague words or patterns ("good", "fast", "user-friendly", "robust", "should", "could", "may", "etc.", "and/or", "various", "some", "as appropriate").
- [ ] Assumptions are listed.
- [ ] Dependencies are identified.
- [ ] Open questions are listed and have owners.
- [ ] Spec is plain Markdown, readable without tools.
- [ ] If the initiative contains multiple user-visible capabilities, a `FEATURE_ROADMAP.md` exists using `docs/templates/feature-roadmap.md`, dependencies are acyclic, and the MVP boundary is drawn.
- [ ] Human has recorded explicit approval (verdict.md or task tracker); can restate every acceptance criterion without referencing the spec.

---

## CHECKLIST: Feature Roadmap

Run this before approving a `FEATURE_ROADMAP.md`.

- [ ] Every feature is a coherent user-visible capability, not an implementation detail.
- [ ] Dependency graph has no cycles.
- [ ] Every P0 and P1 feature has a corresponding spec planned or written.
- [ ] MVP boundary is defensible: a user can achieve the core goal with MVP features alone.
- [ ] No single execution phase exceeds 2 weeks of estimated implementation time.
- [ ] Human has recorded the priority order and MVP boundary in the roadmap file.

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
- [ ] Every task has a capability assessment (High / Medium / Low) and a defined human-AI division of labor.
- [ ] Human can articulate every interface contract in one sentence without referencing the document.
- [ ] All deviations from spec are documented with justification.

---

## CHECKLIST: Execute

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
- [ ] Human has traced the primary execution path and primary error path (limit: 200 lines or 30 minutes per review chunk, whichever comes first; if larger, review in chunks).
- [ ] Commit follows Conventional Commits format and references the task.

---

## CHECKLIST: Verify

Run this before proceeding to Decide.

- [ ] All unit tests pass.
- [ ] Integration tests pass for critical paths.
- [ ] Manual verification covers all UI/UX acceptance criteria.
- [ ] Edge cases are tested (empty input, maximum size, invalid format, network failure).
- [ ] No flaky tests in deterministic suites (run 3 times; results identical). For tests involving time, randomness, or external dependencies, document the stability strategy (e.g., mocked clocks, seeded RNG, stubbed network).
- [ ] Test coverage is documented (percentage is noted, not mandated).
- [ ] Bug list is compiled with severity (Critical / High / Medium / Low).
- [ ] No Critical or High bugs remain.
- [ ] Every acceptance criterion has a documented verification method in the test plan.
- [ ] Tests are independent of implementation: at least one test would fail if the implementation were replaced with a naive or incorrect version (verifies the test checks behavior, not code structure).
- [ ] Human has performed manual verification.

---

## CHECKLIST: Decide

Run this before declaring a feature complete.

- [ ] Implementation matches the approved spec (no silent scope changes).
- [ ] Every acceptance criterion is verified with evidence (test output, screenshot, log).
- [ ] Design deviations are documented with justification.
- [ ] No critical technical debt introduced (see `docs/protocols/definitions.md` §Critical Technical Debt).
- [ ] Known technical debt is documented with priority.
- [ ] Documentation is updated (README, API docs, inline comments where non-obvious).
- [ ] Human has verified critical paths manually.
- [ ] Human makes explicit go / no-go decision (written down).

---

## CHECKLIST: Maintenance

Run this for every bug fix or small change.

- [ ] Change references an issue or spec update.
- [ ] Root cause is documented with evidence (reproduction steps, log excerpts, code trace), not just symptom described.
- [ ] Fix is minimal (smallest change that resolves the issue).
- [ ] Tests are added or updated to prevent regression.
- [ ] Documentation is updated if behavior changed.
- [ ] Change log is updated.
- [ ] Human has verified the fix resolves the reported issue and traced the changed code paths.
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
- [ ] **Simple**: No redundancy; no decorative language; artifact is within its content-type line limit.
- [ ] **Explicit**: Abbreviations expanded on first use; implicit assumptions are surfaced.
- [ ] **Explicit**: Every decision includes the constraint or requirement that drove it.
- [ ] **Explicit**: Error cases are described with the same detail as success paths.
- [ ] **Coherent**: Redundancy test passed — removing any single paragraph loses meaning.
- [ ] **Coherent**: Transition test passed — every adjacent pair of paragraphs has an explicit logical relationship.
- [ ] **Coherent**: Sequence test passed — first sentences of all paragraphs form a complete reasoning chain.

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
- [ ] Context fits within the limit defined in `docs/protocols/threshold-classification.md` (or task is split).
