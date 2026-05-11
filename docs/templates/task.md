# Task: <Task ID> — <Brief Description>

## Reference

- Spec: <path>
- Design: <path>, Section <X>
- Task ID: <T1, T2, etc.>

## Goal

<One sentence: what this task produces.>

## Context

<Paste relevant existing code: types, interfaces, patterns AI must follow.>

## Requirements

<What must this task satisfy? Reference acceptance criteria from spec.>

- 
- 

## Constraints

<Hard constraints not in the spec.>

- 

## Expected Output

<What files or changes should exist when done?>

- [ ] <File/change>
- [ ] Tests for <File/change>

## Verification

<How to verify this task is complete.>

- [ ] Code reviewed against design.
- [ ] Tests pass.
- [ ] Manual verification (if UI).

---

## Quality Checklist

Run this before starting implementation of this task.

- [ ] **Accurate**: All referenced spec ACs and design sections use exact IDs and section names.
- [ ] **Accurate**: Pasted existing code (types, interfaces, patterns) is verbatim, not summarized.
- [ ] **Complete**: A different engineer could pick up this task and implement it without asking questions.
- [ ] **Complete**: Expected output lists every file or change that must exist when done.
- [ ] **Simple**: Task scope fits in one session (≤ 2 hours). If larger, it must be split into sub-tasks.
- [ ] **Simple**: No redundant context already present in the spec or design; reference instead of paste.
- [ ] **Explicit**: Constraints state what happens if violated (e.g., "Must not exceed 100KB; if exceeded, split into chunks").
- [ ] **Explicit**: Verification criteria specify how to verify, not just what to verify (e.g., "Run `npm test -- src/foo.test.ts`" not "tests pass").
