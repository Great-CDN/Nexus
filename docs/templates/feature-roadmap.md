# Feature Roadmap: <Initiative Name>

**Version**: v1.0
**Last Updated**: YYYY-MM-DD

## User Story

<One paragraph describing the complete user-visible outcome when all features are delivered. This is the "why" for the entire initiative.>

## Feature Breakdown

Each feature is a coherent user-visible capability that can go through the full Nexus workflow independently.

| ID | Feature | Description | User Value | Dependencies | Priority | Workflow |
|----|---------|-------------|------------|--------------|----------|----------|
| F-1 | | | | None | P0 | Full |
| F-2 | | | | F-1 | P1 | Full |
| F-3 | | | | None | P1 | Light |

### Priority Definitions

| Priority | Meaning | When to Use |
|----------|---------|-------------|
| **P0** | Foundation / blocked by | Architecture, types, core interfaces. Other features cannot be built without it. |
| **P1** | Core MVP value | The feature delivers the primary user value. MVP is incomplete without it. |
| **P2** | Enhancement | Improves experience but MVP works without it. |
| **P3** | Nice to have | Can be deferred to a later version. |

### Ordering Rules

When two features have the same priority, sort by:

1. **Dependency first**: If Feature A is required by Feature B, A comes first.
2. **Risk first**: If one feature involves unknown technology or uncertain feasibility, do it first (fail fast).
3. **Value density**: Higher user-value-per-effort comes first.

## Dependency Graph

```
F-1 (types + core API)
  ├─ F-2 (auth integration)
  │    └─ F-4 (admin dashboard)
  └─ F-3 (billing module)
       └─ F-5 (invoice export)
```

## Execution Phases

Group features into phases by dependency closure. Each phase produces a working system.

| Phase | Features | Goal | Exit Condition |
|-------|----------|------|----------------|
| 1 | F-1 | Foundation laid; interfaces stable | All P0 features pass Decide |
| 2 | F-2, F-3 | Core user value works end-to-end | All P1 features pass Decide |
| 3 | F-4, F-5 | Enhanced experience | All P2 features pass Decide |

## MVP Boundary

The MVP is the smallest set of features that delivers a complete user story.

**In MVP**: F-1, F-2, F-3

**Out of MVP**: F-4, F-5

## Post-MVP Backlog

| ID | Feature | Why Deferred | Proposed Version |
|----|---------|--------------|------------------|
| F-4 | | | v1.1 |
| F-5 | | | v1.2 |

---

## Quality Checklist

- [ ] Every feature is a coherent user-visible capability, not an implementation detail.
- [ ] Dependency graph has no cycles.
- [ ] Every P0 and P1 feature has a spec version anchored to this roadmap.
- [ ] MVP boundary is defensible: a user can achieve the core goal with MVP features alone.
- [ ] No single phase exceeds 2 weeks of estimated implementation time. If it does, split the phase.
