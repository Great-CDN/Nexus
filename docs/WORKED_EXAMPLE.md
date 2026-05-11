# Worked Example: Rule Editor

This example demonstrates the complete Nexus workflow on a real feature from the GreatCDN project: the **Rule Editor** — a visual rule builder for CDN configuration.

This is a demonstration, not production documentation. It shows what each phase produces and how the artifacts connect.

---

## Background

In GreatCDN, users configure CDN behavior through rules (e.g., "if path matches `/api/*`, then cache for 300s"). The Rule Editor is a visual, category-based rule builder with an 8-phase execution pipeline.

---

## Phase 1: Requirements

### Output: `PRODUCT_SPEC.md`

```markdown
# Spec: Visual Rule Editor

## Problem

Users currently configure CDN rules through raw JSON. This is error-prone, requires knowledge of the rule schema, and provides no validation. We need a visual rule editor that allows non-technical users to build and validate rules through a GUI.

## Scope

- Visual rule builder with drag-and-drop or form-based rule construction
- 8 execution phases: Request, Authentication, Routing, Caching, Header, Compression, Security, Response
- Category-based rule organization (each rule belongs to one phase)
- Real-time validation of rule syntax and logic
- Rule preview showing effective configuration
- Import/export of rule sets as JSON

## Non-Goals

- Real-time traffic simulation (out of scope for MVP)
- AI-assisted rule suggestion
- Multi-user collaborative editing
- Rule versioning / rollback
- Support for custom JavaScript rules

## Acceptance Criteria

- [ ] AC-1: User can create a rule by selecting a phase, condition type, operator, and value
- [ ] AC-2: User can reorder rules within a phase via drag-and-drop
- [ ] AC-3: Invalid rules show error indicators with specific messages
- [ ] AC-4: Rule set can be exported as valid JSON matching the backend schema
- [ ] AC-5: Rule set can be imported from JSON and rendered correctly
- [ ] AC-6: UI displays which phase each rule belongs to with visual distinction
- [ ] AC-7: Editor supports at least 20 rules per phase without performance degradation (<100ms re-render)

## Assumptions

- Backend rule schema is stable (v2 API)
- Ant Design Pro components are available
- User is authenticated and has write permissions

## Dependencies

- `src/types/index.ts` Rule types must be finalized
- Backend `/api/v2/rules/validate` endpoint must exist

## Open Questions

| Question | Owner | Due Date |
|----------|-------|----------|
| Should rules be saved incrementally or on explicit save? | Product | 2026-05-15 |
| Do we need undo/redo for rule operations? | Product | 2026-05-15 |
```

### Snapshot

```
sessions/
  2026-05-11-rule-editor/
    01-requirements/
      context.md          # "Create spec for Rule Editor"
      spec-v1.md          # (copy of above)
      output.md           # (AI-interview transcript)
      verdict.md          # Approve — spec complete, open questions assigned
```

---

## Phase 2: Design

### Output: `DESIGN_DOC.md`

```markdown
# Design: Visual Rule Editor

## Reference

- Spec: `sessions/2026-05-11-rule-editor/01-requirements/spec-v1.md`

## Architecture Decision

### Chosen: Component-based with centralized state

A single `RuleEditor` container manages all rule state. Child components (`RuleList`, `RuleItem`, `PhaseHeader`) are pure presentational. State flows top-down; events bubble up.

**Why**: Matches existing React patterns in GreatCDN. Zustand store is unnecessary for this level of complexity.

### Rejected: Zustand store per phase

Each phase would have its own store slice.

**Why rejected**: Overkill. Rule operations are cross-phase (drag between phases). A single state container is simpler.

## Interface Contracts

### Types

```typescript
// src/types/rule-editor.ts
interface Rule {
  id: string;
  phase: RulePhase;
  priority: number;
  enabled: boolean;
  conditions: Condition[];
  actions: Action[];
}

type RulePhase = 'request' | 'auth' | 'routing' | 'caching' | 'header' | 'compression' | 'security' | 'response';

interface Condition {
  field: string;
  operator: 'eq' | 'neq' | 'contains' | 'regex' | 'startsWith' | 'endsWith';
  value: string;
}

interface Action {
  type: string;
  params: Record<string, unknown>;
}

interface ValidationError {
  ruleId: string;
  field: string;
  message: string;
}
```

### Components

```typescript
// RuleEditor.tsx
export default function RuleEditor(props: {
  initialRules: Rule[];
  onChange: (rules: Rule[]) => void;
  onValidate: (errors: ValidationError[]) => void;
}): JSX.Element;

// RuleList.tsx
function RuleList(props: {
  phase: RulePhase;
  rules: Rule[];
  onReorder: (ruleId: string, newPriority: number) => void;
  onDelete: (ruleId: string) => void;
}): JSX.Element;
```

## Data Model

- Rules are stored as an ordered array in component state.
- Priority is derived from array index within each phase.
- No server state sync during editing; batch save on explicit action.

## Error Handling

- Validation runs on every rule change (debounced 300ms).
- Errors displayed per rule with inline indicators.
- Export blocked if validation errors exist.

## Task Breakdown

| ID | Task | Est. | Depends On |
|----|------|------|------------|
| T1 | Create Rule types and validation utilities | 30m | - |
| T2 | Implement RuleEditor container with state management | 45m | T1 |
| T3 | Implement RuleList with drag-and-drop reordering | 60m | T2 |
| T4 | Implement RuleItem with condition/action editors | 60m | T2 |
| T5 | Implement PhaseHeader with rule count and toggle | 30m | T2 |
| T6 | Implement JSON import/export | 45m | T1 |
| T7 | Integrate with Domain detail page | 30m | T3, T4, T5, T6 |
| T8 | Write unit tests for validation utilities | 30m | T1 |
| T9 | Write unit tests for state transitions | 30m | T2 |

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Drag-and-drop library conflicts with Ant Design | Low | High | Use `@dnd-kit/core` (battle-tested, no jQuery) |
| Performance with 20+ rules | Medium | Medium | Virtualize list if profiling shows issues |
```

### Snapshot

```
sessions/2026-05-11-rule-editor/
  02-design/
    context.md          # Spec-v1 + "Design Rule Editor"
    spec-v1.md          # (copy)
    design-v1.md        # (copy of above)
    verdict.md          # Approve — design covers all ACs, task breakdown accepted
```

---

## Phase 3: Implementation

### Session: T1 — Create Rule types and validation utilities

#### Context Package

```
Phase: Implementation
Task: T1

Spec (relevant):
- AC-3: Invalid rules show error indicators with specific messages
- AC-4: Rule set can be exported as valid JSON

Design (relevant):
- Types defined in src/types/rule-editor.ts
- Validation utilities needed for Rule conditions

Existing code:
[paste src/types/index.ts — Result type, existing rule types]

Constraints:
- Must use existing Result type from src/types/index.ts
- No external validation libraries

What to do:
Implement Rule types in src/types/rule-editor.ts and validation utilities in src/utils/rule-validation.ts with full test coverage.
```

#### Output

- `src/types/rule-editor.ts` — Type definitions
- `src/utils/rule-validation.ts` — `validateRule()`, `validateCondition()` functions
- `src/utils/rule-validation.test.ts` — Unit tests

#### Review Verdict

```markdown
# Review: T1

## Spec Alignment
- AC-3: Partial — validation logic exists but error messages need i18n keys
- AC-4: Pass — types match JSON export schema

## Issues
| Severity | Issue | Resolution |
|----------|-------|------------|
| Medium | Error messages are hardcoded English | Add i18n keys, fix in T4 |

## Verdict: Approve with notes
```

#### Commit

```
feat(rule-editor): add Rule types and validation utilities (T1)

- Define Rule, Condition, Action, ValidationError types
- Implement validateRule and validateCondition
- Add unit tests for valid/invalid conditions

Refs: AC-3, AC-4
```

### Snapshot

```
sessions/2026-05-11-rule-editor/
  03-implementation/
    T1/
      context.md
      spec-v1.md
      design-v1.md
      task-T1.md
      diff.patch
      verdict.md          # Approve with notes
```

### Remaining Tasks

T2 through T9 follow the same pattern: one session per task, explicit context, review, commit, snapshot.

---

## Phase 4: Testing

### Output: `TEST_PLAN.md`

```markdown
# Test Plan: Rule Editor

## Scope
All Rule Editor functionality: CRUD operations, validation, import/export, drag-and-drop.

## Unit Tests

| Function | Test Cases | Status |
|----------|------------|--------|
| validateCondition | valid eq, invalid regex, empty value, null input | Pass |
| validateRule | all conditions valid, one invalid, empty rule | Pass |
| reorderRules | move up, move down, cross-phase move | Pass |

## Integration Tests

| Flow | Steps | Status |
|------|-------|--------|
| Create and save rule | Open editor → Add rule → Fill condition → Save → Verify API call | Pass |
| Import JSON | Click import → Paste JSON → Verify rendered rules match | Pass |
| Export JSON | Add rules → Click export → Verify JSON matches schema | Pass |

## Manual Verification

| Scenario | Steps | Status |
|----------|-------|--------|
| Drag rule between phases | Drag rule from Caching to Header → Verify phase change | Pass |
| Error display | Enter invalid regex → Verify red border + tooltip | Pass |
| Performance at 20 rules | Add 20 rules → Measure re-render | Pass (85ms) |

## Edge Cases

- Empty rule set export produces valid `[]`
- Import with unknown fields ignores extra fields
- Rapid add/delete does not leave orphaned state

## Acceptance Criteria Coverage

| Criterion | Method | Status |
|-----------|--------|--------|
| AC-1 | Manual + Unit | Pass |
| AC-2 | Manual | Pass |
| AC-3 | Unit + Manual | Pass |
| AC-4 | Integration | Pass |
| AC-5 | Integration | Pass |
| AC-6 | Manual | Pass |
| AC-7 | Manual | Pass |
```

### Snapshot

```
sessions/2026-05-11-rule-editor/
  04-testing/
    test-plan.md
    test-results.log
    verdict.md          # Pass — all ACs covered, no critical bugs
```

---

## Phase 5: Acceptance

### Output: `ACCEPTANCE_REPORT.md`

```markdown
# Acceptance: Rule Editor

## Spec Alignment

| Criterion | Status | Evidence |
|-----------|--------|----------|
| AC-1 | Pass | Screenshot: rule creation form with all fields |
| AC-2 | Pass | Screen recording: drag-and-drop reordering |
| AC-3 | Pass | Screenshot: invalid rule with red border and tooltip |
| AC-4 | Pass | Exported JSON validated against backend schema |
| AC-5 | Pass | Import test with sample JSON file |
| AC-6 | Pass | Screenshot: 8 phase columns with distinct colors |
| AC-7 | Pass | React DevTools Profiler: 85ms re-render at 20 rules |

## Design Alignment

| Element | Status | Deviation |
|---------|--------|-----------|
| Component structure | Aligned | None |
| Types | Aligned | None |
| State management | Aligned | None |

## Technical Debt

| Item | Priority | Notes |
|------|----------|-------|
| i18n for error messages | Should Fix | Noted in T1 review, deferred to maintenance |
| Virtualization for 50+ rules | Could Fix | Not needed for current scope |

## Verdict: Approve

## Human Decision

**Decision:** Go

**Reasoning:** All acceptance criteria met. Technical debt is non-blocking and documented.
```

### Snapshot

```
sessions/2026-05-11-rule-editor/
  05-acceptance/
    acceptance-report.md
    screenshots/
    verdict.md          # Go
```

---

## Phase 6: Maintenance

### Scenario: User reports that imported rules lose their priority order

### Output: Change Log Entry

```markdown
# Change Log Entry

## Date
2026-05-18

## Type
Bug fix

## Reference
- Issue: "Imported rules don't maintain priority order"
- Commit: `a1b2c3d`

## Summary
Fix priority ordering bug in Rule Editor JSON import.

## Details
Import logic was assigning priorities based on import array index instead of preserving the `priority` field from JSON. Fixed by reading `priority` from imported rule and sorting after import.

## Impact
All users who import rule sets from JSON.

## Verification
- [x] Unit test added for priority preservation
- [x] Manual test with sample JSON
- [x] Documentation updated (no changes needed)

## Notes
Root cause: assumption that array index equals priority. This broke when rules were exported from a reordered list.
```

### Snapshot

```
sessions/2026-05-18-rule-editor-import-fix/
  06-maintenance/
    context.md
    spec-v1.md          # Referenced to confirm scope
    design-v1.md
    change-log.md
    diff.patch
    verdict.md          # Approve — fix minimal, tests pass
```

---

## Key Observations from This Example

1. **Every phase produces a document**. There is no "just know" state.
2. **Snapshots are copies, not links**. The Design snapshot contains a copy of the spec, ensuring the design context is frozen.
3. **Reviews are specific**. T1's review identified a real issue (hardcoded English) with a specific fix target (T4).
4. **Acceptance has evidence**. Screenshots, recordings, and profiler data — not just "it works."
5. **Maintenance references the original spec**. Even a one-line fix connects back to the design and acceptance criteria.
