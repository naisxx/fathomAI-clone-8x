# Plan — P11, revised against observation

**Status: APPROVED 2026-09-26.** Revised from the pre-observation draft after the
author opened a real Fathom share link in incognito
([SHARE-FLOW-OBSERVED.md](research/SHARE-FLOW-OBSERVED.md)).

**Estimate 3:00 · cutoff 3:45 · reserve 3:00 untouchable** for cold testing and
the camera-on walkthrough.

## What changed from the draft, and why

| Draft | Revised | Because |
|---|---|---|
| Clips first, highlights second | **Search first, highlights second, clips only if time** | Fathom has a *Search Transcript* field we lack entirely; it is observed, cheap, and strongest exactly where we are weakest — a 72-segment hour-long transcript |
| Clips framed as a clone | **Framed as our extension** | The observed Share dialog has no time-range control |
| — | **New slice 0: ship Fathom's real ASR transcript** | The shipped transcript is not Fathom's output, and our claim that it was is not supportable |

On clips: the observed *free-plan Share Recording dialog* has no time range. That
is the limit of the evidence. **We do not claim Fathom lacks clip sharing
elsewhere** — highlights were never tested, and clips may well live there.

---

## Slice 0 — ship Fathom's actual ASR output (0:30, cutoff 0:45)

### Scope
Replace the transcript with what Fathom actually produced, errors included,
labelled as machine transcription. Re-align to the same silence boundaries.

The human-corrected text **leaves the app entirely** and survives only as
evidence in `docs/research/SHARE-FLOW-OBSERVED.md`, where it is already labelled
as the author's corrected version.

### Why this is an upgrade, not a concession
"Fathom **drone**" for "Fathom **clone**" is a real recognition error on a real
recording. It makes the case for click-to-verify better than any copy could: a
transcript is worth more when you can jump to the audio and check it.

### Acceptance criteria
- [ ] Transcript reads Fathom's output verbatim, including `API`, `drone`, `8x0`,
      "I can wait"
- [ ] Segment boundaries still land on `silencedetect` pauses; word rate stays
      consistent across the paragraph break
- [ ] The transcript panel labels it as Fathom's machine transcription and says
      it contains recognition errors
- [ ] README and the data-file comment describe it accurately — no "verbatim"
      claim that outruns the evidence
- [ ] The human-corrected text appears **nowhere** in `app/`, `components/` or `data/`
- [ ] All seven timestamps still seek correctly

---

## Slice 1 — within-meeting transcript search (0:45, cutoff 1:00)

### Scope
A search field inside the Transcript tab. Typing filters to matching segments;
clicking a match **seeks the player** to it.

### Acceptance criteria
- [ ] Field visible in the Transcript tab on every meeting, including shares
- [ ] Typing filters live; match count shown ("4 of 72 segments")
- [ ] The matched term is highlighted inside each result
- [ ] **Clicking a result seeks the player** and makes that line active
- [ ] Clearing restores all segments and the follow-playback behaviour
- [ ] No results → a designed empty state naming the query
- [ ] Works on the 72-segment meeting without perceptible lag
- [ ] Keyboard reachable; the field is labelled for screen readers

## Slice 2 — minimal highlight flow (1:30, cutoff 2:00)

### Scope
Create a highlight **at the current playback moment**, label it, see it in a
list and on the timeline, click to seek. Persist across reload if cheap.

### Honest adaptation, stated in the UI
Fathom highlights are made **mid-call**. We have no live call, so ours are made
**while reviewing the recording**. Different action, labelled as such — no fake
in-call widget. The walkthrough says it too.

### Acceptance criteria
- [ ] "Highlight this moment" captures the player's current time
- [ ] Optional label; unlabelled highlights still work and show their timestamp
- [ ] Appears in a highlights list **and** as a marker on the player timeline
- [ ] Clicking either seeks the player and activates the transcript line
- [ ] Markers positioned proportionally and legible when two are close together
- [ ] Survives reload via `localStorage`, with the same "this browser only" note
      the action-item ticks carry
- [ ] Delete works and persists
- [ ] Meeting with none → designed empty state, not a blank rail
- [ ] Seeded highlights on the Q3 meeting so the feature is populated on arrival
- [ ] **Highlights stripped from shared payloads** — same guard class as P7/P8
- [ ] UI states highlights are made while reviewing, not during a call

## Slice 3 — share tokens (0:15, cutoff 0:20)

The share view presents itself as access-controlled, so the tokens should not be
guessable. `q3plat` and `stnd05` are.

### Acceptance criteria
- [ ] Tokens are opaque, ≥22 characters, no semantic content
- [ ] Every meeting reachable at its new token; old short tokens 404 cleanly
- [ ] The share panel states plainly that **all links in this demo are public** —
      there is no auth behind them
- [ ] Walkthrough script updated to the new URLs

## Slice 4 — bounded clip sharing (1:15) — **only if 1–3 are deployed and tested**

Described as our extension throughout. Cut first if the reserve is threatened.

---

## Order of work

1. Slice 0 — correctness first; it fixes a live inaccuracy
2. Slice 1 — cheapest real feature
3. Slice 3 — small, and it lands before the walkthrough URLs are fixed
4. Slice 2 — largest
5. Slice 4 — only if all of the above are live and tested

**Push points:** after Slice 0+1, and again after Slice 2. The author pushes;
deployment does not update otherwise.
