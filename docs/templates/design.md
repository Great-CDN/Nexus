# Design: <Feature Name>

## Reference

- Spec: <path to PRODUCT_SPEC.md>

## Architecture Decision

<The chosen architecture. Include at least one rejected alternative and why it was rejected.>

### Chosen: <Option A>

<Description>

### Rejected: <Option B>

<Description>

**Why rejected:** <Reason>

## Interface Contracts

<All public interfaces: function signatures, types, API endpoints, props.>

### Types

```typescript
// Example:
interface DomainValidator {
  validate(name: string): Result<Domain, ValidationError>;
}
```

### Functions / API

<List with signatures>

## Data Model

<If applicable: entities, relationships, state shape.>

## Error Handling

<How errors are propagated, logged, and displayed.>

## Task Breakdown

<List of implementation tasks. Each task should be <= 2 hours estimated work.>

| ID | Task | Est. (minutes) | Depends On |
|----|------|----------------|------------|
| T1 | <Task description> | <e.g. 90> | - |
| T2 | <Task description> | <e.g. 60> | T1 |

**Validation rule**: No task may exceed 120 minutes (2 hours). If a task estimate exceeds 120 minutes, split it into smaller sub-tasks.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| <What could go wrong> | Low/Med/High | Low/Med/High | <How to handle> |

## Notes

<Any additional technical notes or references.>

---

## Quality Checklist

Run `CHECKLIST: Artifact Quality` from `docs/CHECKLISTS.md` first. Then verify these template-specific items:

- [ ] **Accurate**: Every interface contract uses exact type signatures and literal names; no placeholders like `any` or `TBD`.
- [ ] **Accurate**: Rejected alternatives are documented with the specific reason for rejection (not just "didn't choose").
- [ ] **Complete**: Every acceptance criterion from the spec maps to at least one design element.
- [ ] **Complete**: Error paths are described with the same detail as success paths (status codes, error types, fallback behavior).
- [ ] **Complete**: Task breakdown covers the full spec with no gaps; every spec item appears in at least one task.
- [ ] **Simple**: No duplication of spec content; cross-reference the spec instead of restating it.
- [ ] **Explicit**: Every risk includes a concrete mitigation, not just "will monitor".
- [ ] **Explicit**: Task estimates include units (minutes) and dependencies are explicit; no task exceeds 120 minutes.
