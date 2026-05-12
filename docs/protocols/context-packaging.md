## Context Packaging Protocol

Every AI session must start with explicit context. Do not assume AI remembers anything from previous sessions.

### Context Package Structure

When starting a session for a task, provide:

1. **Current Phase** — Which workflow phase are you in?
2. **Spec Reference** — Path to `PRODUCT_SPEC.md` or paste relevant sections.
3. **Design Reference** — Path to `DESIGN_DOC.md` or paste relevant sections.
4. **Task Reference** — Which task from the design breakdown?
5. **Code Context** — Relevant existing code (paste, do not summarize). Include:
   - Interfaces/types the new code must conform to.
   - Existing functions that will be called.
   - Test patterns used in this codebase.
6. **Constraints** — Any hard constraints not in the spec (e.g., "must support IE11", "bundle size < 100KB").
7. **What to Do** — One clear instruction for this session.

### Context Loading Rules

- **Paste, do not reference by name**. Saying "use the same pattern as UserService" is insufficient. Paste the relevant code.
- **Keep it under 800 lines ideally, 1200 lines absolutely**. If context exceeds 800 lines, you are in the warning zone — the task should probably be split. If it exceeds 1200 lines, it must be split. See `docs/protocols/threshold-classification.md` for limit classification. For a rough token estimate, run `node tools/count-tokens.js <file>`.
- **Repeat critical constraints**. If a constraint matters, state it explicitly even if it is in the spec.
- **End context with the instruction**. The last thing AI reads should be what to do.

### Example Context Package

```
Phase: Implementation
Task: Implement the domain validation logic in DomainService

Spec (relevant section):
- AC-3: Domain names must be validated against RFC 1035.
- AC-4: Invalid domains must return error code 400 with message "Invalid domain format".

Design (relevant section):
- DomainValidator.validate(name: string): Result<Domain, ValidationError>
- Use the Result type from src/types/index.ts

Existing code:
[paste Result type definition]
[paste existing validator pattern]

Constraints:
- No external libraries for validation. Regex only.
- Must handle internationalized domain names (punycode).

What to do:
Implement DomainValidator.validate() with full test coverage.
```

---
