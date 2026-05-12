## Definitions

Shared terms used across Nexus documents.

### Severity Levels

Used in reviews, bug tracking, and risk assessment:

| Level | Definition | Example | Justification Required |
|-------|-----------|---------|----------------------|
| **Critical** | Blocks acceptance or deployment. No workaround. | Security vulnerability, data loss bug | Why it blocks; what is the impact if shipped |
| **High** | Significant risk or effort required. Has workaround but painful. | Performance regression, missing error handling | Why the risk is significant; what is the workaround |
| **Medium** | Noticeable issue, manageable workaround. | UI inconsistency, unclear error message | Why it is noticeable; what is the workaround |
| **Low** | Cosmetic, negligible impact, or preference. | Typo, formatting inconsistency | Brief note on why it is low |

Every severity assignment must include the justification described in the Justification Required column. A severity without justification is incomplete.

### Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/<short-name>` | `feature/rule-editor` |
| Fix | `fix/<scope>-<description>` | `fix/auth-cache-key` |
| Exploration | `exploration/<YYYY-MM-DD>-<topic>` | `exploration/2026-05-11-dnd-kit` |
| Hotfix | `hotfix/<issue-id-or-description>` | `hotfix/auth-token-leak` |

---
