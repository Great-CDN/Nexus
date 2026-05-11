# Scale

Nexus assumes that all relevant context can be explicitly loaded into an AI session. This assumption holds for small projects. It breaks when projects grow beyond the context window.

This document defines the breaking point and the strategy beyond it.

## The Breaking Point

The context window is approximately 200K tokens. In practice, this means:

- **~500-1000 lines of dense code** (TypeScript with types)
- **~1000-2000 lines of prose** (specs, designs, comments) — prose has lower token density per line
- **Combined code + prose**: if your spec + design + relevant code exceeds 800 lines, you are near the danger zone. 1200 lines is the absolute maximum for mixed content.

**Note**: The 800/1200 limits apply to mixed content (code + prose combined). Pure prose documents (e.g., a spec with no code) can be larger — up to ~2000 lines — because prose has lower token density. When in doubt, count tokens, not lines.

**When the context window truncates, AI silently loses information.** It does not tell you. It just starts making worse decisions.

## Detection

Signs that you have hit the context wall:

- AI asks about things that were in the context you provided
- AI generates code that contradicts types or interfaces you pasted earlier
- AI suggests imports or functions that do not exist
- AI output quality drops noticeably mid-session
- AI "forgets" constraints you stated at the beginning of the session

If you observe these, **stop the session**. Do not continue. The context has been truncated and further generation will be unreliable.

## Strategy: Layered Contracts

When a project exceeds context window limits, you cannot load all relevant code. Instead, you load **contracts** — the boundaries between modules, not the internals.

### Layer 0: System Architecture

A single document describing the system at the highest level:

- Major modules and their responsibilities
- Data flow between modules
- Technology stack and versions
- Global conventions (naming, error handling, state management)

This document is loaded at the start of every session. It is typically 100-200 lines.

### Layer 1: Module Interface Contracts

For each module, a contract document specifying:

```
modules/
  auth/
    CONTRACT.md       # Public interface
    internal/         # Implementation (not loaded into context)
  billing/
    CONTRACT.md
    internal/
```

A module contract contains:

- **Exports**: functions, types, constants that other modules may use
- **Imports**: functions, types from other modules that this module depends on
- **Invariants**: properties that always hold (e.g., "all functions return Result<T, Error>")
- **Side effects**: what this module reads/writes (database, localStorage, filesystem)

A module contract is typically 50-100 lines.

### Layer 2: Feature Spec

The standard `PRODUCT_SPEC.md`, scoped to a single feature that touches 1-3 modules.

### Layer 3: Task-Level Context

For implementation, load:

1. System Architecture (Layer 0)
2. Contracts of modules involved (Layer 1)
3. Feature Spec (Layer 2)
4. **Only the internal code you are directly modifying** (not the entire module)

This keeps context under 500 lines.

### Context Loading at Scale

```
Phase: Implementation
Task: Add OAuth2 provider to auth module

System Architecture: [paste 50-line summary]

Module Contracts:
- auth/CONTRACT.md: [paste 80-line contract]
- user/CONTRACT.md: [paste 60-line contract]

Feature Spec: [paste relevant ACs from spec-v1.md]

Internal Code:
- src/modules/auth/providers/index.ts [paste]
- src/modules/auth/providers/google.ts [paste]

What to do:
Implement OAuth2 provider following the existing provider pattern.
```

## Module Contract Template

Use this for each module:

```markdown
# Contract: <Module Name>

## Responsibility

<One paragraph: what this module does and does not do.>

## Exports

| Name | Type | Description |
|------|------|-------------|
| <name> | <function/type/const> | <description> |

## Imports

| From | What | Used For |
|------|------|----------|
| <module> | <name> | <purpose> |

## Invariants

- <Property that always holds>
- <Property that always holds>

## Side Effects

- Reads: <what it reads>
- Writes: <what it writes>

## Notes

<Any special behavior, threading constraints, lifecycle requirements.>
```

## When to Introduce Contracts

| Project Size | Strategy |
|--------------|----------|
| < 5K lines | Direct context loading. No contracts needed. |
| 5K - 20K lines | Start writing module contracts for the most complex modules. |
| 20K - 50K lines | All modules must have contracts. Context loading uses Layer 0 + Layer 1 + Layer 2 + internal code. |
| > 50K lines | Contracts + generated API documentation. Consider splitting into separate repositories. |

## Anti-Patterns at Scale

- **Loading entire files when only a function matters**: Paste the function signature and 5 lines of context, not the whole file.
- **Outdated contracts**: A contract that contradicts the code is worse than no contract. Contracts must be updated when interfaces change.
- **Overly broad modules**: If a module's contract exceeds 150 lines, the module is too large. Split it.
- **Cross-module dependencies deeper than 2 layers**: If module A depends on B, and B depends on C, and C depends on D, your architecture has decayed. Refactor.

## Tradeoffs

| Benefit | Cost |
|---------|------|
| Can work on large codebases with AI | Must maintain module contracts |
| Clear module boundaries | Upfront architecture effort |
| Easier onboarding for future humans | Contract update discipline required |

## Bottom Line

Nexus's explicit context strategy works up to ~10K lines. Beyond that, you need contracts and layered context. The principles remain the same — only the mechanism changes.
