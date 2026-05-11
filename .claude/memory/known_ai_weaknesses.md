---
name: Known AI Weaknesses
description: Recurring failure patterns observed in AI-generated output for Nexus
type: ai-weakness
first-observed: 2026-05-11
status: active
---

**Pattern**: AI generates plausible-sounding but non-existent file paths, cross-references, or document sections.

**Example**: Claiming a file exists at `.claude/skills/review-code/SKILL.md` when the actual structure differs; referencing a "traceability matrix" that is not defined anywhere in the docs.

**Detection**: Verify every file path and cross-reference before relying on it. Grep for claimed terms before accepting them.

**Mitigation**: Load `CLAUDE.md` project structure at session start. Do not assume directory structure from memory.

---

**Pattern**: AI introduces subjective, unverifiable checklist items ("human has understood the code").

**Example**: Exit conditions requiring "human has approved the design" without defining what observable actions constitute approval.

**Detection**: Scan checklists for mental-state verbs (understood, approved, agrees, feels). Replace with action verbs (traced, verified, stated, documented).

**Mitigation**: Run the subjective-check filter on every new checklist before accepting it.
