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

### Critical Technical Debt

Technical debt that meets any of the following criteria. Its presence blocks acceptance.

| Criterion | Example |
|-----------|---------|
| Missing error handling in a security-sensitive or data-mutating path | API endpoint that returns 500 instead of validating input |
| Hardcoded secrets, credentials, or environment-dependent values | API key in source code; database URL without config injection |
| Unhandled failure modes with no recovery or logging | Background job that silently fails; network call without timeout or retry logic |
| Untested critical path that cannot be verified by inspection | Payment flow with no test coverage; auth logic with no unit tests |
| Design decision that blocks a known near-term requirement | Hardcoded schema that prevents the next planned feature |

Debt that does not meet these criteria (e.g., suboptimal variable names, missing comments, non-critical refactoring opportunities) is **routine debt** and should be logged for future maintenance, not used to block acceptance.

---
