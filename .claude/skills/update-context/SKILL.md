---
name: update-context
description: "Package and refresh explicit context for a new AI session. Use at the start of every session, especially when switching tasks or returning after a break."
disable-model-invocation: true
allowed-tools: Read, Write
---

## When to Use

- At the start of every AI session
- When switching to a new task
- After a break, when resuming work
- The user says "let's start a new session" or "load context"

## Process

1. Ask the user for:
   - Current phase (Discover / Specify / Design / Execute / Verify / Decide / Maintenance)
   - Spec path and version
   - Design path and version (if applicable)
   - Task ID from design breakdown (if applicable)
2. Ask the user to paste relevant existing code:
   - Interfaces/types the new code must conform to
   - Existing functions that will be called
   - Test patterns used in this codebase
3. Ask for hard constraints not in the spec.
4. Ask for the single instruction for this session.
5. Format the context package per the Context Packaging Protocol in `docs/PROTOCOLS.md`.
6. Output the formatted package.

## Rules

- Context must be explicit. Never say "as discussed before".
- Relevant code must be pasted, not summarized or named.
- The final item must be the single instruction for this session.
- If context exceeds what can be explicitly loaded, the task is too large. Advise splitting it.
- Critical constraints must be repeated even if they are in the spec.

## Output

A formatted context package ready to paste into the session.
