# Assignment

> **Partially filled 2026-09-25.** The *Agent Capture Setup* portion is verbatim
> in this conversation. The main brief's **deliverables and judging criteria were
> supplied by the user in summary form** and are recorded below as such. The
> **full verbatim brief is still pending** — the user will paste it here or send
> it. Anything still unknown is marked and must not be invented.

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

## Judging criteria

Stated by the user, pending the verbatim brief:

1. **Speed** — how fast a working product was delivered.
2. **Product judgment** — what was built, what was cut, and why.
3. **UX / UI** — the quality of the interface itself.

Two hard requirements attached to the live app:

- It **must work for an unsigned visitor**. No login anywhere in the graded path.
- It **must contain seeded data**, honestly labelled.

### Consequences for the build

- UX/UI is a *graded axis*, not polish. Interface quality earns its own time
  budget rather than being whatever is left at the end.
- Speed is graded, so shipping a complete narrow product early beats a broader one
  that lands late. Deploy early, cut Shoulds without hesitation.
- No-auth is now a **requirement**, not just a design preference — which the
  chosen architecture already satisfies.

## Known judging signal

From the capture brief, verbatim in substance: the reviewers are not checking
*whether* AI was used — they assume it was. They are checking *how* the work was
done, and the log is the only evidence of that. `CAPTURE-TEST.md` is the first
file they open; if capture is not working the rest is not assessable. A messy
honest log scores better than a clean one.

## Still unknown — needs the verbatim brief

- [ ] Exact deliverable wording and any format requirements
- [ ] **Weighting** between speed, product judgment and UX/UI
- [ ] Submission fields and where the submission goes
- [ ] Deadline (working assumption: 24 hours — see `docs/WORKFLOW.md`)
- [ ] Any explicit non-goals or mandated feature set
- [ ] Whether a specific stack, host or account is mandated

**Action:** paste the full brief here; the remaining `[BRIEF]` items in
`.claude/skills/release-check/SKILL.md` get replaced at the same time.

## Final checks

Tracked as an executable checklist in the `release-check` skill
(`.claude/skills/release-check/SKILL.md`) so it can be run rather than read.
It will be incomplete until the unknowns above are filled in.
