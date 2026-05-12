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

**Grey area rule**: If a revision during Design changes how an acceptance criterion would be verified — even if the criterion's text is unchanged — it is a v2.0 revision. If it only adds examples or corrects typos without altering any possible interpretation, it is v1.1. When in doubt, choose v2.0.

**When to create a new version**:
- Before Design phase starts: spec is v1.0.
- During Design: if the spec needs revision to make design possible, bump to v1.1.
- After Design is approved: do not revise the spec without creating a new version. The approved design was built against a specific spec version.
- During Execute: if new information requires spec changes, create a new version, re-approve the spec, and evaluate whether ongoing tasks need rework.

**Anchoring implementation tasks**: Snapshots copy the spec, not link it. A task snapshot always contains `spec-vX.Y.md` — the exact version the task was built against. This makes version drift visible, not hidden.

---
