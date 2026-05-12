# Workflows

Nexus uses one canonical workflow:

## Discover → Specify → Design → Execute → Verify → Decide

This workflow is the default lifecycle for all work.

Each phase is a contract with:
- **Required Inputs**: what you must have before starting
- **Expected Outputs**: what you must produce to complete the phase
- **Validation Criteria**: how you verify the outputs are correct
- **Exit Conditions**: what must be true to proceed to the next phase
- **AI Role**: what AI does in this phase
- **Human Role**: what you must do
- **Common Pitfalls**: what usually goes wrong

Phases are sequential. You may return to an earlier phase if new information appears. You do not skip phases.

---

## 1. Discover

### Purpose
Understand the problem before defining the solution.

### Required Inputs
- User request or problem statement
- Existing product context (if any)

### Expected Outputs
- Clear problem framing
- Constraints and assumptions
- Unknowns
- Initial scope boundary

### Validation Criteria
- The problem is stated in plain terms.
- The scope is not vague.
- Major unknowns are visible.

### Exit Conditions
- The human confirms the problem is worth solving.
- The problem statement is narrow enough to specify.

### AI Role
- Ask clarifying questions
- Identify hidden assumptions
- Surface edge cases
- Summarize the problem precisely

### Human Role
- Confirm the real problem
- Decide what matters
- Reject scope creep

### Common Pitfalls
- **Solution-first thinking**: describing a solution before understanding the problem
- **Scope ambiguity**: "make it better" is not a problem statement

---

## 2. Specify

### Purpose
Convert the problem into a written spec.

### Feature Decomposition

If the problem contains multiple user-visible capabilities, decompose before writing specs.

**Step 1: List features**
A feature is one coherent user-visible capability (e.g., "user can log in with OAuth"). Implementation details are not features.

**Step 2: Map dependencies**
Which features require others to exist first?

**Step 3: Assign priorities**
- **P0**: Foundation / architecture. Blocked by everything else.
- **P1**: Core MVP value. The product is incomplete without it.
- **P2**: Enhancement. MVP works without it.
- **P3**: Nice to have. Defer.

**Step 4: Resolve ties**
1. Dependency first
2. Risk first (unknown tech goes first — fail fast)
3. Value density (higher user-value-per-effort comes first)

**Step 5: Draw the MVP boundary**
The MVP is the smallest set of features that delivers a complete user story. Be ruthless.

**Output**: `FEATURE_ROADMAP.md` (using `docs/templates/feature-roadmap.md`). Each feature gets its own `PRODUCT_SPEC.md` in subsequent Specify sessions.

**When to skip**: if the problem describes exactly one user-visible capability, skip decomposition and write a single spec.

### Required Inputs
- Approved problem framing
- Known constraints
- Relevant context

### Expected Outputs
- `PRODUCT_SPEC.md` (using `docs/templates/spec.md` or `docs/templates/spec-light.md`)
- Explicit non-goals
- Verifiable acceptance criteria
- Scope definition

### Validation Criteria
- Every acceptance criterion answers "how do we know this is done?"
- Non-goals explicitly state what is out of scope
- No acceptance criterion uses vague words ("good", "fast", "user-friendly")

### Exit Conditions
Run **CHECKLIST: Specify** from `docs/CHECKLISTS.md`.

Do not proceed to Design until:
- [ ] Spec has explicit scope and non-goals
- [ ] Every acceptance criterion is verifiable
- [ ] Human has stated explicit approval

### AI Role
- Structure the spec
- Fill in missing sections
- Make implicit assumptions explicit
- Suggest scope boundaries and non-goals

### Human Role
- Decide scope (what is in, what is out)
- Validate acceptance criteria
- Approve the spec

### Common Pitfalls
- **Scope creep during spec**: AI suggests features; human must reject them
- **Vague acceptance criteria**: "Should work well" is not a criterion
- **Missing non-goals**: what you are NOT building is as important as what you are building

### Light Workflow Variant

- **Template**: `docs/templates/spec-light.md`
- **Output**: one paragraph describing the problem, 2-3 bullet scope items, 2-3 verifiable acceptance criteria
- **Non-goals**: one sentence stating what is not being built
- **Exit**: human states approval verbally or in one sentence

---

## 3. Design

### Purpose
Turn the spec into an implementable plan.

### Required Inputs
- Approved `PRODUCT_SPEC.md`

### Expected Outputs
- `DESIGN_DOC.md` (using `docs/templates/design.md` or `docs/templates/design-light.md`)
- Interface contracts (types / API schemas / data models)
- Implementation task breakdown
- **Capability Assessment** (per `docs/CAPABILITY.md`): for each task, classify AI capability and define the human-AI division of labor

### Validation Criteria
- Every acceptance criterion maps to at least one design element
- Architecture choice is justified with at least two alternatives and tradeoffs
- Interface contracts are fully defined (no `any`, no placeholders)
- Task breakdown covers the full spec with no gaps
- No single task exceeds 2 hours of estimated work

### Exit Conditions
Run **CHECKLIST: Design** from `docs/CHECKLISTS.md`.

Do not proceed to Execute until:
- [ ] Design satisfies all acceptance criteria
- [ ] Interface contracts are defined
- [ ] Task breakdown covers the full spec
- [ ] Human has confirmed every interface contract is understood

### AI Role
- Propose architecture options with tradeoffs
- Design interface contracts
- Identify technical risks
- Break down implementation into tasks

### Human Role
- Choose architecture (AI proposes; human decides)
- Validate interface contracts
- Confirm task breakdown
- Approve the design

### Common Pitfalls
- **Over-designing**: design only what the spec requires
- **Vague interfaces**: types must be explicit

### Light Workflow Variant

- **Template**: `docs/templates/design-light.md`
- **Output**: one paragraph describing the approach + an interface sketch
- **No formal task breakdown** required
- **Exit**: human confirms the approach makes sense

---

## 4. Execute

### Purpose
Implement one bounded task at a time.

### Required Inputs
- Approved `DESIGN_DOC.md`
- Task breakdown

### Expected Outputs
- Working code
- Tests
- Commit history with conventional commits

### Validation Criteria
- Automated checks pass: type check, lint, static analysis, tests
- Code matches the approved design (or deviation is documented)
- Tests cover the relevant acceptance criteria
- Human can explain what every changed line does

### Exit Conditions
Run **CHECKLIST: Execute** from `docs/CHECKLISTS.md` per task.

Do not mark a task complete until:
- [ ] Code matches the design
- [ ] Tests cover the acceptance criteria for this task
- [ ] Human has traced the primary execution path and primary error path
- [ ] Commit is made with conventional commit message

### When AI Cannot Implement the Task

If the task triggers the Fallback Rule (see `docs/CAPABILITY.md` §The Fallback Rule):

1. Stop the AI implementation session.
2. Switch to human implementation.
3. Re-assess remaining tasks.
4. Use AI for sub-tasks only.

Document the fallback in task tracking.

### AI Role
- Implement one task at a time
- Write tests alongside code (not after)
- Explain deviations from design
- Flag when spec or design needs revision

### Human Role
- Assign tasks to AI sessions (one task per session ideally)
- Review generated code against design
- Run tests and verify manually
- Decide when to commit

### Common Pitfalls
- **Multiple tasks in one session**: context drifts. One task, one session, explicit context reload
- **Accepting code without reading it**: if you cannot explain what the code does, do not commit it
- **Tests as afterthought**: write tests with code, not after
- **Ignoring the Fallback Rule**: if AI fails twice on a task, it will not succeed on the third try

### Light Workflow Variant

- **No formal task template** required. One session, one change
- **Required Inputs**: approved spec + a one-sentence approach
- **Review standard**: "human has scanned the diff for obvious errors"
- **Automated checks** still mandatory
- **Snapshots**: optional. The commit message and diff are sufficient audit trail
- **Exit**: automated checks pass; human has scanned the diff; commit is clean

---

## 5. Verify

### Purpose
Confirm that the work is actually correct.

### Required Inputs
- Implemented code
- `PRODUCT_SPEC.md` acceptance criteria
- `DESIGN_DOC.md`

### Expected Outputs
- Test results (unit + integration)
- Manual verification records
- Bug list (if any)

### Validation Criteria
- All unit tests pass
- Integration tests pass for critical paths
- Manual verification covers UI/UX acceptance criteria
- Edge cases are tested (empty input, maximum size, invalid format, network failure)
- No flaky tests (run test suite 3 times; results must be identical)
- Every acceptance criterion has at least one verification method

### Exit Conditions
Run **CHECKLIST: Verify** from `docs/CHECKLISTS.md`.

Do not proceed to Decide until:
- [ ] All unit tests pass
- [ ] Integration tests pass for critical paths
- [ ] Manual verification covers UI/UX acceptance criteria
- [ ] No critical or high bugs remain

### AI Role
- Run automated tests
- Propose additional test cases for edge cases
- Help debug failing tests
- Verify acceptance criteria coverage

### Human Role
- Run the test suite
- Perform manual verification for UI/UX
- Validate that acceptance criteria are met
- Decide if bugs block acceptance

### Common Pitfalls
- **Testing only the happy path**: AI tends to test what works. Push for edge cases
- **Ignoring flaky tests**: a flaky test is worse than no test
- **Manual verification gaps**: if a feature has UI, someone must look at it

### Light Workflow Variant

- **No formal test plan template** required
- **Required**: existing test suite still passes
- **Required**: manual verification of the changed behavior
- **New tests**: only if the change introduces new logic
- **Exit**: existing tests pass + human has manually verified the change

---

## 6. Decide

### Purpose
Close the loop and record the decision.

### Required Inputs
- All test results
- `PRODUCT_SPEC.md`
- `DESIGN_DOC.md`

### Expected Outputs
- Acceptance decision
- Decision log entry
- Follow-up notes (if needed)

### Validation Criteria
- Implementation matches the approved spec (no silent scope changes)
- Every acceptance criterion is verified with evidence
- Design deviations are documented with justification
- No critical technical debt introduced
- Human has verified critical paths manually

### Exit Conditions
Run **CHECKLIST: Decide** from `docs/CHECKLISTS.md`.

Do not deploy until:
- [ ] Implementation matches the approved spec
- [ ] All acceptance criteria are verified
- [ ] No critical technical debt introduced
- [ ] Human makes explicit go decision

**Definition**: "Deploy" means **merge to the main branch**. Production release is a separate operational concern.

### AI Role
- Review the implementation against spec and design
- Identify deviations, gaps, or technical debt
- Summarize what was built vs. what was requested

### Human Role
- Read the verification results
- Verify critical paths manually
- Decide go or no-go
- If go, merge to main. If no-go, return to Execute.

### Common Pitfalls
- **Soft acceptance**: "it is probably fine" is not acceptance
- **Scope expansion at acceptance**: write new ideas down for the next cycle. Do not add them now

### Light Workflow Variant

- **No formal acceptance report** required for truly trivial changes
- **Written verdict** for anything touching business logic or user-visible behavior
- **Verbal "looks good"** permitted only for changes that affect zero business logic paths and zero user-visible behavior
- **Exit**: human states go / no-go

---

## Maintenance

Maintenance is not a phase in the main workflow. It is a continuous activity that uses Light Workflow or Hotfix Workflow.

### Required Inputs
- Production code
- User feedback or change requests

### Expected Outputs
- Updated documentation
- Change log entries
- Revised specs for new features

### Validation Criteria
- Change references an issue or spec update
- Root cause is understood, not just symptom fixed
- Fix is minimal
- Tests are added or updated to prevent regression

### AI Role
- Analyze bug reports and suggest root causes
- Propose minimal fixes
- Update documentation

### Human Role
- Triage bugs and feature requests
- Decide what to fix now vs. later
- Validate AI-proposed fixes

### Common Pitfalls
- **Hotfix without spec**: even a one-line fix should reference the issue
- **Documentation rot**: when code changes, docs must change
- **Debt accumulation**: address debt regularly

---

## Workflow Variants

### Full Workflow
Use for:
- New features
- Architecture changes
- High-risk tasks
- Anything with unclear scope

### Light Workflow
Use for:
- Small changes
- Bounded tasks
- Low-risk work
- Dependency updates

### Hotfix Workflow
Use for:
- Urgent minimal fixes
- Narrow scope
- Known issue, known remedy

The workflow variant is not a preference. It is a triage decision per `docs/protocols/triage.md`.
