## Review Protocol

Every AI-generated artifact must be reviewed before acceptance.

### Automated Review (Mandatory First Step)

Before human review, run automated checks. These catch what humans miss and what humans are slow at.

**Required checks:**
1. **Type check** — `tsc --noEmit` (or equivalent). Zero type errors.
2. **Lint** — ESLint / Prettier / biome. Zero errors, warnings reviewed.
3. **Static analysis** — Security scan (e.g., Semgrep, CodeQL) for injection, XSS, secrets.
4. **Tests** — Unit and integration tests for the changed code. All pass.

**Optional but recommended:**
- Dependency audit (`npm audit`, `pip-audit`)
- Bundle size check (if applicable)

**Rule**: Automated checks must pass before human review begins. Human time is expensive; do not waste it on problems a machine can find.

**Fallback**: If a required automated check is not available for the project (e.g., no security scanner set up, no test framework configured), document the gap in the repository README and manually verify that check's concern during human review. The goal is to have all checks operational before the next review cycle. Do not let missing tooling block all reviews indefinitely.

### Human Review Checklist

After automated checks pass, human review focuses on what machines cannot judge:

1. **Spec Alignment** — Does this code implement the spec, or something else?
2. **Design Alignment** — Does it match the approved design? If not, is the deviation justified and documented?
3. **Business Logic Correctness** — Does it actually solve the problem? Trace through the logic for edge cases.
4. **Test Quality** — Do tests cover the acceptance criteria, or just the happy path?
5. **No Unnecessary Changes** — Does the change only touch what the task requires?
6. **Maintainability** — Will this code be understandable in 6 months? Is the complexity justified?
7. **Readability** — Can you understand this code in 30 seconds? If not, ask AI to simplify.

### Design Review Checklist

For every design document:

1. **Completeness** — Does it address every acceptance criterion?
2. **Feasibility** — Can this be built with available tools and time?
3. **Interface Clarity** — Are all inputs, outputs, and errors defined?
4. **Risk Identification** — What could go wrong? Is there a mitigation?
5. **Scope Discipline** — Does the design stay within the spec's scope?

### Review Output

Reviews must produce a written verdict:
- **Approve**: No issues.
- **Approve with notes**: Minor issues, fix inline.
- **Request changes**: Block until fixed. List every issue explicitly.

---
