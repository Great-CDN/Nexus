# Cross-Validation

Single-model AI collaboration has a fundamental weakness: **systematic bias**.

Every LLM has specific training data distributions, architecture limitations, and knowledge blind spots. Claude may excel at TypeScript patterns but miss certain security edge cases. GPT-4 may generate excellent API designs but overlook accessibility concerns. These biases are not random — they are structural.

Cross-validation uses **different systematic biases to cancel each other out**, revealing blind spots that no single model can detect.

This is not about "more AI is better." It is about **independent perspectives** on the same artifact.

---

## The Problem with Single-Model Review

When you use one AI model for both generation and review, you have:

- **Shared training data**: the model has seen the same patterns, libraries, and conventions.
- **Shared blind spots**: if the training data under-represents a security pattern, the model will neither generate nor detect it.
- **Shared knowledge cutoff**: technologies released after training are equally unknown to generation and review.

A human analogy: asking the same person to both write a document and proofread it. They will miss the same typos they made.

## Three Layers of Cross-Validation

### Layer 1: Review Cross-Validation

Use a different model to independently review what the first model generated.

**Mechanism:**
1. Model A generates an artifact (Spec / Design / Code).
2. Model B reviews the artifact independently. **Do not tell Model B that the artifact was AI-generated.** Present it as a human draft.
3. Human compares both review outputs and merges unique findings.

**Example:**
```
Step 1: Claude-4 generates Design for payment webhook handler.
Step 2: GPT-4.5 reviews the Design (given only the Design + Spec).
Step 3: Claude-4 found 3 issues. GPT-4.5 found 5 issues, 2 overlapping.
Step 4: Human merges 6 unique issues, prioritizes by severity.
```

**Cost:** +30% time, +100% token consumption.
**Benefit:** ~25-35% increase in defect detection. Most valuable for catching categories of errors that Model A systematically misses.

**When to use:**
- Architecture decisions
- Security-critical designs
- Complex interface contracts
- Any Red Zone task (see `docs/CAPABILITY.md`)

---

### Layer 2: Generation Cross-Validation

Use two different models to independently implement the same task, then compare.

**Mechanism:**
1. Model A implements the task from the Spec + Design.
2. Model B implements the same task from the same Spec + Design, without seeing A's output.
3. Human compares both implementations.
4. If implementations diverge significantly: the Spec or Design is ambiguous. Return to Design phase.
5. If implementations are similar: select the better one, or fuse the best parts of both.

**Example:**
```
Task: Implement cached API client with retry logic.

Claude-4: Uses stale-while-revalidate with memoize.
GPT-4.5: Uses TTL-based cache with exponential backoff.

Comparison:
- Claude's cache invalidation is more sophisticated.
- GPT's error handling covers more HTTP status codes.
- GPT missed connection timeout handling (Claude has it).
- Claude missed 503 retry logic (GPT has it).

→ Human fuses both: Claude's invalidation + GPT's status coverage + adds missing timeout and retry.
```

**Key insight:** When two independent models produce different solutions to the same spec, the problem is usually the **spec**, not the models. The divergence exposes ambiguity that a single model would silently resolve one way.

**Cost:** +100% time, +100% token consumption.
**Benefit:** Exposes spec ambiguity and elevates implementation quality through fusion.

**When to use:**
- Novel algorithms or business logic
- Core infrastructure components (caching, routing, state management)
- When the first model's implementation feels "uncertain"
- When human cannot easily judge if the implementation is correct

---

### Layer 3: Adversarial Cross-Validation

Use one model to attack another model's design.

**Mechanism:**
1. Model A produces a Design.
2. Model B is assigned an **adversarial role**: find every flaw, edge case, security hole, and inconsistency in A's Design.
3. Model A fixes the identified issues.
4. Model B re-attacks the fixed Design.
5. Repeat until B finds no new critical issues or the human declares the risk acceptable.

**Example:**
```
Claude-4: "Authentication flow: user submits credentials → server validates →
           issues JWT → client stores in localStorage."

GPT-4.5 (adversarial): "This design has critical flaws:
  1. localStorage is accessible to XSS — use httpOnly cookies instead.
  2. No rate limiting on login endpoint — vulnerable to brute force.
  3. JWT has no refresh token rotation — stolen tokens are valid forever.
  4. No device fingerprinting — tokens can be replayed across devices.
  5. Missing account lockout after failed attempts."

Claude-4: Fixes all five issues.

GPT-4.5 (re-attack): "Remaining issues:
  1. Cookie SameSite policy not specified.
  2. No audit log for authentication events."

Claude-4: Fixes both.

GPT-4.5 (re-attack): "No critical issues remaining."
```

**Cost:** +50-100% time, +200% token consumption.
**Benefit:** Extremely effective for security-critical and high-risk designs. The adversarial dynamic forces Model A to defend its decisions, surfacing assumptions that would otherwise remain hidden.

**When to use:**
- Security architecture (auth, authorization, cryptography)
- Payment or financial logic
- Data privacy designs (GDPR, HIPAA)
- Multi-tenant isolation schemes

---

## Applicability Matrix

| Task Type | Recommended Layer | Notes |
|-----------|-------------------|-------|
| Security-critical logic | Layer 1 + Layer 3 | Defense in depth |
| Architecture decisions | Layer 1 + Layer 2 | Validate + compare alternatives |
| Complex algorithms | Layer 2 | Expose spec ambiguity |
| API / interface design | Layer 1 | Two perspectives on contracts |
| Novel business logic | Layer 1 or 2 | Depends on complexity |
| Core infrastructure | Layer 2 | Caching, routing, state management |
| UI components | None or Layer 1 | Usually not worth the cost |
| Boilerplate / CRUD | None | Single model is sufficient |
| Tests | Layer 1 | Different models find different edge cases |
| Documentation | None | Low value |
| Hotfixes | None | Speed优先 |

---

## Human Role in Cross-Validation

Cross-validation does not remove the human. It adds more AI output for the human to integrate.

The human is:

- **The integrator**: comparing outputs, resolving contradictions, fusing best parts.
- **The tie-breaker**: when models disagree, the human decides which is correct.
- **The quality gate**: even if two models both approve something, the human still does final review.

### Managing Disagreement

When models disagree:

1. **Check if the disagreement reveals a spec ambiguity.** If so, fix the spec, not the models.
2. **Check if one model has domain knowledge the other lacks.** (e.g., one was trained on more React code)
3. **When in doubt, favor the more conservative option** — the one that is simpler, more explicit, or has fewer implicit assumptions.
4. **Document the disagreement and resolution.** Future-you will want to know why you chose A over B.

---

## Cost-Benefit Analysis

| Layer | Time | Tokens | Cognitive Load | Defect Detection Boost |
|-------|------|--------|----------------|----------------------|
| None (single model) | 1x | 1x | Low | Baseline |
| Layer 1 (review) | 1.3x | 2x | Medium | +25-35% |
| Layer 2 (generation) | 2x | 2x | High | +30-40% + spec clarity |
| Layer 3 (adversarial) | 1.5-2x | 3x | High | +40-60% (security) |

**Rule of thumb**: Use cross-validation when the cost of a defect exceeds the cost of the validation. For a payment system, a missed security flaw costs millions — cross-validation is cheap. For a CSS tweak, a defect costs nothing — cross-validation is waste.

---

## Implementation Guide

### Step 1: Select the Primary Model

This is your default model for the project. Choose based on:
- Your access and cost constraints
- The technology stack (some models are stronger in certain languages)
- Your past experience with model quality

### Step 2: Select the Secondary Model

This model should be **architecturally different** from the primary:
- Different training data (different cutoff, different corpus weighting)
- Different architecture (transformer variant, mixture-of-experts vs dense)
- Different provider (reduces shared infrastructure biases)

Good pairs:
- Claude + GPT (different training data, different safety alignment)
- Claude + Gemini (different architectures)
- GPT + local model (different scale, different cost constraints)

Avoid pairing models that are essentially the same base model with minor fine-tuning differences.

### Step 3: Isolate Context

**Critical**: When Model B reviews Model A's output, Model B must not know it was generated by AI.

Present the artifact neutrally:
```
"Here is a design document for review. Please identify issues, risks, and ambiguities."
[ paste design, no attribution ]
```

If Model B knows the artifact was AI-generated, it may:
- Be lenient ("AI wrote this, probably fine")
- Be hostile ("AI wrote this, probably wrong")
- Pattern-match against known AI failure modes rather than evaluating the substance

### Step 4: Structured Comparison

Do not trust your memory to compare two model outputs. Use a structured format:

```markdown
# Cross-Validation Report: [Feature Name]

## Artifact
- Type: Design / Code / Spec
- Primary Model: Claude-4
- Secondary Model: GPT-4.5

## Issues Found

| Issue | Primary Found? | Secondary Found? | Severity | Resolution |
|-------|---------------|-----------------|----------|------------|
| Missing rate limiting | No | Yes | Critical | Fixed |
| Edge case on empty input | Yes | No | Medium | Fixed |
| Ambiguous error contract | Yes | Yes | High | Spec clarified |

## Unique Insights
- **Primary only**: [what only the primary model caught]
- **Secondary only**: [what only the secondary model caught]

## Disagreements
- [describe any contradictions between models and how resolved]

## Human Decision
- [final verdict]
```

---

## Limitations

Cross-validation is powerful but not magic:

1. **Shared blind spots across all models**: If all major LLMs were trained on similar data with similar biases, cross-validation will not catch those biases. Example: all models may underweight certain accessibility patterns.

2. **Cost is real**: For a team with tight budgets, running every design through two models may be unsustainable. Use selectively.

3. **Diminishing returns**: After 2-3 models, additional models rarely find new critical issues. The marginal value of the fourth model is near zero.

4. **Not a substitute for human expertise**: Cross-validation finds more AI-generated errors. It does not find human conceptual errors in the original requirements.

---

## Bottom Line

> **Single-model collaboration is like a single point of failure.**
> **Cross-validation is redundancy for reasoning.**

Use it for high-stakes decisions. Skip it for low-stakes implementation. The goal is not perfect coverage — it is **asymmetric defense**: cheap to validate, expensive to miss.
