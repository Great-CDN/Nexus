## Memory Protocol

Memory stores information that should persist across sessions and conversations. It is not a replacement for specs or design docs.

### What to Save

Save to `.claude/memory/` when:
- You learn something about the user's preferences that affects future work.
- You discover a project-level constraint not in the spec.
- You establish a pattern that should be reused.
- You identify a **systematic AI weakness** that recurs across tasks (see Known AI Weaknesses below).

### What NOT to Save

Do not save:
- Code patterns (derive from code).
- File paths (derive from file system).
- Git history (use `git log`).
- Temporary task state.
- Anything already in a spec or design doc.

### Memory Format

Use the standard memory frontmatter format:

```markdown
---
name: {{short name}}
description: {{one-line description}}
type: {{user | feedback | project | reference}}
---

{{content}}
```

### Known AI Weaknesses

In addition to user preferences and project constraints, track **systematic failure patterns** observed in AI-generated output for this project. These are not one-off mistakes — they are recurring blind spots that will repeat unless explicitly guarded against.

**When to record**:
- The same category of error appears in **two or more tasks**.
- Cross-validation reveals a consistent blind spot across multiple models.

**Format** (extends the standard memory frontmatter):

```markdown
---
name: {{short description of weakness}}
description: {{one-line summary}}
type: ai-weakness
first-observed: {{YYYY-MM-DD}}
tasks-affected: {{task IDs or count}}
status: active | resolved
---

**Pattern**: What does AI systematically get wrong?

**Example**: Paste a minimal example of the error.

**Detection**: How do you verify this weakness is not present in new output?

**Mitigation**: What constraint or reminder prevents it?
```

**Usage**:
- Include the active weaknesses list in every context package under **Constraints**.
- When a weakness has not been observed for 5 consecutive tasks, mark it `resolved` but keep the file for reference.
- If a resolved weakness reappears, reactivate it and reset the counter.

### Memory Maintenance

- Review memory monthly. Delete stale entries.
- If memory contradicts a spec, the spec wins. Update memory.
- Memory is a hint, not a rule. Always verify against current state.
- **Atomic writes**: Each memory entry is one file. Do not append to a shared file.
  - Write to a temporary file, then rename to the final filename. This prevents corruption from partial writes if a session crashes mid-write.
  - If two sessions write simultaneously, the last write wins. Use descriptive filenames to avoid collisions (e.g., `user_prefers_tabs.md` not `memory_01.md`).
  - For team environments where multiple humans may write concurrently, consider using a lock file (`.claude/memory/.lock`) to serialize writes. If a lock is not feasible, accept the risk and verify memory files for completeness on read.

---
