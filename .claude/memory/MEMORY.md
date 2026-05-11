# Memory Index

This directory stores persistent context that should survive across sessions. Each file is a standalone memory entry with standard frontmatter. See `docs/PROTOCOLS.md` §Memory Protocol for format rules.

## Entries

| File | Type | Purpose |
|------|------|---------|
| `user_preferences.md` | user | User role, style, and collaboration preferences |
| `feedback_style.md` | feedback | Guidance on how to approach work for this user |
| `project_goals.md` | project | Current project state, goals, and constraints |
| `known_ai_weaknesses.md` | ai-weakness | Recurring AI failure patterns observed in this project |

## Rules

- One idea per file. Do not append to shared files.
- If memory contradicts a spec, the spec wins. Update memory.
- Review monthly. Delete stale entries.
