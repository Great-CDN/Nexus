# Protocols

Protocols define how humans and AI communicate within Nexus. They are rules, not suggestions. Violating a protocol means the output is invalid until corrected.

---

## Rule Priority

Nexus documents have a strict precedence order. When two documents conflict, the higher-priority document wins.

| Priority | Source | Role | Can Override |
|----------|--------|------|--------------|
| 1 | `CLAUDE.md` §Critical Rules (Absolute) | Hard constraints for AI behavior | Everything |
| 2 | `PROTOCOLS.md` | Binding operational rules | Templates, examples, checklists |
| 3 | `PHILOSOPHY.md` | Principles and reasoning | Nothing; explains *why* rules exist |
| 4 | `WORKFLOWS.md` | Phase definitions and flow | Nothing; operationalizes protocols |
| 5 | `CHECKLISTS.md` | Verification steps | Nothing; checks compliance with rules above |
| 6 | `docs/templates/` | Format templates | Nothing; defines artifact structure only |
| 7 | `docs/WORKED_EXAMPLE.md` | Illustrative walkthrough | Nothing; example, not normative |
| 8 | `docs/reviews/` | Historical cross-validation reports | Nothing; snapshots in time, not living rules |

**Conflict resolution**: If `PHILOSOPHY.md` and `PROTOCOLS.md` say different things, `PROTOCOLS.md` wins. If a template contradicts a protocol, the protocol wins. If a worked example contradicts a rule, the rule wins.

**Template conflicts**: Priority 6 covers any file inside `docs/templates/`. If two templates conflict (e.g., `spec.md` vs. `spec-light.md`), the Triage Protocol decision (Full vs. Light Workflow) determines which applies. Neither template can override a protocol.

**Examples of invalid overrides**:
- A template cannot relax the "no vague acceptance criteria" rule.
- A worked example cannot justify skipping a required checklist.
- Philosophy cannot override a hard protocol (e.g., "Explicit Context > Implicit Memory" is philosophy; the 1200-line context limit in the Context Packaging Protocol is the binding rule).

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

- **One spec per feature**. Do not bundle unrelated features. A single spec may span multiple implementation tasks; the boundary is "one coherent user-visible capability," not "one session."
- **Specs are plain Markdown**. No diagrams required, but ASCII or linked diagrams are allowed.
  - If using ASCII diagrams, keep them compact. If a diagram exceeds 20 lines, link an external file (e.g., `docs/diagrams/`) rather than embedding it, to stay within the 800-line mixed-content limit.
- **Acceptance criteria are the contract**. Code is done when all criteria are met, not when it "feels done".

### Spec Versioning

Specs evolve. Version management prevents "which spec am I building against?" confusion.

**Version rules**:
- **v1.0** — Initial spec at Design phase start.
- **v1.1, v1.2** — Minor revisions (clarifications, typo fixes, additional examples) that do not change scope or acceptance criteria meaning.
- **v2.0** — Major revision: scope changes, new acceptance criteria, removed non-goals, or altered assumptions. Any in-progress implementation tasks must be re-evaluated against the new version.

**When to create a new version**:
- Before Design phase starts: spec is v1.0.
- During Design: if the spec needs revision to make design possible, bump to v1.1.
- After Design is approved: do not revise the spec without creating a new version. The approved design was built against a specific spec version.
- During Implementation: if new information requires spec changes, create a new version, re-approve the spec, and evaluate whether ongoing tasks need rework.

**Anchoring implementation tasks**: Snapshots copy the spec, not link it. A task snapshot always contains `spec-vX.Y.md` — the exact version the task was built against. This makes version drift visible, not hidden.

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
- **Keep it under 800 lines ideally, 1200 lines absolutely**. If context exceeds 800 lines, you are in the warning zone — the task should probably be split. If it exceeds 1200 lines, it must be split. These numbers are heuristics based on typical token density, not hard limits. For a rough token estimate, run `node tools/count-tokens.js <file>`.
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
   - Exception: If a single artifact is expected to exceed the model's output token limit (e.g., a large component with embedded styles and logic), split it into multiple prompts and combine manually.
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

**Fallback**: If a required automated check is not available for the project (e.g., no security scanner set up, no test framework configured), document the gap in the repository README and manually verify that check's concern during human review. The goal is to have all checks operational before the next review cycle. Do not let missing tooling block all reviews indefinitely.

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
- You identify a **systematic AI weakness** that recurs across tasks (see Known AI Weaknesses below).

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

### Known AI Weaknesses

In addition to user preferences and project constraints, track **systematic failure patterns** observed in AI-generated output for this project. These are not one-off mistakes — they are recurring blind spots that will repeat unless explicitly guarded against.

**When to record**:
- The same category of error appears in **two or more tasks**.
- Cross-validation reveals a consistent blind spot across multiple models.

**Format** (extends the standard memory frontmatter):

```markdown
---
name: {{short description of weakness}}
description: {{one-line summary}}
type: ai-weakness
first-observed: {{YYYY-MM-DD}}
tasks-affected: {{task IDs or count}}
status: active | resolved
---

**Pattern**: What does AI systematically get wrong?

**Example**: Paste a minimal example of the error.

**Detection**: How do you verify this weakness is not present in new output?

**Mitigation**: What constraint or reminder prevents it?
```

**Usage**:
- Include the active weaknesses list in every context package under **Constraints**.
- When a weakness has not been observed for 5 consecutive tasks, mark it `resolved` but keep the file for reference.
- If a resolved weakness reappears, reactivate it and reset the counter.

### Memory Maintenance

- Review memory monthly. Delete stale entries.
- If memory contradicts a spec, the spec wins. Update memory.
- Memory is a hint, not a rule. Always verify against current state.
- **Atomic writes**: Each memory entry is one file. Do not append to a shared file.
  - Write to a temporary file, then rename to the final filename. This prevents corruption from partial writes if a session crashes mid-write.
  - If two sessions write simultaneously, the last write wins. Use descriptive filenames to avoid collisions (e.g., `user_prefers_tabs.md` not `memory_01.md`).
  - For team environments where multiple humans may write concurrently, consider using a lock file (`.claude/memory/.lock`) to serialize writes. If a lock is not feasible, accept the risk and verify memory files for completeness on read.

---

## Definitions

Shared terms used across Nexus documents.

### Severity Levels

Used in reviews, bug tracking, and risk assessment:

| Level | Definition | Example | Justification Required |
|-------|-----------|---------|----------------------|
| **Critical** | Blocks acceptance or deployment. No workaround. | Security vulnerability, data loss bug | Why it blocks; what is the impact if shipped |
| **High** | Significant risk or effort required. Has workaround but painful. | Performance regression, missing error handling | Why the risk is significant; what is the workaround |
| **Medium** | Noticeable issue, manageable workaround. | UI inconsistency, unclear error message | Why it is noticeable; what is the workaround |
| **Low** | Cosmetic, negligible impact, or preference. | Typo, formatting inconsistency | Brief note on why it is low |

Every severity assignment must include the justification described in the Justification Required column. A severity without justification is incomplete.

### Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/<short-name>` | `feature/rule-editor` |
| Fix | `fix/<scope>-<description>` | `fix/auth-cache-key` |
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
   - A "task" is defined by the spec or task reference. If a single session covers multiple logically separate changes (different acceptance criteria), split into multiple commits.
   - Light Workflow exception: A single commit is acceptable if all changes are trivial, related to the same UI surface or API endpoint, and documented in the commit message body.
2. **Commit message explains why, not what**. The diff shows what; the message explains why.
3. **Reference the spec**. If a commit implements AC-3, mention it: `feat(auth): implement password reset (AC-3)`.
4. **No WIP commits in main**. Feature branches can have WIP commits, but squash or clean before merge.
5. **Commit after every task**. Small commits are cheap. Large rollbacks are expensive.

### Signed Commits (Recommended)

Git history is the audit trail. Unsigned commits can be forged. For Acceptance-phase merges to `main`, use GPG or SSH commit signing.

```bash
# Enable SSH signing (simpler than GPG)
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global gpg.format ssh
git config --global commit.gpgsign true
```

This is optional for feature branches and Light Workflow changes, but mandatory for anything that touches security-critical code.

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

### Session Interruption

Sessions do not always complete normally. Define the abort path:

1. **Human must leave mid-session**: Save the current AI output (even if incomplete) to a scratch file. Note the stopping point in the task tracker. Resume from that point in a new session with a fresh context reload — do not attempt to continue from conversation memory.
2. **Connection drops or tool failure**: If an AI tool call fails (network error, API timeout), do not retry blindly. Verify the last successful state from git or the snapshot, then resume from there.
3. **Power failure or crash**: This is why frequent commits matter. The maximum uncommitted work at risk is one task. After recovery, check git status, review the diff, and decide whether to continue or restart.
4. **API hard limit reached**: Context window exceeded, quota/billing exhausted, session time limit hit (e.g., 5-hour limit), or authentication failure. Stop immediately. Do not retry. Follow the Session Recovery Protocol below.

### API Failure Classification

When an AI API call fails, classify before acting:

| Error Type | Examples | Action |
|------------|----------|--------|
| **Transient** | Network timeout, 5xx server error, rate limit (429) | Retry with exponential backoff: 1s, 2s, 4s. Max 3 attempts. If all fail, treat as session interruption. |
| **Hard limit** | Context window exceeded, quota/billing exhausted, session time limit, auth failure | Do not retry. Stop immediately. Follow Session Recovery Protocol. |
| **Client error** | Invalid prompt format, malformed tool call | Fix the input and retry once. If it fails again, treat as session interruption. |

**Never retry a hard limit error.** Retrying a context-window exceedance or an expired session wastes tokens and time. Hard limits require a fresh session.

### Session Recovery Protocol

When any interruption terminates a session abnormally, use this protocol to resume without losing state:

1. **Preserve uncommitted output**: Save any AI-generated but uncommitted work to `.claude/scratch/YYYY-MM-DD-HHMM-<task>.md`.
2. **Record the breakpoint**: In the task tracker or a scratch note, record:
   - Task name and spec version
   - Last completed step
   - File being edited and approximate line/section
   - What was about to happen next
3. **Commit completed work**: If any portion of the task was finished before the interruption, commit it now with a note: `wip: partial <task> before session interruption`.
4. **Start a recovery session**: Reload context per the Context Packaging Protocol. The context package must include:
   - Original spec and design references
   - Breakpoint note
   - Scratch file content (paste it)
   - Git status / diff since last commit
5. **Resume from breakpoint**: Continue from where the interruption occurred. Do not regenerate already-completed work. Verify the current file state matches expectations before proceeding.

### Session Length

- **Target: 30–60 minutes**. Longer sessions accumulate drift.
- **Maximum: 2 hours**. If a task takes longer, the task was too large. Split it.
- **One session = one task**. A session may include multiple iterations of review and fixes, but must be centered on a single task. Do not start a new task in the same session without reloading context. If a task requires more than one session, explicitly split it into subtasks, each with its own session and context reload.

---

## Threshold Classification

Nexus uses numeric thresholds across multiple documents. Not all thresholds have the same force. They are classified into three tiers:

| Tier | Meaning | Violation Consequence | Examples |
|------|---------|----------------------|----------|
| **Hard Limit** | Must not exceed. These are physical or process boundaries. | Process is invalid; split the task immediately. | 1200 lines mixed content (context hard ceiling); 2 hours max per task; 2 hours max per session; no Critical/High bugs at acceptance |
| **Soft Limit** | Warning zone. Exceeding requires explicit justification. | Elevated risk; document why the exception is safe. | 800 lines mixed content (context warning); 30–60 min session target; 150 lines module contract; 200 lines or 30 min per review chunk |
| **Heuristic** | Rough guidance for estimation. Highly context-dependent. | None; adjust to your project and team. | 200–400 lines/hour human review rate; phase dwell time targets (10–30 min Requirements, etc.); 100–200 lines system architecture doc; ~2000 lines pure prose |

**Why lines instead of tokens?** Lines are a fast, tool-free proxy. Token density varies by language and format. When precision matters, use `node tools/count-tokens.js <file>`. See `docs/SCALE.md` for the token-density rationale.

**How to use this table**: If you are near a Soft Limit, consider splitting. If you hit a Hard Limit, you must split. Heuristics are for planning, not enforcement.

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
  - Review standard: "Human has scanned the diff for obvious errors" (vs. full execution-path trace for Full Workflow).
  - Automated checks (type check, lint, tests) still mandatory.
- **Testing**: Manual verification + existing test suite still passes.
- **Acceptance**: Written verdict for anything touching business logic or user-visible behavior; verbal "looks good" permitted only for changes that affect zero business logic paths and zero user-visible behavior (e.g., CSS color tweak, comment correction). When in doubt, use a written verdict.
- **Snapshots**: Optional for implementation. Diff in commit message is sufficient.

#### Hotfix

Use for: production bugs, security patches, critical broken functionality.

- **Requirements**: Bug report is the requirement. Minimum contents: (1) exact reproduction steps, (2) expected vs. actual behavior, (3) affected scope / users, (4) regression risks. No formal spec template required for trivial fixes; use `docs/templates/spec-light.md` if the fix touches non-obvious logic.
- **Design**: Skip if the fix is obvious; one-sentence design if not.
- **Implementation**: One task, one session (max 2 hours). If the hotfix exceeds this, split into logical subtasks (e.g., fix + validation) with separate sessions, and document the split in the change log.
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
- **Skipping Testing on Light Workflow**: Even Light Workflow requires verification. The only thing that shrinks is documentation, not validation.
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
- **Line limits by content type.**
  - **Mixed-content artifacts** (code + prose combined): must not exceed 800 lines.
  - **Pure prose documents** (specs, designs with no embedded code): may reach ~2000 lines because prose has lower token density.
  - If a mixed-content artifact exceeds 800 lines, or a pure prose document exceeds ~2000 lines, the scope is too large and must be split. See `docs/SCALE.md` for the full context-window rationale.
- **No decorative language.** "Elegantly handles", "seamlessly integrates", "robustly manages" add zero information. Remove them.

### 4. Explicit（显式）

"Elegant" is subjective and unenforceable. Its functional equivalent in documentation is **explicit** — nothing is left for the reader to infer.

- **Every abbreviation is expanded on first use.** Even obvious ones like "API" or "UI" must be defined if the document is intended for a broad audience.
- **Implicit assumptions are surfaced.** If the writer assumes the reader knows the codebase structure, that assumption must be written down.
- **Every decision has a reason.** "Use React" is explicit; "Use React (team has 5 years collective experience; migration cost of Vue is unacceptable)" is explicit with reasoning.
- **Every number has a source.** "Supports 10,000 users" must state whether this is tested, estimated, or required.
- **Error cases are first-class.** Do not describe the happy path and append "errors are handled gracefully." Describe the error path with the same detail as the success path.

### 5. Coherent（连贯）

The document must flow logically. A reader should never wonder "why am I reading this now?" or "how did we get here?"

- **One arc per document.** Every section serves the document's single purpose. If a section does not advance the reader's understanding of that purpose, remove it.
- **Natural transitions.** The relationship between adjacent sections must be obvious. Use forward references sparingly and only when necessary.
- **No logical gaps.** Do not jump from problem to solution without showing the reasoning chain. Do not list options without explaining how they were evaluated.

**Operational verification** (apply these tests before marking the artifact complete):

- **Redundancy test**: Remove any single paragraph. Does the document's purpose remain fully expressible? If yes, the paragraph is redundant — delete it or merge it.
- **Transition test**: Read the last sentence of paragraph N and the first sentence of paragraph N+1. Is the logical relationship explicit (cause, contrast, elaboration, example)? If not, add a transitional sentence.
- **Sequence test**: Extract the first sentence of every paragraph into a numbered list. Read the list in order. Does it form a complete reasoning chain from premise to conclusion? If not, reorder paragraphs or add bridging content.

### Quality Checklist (Universal)

Before any artifact is marked complete, run this checklist:

- [ ] **Accurate**: No vague qualifiers; named references are exact; assumptions are falsifiable; metrics have units.
- [ ] **Complete**: Five Ws derivable; boundaries stated; alternatives recorded; no orphaned references; open questions owned.
- [ ] **Simple**: One idea per paragraph; tables for comparisons; no redundancy; within line limits; no decorative language.
- [ ] **Explicit**: Abbreviations expanded; assumptions surfaced; decisions justified; numbers sourced; errors described in full.
- [ ] **Coherent**: 
  - [ ] Redundancy test passed (no paragraph can be deleted without loss).
  - [ ] Transition test passed (every adjacent pair has explicit logical relationship).
  - [ ] Sequence test passed (paragraph first-sentences form a complete reasoning chain).

If any item fails, the artifact is incomplete. Revise and re-check.
