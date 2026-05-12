# Review: <Feature Name>

## Reference

- Spec: <path>
- Design: <path>
- Implementation: <branch / commit range>

## Review Date

<YYYY-MM-DD>

## Reviewer

<Human name>

## Spec Alignment

<Does the implementation match the spec? List any deviations.>

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1 | Pass / Fail / Partial | <Notes> |
| AC-2 | Pass / Fail / Partial | <Notes> |
| AC-3 | Pass / Fail / Partial | <Notes> |

## Design Alignment

<Does the implementation match the design? List deviations with justification.>

| Design Element | Status | Deviation Justification |
|----------------|--------|-------------------------|
| <Element> | Aligned / Deviation | <If deviation, why?> |

## Code Quality

<Review findings.>

- **Correctness:** <Assessment>
- **Test Coverage:** <Assessment>
- **Security:** <Assessment>
- **Performance:** <Assessment>
- **Readability:** <Assessment>

## Issues Found

| Severity | Issue | Location | Resolution |
|----------|-------|----------|------------|
| Critical / High / Medium / Low | <Description> | <File:line> | <Fix / Accept / Defer> |

See `docs/protocols/definitions.md` for severity level definitions.

## Technical Debt

| Item | Priority | Notes |
|------|----------|-------|
| <Debt item> | Must Fix / Should Fix / Could Fix | <Why and when> |

## Verdict

- [ ] **Approve** — No issues.
- [ ] **Approve with notes** — Minor issues, fix inline.
- [ ] **Request changes** — Block until issues resolved.

## Human Decision

<Explicit go / no-go statement. Include reasoning if no-go.>

**Decision:** Go / No-Go

**Reasoning:** <...>

---

## Quality Checklist

Run `CHECKLIST: Artifact Quality` from `docs/CHECKLISTS.md` first. Then verify these template-specific items:

- [ ] **Accurate**: Every issue references an exact file path and line number or function name.
- [ ] **Accurate**: Every deviation from design or spec is explicitly called out, not implied.
- [ ] **Complete**: Every acceptance criterion has a status (Pass / Fail / Partial) with evidence or rationale.
- [ ] **Complete**: Severity is assigned to every issue (Critical / High / Medium / Low) with justification. See `docs/protocols/definitions.md` §Severity Levels.
- [ ] **Complete**: Technical debt items include priority and a proposed resolution timeline.
- [ ] **Simple**: Review is under 400 lines. If the change is too large to review in one pass, request it be split.
- [ ] **Explicit**: Verdict is one of the three allowed states (Approve / Approve with notes / Request changes); no soft language like "looks okay".
- [ ] **Explicit**: Human decision includes a clear Go or No-Go with reasoning; "probably fine" is not acceptable.
