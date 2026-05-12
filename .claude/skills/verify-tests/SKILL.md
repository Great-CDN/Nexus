---
name: verify-tests
description: "Verify that tests cover the acceptance criteria from the spec. Use during the Verify phase after automated tests are written."
disable-model-invocation: true
allowed-tools: Read, Grep, Bash
---

## When to Use

- During the Verify phase
- After tests are written but before Decide
- The user asks "do we have enough tests?" or "check test coverage"

## Process

1. Read the spec's acceptance criteria.
2. Read the test files (use the provided pattern or discover them).
3. Map each acceptance criterion to one or more tests.
4. Identify gaps: criteria with no corresponding test.
5. Report coverage and gaps.

## Rules

- Every acceptance criterion must have at least one verification method:
  - Unit test
  - Integration test
  - Manual verification (documented in test plan)
- Gap reports must be specific: which AC is missing coverage and why.
- The human decides whether to add tests or accept the gap.
- Reference `docs/templates/test-plan.md` for test plan structure.

## Output

A coverage report mapping each AC to its verification method, with explicit gap list.
