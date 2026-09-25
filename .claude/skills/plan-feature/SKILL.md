---
name: plan-feature
description: Short plan template with scope, user flow, data needs, steps, acceptance criteria, estimate, deferrals and an explicit approval gate. Use before implementing any substantial phase, feature or slice.
---

# Plan a slice

One page. If it needs more, the slice is too big — split it.

Never start implementing from this template. It ends at a gate.

## Template

```markdown
# Plan — <slice name>

**Gate:** <n> | **Estimate:** <hours> | **Depends on:** <slices / approvals>

## Scope
<2–3 sentences. What this slice does.>

## Not in scope
<The specific adjacent things someone would reasonably assume are included.>

## User flow
1. User <does> → <sees>
2. …
<The path the walkthrough will show.>

## Data needs
<Entities, fields, where they come from. Flag anything seeded or simulated —
it must be labelled in the UI, not just here.>

## Implementation steps
1. …
<Ordered. Each independently checkable.>

## Acceptance criteria
- [ ] <Checkable in a browser by someone who did not build it>
- [ ] <Includes an empty/error/long-content state>
- [ ] <Includes the unsigned-visitor view where sharing applies>

## Risk
<The one assumption that, if wrong, breaks this slice.>

## Deferred
<What is consciously left out, and when it would come back.>

---
**APPROVAL GATE — do not implement until the user replies.**
```

## Rules

- **Acceptance criteria are browser-checkable.** "Summary generation works" is not
  a criterion. "Opening a seeded meeting shows a summary with at least three
  sections and no placeholder text" is.
- **Always include an unhappy state.** Empty, error, or long content. A plan with
  only the happy path will ship only the happy path.
- Estimate against the budget in `docs/WORKFLOW.md`. Over budget → cut inside the
  plan, before presenting it.
- Name the risk. One real assumption, not a list of generic ones.
- **Deferred is not a dumping ground.** If everything interesting is deferred, the
  slice is not worth building.
- Approval of this slice is not approval of the next one. Say so.
