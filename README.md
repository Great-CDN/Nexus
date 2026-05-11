# Nexus

Nexus is a structured methodology for collaborating with AI on software engineering.

It does not make AI output deterministic — that is impossible with current language models. Instead, it builds **human-controllable guardrails** around AI's inherent limitations: probability, context windows, and lack of memory. It covers requirements, design, implementation, testing, acceptance, and maintenance.

It is not an AI agent framework, not a prompt collection, and not an autonomous platform.

## How to Use

1. Read `docs/PHILOSOPHY.md` to understand the rules.
2. Read `docs/WORKFLOWS.md` to understand the lifecycle.
3. When starting a new feature, use `docs/templates/spec.md`.
4. Before writing code, load the spec and design into context.
5. At each stop point, run the relevant checklist from `docs/CHECKLISTS.md`.

## Document Index

| Document | Purpose |
|----------|---------|
| `docs/PHILOSOPHY.md` | Principles and values |
| `docs/WORKFLOWS.md` | Phase-by-phase lifecycle |
| `docs/PROTOCOLS.md` | Communication and artifact rules |
| `docs/CHECKLISTS.md` | Verification checklists |
| `docs/EXPLORATION.md` | When and how to use unstructured exploration before execution |
| `docs/CAPABILITY.md` | What AI can and cannot do; when to switch to human implementation |
| `docs/REPRODUCIBILITY.md` | State snapshots, environment locking, output validation |
| `docs/SCALE.md` | Working with large codebases beyond context limits |
| `docs/METRICS.md` | How to measure whether the process is effective |
| `docs/WORKED_EXAMPLE.md` | End-to-end walkthrough using a real feature |
| `docs/CROSS_VALIDATION.md` | Using multiple AI models to validate critical decisions |
| `docs/templates/` | Reusable document templates (full + light) |
| `CLAUDE.md` | Claude Code project context |

## The Rules

1. **Spec > Prompt** — Structured input reduces ambiguity. It does not eliminate AI variance, but it forces human clarity before generation begins.
2. **Workflow > Chat** — Phases are contracts with required inputs, expected outputs, validation criteria, and exit conditions. Conversation is a side effect; workflow is system state.
3. **Review > Generation** — Automate what machines can check (types, lint, tests, security). Human review is for architecture, business logic, and maintainability.
4. **Explicit Context > Implicit Memory** — Load context explicitly at session start. AI has no cross-session memory and a finite context window. See `docs/SCALE.md` for large codebases.
5. **Small Context > Large Context** — Smaller scoped tasks produce more stable outputs. Large context increases ambiguity and cross-contamination. Prefer small modules, short sessions, and isolated tasks.
6. **Human Final Judgment** — AI proposes; human decides. This prevents the gradual erosion of human judgment from consistently accepting unexamined AI output.
