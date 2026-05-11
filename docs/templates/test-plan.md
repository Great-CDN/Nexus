# Test Plan: <Feature Name>

## Reference

- Spec: <path>
- Design: <path>

## Scope

<What this test plan covers.>

## Test Levels

### Unit Tests

<Functions/components to test in isolation.>

| Function/Component | Test Cases | Expected Result |
|--------------------|------------|-----------------|
| <Name> | <Cases> | <Result> |

### Integration Tests

<End-to-end flows to test.>

| Flow | Steps | Expected Result |
|------|-------|-----------------|
| <Flow name> | <Steps> | <Result> |

### Manual Verification

<UI/UX aspects that require human eyes.>

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| <Scenario> | <Steps> | <Result> |

## Edge Cases

<Non-obvious cases that must be tested.>

- <Edge case>
- <Edge case>

## Environment

- <Browser / runtime / OS versions>
- <Test data requirements>

## Acceptance Criteria Coverage

| Criterion | Verification Method | Status |
|-----------|---------------------|--------|
| AC-1 | <Test / Manual> | Pass / Fail / Pending |
| AC-2 | <Test / Manual> | Pass / Fail / Pending |

## Notes

<Any dependencies, blockers, or special setup.>

---

## Quality Checklist

Run this before declaring the test plan complete.

- [ ] **Accurate**: Every test case specifies exact input values and expected outputs, not descriptions.
- [ ] **Accurate**: Environment section lists exact versions (browser, runtime, OS, dependency versions).
- [ ] **Complete**: Every acceptance criterion from the spec appears in the coverage table with a verification method.
- [ ] **Complete**: Edge cases cover at least: empty input, maximum size, invalid format, network failure, boundary values.
- [ ] **Complete**: Manual verification scenarios include exact steps a human can follow without interpretation.
- [ ] **Simple**: No duplication of spec or design content; cross-reference instead.
- [ ] **Simple**: Test cases are grouped by level (unit / integration / manual) with no overlap.
- [ ] **Explicit**: Test data requirements state what data must exist, in what state, and how to set it up.
- [ ] **Explicit**: Each edge case states the condition that triggers it and the expected system behavior.
