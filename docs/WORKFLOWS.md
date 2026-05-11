# Workflows

Nexus divides software engineering into six phases. Each phase is a **contract** with:

- **Required Inputs**: What you must have before starting.
- **Expected Outputs**: What you must produce to complete the phase.
- **Validation Criteria**: How you verify the outputs are correct.
- **Exit Conditions**: What must be true to proceed to the next phase.
- **AI Role**: What AI does in this phase.
- **Human Role**: What you must do.
- **Common Pitfalls**: What usually goes wrong.

Phases are sequential. You may return to an earlier phase if you discover new information, but you do not skip phases.

---

## Phase 1: Requirements

### Required Inputs
- Problem statement or user request.
- Existing product context (if any).

### Expected Outputs
- `PRODUCT_SPEC.md` (using `docs/templates/spec.md` or `docs/templates/spec-light.md`).
- Explicit non-goals.
- Verifiable acceptance criteria.

### Validation Criteria
- The spec answers: what problem, for whom, and why now?
- Scope is bounded by specific inclusions.
- Non-goals explicitly state what is out of scope.
- Every acceptance criterion answers "how do we know this is done?"
- No acceptance criterion uses vague words ("good", "fast", "user-friendly").

### Exit Conditions
Run **CHECKLIST: Requirements** from `docs/CHECKLISTS.md`.

Do not proceed to Design until:
- [ ] Spec has explicit scope and non-goals.
- [ ] Every acceptance criterion is verifiable.
- [ ] Human has read and approved the entire spec.

### AI Role
- Interview the human to clarify ambiguity.
- Identify hidden assumptions and edge cases.
- Suggest scope boundaries and non-goals.
- Structure the spec from raw requirements.

### Human Role
- Provide the problem statement.
- Decide scope (what is in, what is out).
- Validate acceptance criteria.
- Approve the spec.

### Common Pitfalls
- **Scope creep during spec**: AI suggests features; human must reject them.
- **Vague acceptance criteria**: "Should work well" is not a criterion. "Handles 1000 concurrent requests with <100ms latency" is.
- **Missing non-goals**: What you are NOT building is as important as what you are building.

---

## Phase 2: Design

### Required Inputs
- Approved `PRODUCT_SPEC.md`.

### Expected Outputs
- `DESIGN_DOC.md` (using `docs/templates/design.md` or `docs/templates/design-light.md`).
- Interface contracts (TypeScript types / API schemas / data models).
- Implementation task breakdown.

### Validation Criteria
- Every acceptance criterion from the spec maps to at least one design element.
- Architecture choice is justified with at least two alternatives and tradeoffs.
- Interface contracts are fully defined (no `any`, no placeholders).
- Task breakdown covers the full spec with no gaps.
- No single task exceeds 2 hours of estimated work.

### Exit Conditions
Run **CHECKLIST: Design** from `docs/CHECKLISTS.md`.

Do not proceed to Implementation until:
- [ ] Design satisfies all acceptance criteria.
- [ ] Interface contracts are defined.
- [ ] Task breakdown covers the full spec.
- [ ] Human has approved the design.

### AI Role
- Propose architecture options with tradeoffs.
- Design interface contracts.
- Identify technical risks.
- Break down implementation into tasks.

### Human Role
- Choose architecture (AI proposes; human decides).
- Validate interface contracts.
- Confirm task breakdown.
- Approve the design.

### Common Pitfalls
- **Over-designing**: Design only what the spec requires. Do not build for hypothetical future needs.
- **Ignoring constraints**: If the spec says "must work offline", the design must address it.
- **Vague interfaces**: Types must be explicit. No `any`, no "we will figure it out later".

---

## Phase 3: Implementation

### Required Inputs
- Approved `DESIGN_DOC.md`.
- Task breakdown.

### Expected Outputs
- Working code.
- Unit tests (for logic).
- Commit history with conventional commits.

### Validation Criteria
- Automated checks pass: type check, lint, static analysis, tests.
- Code matches the approved design (or deviation is documented).
- Code implements the relevant acceptance criteria.
- Tests cover the acceptance criteria for this task.
- Human can explain what every changed line does.

### Exit Conditions
Run **CHECKLIST: Implementation** from `docs/CHECKLISTS.md` per task.

Do not mark a task complete until:
- [ ] Code matches the design.
- [ ] Tests cover the acceptance criteria for this task.
- [ ] Human has reviewed and understood the code.
- [ ] Commit is made with conventional commit message.

### AI Role
- Implement one task at a time.
- Write tests alongside code (not after).
- Explain deviations from design.
- Flag when spec or design needs revision.

### Human Role
- Assign tasks to AI sessions (one task per session ideally).
- Review generated code against design.
- Run tests and verify manually.
- Decide when to commit.

### When AI Cannot Implement the Task

If the task is in the Red Zone (see `docs/CAPABILITY.md`) or AI fails twice with structurally incorrect output:

1. **Invoke the Fallback Rule.** Stop the AI implementation session.
2. **Switch to human implementation.** Write the code yourself.
3. **Re-assess remaining tasks.** If most tasks are Red Zone, the entire feature should be human-led with AI in a supporting role.
4. **Use AI for sub-tasks only.** After human writes the architecture, AI can implement individual functions, write tests, or generate documentation.

Document the fallback in the task tracking: "T2: Human implementation (AI failed twice on optimistic update hook)."

### Common Pitfalls
- **Multiple tasks in one session**: Context drifts. One task, one session, explicit context reload.
- **Accepting code without reading it**: If you cannot explain what the code does, do not commit it.
- **Tests as afterthought**: Write tests with code, not after. If it is hard to test, the design is wrong.
- **Skipping commits**: Commit after every task. Small commits are cheap; large rollbacks are expensive.
- **Ignoring the Fallback Rule**: If AI fails twice on a task, it will not succeed on the third try. Switch to human implementation.

---

## Phase 4: Testing

### Required Inputs
- Implemented code.
- `PRODUCT_SPEC.md` acceptance criteria.
- `DESIGN_DOC.md`.

### Expected Outputs
- Test results (unit + integration).
- Manual verification records.
- Bug list (if any).

### Validation Criteria
- All unit tests pass.
- Integration tests pass for critical paths.
- Manual verification covers all UI/UX acceptance criteria.
- Edge cases are tested (empty input, maximum size, invalid format, network failure).
- No flaky tests (run test suite 3 times; results must be identical).
- Every acceptance criterion has at least one verification method.

### Exit Conditions
Run **CHECKLIST: Testing** from `docs/CHECKLISTS.md`.

Do not proceed to Acceptance until:
- [ ] All unit tests pass.
- [ ] Integration tests pass for critical paths.
- [ ] Manual verification covers UI/UX acceptance criteria.
- [ ] No critical or high bugs remain.

### AI Role
- Run automated tests.
- Propose additional test cases for edge cases.
- Help debug failing tests.
- Verify acceptance criteria coverage.

### Human Role
- Run the test suite.
- Perform manual verification for UI/UX.
- Validate that acceptance criteria are met.
- Decide if bugs block acceptance.

### Common Pitfalls
- **Testing only the happy path**: AI tends to test what works. Push for edge cases.
- **Ignoring flaky tests**: A flaky test is worse than no test. Fix or delete it.
- **Manual verification gaps**: If a feature has UI, someone must look at it. Automated tests do not catch visual bugs.

---

## Phase 5: Acceptance

### Required Inputs
- All test results.
- `PRODUCT_SPEC.md`.
- `DESIGN_DOC.md`.

### Expected Outputs
- `ACCEPTANCE_REPORT.md` (using `docs/templates/review.md`).
- Go / No-Go decision.

### Validation Criteria
- Implementation matches the approved spec (no silent scope changes).
- Every acceptance criterion is verified with evidence (test output, screenshot, log).
- Design deviations are documented with justification.
- No critical technical debt introduced.
- Human has verified critical paths manually.

### Exit Conditions
Run **CHECKLIST: Acceptance** from `docs/CHECKLISTS.md`.

Do not deploy until:
- [ ] Implementation matches the approved spec.
- [ ] All acceptance criteria are verified.
- [ ] No critical technical debt introduced.
- [ ] Human makes explicit go decision.

### AI Role
- Review the implementation against spec and design.
- Identify deviations, gaps, or technical debt.
- Suggest fixes for any issues found.
- Summarize what was built vs. what was requested.

### Human Role
- Read the acceptance report.
- Verify critical paths manually.
- Decide go or no-go.
- If go, merge to main. If no-go, return to Implementation.

### Common Pitfalls
- **Soft acceptance**: "It is probably fine" is not acceptance. Verify each criterion explicitly.
- **Scope expansion at acceptance**: If you think of a new feature, write it down for the next cycle. Do not add it now.
- **Ignoring technical debt**: Note all debt. Decide if it is blocking. Do not pretend it does not exist.

---

## Phase 6: Maintenance

### Required Inputs
- Production code.
- User feedback or change requests.
- `PRODUCT_SPEC.md` and `DESIGN_DOC.md`.

### Expected Outputs
- Updated documentation.
- Change log entries.
- Revised specs for new features.

### Validation Criteria
- Change references an issue or spec update.
- Root cause is understood, not just symptom fixed.
- Fix is minimal (smallest change that resolves the issue).
- Tests are added or updated to prevent regression.
- Documentation is updated if behavior changed.

### Exit Conditions
Run **CHECKLIST: Maintenance** from `docs/CHECKLISTS.md` per change.

### AI Role
- Analyze bug reports and suggest root causes.
- Propose minimal fixes.
- Update documentation to reflect reality.
- Help prioritize technical debt.

### Human Role
- Triage bugs and feature requests.
- Decide what to fix now vs. later.
- Validate AI-proposed fixes.
- Update the spec and design when reality diverges.

### Common Pitfalls
- **Hotfix without spec**: Even a one-line fix should reference the issue and be reviewed.
- **Documentation rot**: When code changes, docs must change. AI can help, but human must verify.
- **Debt accumulation**: Address debt regularly. Do not let it compound.
