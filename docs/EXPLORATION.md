# Exploration

Software development has two fundamentally different modes. Nexus is designed for **execution** — when you know what to build. But before execution comes **exploration** — when you do not know what to build yet.

This document defines Exploration Mode, when to use it, and how to transition from exploration to execution.

## Two Modes

| | Exploration | Execution |
|---|---|---|
| **Goal** | Discover what to build | Build what you have defined |
| **Certainty** | Low — requirements unclear | High — requirements defined |
| **Output** | Working prototype + lessons | Production code + tests |
| **Process** | Loose, fast, discardable | Structured, verified, maintainable |
| **Nexus intensity** | None — chat is acceptable | Full Nexus workflow |

## When to Enter Exploration Mode

Enter exploration when any of these are true:

- You cannot write a one-paragraph problem statement.
- You do not know what the user interface should look like.
- You are evaluating a new technology or architecture you have not used before.
- The project has no existing codebase — you are starting from zero.
- You have a "feeling" there is a problem but cannot articulate it.

If you can write a clear problem statement and know roughly what the solution looks like, skip exploration. Go straight to Nexus execution.

## When Exploration Is Forbidden

Do **not** enter exploration mode when:

- A production system is down or critically impaired — use **Hotfix Workflow** instead.
- A security vulnerability is actively exploitable — fix immediately, explore later.
- A deadline is within the exploration time box (2 weeks) — you do not have time to learn.
- The team has already committed to a scope — exploration becomes scope creep.

Exploration is a **luxury of schedule**, not an emergency tool. If there is business pressure to ship, exploration is the wrong mode.

## When You Must Switch to Execution

Exploration is not a permanent state. You must switch to execution when:

- All exit criteria are met (clear problem statement, sketched solution, known risks).
- The time box expires — even if exit criteria are not met.
- The Lessons Log stops producing new insights for 3 consecutive days.
- A stakeholder commits budget or timeline to building the real thing.

**No indefinite exploration.** If you have been exploring for more than 2 weeks without a decision to execute or abandon, you are not exploring — you are procrastinating.

## Exploration Mode Rules

### 1. Time-Boxed

Exploration has a hard deadline. Default: **2 weeks maximum**.

- 1-3 days for very small explorations (single API endpoint, one UI screen, one library evaluation).
- 1 week for small prototypes (single feature, single screen).
- 2 weeks for complex prototypes (multi-step flows, new architecture).

When the time box expires, exploration ends. You must either:
- Transition to execution with Nexus, or
- Abandon the idea.

No extensions. Extensions turn exploration into unstructured hacking.

### 2. No Spec, No Design

During exploration:

- Do not write a `PRODUCT_SPEC.md`.
- Do not write a `DESIGN_DOC.md`.
- Do not use the Context Packaging Protocol.
- Chat with AI freely. Try things. Break things.

The only documentation allowed is a running **Lessons Log** — a plain text file where you jot down what you learned:

```
lessons-log.md
---
2026-05-11: Tried using Zustand for global state. Works well for simple cases but gets messy with async actions. Might need Redux Toolkit for the real implementation.
2026-05-12: Drag-and-drop with @dnd-kit is smoother than react-beautiful-dnd. Use @dnd-kit in the real build.
2026-05-13: The rule engine needs a validation layer before execution. Otherwise invalid rules crash the pipeline. Add this to the real spec.
```

### 3. Discipline of Disposal

Exploration code is **disposable by default**. You are not building the real product. You are building a throwaway prototype to learn.

- Do not write tests for exploration code.
- Do not worry about code quality.
- Do not commit to main. Use a branch named `exploration/YYYY-MM-DD-topic`.
- When exploration ends, delete the branch or archive it. Do not merge it.

**The hardest part of exploration is throwing away the code.** If you cannot throw it away, you were not exploring — you were already executing without a plan.

### 4. Human-Driven, AI-Assisted

In exploration, AI is a sparring partner, not an implementer.

- Ask AI for alternatives: "What are three ways to do X?"
- Ask AI for quick prototypes: "Build a minimal version of Y so I can see how it feels."
- Do not ask AI to "build the real thing." That is execution, not exploration.

### 5. Exit Criteria

Exploration ends when any of these are met:

- [ ] You can write a clear one-paragraph problem statement.
- [ ] You can sketch the user interface or API on paper.
- [ ] You understand the technical risks and know how to mitigate them.
- [ ] You have identified at least one non-obvious constraint.
- [ ] The time box has expired (hard stop).

If you exit because the time box expired but the other criteria are not met, **abandon the project** or redefine the scope. Do not transition to execution with unclear requirements.

## Transition: Exploration → Execution

When exploration ends and you decide to build the real thing:

1. **Archive the exploration branch.** Tag it: `git tag exploration/rule-editor-2026-05-11`.
2. **Start fresh.** Create a new branch from main.
3. **Write the spec using lessons from exploration.** Reference the Lessons Log, but do not copy exploration code into the spec.
4. **Follow Nexus execution workflow.** Spec → Design → Implementation → Testing → Acceptance.
5. **Do not port exploration code directly.** Re-implement with proper structure. You can reference the exploration branch for logic, but rewrite everything.

## Common Pitfalls

- **"This code is too good to throw away"**: If it is good, you can rewrite it better with a spec. If you cannot rewrite it better, you did not learn enough during exploration.
- **Exploration creep**: Extending the time box because "I am almost there." You are not almost there. 2 weeks is enough to know if an idea is viable.
- **Premature execution**: Starting Nexus workflow before exploration is complete. This produces specs for things you do not understand, which produces designs for things you do not understand, which produces code that will be rewritten.
- **No lessons log**: If you did not write down what you learned, the exploration was wasted. You will make the same mistakes in execution.

## From Lessons Log to Spec

Exploration produces a Lessons Log, not a Spec. The transition between them is a creative act — there is no automatic conversion. But there is a structured way to do it.

### Step 1: Extract Constraints

Read your Lessons Log and identify hard constraints discovered during exploration:

| Lesson | Constraint Type | Spec Section |
|--------|----------------|--------------|
| "Zustand gets messy with async" | Non-Goal | Non-Goals |
| "@dnd-kit is smoother" | Technology choice | Assumptions |
| "Rule engine needs validation layer" | Requirement | Scope / AC |

### Step 2: Identify Anti-Patterns

Note what did **not** work. These become explicit non-goals in the Spec:

- "Do not use Zustand for async state."
- "Do not use react-beautiful-dnd — @dnd-kit is the chosen library."

### Step 3: Define the Problem Using Exploration Insights

The problem statement in the Spec should reflect what you actually learned:

```markdown
## Problem

Users need a visual rule editor for CDN configuration. Exploration confirmed that:
- Raw JSON editing is unusable for non-technical users
- Drag-and-drop rule reordering is expected (validated with @dnd-kit prototype)
- Real-time validation is necessary to prevent pipeline crashes (discovered during exploration)
```

### Step 4: Derive Acceptance Criteria from Prototype Behavior

Your prototype demonstrated behaviors. Turn them into verifiable criteria:

```
Prototype behavior: "I could drag rules between phases and it worked smoothly"
→ AC: "User can reorder rules within a phase via drag-and-drop with <100ms feedback"

Prototype behavior: "When I entered an invalid regex, the editor showed an error"
→ AC: "Invalid rules display inline error indicators with specific messages"
```

### Step 5: Discard the Prototype, Keep the Knowledge

This is the hardest step. The prototype code is not the spec. The spec is the distilled knowledge from the prototype.

- Do not copy prototype code into the Spec.
- Do not copy prototype filenames or structure into the Design.
- Do reference the exploration branch: "See exploration/rule-editor-2026-05-11 for validation of drag-and-drop approach."

## When Exploration Is Not Needed

Do not use Exploration Mode if:

- You are adding a field to an existing form.
- You are fixing a known bug.
- You are implementing a well-understood pattern in a familiar codebase.
- You are updating dependencies.

These are Light Workflow or Hotfix territory. Exploration is for **unknown unknowns**.
