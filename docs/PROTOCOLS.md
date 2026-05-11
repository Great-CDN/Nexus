# Protocols

Protocols define how humans and AI communicate within Nexus. They are rules, not suggestions. Violating a protocol means the output is invalid until corrected.

---

## Spec Format Protocol

Every `PRODUCT_SPEC.md` must use `docs/templates/spec.md` and include these mandatory sections. A spec without all sections is incomplete.

### Mandatory Sections

1. **Problem** — What problem are we solving? One paragraph.
2. **Scope** — What is in scope? Bullet list, bounded.
3. **Non-Goals** — What is explicitly out of scope? This prevents creep.
4. **Acceptance Criteria** — Verifiable conditions. Each must answer: how do we know this is done? Use the format: "Given X, when Y, then Z" or "Metric M satisfies condition C".
5. **Assumptions** — What do we assume to be true? (e.g., "User is authenticated", "API v2 is available").
6. **Dependencies** — What must exist before this can be built?
7. **Open Questions** — What do we not know yet? Must be resolved before Design phase.

### Spec Rules

- **One spec per feature**. Do not bundle unrelated features.
- **Spec changes must be explicit**. If reality demands change during Implementation, revise the spec with a new version, re-approve it, and only then update the code. Do not silently deviate from the approved spec.
- **Specs are plain Markdown**. No diagrams required, but ASCII or linked diagrams are allowed.
- **Acceptance criteria are the contract**. Code is done when all criteria are met, not when it "feels done".

---

## Context Packaging Protocol

Every AI session must start with explicit context. Do not assume AI remembers anything from previous sessions.

### Context Package Structure

When starting a session for a task, provide:

1. **Current Phase** — Which workflow phase are you in?
2. **Spec Reference** — Path to `PRODUCT_SPEC.md` or paste relevant sections.
3. **Design Reference** — Path to `DESIGN_DOC.md` or paste relevant sections.
4. **Task Reference** — Which task from the design breakdown?
5. **Code Context** — Relevant existing code (paste, do not summarize). Include:
   - Interfaces/types the new code must conform to.
   - Existing functions that will be called.
   - Test patterns used in this codebase.
6. **Constraints** — Any hard constraints not in the spec (e.g., "must support IE11", "bundle size < 100KB").
7. **What to Do** — One clear instruction for this session.

### Context Loading Rules

- **Paste, do not reference by name**. Saying "use the same pattern as UserService" is insufficient. Paste the relevant code.
- **Keep it under 800 lines ideally, 1200 lines absolutely**. If context exceeds 800 lines, you are in the warning zone — the task should probably be split. If it exceeds 1200 lines, it must be split. These numbers are heuristics based on typical token density, not hard limits.
- **Repeat critical constraints**. If a constraint matters, state it explicitly even if it is in the spec.
- **End context with the instruction**. The last thing AI reads should be what to do.

### Example Context Package

```
Phase: Implementation
Task: Implement the domain validation logic in DomainService

Spec (relevant section):
- AC-3: Domain names must be validated against RFC 1035.
- AC-4: Invalid domains must return error code 400 with message "Invalid domain format".

Design (relevant section):
- DomainValidator.validate(name: string): Result<Domain, ValidationError>
- Use the Result type from src/types/index.ts

Existing code:
[paste Result type definition]
[paste existing validator pattern]

Constraints:
- No external libraries for validation. Regex only.
- Must handle internationalized domain names (punycode).

What to do:
Implement DomainValidator.validate() with full test coverage.
```

---

## Prompt Protocol

Prompts are structured inputs derived from specs, not creative writing.

### Prompt Rules

1. **No open-ended generation**. "Build a login page" is forbidden. "Implement LoginPage.tsx per DESIGN_DOC.md section 3.2 using the AuthContext pattern" is required.
2. **Include constraints in every prompt**. Do not assume AI remembers constraints from context.
3. **Request one artifact per prompt**. One function, one component, one test file.
4. **Specify output format**. "Return only the code, no explanation" or "Return the code plus a 3-sentence summary of the changes".
5. **No "improve this" prompts**. Improvement is vague. Specify the metric: "reduce cyclomatic complexity below 10" or "extract the fetch logic into a reusable hook".

### Prohibited Prompt Patterns

- "Can you..." — This is a question, not an instruction. Use imperatives.
- "Make it better" — Undefined. Specify what "better" means.
- "Like X but for Y" — Too vague. Provide the spec.
- "Just do it" — No context. Always load context first.

---

## Review Protocol

Every AI-generated artifact must be reviewed before acceptance.

### Automated Review (Mandatory First Step)

Before human review, run automated checks. These catch what humans miss and what humans are slow at.

**Required checks:**
1. **Type check** — `tsc --noEmit` (or equivalent). Zero type errors.
2. **Lint** — ESLint / Prettier / biome. Zero errors, warnings reviewed.
3. **Static analysis** — Security scan (e.g., Semgrep, CodeQL) for injection, XSS, secrets.
4. **Tests** — Unit and integration tests for the changed code. All pass.

**Optional but recommended:**
- Dependency audit (`npm audit`, `pip-audit`)
- Bundle size check (if applicable)

**Rule**: Automated checks must pass before human review begins. Human time is expensive; do not waste it on problems a machine can find.

### Human Review Checklist

After automated checks pass, human review focuses on what machines cannot judge:

1. **Spec Alignment** — Does this code implement the spec, or something else?
2. **Design Alignment** — Does it match the approved design? If not, is the deviation justified and documented?
3. **Business Logic Correctness** — Does it actually solve the problem? Trace through the logic for edge cases.
4. **Test Quality** — Do tests cover the acceptance criteria, or just the happy path?
5. **No Unnecessary Changes** — Does the change only touch what the task requires?
6. **Maintainability** — Will this code be understandable in 6 months? Is the complexity justified?
7. **Readability** — Can you understand this code in 30 seconds? If not, ask AI to simplify.

### Design Review Checklist

For every design document:

1. **Completeness** — Does it address every acceptance criterion?
2. **Feasibility** — Can this be built with available tools and time?
3. **Interface Clarity** — Are all inputs, outputs, and errors defined?
4. **Risk Identification** — What could go wrong? Is there a mitigation?
5. **Scope Discipline** — Does the design stay within the spec's scope?

### Review Output

Reviews must produce a written verdict:
- **Approve**: No issues.
- **Approve with notes**: Minor issues, fix inline.
- **Request changes**: Block until fixed. List every issue explicitly.

---

## Memory Protocol

Memory stores information that should persist across sessions and conversations. It is not a replacement for specs or design docs.

### What to Save

Save to `.claude/memory/` when:
- You learn something about the user's preferences that affects future work.
- You discover a project-level constraint not in the spec.
- You establish a pattern that should be reused.

### What NOT to Save

Do not save:
- Code patterns (derive from code).
- File paths (derive from file system).
- Git history (use `git log`).
- Temporary task state.
- Anything already in a spec or design doc.

### Memory Format

Use the standard memory frontmatter format:

```markdown
---
name: {{short name}}
description: {{one-line description}}
type: {{user | feedback | project | reference}}
---

{{content}}
```

### Memory Maintenance

- Review memory monthly. Delete stale entries.
- If memory contradicts a spec, the spec wins. Update memory.
- Memory is a hint, not a rule. Always verify against current state.
- **Atomic writes**: Each memory entry is one file. Do not append to a shared file. If two sessions write simultaneously, the last write wins. Use descriptive filenames to avoid collisions (e.g., `user_prefers_tabs.md` not `memory_01.md`).

---

## Definitions

Shared terms used across Nexus documents.

### Severity Levels

Used in reviews, bug tracking, and risk assessment:

| Level | Definition | Example |
|-------|-----------|---------|
| **Critical** | Blocks acceptance or deployment. No workaround. | Security vulnerability, data loss bug |
| **High** | Significant risk or effort required. Has workaround but painful. | Performance regression, missing error handling |
| **Medium** | Noticeable issue, manageable workaround. | UI inconsistency, unclear error message |
| **Low** | Cosmetic, negligible impact, or preference. | Typo, formatting inconsistency |

### Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/<short-name>` | `feature/rule-editor` |
| Exploration | `exploration/<YYYY-MM-DD>-<topic>` | `exploration/2026-05-11-dnd-kit` |
| Hotfix | `hotfix/<issue-id-or-description>` | `hotfix/auth-token-leak` |

---

## Commit Protocol

Git history is the audit trail. It must be readable and meaningful.

### Conventional Commits

Use the Conventional Commits format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature.
- `fix`: Bug fix.
- `docs`: Documentation only.
- `style`: Formatting, missing semicolons, etc. (no code change).
- `refactor`: Code change that neither fixes a bug nor adds a feature.
- `test`: Adding or correcting tests.
- `chore`: Build process, dependencies, etc.

### Commit Rules

1. **One task, one commit**. Do not bundle unrelated changes.
2. **Commit message explains why, not what**. The diff shows what; the message explains why.
3. **Reference the spec**. If a commit implements AC-3, mention it: `feat(auth): implement password reset (AC-3)`.
4. **No WIP commits in main**. Feature branches can have WIP commits, but squash or clean before merge.
5. **Commit after every task**. Small commits are cheap. Large rollbacks are expensive.

---

## Session Protocol

How to structure an AI-assisted work session.

### Session Start

1. Load explicit context package per the Context Packaging Protocol above.
2. State the single task for this session.
3. Confirm AI understands the task before proceeding.

Do not repeat the context packaging rules here — they are defined in the Context Packaging Protocol.

### Session During

1. AI generates one artifact.
2. Human reviews against checklist.
3. If changes needed, human provides specific feedback, not "fix it".
4. Repeat until artifact passes review.

### Session End

1. Human commits the change.
2. Update task tracking (mark task complete).
3. If scope discovered to be wrong, note it for spec revision — do not change course mid-session.

### Session Length

- **Target: 30–60 minutes**. Longer sessions accumulate drift.
- **Maximum: 2 hours**. If a task takes longer, the task was too large. Split it.
- **One session = one task**. Do not start a new task in the same session without reloading context.

---

## Triage Protocol

Not every change needs the full 6-phase workflow. Use this protocol to decide which intensity level applies.

### Levels

#### Full Workflow

Use for: new features, major refactors, architectural changes.

All 6 phases. All checklists. All snapshots.

#### Light Workflow

Use for: small enhancements, UI tweaks, adding a field to a form, routine dependency updates.

- **Requirements**: Use `docs/templates/spec-light.md`. One paragraph, 2-3 ACs maximum.
- **Design**: Use `docs/templates/design-light.md`. One paragraph approach + interface sketch.
- **Implementation**: One task, one session. No formal task template needed.
- **Testing**: Manual verification + existing test suite still passes.
- **Acceptance**: Quick verbal "looks good" is acceptable for truly trivial changes; written verdict for anything touching business logic.
- **Snapshots**: Optional for implementation. Diff in commit message is sufficient.

#### Hotfix

Use for: production bugs, security patches, critical broken functionality.

- **Requirements**: Bug report is the requirement. No spec template.
- **Design**: Skip if the fix is obvious; one-sentence design if not.
- **Implementation**: One task, one session. Get in, fix, get out.
- **Testing**: Reproduce the bug, apply fix, verify fix, check for regressions. Run the full test suite if possible.
- **Acceptance**: Verify the bug is fixed; verify no regressions.
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
- **Skipping Testing on Light**: Even light workflow requires verification. The only thing that shrinks is documentation, not validation.
- **Snapshots for trivial changes**: If a change is one line and obviously correct, a snapshot is bureaucracy. The commit message is the audit trail.

---

## Artifact Quality Standard

All Nexus output documents — specs, designs, tasks, reviews, test plans, change logs — must satisfy four quality dimensions. These are not aesthetic preferences; they are functional requirements that reduce error propagation between human and AI.

### 1. Accurate（准确）

Every statement in the document must be **verifiably true** within the project's context at the time of writing.

- **No ambiguous qualifiers.** "Usually", "probably", "might" are forbidden unless paired with a probability or condition. "Most requests" is vague; "Requests under 10KB" is accurate.
- **Named references are precise.** File paths, function names, API endpoints, and version numbers must be exact literal values. "The auth module" is inaccurate; `src/auth/AuthService.ts` is accurate.
- **Assumptions are grounded.** Every assumption must state what would falsify it. "Assumes Redis is available" is weak; "Assumes Redis 7.x on localhost:6379; if false, falls back to in-memory cache per DESIGN_DOC.md §3.2" is accurate.
- **Metrics have units.** "Fast" is inaccurate. "< 100ms p95 latency under 1000 concurrent connections" is accurate.

### 2. Complete（完整）

The document must contain everything a competent reader needs to act on it without seeking clarification.

- **Answer the five Ws implicitly.** What, Why, Who, When, and Where must be derivable from the text. If a reader must ask "what happens if X?", the document is incomplete.
- **Boundary conditions are explicit.** Every rule, function, or process must state its preconditions and postconditions. What must be true before this runs? What is guaranteed after?
- **Rejected alternatives are recorded.** For every decision, at least one rejected alternative and the reason for rejection must be documented. This prevents revisiting the same debate.
- **No orphaned references.** Every cross-reference points to a specific section, file, or commit hash. "See the auth docs" is incomplete; "See `docs/auth.md` §Token Rotation" is complete.
- **Open questions have owners and deadlines.** An unresolved question without an owner is an invisible risk.

### 3. Simple（简单）

The document must be as short as possible without sacrificing completeness. Complexity is information entropy; entropy breeds error.

- **One idea per paragraph.** If a paragraph contains multiple decisions, split it.
- **Tables over paragraphs.** Comparative data (tradeoffs, options, test cases) belongs in tables. Tables compress information and reduce parsing ambiguity.
- **No redundant restatements.** Do not repeat what is already in the spec in the design, or what is in the design in the task. Reference; do not duplicate.
- **Line limits.** Specs and designs must not exceed 800 lines. If they do, the scope is too large and must be split. This aligns with the Small Context rule.
- **No decorative language.** "Elegantly handles", "seamlessly integrates", "robustly manages" add zero information. Remove them.

### 4. Explicit（显式）

"Elegant" is subjective and unenforceable. Its functional equivalent in documentation is **explicit** — nothing is left for the reader to infer.

- **Every abbreviation is expanded on first use.** Even obvious ones like "API" or "UI" must be defined if the document is intended for a broad audience.
- **Implicit assumptions are surfaced.** If the writer assumes the reader knows the codebase structure, that assumption must be written down.
- **Every decision has a reason.** "Use React" is explicit; "Use React (team has 5 years collective experience; migration cost of Vue is unacceptable)" is explicit with reasoning.
- **Every number has a source.** "Supports 10,000 users" must state whether this is tested, estimated, or required.
- **Error cases are first-class.** Do not describe the happy path and append "errors are handled gracefully." Describe the error path with the same detail as the success path.

### Quality Checklist (Universal)

Before any artifact is marked complete, run this checklist:

- [ ] **Accurate**: No vague qualifiers; named references are exact; assumptions are falsifiable; metrics have units.
- [ ] **Complete**: Five Ws derivable; boundaries stated; alternatives recorded; no orphaned references; open questions owned.
- [ ] **Simple**: One idea per paragraph; tables for comparisons; no redundancy; under 800 lines; no decorative language.
- [ ] **Explicit**: Abbreviations expanded; assumptions surfaced; decisions justified; numbers sourced; errors described in full.

If any item fails, the artifact is incomplete. Revise and re-check.
