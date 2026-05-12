---
name: init-design
description: "Initialize a technical design document from an approved spec. Use when entering the Design phase after Specify is complete."
disable-model-invocation: true
allowed-tools: Read, Write
---

## When to Use

- Entering the Design phase after spec approval
- The user says "design this" or "how should we build this"
- A spec exists and needs a design doc, interface contracts, and task breakdown

## Process

1. Read the approved spec (provided by user or at the spec path).
2. Read `docs/templates/design.md` for the template structure.
3. Propose 2-3 architecture options with tradeoffs (pros / cons / constraints).
4. After human selects an option, design interface contracts:
   - TypeScript types / function signatures
   - API schemas (if applicable)
   - Data models
5. Define error handling strategy.
6. Break the implementation into tasks. Each task:
   - Maps to at least one acceptance criterion
   - Has an estimated effort of 2 hours maximum
   - Has a capability assessment (High / Medium / Low AI capability per `docs/CAPABILITY.md`)
7. Create `DESIGN_DOC.md` using the template.
8. Output the Capability Assessment table.

## Rules

- Do not proceed without an approved spec. If the spec is missing or unapproved, stop.
- Every architecture option must have at least one rejected alternative documented with reasons.
- Interface contracts must be fully defined — no `any`, no placeholders.
- Every acceptance criterion from the spec must map to at least one design element.
- No single task may exceed 2 hours of estimated work. If it does, split it.
- Do not introduce scope beyond the spec. If a design decision requires scope expansion, flag it for spec revision.
- The human selects the architecture option; AI only proposes.

## Output

A complete `DESIGN_DOC.md` with interface contracts, task breakdown, and a Capability Assessment table mapping each task to its AI capability level and human-AI division of labor.
