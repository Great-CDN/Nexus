# Philosophy

## What Nexus Is

Nexus is not an AI framework. It is not an agent platform, a prompt library, or an automation system.

Nexus is an **engineering coordination layer** between humans, AI systems, and software projects.

It does not make AI smarter. It does not make AI deterministic. It structures the boundary where human judgment meets probabilistic generation.

**Scope**: Nexus is designed for **single-author projects** where one human developer uses AI as a collaborative tool. Multi-team scenarios are outside the current design boundary.

## The Three Axioms

### 1. LLMs are probabilistic systems

Large language models generate text by sampling from a probability distribution. They are not deterministic engineers. They do not guarantee consistency, memory, or correctness across identical prompts.

This means:
- **Instability**: same input, different outputs. Temperature and sampling make identical token sequences impossible.
- **Prompt sensitivity**: small input changes can produce large output changes.
- **No true reasoning**: AI pattern-matches solutions that look correct but may contain subtle errors.

Implication: do not assume a single output is reliable. Do not treat AI output as final truth. Always verify critical results.

### 2. Context is a finite resource

AI collaboration is limited by context windows, session length, and information density. What is not explicitly loaded cannot be relied on. What is not written down cannot be assumed to persist.

This means:
- **Context limits**: ~200K tokens is a hard physical boundary. Long conversations silently truncate.
- **No cross-session memory**: AI does not remember prior conversations unless context is explicitly reloaded.

Implication: use explicit specs, designs, and context packages. Keep sessions small and focused. Split large work into bounded phases. Version important decisions and artifacts.

### 3. Human judgment is final

AI can propose, compare, draft, analyze, and validate. AI cannot own the final decision.

Implication: human decides scope, chooses architecture, approves implementation, and signs off on acceptance. Human owns the consequences.

## What Nexus Optimizes For

- **Accuracy of problem framing**
- **Effective use of AI where it is strong**
- **Maximum practical reliability**
- **Completeness of the engineering lifecycle**
- **Simplicity of process**
- **Elegance through compression, not expansion**

## What AI Is Good At

LLMs are effective at:
- Pattern expansion: given an example, generate more of the same
- Boilerplate generation: CRUD, tests, types, config
- Alternative exploration: "here are three ways to do this"
- Summarization: condense large text into structured form
- Transformation: rewrite X into Y
- Repetitive implementation: applying the same pattern across many files

LLMs are **not** effective at:
- Novel architecture design: they remix training data, not invent
- Security-critical logic: they generate plausible-looking but unsafe code
- Complex debugging: they guess at root causes without runtime data
- Long-horizon planning: they cannot maintain consistency across thousands of lines

Implication: use AI for scaffolding and exploration. Use humans for architecture, security, and validation.

## What Nexus Rejects

- "AI will remember"
- "One prompt should solve everything"
- Autonomous agent fantasy
- Hidden state as a substitute for documentation
- Opaque decision-making
- AI-controlled workflows
- Generic frameworks and plugin systems
- Prompt engineering as craft
- Buzzword compliance ("AI-native", "agentic", etc.)
- Overengineering: process exists to reduce risk, not to create work

## When Not to Use Nexus

- One-off scripts (< 50 lines, single use, disposable)
- Personal learning projects
- Pure exploration (see `docs/EXPLORATION.md`)
- Emergency hotfixes (use Hotfix Workflow)
- Dependency updates (use Light Workflow)
- Code that will never be read again

Nexus is for **code that must be correct and maintainable**. If neither matters, skip the process.

## Engineering Values

### Reproducibility Over Convenience

Spend 10 minutes documenting context rather than 2 hours debugging why AI produced different output today.

### Maintainability Over Speed

A spec that takes 30 minutes to write saves hours of rework. A reviewed design prevents refactorings.

### Explicit Over Implicit

If a constraint is not written down, it does not exist. If a decision is not documented, it will be revisited.

## Solo Developer Adaptations

- **No PR gates**: review is self-review with AI assistance
- **No standups or sync**: phase transitions happen when the human decides
- **Lightweight artifacts**: minimal but complete templates
- **Git as audit trail**: conventional commits serve as the change log

## Decision Principles

When in doubt:

1. If it cannot be reproduced from documents, it does not belong in the process.
2. If the human is not making a decision, the process is too automated.
3. If you cannot explain the purpose of every AI-generated action in the last 15 minutes, stop and revert.
4. If a template is not being used, delete it or fix it.
5. If context exceeds what can be explicitly loaded, the scope is too large.
