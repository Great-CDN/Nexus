## Threshold Classification

Nexus uses numeric thresholds across multiple documents. Not all thresholds have the same force. They are classified into three tiers:

| Tier | Meaning | Violation Consequence | Examples |
|------|---------|----------------------|----------|
| **Hard Limit** | Must not exceed. These are physical or process boundaries. | Process is invalid; split the task immediately. | 1200 lines mixed content (context hard ceiling); 2 hours max per task; 2 hours max per session; no Critical/High bugs at acceptance |
| **Soft Limit** | Warning zone. Exceeding requires explicit justification. | Elevated risk; document why the exception is safe. | 800 lines mixed content (context warning); 30–60 min session target; 150 lines module contract; 200 lines or 30 min per review chunk |
| **Heuristic** | Rough guidance for estimation. Highly context-dependent. | None; adjust to your project and team. | 200–400 lines/hour human review rate; phase dwell time targets (10–30 min Specify, etc.); 100–200 lines system architecture doc; ~2000 lines pure prose |

**Why lines instead of tokens?** Lines are a fast, tool-free proxy. Token density varies by language and format. When precision matters, use `node tools/count-tokens.js <file>`. See `docs/SCALE.md` for the token-density rationale.

**How to use this table**: If you are near a Soft Limit, consider splitting. If you hit a Hard Limit, you must split. Heuristics are for planning, not enforcement.

---
