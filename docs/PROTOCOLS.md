# Protocols

Protocols define how humans and AI communicate within Nexus. They are rules, not suggestions. Violating a protocol means the output is invalid until corrected.

This file is the **arbitration center** for Nexus. When rules conflict, terminology is ambiguous, or boundaries are unclear, resolve the issue here before continuing.

Each operational protocol lives in its own file under `docs/protocols/`. This file contains the Rule Priority table, arbitration principles, violation handling, and the protocol directory.

---

## Rule Priority

Nexus documents have a strict precedence order. When two documents conflict, the higher-priority document wins.

| Priority | Source | Role | Can Override |
|----------|--------|------|--------------|
| 1 | `./CLAUDE.md` §Critical Rules (Absolute) | Hard constraints for AI behavior | Everything |
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

## Core Arbitration Principles

These principles govern all protocol decisions. When in doubt, apply them in order.

### 1. Spec > Prompt
A spec is the source of truth. A prompt is only a request derived from the spec.

### 2. Workflow > Chat
Conversation is a medium. Workflow is the system state.

### 3. Review > Generation
Generation is cheap. Review is where correctness is established.

### 4. Explicit Context > Implicit Memory
If it is important, it must be loaded explicitly.

### 5. Human Final Judgment
AI can recommend. AI cannot decide.

---

## Arbitration Procedure

When rules conflict:

1. Identify the conflicting documents or sections.
2. Determine the highest-priority rule using the Rule Priority table above.
3. Follow the highest-priority rule.
4. Record the conflict if it may recur.
5. Do not continue with invalid output.

If the conflict affects a Critical Rule, stop the session and require explicit human approval before proceeding.

---

## Protocol Violation Handling

When a protocol is violated, the output is invalid. The violation must be detected, corrected, and re-verified before proceeding.

**Detection**: Violations are caught by:
- Automated checks (type check, lint, tests) per the Review Protocol
- Human review against checklists per `docs/CHECKLISTS.md`
- Cross-validation reports per `docs/CROSS_VALIDATION.md`

**Correction path**:
1. Stop generating new output. Do not build on invalid output.
2. Identify which protocol was violated and why.
3. Fix the underlying cause (e.g., rewrite the spec, reload context, split the task).
4. Re-run the relevant checklist before continuing.

**Escalation**: If a Critical protocol (e.g., "Spec > Prompt", "Human Final Judgment") is violated, stop the session entirely. Do not continue until the human explicitly approves the correction plan.

## Protocol Directory

| Protocol | File | Purpose |
|----------|------|---------|
| Spec Format | `docs/protocols/spec-format.md` | How to write specs, version them, and what sections are mandatory |
| Context Packaging | `docs/protocols/context-packaging.md` | What context to load at session start and how to structure it |
| Prompt | `docs/protocols/prompt.md` | How to write structured prompts; prohibited patterns |
| Review | `docs/protocols/review.md` | Automated and human review checklists; review output format |
| Memory | `docs/protocols/memory.md` | What to save in `.claude/memory/`, format, and maintenance |
| Commit | `docs/protocols/commit.md` | Conventional commits, commit rules, signing |
| Session | `docs/protocols/session.md` | Session structure, interruption handling, API failure recovery |
| Triage | `docs/protocols/triage.md` | How to choose Full / Light / Hotfix workflow |
| Artifact Quality | `docs/protocols/artifact-quality.md` | Five-dimensional quality standard for all artifacts |
| Threshold Classification | `docs/protocols/threshold-classification.md` | Hard Limit / Soft Limit / Heuristic definitions |
| Definitions | `docs/protocols/definitions.md` | Shared terms: severity levels, branch naming |

---

## Decision Rule

If a rule does not help one of these outcomes, it should be removed or demoted:

- Reduce ambiguity
- Improve verification
- Preserve human judgment
- Improve reproducibility
- Keep the system maintainable
