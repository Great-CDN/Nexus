# CLAUDE.md — Nexus Project Context

## What This Project Is

Nexus is an **engineering coordination layer** between humans, AI systems, and software projects. It is not an AI framework, not an agent platform, not a prompt library, and not an automation system.

It does not make AI smarter. It does not make AI deterministic. It structures the boundary where human judgment meets probabilistic generation.

It contains documents, templates, protocols, and skills that govern how AI and humans collaborate on software engineering.

## Critical Rules (Absolute)

1. **Spec > Prompt** — Never generate code without a spec reference. Specs force human clarity; they do not eliminate AI variance.
2. **Workflow > Chat** — Each session serves one phase and one task. Phases are contracts with inputs, outputs, validation criteria, and exit conditions.
3. **Review > Generation** — Automate what machines can check (types, lint, tests, security). Human review is for architecture, business logic, and maintainability.
4. **Explicit Context > Implicit Memory** — Load context explicitly at session start. AI has no memory and a finite context window.
5. **Small Context > Large Context** — Smaller scoped tasks produce more stable outputs. If context exceeds 800 lines, split the task.
6. **Human Final Judgment** — AI proposes; human decides. This prevents the gradual erosion of human judgment from unexamined AI output.

## Document Index

| Document | When to Reference |
|----------|-------------------|
| `docs/PHILOSOPHY.md` | When explaining why a rule exists |
| `docs/WORKFLOWS.md` | When determining what phase we are in |
| `docs/PROTOCOLS.md` | When defining how to communicate or format artifacts |
| `docs/CHECKLISTS.md` | At every stop point |
| `docs/EXPLORATION.md` | When requirements are unclear and exploration is needed |
| `docs/CAPABILITY.md` | When assessing whether AI can handle a specific task |
| `docs/REPRODUCIBILITY.md` | When ensuring a session can be replayed |
| `docs/SCALE.md` | When projects grow beyond context window limits |
| `docs/METRICS.md` | When evaluating whether the process is effective |
| `docs/WORKED_EXAMPLE.md` | When learning how the workflow applies to a real feature |
| `docs/CROSS_VALIDATION.md` | When using multiple models for independent review |
| `docs/templates/spec.md` | When creating a new product spec (full) |
| `docs/templates/spec-light.md` | When creating a quick spec (light workflow) |
| `docs/templates/design.md` | When creating a new design doc (full) |
| `docs/templates/design-light.md` | When creating a quick design (light workflow) |
| `docs/templates/task.md` | When defining an implementation task |
| `docs/templates/review.md` | When conducting a review |
| `docs/templates/test-plan.md` | When planning tests |
| `docs/templates/change-log.md` | When documenting a change |

## How to Use This Context

When the user starts a session:
1. Ask what phase we are in (Requirements, Design, Implementation, Testing, Acceptance, Maintenance).
2. Ask for the relevant spec and design references.
3. Load the context package per `docs/PROTOCOLS.md` Context Packaging Protocol.
4. Confirm understanding before generating anything.

## Anti-Patterns to Reject

- Generating code without a spec reference.
- Starting a new task in the same session without reloading context.
- Accepting vague acceptance criteria ("good", "fast", "user-friendly").
- Proposing scope expansion during implementation.
- Committing or deploying without human explicit approval.

## Project Structure

```
Nexus/
  README.md
  CLAUDE.md              # This file
  docs/
    PHILOSOPHY.md
    WORKFLOWS.md
    PROTOCOLS.md
    CHECKLISTS.md
    REPRODUCIBILITY.md
    SCALE.md
    METRICS.md
    WORKED_EXAMPLE.md
    CROSS_VALIDATION.md
    templates/
      spec.md
      spec-light.md
      design.md
      design-light.md
      task.md
      review.md
      test-plan.md
      change-log.md
  .claude/
    settings.json
    settings.local.json
    skills/
      init-spec/
        SKILL.md
      review-code/
        SKILL.md
      verify-tests/
        SKILL.md
      update-context/
        SKILL.md
```
