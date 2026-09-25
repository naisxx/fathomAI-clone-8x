# Plan — P11: highlights and bounded clip sharing

**Status: PROPOSED. Awaiting approval and awaiting your Fathom observations.**
**Estimate: 3:00 for both · Cutoff 3:45 · Depends on:** P7 share route, P4 deep links.

Both features are named in the brief and neither exists yet:

> "**Highlight a moment mid-call** and see where it lands. […] **Share a clip**
> with someone who was not on the call."

---

## Recommended order — clips first

If only one ships, **ship clips**. Not because it matters more, but because it is
the one I can make reliable inside the window:

| | Clips | Highlights |
|---|---|---|
| Builds on | `/share/[token]` + player, both proven | new data, new UI, new persistence |
| New surfaces | one route param pair | timeline markers, a rail, a create affordance |
| Ways to be subtly wrong | range clamping | clamping **and** persistence **and** marker positioning |
| Estimate | **1:15** | **1:45** |

Clips also finish a story we already tell — the share view — rather than opening
a new one. Doing them first means stopping early still leaves a complete feature
rather than two half-built ones.

---

## Slice A — bounded clip sharing (1:15, cutoff 1:30)

### Scope
Share a bounded range of a meeting instead of the whole thing. `/share/<token>`
gains optional `?from=<sec>&to=<sec>`; the player is constrained to that window
and the transcript shows only the segments inside it.

### Not in scope
Re-encoding media (the clip is a *view* over the same asset, not a new file),
clip-specific tokens, expiry, or download.

### User flow
1. On the review screen, select a range — simplest honest affordance is **"Share
   from here"** on any transcript line, which sets `from` to that line's start and
   `to` 60s later, then lets you nudge both.
2. Share panel shows the bounded URL and a plain-English summary:
   *"A 1:04 clip, from 9:14 to 10:18."*
3. Recipient opens it: player starts at `from`, stops at `to`, cannot scrub
   outside, and sees only the transcript for that window.

### Data needs
None new. `from`/`to` are URL state, clamped server-side against
`durationSec`. Existing redaction applies unchanged.

### Implementation steps
1. `clampRange(meeting, from, to)` in `lib/share.ts` — order, bounds, minimum 5s.
2. `usePlayback` gains optional `bounds` — seek clamps, playback pauses at `to`.
3. `SharedMeetingView` filters transcript to the window and renders the range header.
4. `ShareButton` gains the range control and emits the bounded URL.
5. Extend the build-time guard: a bounded share must not leak segments outside it.

### Acceptance criteria
- [ ] `/share/q3plat?from=554&to=614` plays 9:14 → 10:14 and **stops at 10:14**
- [ ] Dragging the scrubber past `to` clamps; before `from` clamps
- [ ] Transcript lists **only** segments overlapping the window
- [ ] Page source contains **no transcript text from outside the window**
- [ ] `from`/`to` reversed, negative, non-numeric, or beyond duration → falls back
      to the full meeting, never a crash or an empty player
- [ ] A clip of the **real** meeting plays real audio bounded correctly
- [ ] Unbounded `/share/<token>` behaves exactly as today (no regression)
- [ ] Share panel states the clip length in words, not just numbers

### Risk
Bounding the *simulated* transport and the *real* audio element are different
code paths; the seeded meetings use one and the featured meeting the other. Both
must clamp. Mitigation: the acceptance list tests both explicitly.

---

## Slice B — highlights (1:45, cutoff 2:15)

### Scope
Mark moments on a recording, see them on the timeline, jump between them.

### Honest adaptation, stated up front
Fathom highlights are made **mid-call**. We have no live call, so ours are made
**while reviewing**. That is a different action and the UI will say so — a
"Highlight" button on a transcript line, not a fake in-call widget. The
walkthrough should say it too.

### User flow
1. Hover a transcript line → **Highlight**, optionally typed a label.
2. It appears as a marker on the player timeline and in a Highlights rail.
3. Clicking a marker or rail entry seeks to it.
4. Seeded meetings ship with 3–4 highlights so the feature is populated on arrival.

### Data needs
`Highlight { id, label, startSec, endSec, userGenerated }` — mirroring Fathom's
own schema, which uses float seconds and a label. Seeded highlights live in
`data/`; ones you create live in `localStorage`, with the same
"this browser only" note the action-item ticks carry.

### Implementation steps
1. `Highlight` type + seeded highlights on Q3 and the design sync.
2. `HighlightsRail` — list, jump, delete.
3. Timeline markers on the player, positioned by `startSec / durationSec`.
4. Create/label affordance on transcript lines.
5. `localStorage` persistence keyed per meeting.
6. Strip highlights in `redactForShare` — a viewer's private marks are not the
   recipient's business. *(Same class as the Ask-entry leak found in P8.)*

### Acceptance criteria
- [ ] Seeded highlights render as markers at the correct proportional position
- [ ] Clicking a marker seeks; the rail and transcript agree on the moment
- [ ] Creating a highlight persists across reload; deleting persists
- [ ] Markers stay legible when two sit within 1% of each other
- [ ] Meeting with no highlights shows a designed empty state, not a blank rail
- [ ] Share pages contain **no** highlight data in page source
- [ ] Timeline markers reachable by keyboard and labelled for screen readers
- [ ] The UI says highlights are made while reviewing, not during a call

### Risk
The create-and-persist path is the fragile part — it is the first thing in this
build that writes user data. If it wobbles, **ship seeded highlights read-only**
and cut creation; the demo value is in seeing them on the timeline, not in making
one on camera.

---

## Open — decided by your observations, not by me

1. **What does a Fathom share link actually show a logged-out visitor?** Our whole
   share view is designed from documentation. If yours differs, fixing it beats
   both slices.
2. **Is clip sharing range-based, or does Fathom cut a separate asset?** Changes
   whether `?from/&to` is a fair clone or a simplification we should label.
3. **What does a highlight look like where it lands** — timeline marker, transcript
   mark, a separate list, or all three?
4. **Does template switching re-render the summary live?** If your plan allows one
   switch, that is cheap evidence for a possible later slice.

---

## Time

~9h elapsed. **3:00 reserved and untouchable** for cold deployment testing and
the camera-on walkthrough. This slice fits comfortably; the cutoffs exist so that
it cannot eat the reserve.

**APPROVAL GATE — nothing is implemented until you approve, and I will revise
this against your observations first.**
