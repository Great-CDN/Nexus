## Session Protocol

How to structure an AI-assisted work session.

### Session Start

1. Load explicit context package per the Context Packaging Protocol above.
2. State the single task for this session.
3. Confirm AI understands the task before proceeding.

Do not repeat the context packaging rules here — they are defined in the Context Packaging Protocol.

### Session During

1. AI generates one artifact.
2. Human reviews against checklist.
3. If changes needed, human provides specific feedback, not "fix it".
4. Repeat until artifact passes review.

**Loop exit conditions**:
- **Normal**: artifact passes review → proceed to Session End.
- **Spec ambiguity found**: after two iterations, the AI still misunderstands the requirement → stop the session, revise the spec, start a new session.
- **Fallback Rule triggered**: AI produces structurally incorrect code twice for the same task → stop the session, switch to human implementation per `docs/CAPABILITY.md` §The Fallback Rule.
- **Human fatigue**: if a single task has gone through more than 3 review cycles without converging → stop, record the blocker, and escalate to spec or design revision.

### Session End

1. Human commits the change.
2. Update task tracking (mark task complete).
3. If scope discovered to be wrong, note it for spec revision — do not change course mid-session.

### Session Interruption

Sessions do not always complete normally. Define the abort path:

1. **Human must leave mid-session**: Save the current AI output (even if incomplete) to a scratch file. Note the stopping point in the task tracker. Resume from that point in a new session with a fresh context reload — do not attempt to continue from conversation memory.
2. **Connection drops or tool failure**: If an AI tool call fails (network error, API timeout), do not retry blindly. Verify the last successful state from git or the snapshot, then resume from there.
3. **Power failure or crash**: This is why frequent commits matter. The maximum uncommitted work at risk is one task. After recovery, check git status, review the diff, and decide whether to continue or restart.
4. **API hard limit reached**: Context window exceeded, quota/billing exhausted, session time limit hit (e.g., 5-hour limit), or authentication failure. Stop immediately. Do not retry. Follow the Session Recovery Protocol below.

### API Failure Classification

When an AI API call fails, classify before acting:

| Error Type | Examples | Action |
|------------|----------|--------|
| **Transient** | Network timeout, 5xx server error, rate limit (429) | Retry with exponential backoff + jitter: base delays 1s, 2s, 4s, each multiplied by a random value in [0.5, 1.5). Max 3 attempts. If all fail, treat as session interruption. |
| **Hard limit** | Context window exceeded, quota/billing exhausted, session time limit, auth failure | Do not retry. Stop immediately. Follow Session Recovery Protocol. |
| **Client error** | Invalid prompt format, malformed tool call | Fix the input and retry once. If it fails again, treat as session interruption. |

**Never retry a hard limit error.** Retrying a context-window exceedance or an expired session wastes tokens and time. Hard limits require a fresh session.

### Session Recovery Protocol

When any interruption terminates a session abnormally, use this protocol to resume without losing state:

1. **Preserve uncommitted output**: Save any AI-generated but uncommitted work to `.claude/scratch/YYYY-MM-DD-HHMM-<task>.md`.
2. **Record the breakpoint**: In the task tracker or a scratch note, record:
   - Task name and spec version
   - Last completed step
   - File being edited and approximate line/section
   - What was about to happen next
3. **Commit completed work**: If any portion of the task was finished before the interruption, commit it now with a note: `wip: partial <task> before session interruption`.
4. **Start a recovery session**: Reload context per the Context Packaging Protocol. The context package must include:
   - Original spec and design references
   - Breakpoint note
   - Scratch file content (paste it)
   - Git status / diff since last commit
5. **Resume from breakpoint**: Continue from where the interruption occurred. Do not regenerate already-completed work. Verify the current file state matches expectations before proceeding.

### Session Length

- **Target: 30–60 minutes**. Longer sessions accumulate drift.
- **Maximum: 2 hours**. If a task takes longer, the task was too large. Split it.
- **One session = one task**. A session may include multiple iterations of review and fixes, but must be centered on a single task. Do not start a new task in the same session without reloading context. If a task requires more than one session, explicitly split it into subtasks, each with its own session and context reload.

---
