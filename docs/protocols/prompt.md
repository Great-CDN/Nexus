## Prompt Protocol

Prompts are structured inputs derived from specs, not creative writing.

### Prompt Rules

1. **No open-ended generation**. "Build a login page" is forbidden. "Implement LoginPage.tsx per DESIGN_DOC.md section 3.2 using the AuthContext pattern" is required.
2. **Include constraints in every prompt**. Do not assume AI remembers constraints from context.
3. **Request one artifact per prompt**. One function, one component, one test file.
   - Exception: If a single artifact is expected to exceed the model's output token limit (e.g., a large component with embedded styles and logic), split it into multiple prompts and combine manually.
4. **Specify output format**. "Return only the code, no explanation" or "Return the code plus a 3-sentence summary of the changes".
5. **No "improve this" prompts**. Improvement is vague. Specify the metric: "reduce cyclomatic complexity below 10" or "extract the fetch logic into a reusable hook".

### Prohibited Prompt Patterns

- "Can you..." — This is a question, not an instruction. Use imperatives.
- "Make it better" — Undefined. Specify what "better" means.
- "Like X but for Y" — Too vague. Provide the spec.
- "Just do it" — No context. Always load context first.

---
