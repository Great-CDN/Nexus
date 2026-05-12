# Philosophy

## What Nexus Is

Nexus is not an AI framework. It is not an agent platform, a prompt library, or an automation system.

Nexus is an **engineering coordination layer** between humans, AI systems, and software projects.

It does not make AI smarter. It does not make AI deterministic. It structures the boundary where human judgment meets probabilistic generation.

**Scope**: Nexus is designed for **single-author projects** where one human developer uses AI as a collaborative tool. Multi-team scenarios are outside the current design boundary; adapting Nexus to team settings requires additional protocols for ownership, review gates, and merge coordination that are not defined here.

## The Problem

LLMs are probability distributions over text, conditioned on input and trained on human data. They have no memory, no understanding, and no ability to reason about code the way humans do. These are not bugs to fix — they are inherent properties of the technology.

What this means in practice:

- **Instability**: same input, different sampled outputs. Temperature and sampling make identical token sequences impossible.
- **Context limits**: ~200K tokens is a hard physical boundary. Long conversations silently truncate. There is no "remembering" across sessions.
- **Prompt sensitivity**: the input-to-output mapping is high-dimensional and non-linear. Small input changes can produce large output changes because the model redistributes probability mass across its entire vocabulary.
- **No true reasoning**: AI can pattern-match solutions that look correct but contain subtle errors humans miss.

Nexus does not "solve" these properties. No workflow can turn a probabilistic text generator into a deterministic engineer. What Nexus does is **work within these constraints** by:

- Forcing human clarity before generation (Spec)
- Limiting conversation length to reduce drift (Workflow)
- Adding machine and human verification layers (Review)
- Explicitly managing the finite context window (Explicit Context)
- Keeping human authority as the final backstop (Human Final Judgment)

Nexus is a set of guardrails, not a transformation.

## What AI Is Good At

Nexus is defensive by design. But defense without offense is just paralysis. You must also know where to apply AI.

LLMs are effective at:

- **Pattern expansion**: given an example, generate more of the same
- **Boilerplate generation**: CRUD, tests, type definitions, config files
- **Alternative exploration**: "here are three ways to do this"
- **Summarization**: condense large text into structured form
- **Transformation**: rewrite X into Y (e.g., JS to TS, REST to GraphQL)
- **Repetitive implementation**: applying the same pattern across many files
- **Interface adaptation**: wrapping existing code in new APIs

LLMs are **not** effective at:

- **Novel architecture design**: they remix training data, not invent
- **Security-critical logic**: they generate plausible-looking but unsafe code
- **Complex debugging**: they guess at root causes without runtime data
- **Long-horizon planning**: they cannot maintain consistency across thousands of lines

**Implication**: Nexus exists to apply AI where probabilistic generation is acceptable, while constraining areas where correctness is critical. Use AI for scaffolding and exploration. Use humans for architecture, security, and validation.

## Failure Is Expected

AI mistakes are not exceptional events. They are expected properties of probabilistic systems.

- Hallucinations are normal.
- Incorrect assumptions are normal.
- Inconsistent implementations are normal.

The process must assume failure by default. Every AI-generated artifact is guilty until proven innocent. Every line of code is wrong until tested. Every design is suspect until reviewed.

This is not cynicism. It is engineering realism.

## The Rules

### 1. Spec > Prompt

A prompt is a request. A spec is a contract. But both are text fed into a probability distribution.

- Prompts are conversational and ambiguous — this gives the model more degrees of freedom to sample incorrectly.
- Specs are structured and bounded — this reduces ambiguity, which reduces (but does not eliminate) variance.
- The real value of a spec is not "controlling AI output." It is **forcing the human to clarify their own thinking before asking AI to generate anything.**

**Implication**: Before asking AI to write code, write a spec. The spec is the source of truth for the human. AI may still deviate — that is expected. The spec gives you a reference to judge the deviation against.

### 2. Workflow > Chat

Engineering is a process with defined phases. Each phase is a **contract**:

- **Required inputs**: what you must have before starting
- **Expected outputs**: what you must produce to complete
- **Validation criteria**: how you verify the output is correct
- **Exit conditions**: what must be true to proceed to the next phase

- Chat is stateful and non-reproducible.
- Workflow is stateless between phases and fully reproducible.
- You can restart any phase from its inputs.

Conversation is a side effect. Workflow is system state.

**Implication**: Break work into phases. Complete one phase before starting the next. Do not mix requirements discussion with code generation. If a session has spanned multiple phases, end it and start a new one.

### 3. Review > Generation

AI generates faster than humans can review. Humans review about 200-400 lines per hour effectively, and fatigue sets in after 400 lines. AI generates thousands of lines per hour. This is a hard mismatch.

- **Automate what machines can check first**: type checking, static analysis, linting, security scanning, test execution. These must pass before human review begins.
- **Human review is for what machines cannot judge**: architecture fit, business logic correctness, maintainability, whether the code actually solves the problem.
- Review against the spec, not against intuition.
- Use checklists, not gut feeling.

**Implication**: Budget time for review. If you do not have time to review, you do not have time to generate. Better yet, keep generation small enough that review is feasible. A 30-line function that you understand is better than a 300-line function that you do not.

### 4. Explicit Context > Implicit Memory

AI has no memory across sessions. Within a session, context windows silently truncate at ~200K tokens. These are physical limits, not design flaws.

- Never assume AI remembers a decision from yesterday.
- Every session starts with explicit context loading.
- Critical constraints are repeated in every relevant prompt.

**Implication**: Maintain a context package (spec + design + relevant code) that is loaded at session start. The context package is versioned with the project. Do not say "as we discussed earlier" — paste the relevant text.

**Limitation**: This rule works for small projects where all relevant code fits in the context window. When projects exceed that window, explicit context loading becomes impossible. At that scale, you need module boundary contracts and layered abstractions. See `docs/SCALE.md`.

### 5. Human Final Judgment

AI can propose, recommend, generate, and analyze. AI cannot decide.

In single-author projects, this principle is tautological — the human is already the only decision-maker. Its value is not organizational; it is **psychological**. It prevents the gradual erosion of human judgment that happens when AI output is consistently accepted without scrutiny.

- Scope decisions are human.
- Architecture decisions are human.
- Acceptance is human.
- Deployment is human.

**Implication**: When AI says "we should", hear "I propose that you consider whether we should." Even when you agree, make it an explicit choice, not a default.

### 6. Small Context > Large Context

Smaller scoped tasks produce more stable outputs.

Large context windows increase ambiguity, cross-contaminate concerns, and reduce reproducibility. The more context you load, the more opportunity the model has to fixate on irrelevant patterns and ignore critical constraints.

Prefer:
- Small modules
- Short sessions (30-60 minutes)
- Isolated tasks
- Explicit boundaries

**Implication**: Context package size limits are defined in `docs/protocols/threshold-classification.md`. As a rule of thumb: if your context package exceeds the soft limit, the task is too large and should be split. See `docs/SCALE.md` for the full token-density rationale. If your module contract exceeds 150 lines, the module is too large. Split it. Small scope is not just a preference — it is a stability mechanism.

## Anti-Goals

Nexus explicitly avoids:

- **Autonomous operation**: AI never commits, deploys, or merges without human approval.
- **Persistent autonomous agents**: No background AI processes that make decisions while you are not looking.
- **Hidden memory systems**: No opaque state that AI maintains between sessions. All context is explicit and human-inspectable.
- **Opaque decision-making**: AI must explain its reasoning. "Because I think so" is not acceptable.
- **AI-controlled workflows**: AI does not decide what to build next. Humans set priorities; AI executes tasks.
- **Generic frameworks**: No abstract agent orchestration, no plugin systems, no "AI operating systems".
- **Prompt engineering as craft**: Prompts are not art. They are structured inputs derived from specs.
- **Buzzword compliance**: No "AI-native", "agentic", "copilot-driven" nonsense.
- **Overengineering**: Process exists to reduce risk, not to create work.

## When Not to Use Nexus

Nexus is not universal. Using it in the wrong context creates process fatigue without value.

Do not use Nexus for:

- **One-off scripts** (< 50 lines, single use, disposable)
- **Personal learning projects** (the goal is learning, not maintainability)
- **Pure exploration** (see `docs/EXPLORATION.md` — exploration ends before Nexus begins)
- **Emergency hotfixes** (use Hotfix Workflow, not Full Workflow)
- **Dependency updates** (use Light Workflow, or just update and test)
- **Code that will never be read again** (prototypes, throwaway demos)

Nexus is for **code that must be correct and maintainable**. If neither matters, skip the process.

## Motivation and Process Fatigue

Strict process kills creative joy. This is not a bug — it is a tradeoff.

Nexus acknowledges that:

- **Writing specs is not fun.** It is work. The fun is in building.
- **Reviewing code is tiring.** After 400 lines, your brain checks out.
- **Loading context feels bureaucratic.** You want to just start coding.

These feelings are valid. The process does not eliminate them; it manages them.

### Managing Fatigue

- **Use Light Workflow for 70% of your work.** Full Workflow is for novel, complex, or risky changes. Most day-to-day work is Light.
- **Batch small tasks.** Three Light Workflow tasks in one day feel less burdensome than one Full Workflow task.
- **Take breaks between sessions.** Do not chain 3-hour implementation marathons. Your review quality will collapse.
- **If you feel the process is suffocating, check your Triage.** You are probably using Full Workflow for things that should be Light.

### The Creative Compromise

Nexus is not designed to maximize fun. It is designed to maximize the probability that your code works and can be maintained. The fun comes from shipping working software, not from skipping verification.

But if you never feel the joy of building, something is wrong. Either the project scope is wrong, or the process intensity is wrong. Adjust.

## What Nexus Does Not Do

Nexus ensures the code is **built correctly**. It does not ensure the **correct thing is built**.

- A perfect Nexus workflow can produce a beautifully engineered product that nobody needs.
- A perfect Nexus workflow can produce a feature that solves the wrong problem.
- A perfect Nexus workflow cannot replace product sense, user research, or market validation.

Nexus is a **construction methodology**, not a **product discovery methodology**. Discovery happens before Nexus (see `docs/EXPLORATION.md`) or outside of it entirely. Do not confuse process compliance with product success.

## Engineering Values

### Reproducibility Over Convenience

It is better to spend 10 minutes documenting context than 2 hours debugging why AI produced different output today. Reproducibility means anyone (including future you) can pick up the spec and get the same result.

### Maintainability Over Speed

A spec that takes 30 minutes to write saves hours of rework. A reviewed design prevents refactorings. Slow down to speed up.

### Explicit Over Implicit

If a constraint is not written down, it does not exist. If a decision is not documented, it will be revisited. Ambiguity is not efficiency — it is deferred conflict.

## Solo Developer Adaptations

Nexus is designed for single-author projects. Adaptations from team-oriented methodologies:

- **No PR gates**: Review is self-review with AI assistance. The checklist is the gate.
- **No standups or sync**: Phase transitions happen when the human decides, not on a schedule.
- **Lightweight artifacts**: Templates are minimal but complete. No Jira, no Confluence.
- **Git as audit trail**: Conventional commits and commit messages serve as the change log.

## Decision Principles

When in doubt, apply these:

1. If it cannot be reproduced from documents, it does not belong in the process.
2. If the human is not making a decision, the process is too automated.
3. If you cannot explain the purpose of every AI-generated action in the last 15 minutes, the process has violated Principle #2. Stop and revert.
4. If a template is not being used, delete it or fix it.
5. If context exceeds what can be explicitly loaded, the scope is too large.
