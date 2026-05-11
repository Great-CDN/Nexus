---
name: review-code
description: "Run the Nexus code review protocol against current changes. Use after AI generates code and before the human commits it."
disable-model-invocation: true
allowed-tools: Read, Grep, Bash
---

## When to Use

- The user asks to review code
- Before committing AI-generated changes
- The user says "review this" or "check my changes"

## Process

1. Identify the changes (staged via `git diff --staged`, unstaged via `git diff`, or specific files).
2. Read the relevant spec and design documents if paths are provided.
3. Run the Code Review Checklist from `docs/PROTOCOLS.md`:
   - Spec Alignment
   - Design Alignment
   - Correctness (trace logic, check edge cases)
   - Test Coverage
   - No Unnecessary Changes
   - Security (injection, XSS, CSRF, secrets)
   - Performance (N+1, re-renders, blocking)
   - Readability (understandable in 30 seconds)
4. Produce a review report using `docs/templates/review.md`.
5. Give a verdict: Approve / Approve with notes / Request changes.

## Rules

- Review against the spec, not intuition. If there is no spec, refuse to approve and ask for one.
- Every issue must have a severity (Critical / High / Medium / Low) and a file location.
- No soft approvals. If there are issues, the verdict is Request changes.
- The human makes the final approve/reject decision. AI only recommends.

## Output

A written review report with explicit verdict and issue list.
