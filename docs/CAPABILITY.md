# Capability

Not every task is suitable for AI collaboration. Some tasks exceed AI's capabilities in ways that no amount of prompting or context can fix.

This document defines a capability matrix and fallback rules for deciding when to use AI, when to use humans, and when to switch.

## The Capability Matrix

| Task Type | AI Capability | Recommended Approach |
|-----------|--------------|---------------------|
| **Boilerplate generation** (CRUD, config, types) | High | AI leads, human reviews |
| **Pattern application** (apply existing pattern to new file) | High | AI leads, human reviews |
| **Code transformation** (JS→TS, refactor) | High | AI leads, human verifies output |
| **Alternative exploration** ("show me 3 ways to do X") | High | AI generates, human selects |
| **Summarization** (condense docs, extract ACs) | Medium-High | AI generates, human verifies |
| **Interface design** (API signatures, props) | Medium | AI proposes, human decides |
| **Component implementation** (UI with clear spec) | Medium | AI implements, human verifies visuals and behavior |
| **Bug localization** (find where bug might be) | Medium | AI assists, human diagnoses |
| **Test generation** (unit tests for existing code) | Medium | AI generates, human adds edge cases |
| **Novel algorithm design** | Low | Human leads, AI assists with implementation details |
| **Security-critical logic** | Low | Human leads, AI only generates boilerplate |
| **Complex debugging** (race conditions, memory leaks) | Low | Human leads, AI assists with information gathering |
| **Architecture decisions** (microservices vs monolith) | Low | Human leads, AI proposes options and tradeoffs |
| **Performance optimization** (database query tuning) | Low | Human leads, AI assists with rewrites |
| **Cross-system integration** (multiple unfamiliar services) | Low | Human leads, AI assists per module |

## Red Zone: Do Not Use AI

These tasks should be implemented entirely by humans. AI can read the result, but should not generate it.

### 1. Security-Critical Logic

Authentication, authorization, cryptography, payment processing, PII handling.

**Why**: AI generates plausible-looking but unsafe code. It does not understand threat models. It will miss timing attacks, injection vectors, and privilege escalation paths.

**Rule**: Human writes the logic. AI can write tests and documentation.

### 2. Novel Algorithm Design

Designing a new consensus algorithm, a custom encryption scheme, a novel scheduling strategy.

**Why**: AI remixes training data. It cannot invent genuinely new algorithms. What it produces will be a variation of something it has seen, which may be incorrect or suboptimal.

**Rule**: Human designs. AI implements known subroutines.

### 3. Complex Debugging

Race conditions, memory leaks, non-deterministic failures, performance regressions in large systems.

**Why**: AI guesses at root causes without runtime data. It will suggest "fixes" that mask symptoms rather than address causes.

**Rule**: Human diagnoses with profiler/debugger. AI can help format logs or suggest instrumentation points.

### 4. Regulatory / Compliance Logic

GDPR data handling, HIPAA compliance, financial audit trails.

**Why**: AI does not understand legal requirements. It will generate code that looks compliant but misses edge cases that lawyers care about.

**Rule**: Human implements with legal review. AI can generate boilerplate documentation.

## Yellow Zone: Use AI with Human Supervision

These tasks can use AI, but require deep human involvement.

### 1. Architecture Decisions

AI can propose options and tradeoffs, but the human must decide.

**Why**: AI does not understand business constraints, team skills, operational costs, or strategic direction.

**Rule**:
- AI presents 2-3 concrete options.
- Each option should include pros/cons, key constraints, and likely failure modes.
- AI may recommend a preferred option, but must not present that recommendation as a final decision.
- Human selects the option and documents the rationale in the design artifact.

### 1.1 Decision Ownership

For architecture-related tasks, AI may shape the comparison space, but it must not collapse the comparison into a single authoritative answer.
Final architecture ownership remains with the human.

### 2. Database Schema Design

AI can suggest schemas, but the human must validate normalization, indexing strategy, and query patterns.

**Rule**: AI generates draft schema. Human reviews and adjusts.

### 3. API Design

AI can generate OpenAPI specs, but the human must ensure the API is idiomatic, versionable, and consistent with existing endpoints.

**Rule**: AI generates draft. Human reviews against existing API conventions.

## Green Zone: AI Can Lead

These tasks are safe to delegate to AI with light human review.

### 1. Type Definitions

Generating TypeScript interfaces from examples or schemas.

### 2. Test Boilerplate

Setting up test files, mock data, fixtures.

### 3. Documentation

Writing README sections, API docs, inline comments for obvious code.

### 4. Refactoring

Renaming variables, extracting functions, moving files.

### 5. Configuration

Setting up build tools, CI configs, lint rules.

## The Fallback Rule

When AI fails repeatedly, stop using it for that task.

### Trigger Conditions

If any of these occur, invoke the Fallback Rule:

1. AI generates **structurally incorrect code** twice in a row for the same task.
   - "Structurally incorrect" means: does not compile, fails type check, or fundamentally misunderstands the problem (not just a typo or off-by-one error).

2. AI's output **diverges from the spec** in ways that suggest it does not understand the domain, not just missed a detail.

3. AI produces **confident-sounding but wrong explanations** of why its code works.

4. The task involves a **technology stack released after the AI's training cutoff** and the AI is clearly guessing.

### Fallback Actions

When triggered:

1. **Stop the AI session.** Do not continue iterating with AI.
2. **Switch to human implementation.** Write the code yourself.
3. **Use AI for sub-tasks only.** If the overall task is too complex for AI, break it into smaller pieces where AI can help (e.g., AI generates individual functions after human writes the architecture).
4. **Document the failure.** Note in the Lessons Log or a project memory file that AI is not effective for this type of task. Do not retry in the future.

### Example

```
Task: Implement a custom React hook for optimistic updates with rollback.

Attempt 1: AI generates hook. Review finds race condition in rollback.
Attempt 2: AI fixes race condition. Review finds state inconsistency on rapid toggles.
Attempt 3: AI explains "the hook handles all cases" but code clearly does not.

→ Fallback Rule triggered.
→ Human writes the hook.
→ AI writes tests for the hook after human implementation is complete.
```

## Capability Assessment at Spec Time

Before starting Execute, assess whether AI can handle each task:

| Task ID | Description | AI Capability | Plan |
|---------|-------------|---------------|------|
| T1 | Type definitions | High | AI implements, human reviews |
| T2 | Optimistic update hook | Low | Human implements, AI writes tests |
| T3 | UI components | Medium | AI implements, human verifies visually |

This assessment is part of the Design phase. If most tasks are Red Zone, the project should be human-led with AI in a supporting role.

## Anti-Patterns

- **"AI will figure it out"**: If AI has failed twice, it will not figure it out on the third try. The Fallback Rule exists because AI does not learn within a session.
- **Using AI for Red Zone tasks because "it is faster"**: It is faster until it generates a security vulnerability that takes weeks to discover.
- **Ignoring the capability matrix because "this time is different"**: It is not different. The matrix is based on LLM architecture, not your specific prompt.
