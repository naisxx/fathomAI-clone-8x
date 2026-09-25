# Research Plan — Fathom

**Status: PROPOSED. Awaiting approval. No research has been carried out.**

Gate 2 in [WORKFLOW.md](WORKFLOW.md). Total timebox **1h30**, hard stop at 2h.
Output is `docs/research/FINDINGS.md` plus screenshots in `docs/research/screens/`.

## Decisions I need from you first

**D1 — Do we have a Fathom account, and may I sign in?**
This changes the plan more than anything else. Fathom requires a Google or
Microsoft sign-in and a real calendar meeting to produce a recording, so the
depth of evidence depends entirely on access.

| | Access | What we get | Timebox |
|---|---|---|---|
| **A** | You have an account and approve sign-in | The real post-meeting review UI — the thing we are actually cloning | 1h30 |
| **B** | No account; public surfaces only | Marketing site, docs, help centre, public demo video, review-site screenshots | 1h00 |
| **C** | You record a short real call yourself and share screenshots | Genuine UI evidence with no credential handling by me | 0h45 + your time |

Default if you do not pick: **B**. It is the only option that needs nothing from
you, and it is honest — findings get labelled as marketing-derived, not observed.

I will not enter credentials into any sign-in form. Under option A you sign in
yourself in the browser pane and I drive from there.

**D2 — Competitor sweep: in or out?**
30 minutes on Granola, Otter and Fireflies to find where Fathom's review
experience is weak. Useful for scoping, cuttable. Default: **a 15-minute skim of
Granola only**, because its notes-first review model is the strongest contrast
with Fathom's recording-first one.

**D3 — Depth vs breadth.**
Default: **depth on the post-meeting review experience**, which is the deliverable
we can actually build well, and a deliberately shallow pass on capture/bot
mechanics, which will be stubbed anyway.

## Scope

**In.** The post-meeting experience: meeting list, the single-meeting review
screen, transcript, AI summary, action items, search, sharing, and the shape of
the data behind them.

**Out.** Billing, admin, CRM integrations, mobile apps, the real bot's joining
mechanics beyond what a user visibly sees.

## Timeboxes

| # | Block | Box | Produces |
|---|---|---|---|
| R1 | Landing + pricing: what Fathom claims it is | 0:10 | Positioning, headline features, plan gates |
| R2 | Help centre + docs: feature inventory | 0:20 | Feature list with evidence links |
| R3 | The review screen — the core | 0:30 | Annotated screenshots, layout anatomy |
| R4 | Transcript + AI summary + action items | 0:20 | Section structure, speaker handling, timestamp links |
| R5 | Sharing and the unsigned-visitor view | 0:10 | What a logged-out share link shows |
| R6 | Data model inference | 0:10 | Draft entities and relations |
| R7 | Write-up | 0:10 | `FINDINGS.md` |

R3 and R4 are the ones that matter. If the box runs out, cut R1 and R2.

## Screenshots to capture

Into `docs/research/screens/`, named `NN-<what>.png`, each referenced from
`FINDINGS.md` with a caption saying whether it is **observed** or **marketing**.

1. Meeting list / home
2. Single meeting review — full screen
3. Transcript panel, speaker attribution visible
4. AI summary block
5. Action items block
6. Search or filter across meetings
7. Share dialog
8. Unsigned-visitor view of a shared link
9. Empty state (no meetings yet)
10. Anything that surprises me

## Observations to record

For each: **what it does**, **how it is laid out**, **what state it has**
(loading, empty, error, long content), and **observed or assumed**.

- How a meeting is represented in the list — what metadata earns a place
- Review screen anatomy: what is primary, what is secondary, what is hidden
- Transcript: speaker labels, timestamps, whether transcript and video are linked
- Summary: sections, length, whether it is templated per meeting type
- Action items: extracted how, assignable, checkable, exportable
- Playback: does clicking a transcript line seek the recording
- Search: within one meeting vs across all
- Sharing: granularity, and what a logged-out visitor sees
- Long-meeting behaviour: what an hour-long, eight-person call does to the UI
- Loading and empty states — cheap to copy, high polish payoff

## Questions to answer

1. What is the single screen that makes Fathom feel valuable? That is what we clone.
2. What is the minimum data model behind that screen?
3. How does it stay usable at hour-long, eight-speaker scale?
4. What does a shared link show an unsigned visitor?
5. Where is it weak or slow — our chance to be visibly better?
6. What is obviously out of reach in 24 hours, and what is the honest substitute?

## Acceptance criteria

- `docs/research/FINDINGS.md` exists and answers all six questions.
- Every claim is tagged **observed** or **assumed**. No blurring.
- At least 6 screenshots, captioned, referenced, with provenance stated.
- A draft data model sufficient to start `BUILD-PLAN.md`.
- An explicit "could not determine" list. Gaps are findings.

## Deferred

- Competitor sweep beyond D2's default
- Accessibility audit of Fathom
- Performance measurement
- Anything about the real bot's infrastructure

## Method note

Executed by the `researcher` subagent (`claude-sonnet-5`) using the in-app browser
pane, following the `research-fathom` skill so the write-up format is consistent.
Read-only with respect to app code; it writes only under `docs/research/`.
