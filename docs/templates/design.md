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

| ID | Task | Est. | Depends On |
|----|------|------|------------|
| T1 | <Task description> | <Time> | - |
| T2 | <Task description> | <Time> | T1 |

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| <What could go wrong> | Low/Med/High | Low/Med/High | <How to handle> |

## Notes

<Any additional technical notes or references.>

---

## Quality Checklist

Run this before declaring the design complete.

- [ ] **Accurate**: Every interface contract uses exact type signatures and literal names; no placeholders like `any` or `TBD`.
- [ ] **Accurate**: Rejected alternatives are documented with the specific reason for rejection (not just "didn't choose").
- [ ] **Complete**: Every acceptance criterion from the spec maps to at least one design element.
- [ ] **Complete**: Error paths are described with the same detail as success paths (status codes, error types, fallback behavior).
- [ ] **Complete**: Task breakdown covers the full spec with no gaps; every spec item appears in at least one task.
- [ ] **Simple**: Design is under 800 lines. If longer, the feature should be decomposed into sub-systems with separate designs.
- [ ] **Simple**: No duplication of spec content; cross-reference the spec instead of restating it.
- [ ] **Explicit**: Every architectural decision includes the constraint or requirement that drove it.
- [ ] **Explicit**: Every risk includes a concrete mitigation, not just "will monitor".
- [ ] **Explicit**: Task estimates include units (minutes / hours) and dependencies are explicit.
