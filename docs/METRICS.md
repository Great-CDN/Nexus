# Metrics

Nexus is a process. Like any process, it can be measured. These metrics tell you whether the methodology is working or whether it needs adjustment.

## Why Metrics Matter

Without measurement, you cannot distinguish between "this is working" and "this feels right." Metrics prevent both optimism bias ("it went fine") and pessimism bias ("this is too slow").

## Core Metrics

### 1. Rework Rate

**Definition**: Percentage of tasks that require revision after the initial implementation.

Split into two sub-metrics for diagnostic clarity:

```
Upstream Rework Rate = (Tasks requiring spec or design revision) / (Total tasks) * 100%
Execute Rework Rate  = (Tasks requiring code fix only) / (Total tasks) * 100%
Total Rework Rate    = Upstream + Execute
```

**Target**: Total < 20%

**Source**: Empirical heuristic based on industry code review data (Google CR Research 2018 reports ~15-25% rework rates for teams with mandatory review). Single-author AI-assisted projects may deviate significantly — treat 20% as a starting point and adjust based on your project's data.

**What it tells you**:
- High *Upstream* Rework means the spec or design was unclear before execution started. Fix the Specify or Design phase.
- High *Execute* Rework means the coding process is unstable. Fix the context packaging or task sizing.

**Collection**: Count from review verdicts in session snapshots. Light Workflow tasks are excluded from this metric because snapshots are optional for Light Workflow.

---

### 2. Spec Stability

**Definition**: Number of spec revisions after the Design phase has started.

```
Spec Stability = (Spec versions at acceptance) / (Spec versions at design start)
```

**Target**: 1.0 (no revisions)

**Acceptable**: <= 1.2 (one minor revision)

**Source**: Ideal target. Acceptable threshold is an empirical heuristic from software engineering practice.

**What it tells you**: Values above 1.2 indicate the spec was not well-understood before design. Slow down the Specify phase.

**Collection**: Count spec versions in `sessions/` directory.

---

### 3. First-Pass Review Rate

**Definition**: Percentage of tasks that pass review without changes on the first attempt.

```
First-Pass Rate = (Tasks with Approve verdict) / (Total tasks reviewed) * 100%
```

**Target**: > 60%

**Source**: Empirical heuristic. Rates below 30% suggest AI-context mismatch; rates above 90% suggest insufficient review rigor.

**What it tells you**: Very low (< 30%) means AI is not understanding the spec. Very high (> 90%) may mean the review is too lenient.

**Collection**: Count from review verdicts.

---

### 4. Bug Escape Rate

**Definition**: Bugs found after acceptance (in production or late testing) per feature.

```
Bug Escape Rate = (Bugs found post-acceptance) / (Features shipped)
```

**Target**: < 0.5 (one bug every two features)

**Source**: Empirical heuristic for non-critical projects. Safety-critical systems should target near-zero escapes.

**What it tells you**: Escaped bugs mean the Verify or Decide checklist was ineffective. Review the checklists.

**Collection**: Track in maintenance snapshots.

---

### 5. Context Reload Frequency

**Definition**: How often a session must be restarted because context was lost or incomplete.

```
Reload Frequency = (Sessions restarted due to context issues) / (Total sessions) * 100%
```

**Target**: < 10%

**What it tells you**: High reload frequency means the Context Packaging Protocol is not being followed. Review the protocol.

**Collection**: Self-reported in session notes.

---

### 6. Phase Dwell Time

**Definition**: Time spent in each phase, per feature.

| Phase | Target | Warning |
|-------|--------|---------|
| Discover | 10-20 min | > 30 min |
| Specify | 10-30 min | > 1 hour |
| Design | 20-60 min | > 2 hours |
| Execute (per task) | 30-120 min | > 2 hours |
| Verify | 20-40 min | > 1 hour |
| Decide | 10-20 min | > 30 min |
| Maintenance (per fix) | 15-30 min | > 1 hour |

**What it tells you**: Excessive dwell time in any phase indicates the scope is too large or the phase is not well-defined.

**Note on scope**: These targets apply to a feature of typical scope (3-7 execution tasks). A feature with significantly more tasks will scale proportionally; use the per-task Execute target to estimate.

**Collection**: Self-reported or derived from session timestamps.

---

### 7. Cognitive Load Ratio

**Definition**: Ratio of human decision time to total session time.

```
Cognitive Load Ratio = (Human active time) / (Total session time) * 100%
```

**Target**: 40-60%

**What it tells you**: Below 40% means the human is disengaged (AI is doing too much unsupervised). Above 60% means the human is doing too much manual work (AI is not contributing enough).

**Collection**: Estimate per session. Human active time = reading + reviewing + deciding + writing context.

**Note on review limits**: The Execute checklist limits review to 200 lines or 30 minutes per chunk, whichever comes first. For sessions approaching the 120-minute maximum, split large reviews across multiple sessions to keep Cognitive Load Ratio within target.

## Measurement Cadence

| Metric | When to Review |
|--------|----------------|
| Rework Rate | After every feature |
| Spec Stability | After every feature |
| First-Pass Rate | Weekly |
| Bug Escape Rate | Monthly |
| Reload Frequency | Weekly |
| Phase Dwell Time | After every feature |
| Cognitive Load Ratio | Weekly |

## What to Do When Metrics Are Off

| Symptom | Likely Cause | Action |
|---------|-------------|--------|
| High rework, high spec stability | Design is unclear | Strengthen Design checklist |
| High rework, low spec stability | Specify was wrong | Slow down Specify phase |
| Low first-pass, high reload | Context packaging is bad | Review Context Packaging Protocol |
| High bug escape | Verify checklist is weak | Add more edge case checks |
| Long dwell in Execute | Tasks are too large | Break down tasks further |
| Low cognitive load | Human is not reviewing | Enforce Review protocol |
| High cognitive load | AI is not generating useful output | Improve context quality |

## Anti-Patterns

- **Gaming metrics**: Do not optimize metrics at the expense of quality. A 100% first-pass rate achieved by skipping review is worse than a 50% rate with honest review.
- **Metrics without action**: If you measure but do not adjust the process based on results, the measurement is waste.
- **Comparing across projects**: Metrics are project-specific. A rework rate of 30% may be fine for a research prototype and terrible for a payment system.

---

## Validating Nexus Itself

Nexus is a hypothesis. Like any hypothesis, it must be tested. This section tells you how to validate whether Nexus is actually helping your project.

### Baseline Period (Weeks 1-2)

Before applying Nexus, establish a baseline:

1. Work for 2 weeks using your current method (pure chat, ad-hoc review, whatever you do now).
2. Track these manually:
   - How many features did you ship?
   - How many bugs were found after shipping?
   - How many times did you rewrite code because spec changed mid-execution?
   - How stressed did you feel about code quality (1-10)?

This is your baseline. Do not skip this. Without a baseline, you cannot know if Nexus improved anything.

### Validation Milestones

#### Month 1: Adoption Check

| Question | Target | If Not Met |
|----------|--------|------------|
| Are you using Triage correctly? | 70% Light, 20% Full, 10% Hotfix | You are using Full for everything. Review Triage Protocol. |
| Are specs being written before code? | > 80% of features | You are still chatting your way to solutions. Enforce Spec > Prompt. |
| Are automated checks running? | > 90% of commits | Set up CI or pre-commit hooks. |
| How does process overhead feel? | Manageable (not suffocating) | You are using Full Workflow too often. Switch more tasks to Light Workflow. |

#### Month 3: Effectiveness Check

Compare Month 3 metrics to your baseline:

| Metric | Baseline | Month 3 | Improvement? |
|--------|----------|---------|--------------|
| Bugs found post-shipping | X | Y | Y < X? |
| Rewrites due to unclear spec | X | Y | Y < X? |
| Time from "start feature" to "ship feature" | X | Y | Comparable or better? |
| Subjective code quality confidence | X | Y | Y > X? |

**Expectation**: Bug escape rate and requirement rewrites should decrease. Delivery time may stay the same or slightly increase (you are trading speed for correctness). Confidence should increase.

#### Month 6: Maturity Check

At 6 months, Nexus should feel natural, not forced:

- You write specs without being reminded.
- You catch yourself before starting a new task without context.
- Your rework rate is stable and predictable.
- You know when to use Light Workflow vs. Full Workflow instinctively.

If Nexus still feels like a burden at Month 6, either:
1. The project is fundamentally unsuited to Nexus (too small, too experimental), or
2. You are not using Triage correctly, or
3. The process needs adjustment for your specific context.

### When to Abandon Nexus

Abandon Nexus if:

- After 3 months, bug escape rate has **increased** (the process is not helping).
- After 3 months, delivery time has **doubled** without a corresponding quality improvement (the process is too heavy).
- You consistently find yourself **bypassing** the process because "it is faster this way" (the process has lost credibility).
- The project is **shutting down** or pivoting to pure exploration.

Abandoning Nexus is not failure. It is data-driven decision-making. The goal is working software, not process compliance.

### When to Evolve Nexus

Evolve Nexus (modify templates, checklists, or protocols) if:

- A metric is consistently off-target and the root cause is a process gap.
- You discover a pattern that works better than the documented one.
- The project has scaled beyond the current process's assumptions (e.g., from single-author to team, from 10K to 100K lines).

Document your evolutions. If you change a template, version it. If you drop a checklist item, record why. Nexus is not scripture — it is a starting point.
