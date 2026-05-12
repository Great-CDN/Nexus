---
name: init-spec
description: "Initialize a new product specification from the Nexus spec template. Use when starting the Specify phase for a new feature or change."
disable-model-invocation: true
allowed-tools: Read, Write
---

## When to Use

- Starting the Specify phase for a new feature
- A change request needs to be formally scoped
- The user says "we need to build X" or "let's spec this out"

## Process

1. Read `docs/templates/spec.md` to get the template structure.
2. Ask the user for the feature name and any known requirements.
3. Create the spec file at the user-specified path (default: `docs/specs/<feature-name>.SPEC.md`).
4. Pre-fill the template with the feature name and guide the user through each mandatory section.
5. Ensure all mandatory sections are present per the Spec Format Protocol in `docs/PROTOCOLS.md`:
   - Problem
   - Scope
   - Non-Goals
   - Acceptance Criteria (verifiable)
   - Assumptions
   - Dependencies
   - Open Questions

## Rules

- Do not proceed to Design until the human explicitly approves the spec.
- Acceptance criteria must be verifiable — reject vague wording like "good performance" or "user-friendly".
- Non-goals must be explicit. "Out of scope" is not enough; state what is explicitly not being built.
- One spec per feature. Do not bundle unrelated features.

## Output

A complete `PRODUCT_SPEC.md` file ready for human review and approval.
