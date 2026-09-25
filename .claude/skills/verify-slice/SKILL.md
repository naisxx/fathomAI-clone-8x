---
name: verify-slice
description: Functional browser verification of a built slice against its approved acceptance criteria, including unsigned-visitor and long-content checks. Use after implementing a slice and before committing or calling it done.
---

# Verify a slice

Verification happens **in a browser**. A passing test suite is not evidence that a
user-facing flow works.

## Order

1. Read the approved plan's acceptance criteria. Verify against those, not against
   what the implementer said they did.
2. Start the app. Exercise the flow as a user, not as its author.
3. Then the unhappy paths below.
4. Then, once it exists, the deployed public URL.

## Checklist

**The flow**
- [ ] Each acceptance criterion, pass or fail, individually
- [ ] The complete user flow start to finish, no shortcuts
- [ ] Refresh mid-flow — state survives or fails cleanly
- [ ] Deep-link straight into a sub-route in a new tab

**States**
- [ ] Empty — no meetings, no transcript, no results
- [ ] Loading — visible, not a frozen screen
- [ ] Error — a bad ID or failed request says something useful
- [ ] Long content — hour-long, eight-speaker meeting. Layout, scroll, performance.

**Unsigned visitor** (wherever sharing or public links exist)
- [ ] Open the share link in a **fresh tab with no session**
- [ ] It shows what it should and nothing it should not
- [ ] Private routes actually redirect or refuse

**Responsive**
- [ ] 375px phone width — no horizontal scroll, targets reachable
- [ ] Desktop

**Quiet failures**
- [ ] Browser console clean — errors and warnings
- [ ] Network panel — no failed or 4xx/5xx requests
- [ ] No placeholder or lorem text left in the UI

**Honesty**
- [ ] Seeded or simulated data is visibly labelled **in the UI**
- [ ] Nothing implies a real call was recorded when it was not

## Reporting

Per defect: what you did, expected, actual, severity
(**blocker** / **major** / **minor**), and evidence — screenshot, console output
or response body.

State what you could not test and why. An untested criterion is reported as
untested, never as passing.
