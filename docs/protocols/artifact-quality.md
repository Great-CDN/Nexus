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
