# Assignment

> **Gap flagged 2026-09-25.** Only the *Agent Capture Setup* portion of the 8x
> brief has been pasted into this project. The main assignment brief — its exact
> deliverables wording, judging criteria, hard requirements and final checks —
> **has not been provided**. Everything in *Known* below is sourced from the
> capture brief or from the user's own instructions. Everything in *Not yet
> known* is genuinely missing and must not be invented.

## Known deliverables

1. **A working public deployment** of a Fathom-style AI meeting notetaker.
2. **A public repository** containing raw `.agent-logs/`, committed as work
   progressed rather than dumped at the end.
3. **A camera-on walkthrough under five minutes.**

## Known hard requirements

These are verbatim constraints from the capture brief (`§3 What to capture`) and
the user's working agreement.

- `.agent-logs/` ships with the repo and is never added to `.gitignore`.
- Capture is automatic — a hook, not a manual step.
- Per turn: prompt verbatim and in full, final response in full, UTC timestamp,
  model name. No thinking, no tool calls, no intermediate steps.
- Log entries are never edited, tidied, summarised or deleted after the fact.
  Wrong turns and dead ends stay in.
- Logs are committed interleaved with the code they produced. Commit order shows
  the real order of work.
- `CAPTURE-TEST.md` at repo root, with tool/model, mechanism, config file
  changed, log path, both canary entries raw, and what failed first.
- Seeded or simulated behaviour is labelled honestly. The capture bot may be
  stubbed.
- No claim of a real eight-person, hour-long call unless one was actually tested.

## Known judging signal

From the capture brief, verbatim in substance: the reviewers are not checking
*whether* AI was used — they assume it was. They are checking *how* the work was
done, and the log is the only evidence of that. `CAPTURE-TEST.md` is the first
file they open; if capture is not working the rest is not assessable. A messy
honest log scores better than a clean one.

## Not yet known — needs the original 8x brief

- [ ] Exact deliverable wording and any format requirements
- [ ] Judging criteria and their weighting
- [ ] Submission fields and where the submission goes
- [ ] Deadline (working assumption: 24 hours — see `docs/WORKFLOW.md`)
- [ ] Any required feature set or explicit non-goals
- [ ] Whether a specific stack, host or account is mandated

**Action:** paste the full 8x brief and this file gets completed before the build
plan is finalised. `docs/RESEARCH-PLAN.md` does not depend on it and can be
approved first.

## Final checks

Tracked as an executable checklist in the `release-check` skill
(`.claude/skills/release-check/SKILL.md`) so it can be run rather than read.
It will be incomplete until the unknowns above are filled in.
