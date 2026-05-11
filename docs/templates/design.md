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
