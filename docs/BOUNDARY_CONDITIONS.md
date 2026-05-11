# Boundary Conditions

Nexus is built on assumptions. When those assumptions hold, the methodology works. When they do not, the methodology does not break — it becomes **undefined behavior**.

This document states the assumptions explicitly so you know when to trust the process and when to override it.

---

## 1. Reproducibility is Traceability, Not Determinism

**Assumption**: Snapshots and context packages make AI collaboration reproducible.

**Reality**: AI output is non-deterministic. Temperature, sampling, model weight updates, and silent context truncation make identical outputs impossible. Snapshots provide **traceability** (you can see what happened) and **auditability** (you can verify decisions), not **reproducibility** (you cannot replay the session and get the same tokens).

**Boundary**: Nexus provides post-hoc auditability, not deterministic replay. Do not expect the same input to produce the same output.

**When to override**: If you need bit-for-bit reproducibility, do not use LLMs. Use formal methods or handwritten code.

---

## 2. Human Review is Sampling, Not Exhaustive

**Assumption**: Human review catches AI errors.

**Reality**: AI generates thousands of lines per hour. Humans review 200-400 lines per hour before fatigue. For any project beyond trivial scale, human review is **statistical sampling**, not comprehensive verification.

**Boundary**: The methodology assumes the human can review enough to catch critical errors. This assumption fails when output size exceeds review capacity. The 200-line / 30-minute chunk limit is an admission of this boundary, not a solution to it.

**When to override**: For large-scale changes, accept that you are sampling. Design explicit sampling strategies (review entry points, error paths, and random samples) rather than pretending comprehensive review is possible.

---

## 3. The Human is an Unvalidated Single Point of Failure

**Assumption**: Human final judgment prevents error propagation.

**Reality**: Humans make mistakes, overlook details, and suffer from automation bias ("Claude checked it, so it must be safe"). The entire quality chain depends on human judgment, but there is no mechanism to verify that judgment.

**Boundary**: Nexus trades detection of AI errors for tolerance of human errors. It detects when AI deviates from spec. It does not detect when the spec itself is wrong, when the human misreads code, or when the human approves out of fatigue.

**When to override**: For high-stakes decisions, add independent human review or cross-validation of the human's own judgment (e.g., re-review your own approval after a 24-hour cooldown).

---

## 4. The Spec is Human Discipline, Not an AI Contract

**Assumption**: A spec is a contract that binds AI behavior.

**Reality**: A spec cannot bind a probability distribution. AI will deviate. The spec's real function is forcing the human to clarify their own thinking before generating. It is a **human self-discipline tool**, not an AI constraint.

**Boundary**: Review against spec detects AI deviation from human intent. It does not prevent deviation. Do not conflate "AI followed the spec" with "the output is correct."

**When to override**: If the spec itself is ambiguous, stop and fix the spec. Do not assume multiple AI implementations of the same ambiguous spec will converge on the correct interpretation.

---

## 5. Cognitive Load Has a Ceiling

**Assumption**: Humans can execute the full process (spec, design, review, metrics, triage) consistently.

**Reality**: Every checklist item, template field, and metric calculation consumes working memory and decision capacity. The process itself introduces cognitive overhead. At some point, the overhead of following the methodology exceeds the cognitive capacity available for actual engineering judgment.

**Boundary**: Nexus assumes the human is metacognitively skilled (able to self-monitor judgment quality). This is not true for all humans in all states. Process fatigue is not just about time — it is about decision depletion.

**When to override**: If you find yourself mechanically checking boxes without thinking, stop. The process has become cargo cult. Take a break, reduce intensity (switch to Light Workflow), or skip a non-critical verification step.

---

## 6. Nexus is Not Economically Justified for All Projects

**Assumption**: The methodology's verification overhead is worth the defect prevention.

**Reality**: Verification costs are fixed (time, cognitive energy) while defect costs are variable (severity × probability). For low-value projects, the cost of finding and preventing a defect may exceed the cost of the defect itself.

**Boundary**: Nexus is designed for code that must be correct and maintainable. For disposable scripts, personal learning projects, or prototypes, the overhead is unjustified.

**When to override**: Use the triage protocol honestly. If a button color change triggers Full Workflow, you are misapplying the methodology. If a payment system skips review, you are reckless. The boundary is economic: defect cost must exceed verification cost.

---

## 7. Capability Boundaries Are Empirical, Not Theoretical

**Assumption**: The Capability Matrix predicts where AI fails.

**Reality**: The matrix is an empirical observation of current models at a point in time. It provides no underlying theory for why a task falls into a category. When models improve or new architectures emerge, the matrix becomes stale.

**Boundary**: The matrix cannot predict the capability classification of a novel task without referring to the list. It must be manually updated for every significant model advancement.

**When to override**: Treat the matrix as a starting hypothesis, not gospel. If a "Red Zone" task succeeds on the first try, update your assessment. If a "Green Zone" task fails repeatedly, downgrade it.

---

## 8. Conversation Has Value That Structured Artifacts Discard

**Assumption**: Structured context packages are superior to conversational exploration.

**Reality**: Back-and-forth conversation resolves ambiguity faster than structured documents. The act of conversing helps humans clarify thinking (the "rubber duck" effect). Important information emerges in dialogue that is never captured in formal artifacts.

**Boundary**: Nexus prioritizes auditability over conversational fluidity. This is a tradeoff, not an absolute truth. You may lose valuable insights by forcing everything into formal artifacts.

**When to override**: If a conversation is producing clarity faster than spec-writing, have the conversation first. Capture the outcome in a spec afterward. Do not let the process prevent useful dialogue.

---

## 9. Process Compliance is a Motivation Problem

**Assumption**: Humans will follow the process if it is not too burdensome.

**Reality**: Humans violate processes when they do not see value, when processes frustrate goals, or when they believe they can achieve better results without them. Process fatigue is a motivational failure, not a design failure.

**Boundary**: Nexus provides no mechanism for building process buy-in, validating that the process works for a specific human, or gracefully degrading when the human starts shortcutting.

**When to override**: If you find yourself consistently skipping steps, ask whether the process is wrong for you or whether you are wrong for the process. Either is valid. Do not force compliance.

---

## 10. AI Introduces New Attack Surfaces

**Assumption**: Security is a property of the code being built.

**Reality**: AI-assisted development introduces security risks unrelated to the final product: prompt injection, training data leakage, context window side-channels, and automation bias (trusting AI-generated security code because "it looks right").

**Boundary**: Nexus treats security as a task category (Red Zone tasks) and a review target. It does not address AI-specific threat models.

**When to override**: Define a security boundary for AI sessions. Never paste credentials, private keys, PII, or internal system topology into an AI context. Treat the AI provider as a semi-trusted third party.

---

## Bottom Line

Nexus is not a universal solution. It is a set of guardrails that work within specific boundaries. Outside those boundaries, the methodology is undefined — and pretending otherwise is more dangerous than admitting limitation.

Use Nexus when:
- The code must be correct and maintainable.
- The human has enough cognitive bandwidth to execute the process.
- Defect cost exceeds verification cost.
- The project scale allows meaningful human review.

Do not use Nexus when:
- Correctness does not matter.
- The human is exhausted or disengaged.
- The process has become mechanical box-checking.
- You need deterministic reproducibility.

The boundary is the methodology. Respect it.
