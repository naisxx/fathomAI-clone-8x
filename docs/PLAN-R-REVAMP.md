# Plan — R: whole-application UI/UX revamp

**Status: PROPOSED. Awaiting approval. Nothing implemented.**

Three phases, in order. **7:30 estimated, 9:00 at cutoffs.** The 3:00 reserve for
cold testing and the walkthrough stays untouchable.

## Why, in one table

Audited across all five surfaces:

| | List | Search | Review | Share |
|---|---|---|---|---|
| Container | `max-w-6xl` | `max-w-3xl` | `max-w-6xl` | `max-w-3xl` |
| `h2` count | 4 | **0** | 8 | 5 |
| Distinct radii | 4 | 5 | 4 | 4 |

Font sizes in use: **10, 11, 12, 13, 14, 15px** — six arbitrary values, no scale.
Three accent hues. The review screen spends **345px** (36% of the fold) rendering
a play button on an empty gradient, and its right rail is **1715px** tall — 1.8
screens — with the share control a 40px item sitting above 909px of action items.

These are not five screens with problems. They are five screens with no system.

## Non-negotiable in every phase

The honesty layer is load-bearing and survives intact:

- Every meeting carries a visible real-vs-seeded label on every surface
- The provenance note stays on the review and share screens
- "Simulated timeline — no audio", "timestamps manually aligned", "made while
  reviewing", "pre-written answers", "saved in this browser only" all persist
- Share redaction, clip filtering and the three leak guards are untouched

A phase that weakens labelling has failed, however good it looks.

---

## Phase R1 — the design system (2:30, cutoff 3:00)

### Scope
Define tokens and a component vocabulary, then apply them everywhere. The
unglamorous phase that makes the other two cheap instead of expensive.

### Proposed type scale — 5 steps, replacing six arbitrary values

| Step | Size / line-height | Used for |
|---|---|---|
| `display` | 28 / 34, -0.02em | page titles |
| `title` | 19 / 26 | meeting titles, section heads |
| `body` | **15 / 25** | transcript, summary — up from 13–14 |
| `meta` | 13 / 20 | timestamps, speakers, counts |
| `micro` | 11 / 16, 0.08em caps | labels, chips |

### Proposed surface — warm, not cold

`#0b0d10` is a cold blue-black that reads as generic dev-tool. This is a
long-form reading product, so the surface should sit closer to ink on paper:
warm near-black, warm off-white text.

### Proposed colour — one accent plus one semantic

Down from three competing hues:

- **Accent**: a warm amber/gold, used for interaction only
- **`Real recording`**: one muted green — the single semantic hue
- **`Seeded demo data`**: **neutral** — outlined chip, label, no hue

Colour never carries meaning alone; the labels already do that work.

### Geometry
Two radii — 8px controls, 14px panels — plus pill for chips. One 4px spacing
rhythm. Two containers: content 1200, reading 680.

### Checkpoint — you see it before it lands

R1 pauses at a temporary `/_specimen` route showing the palette, type scale and
every component in both themes. **I show you that and stop.** Tokens are applied
app-wide only after you say yes. The route is deleted before submission.

### Implementation steps
1. Contrast-verify every token pair with the existing script; nothing below AA ships
2. Tokens into `globals.css`, build the specimen route — **stop for approval**
3. Component vocabulary: `Card`, `Chip`, `Panel`, `EmptyState`, `Badge`, `Timestamp`
4. Replace every arbitrary `text-[Npx]` with a scale step
5. One shared container; fix heading structure (the search page has no `h2`s)
6. Re-run the verification suite

### Acceptance criteria
- [ ] No arbitrary `text-[Npx]` remains outside the token definitions
- [ ] No contrast pair below AA, proven by computation rather than eye
- [ ] Every surface uses the shared container; no page invents its own width
- [ ] Heading structure valid on all five surfaces — search results are headed
- [ ] Light and dark both verified on every surface
- [ ] All honesty labels present and legible in the new palette
- [ ] Playback, seeking, clips, search and highlights all still pass

---

## Phase R2 — one shell, one way to move (2:30, cutoff 3:00)

### Scope
Replace four unrelated page layouts with a persistent shell, and make search and
actions reachable from anywhere.

### User flow
1. Land anywhere — meetings are always present in a left rail
2. Open one — it fills the content area; the rail keeps your place
3. `Cmd/Ctrl-K` anywhere — search **this meeting** or **all meetings**, and run
   actions: share, clip, highlight, jump to a moment
4. Narrow screens — the rail becomes a drawer; the palette stays

The share view is the deliberate exception: no rail, no search, no palette. A
recipient was given one meeting, not an account.

### Acceptance criteria
- [ ] The shell is identical across list, review and search — no layout jump
- [ ] The palette opens from every non-share screen, closes on Escape, restores focus
- [ ] It searches transcripts and meetings, and exposes share, clip and highlight
- [ ] Results and actions reachable by keyboard alone — arrows and Enter
- [ ] The `/search` page still works as a deep link
- [ ] Rail collapses to a drawer below 900px with no horizontal scroll
- [ ] Share view shows no rail, no search, no palette
- [ ] Opening a meeting does not lose rail scroll position
- [ ] Landmarks present: nav, main, complementary

---

## Phase R3 — time as the primitive (2:30, cutoff 3:00)

### Scope
One way to render a moment, and one object that shows the shape of a meeting.

### The timeline ribbon
Replaces the 345px gradient box. Full width:

- **speaker bands** — who talks when, across 62 minutes and 8 people
- highlight markers, action-item pins and search hits on the same axis
- click anywhere to seek; the playhead rides along it

Fathom leads with video because they have video. We do not — so the constraint
becomes the differentiator. For an hour-long eight-speaker call, *who spoke when
and where were the decisions* is the most useful single view, and nothing in the
product shows it today.

### The `Moment` component
One affordance wherever a timestamp appears — search hits, action items,
highlights, transcript lines, Ask citations. Same look, same seek, same keyboard
behaviour. Today these are five treatments of one concept.

### Acceptance criteria
- [ ] Speaker bands render correctly for 8 speakers across 62 minutes
- [ ] Unmatched speakers are visually distinct in the bands, not silently merged
- [ ] Clicking the ribbon seeks; the playhead tracks playback
- [ ] Highlights, action items and search hits all appear on the ribbon
- [ ] It degrades honestly for the 44-second real meeting and for clip views
- [ ] Every timestamp in the app is a `Moment`; none render bespoke
- [ ] Ribbon is keyboard operable and labelled for screen readers
- [ ] Clip views bound the ribbon to the clip, matching the bounded scrubber
- [ ] No jank at 72 segments — measured, not assumed

---

## Risk

| Risk | Mitigation |
|---|---|
| The revamp breaks verified behaviour | Playback, redaction, clip bounds and the leak guards live in `usePlayback`, `lib/share.ts` and `data/` — not the view layer. Re-run the suite after each phase, not at the end. |
| Honesty labelling gets lost in a redesign | Non-negotiable acceptance criteria in all three phases. |
| The palette lands badly and needs redoing | R1 stops at a specimen you approve before anything is applied. |
| Scope creep into a fourth phase | Cutoffs are hard. Anything found on the way is written down, not built. |

## Deferred

Animation beyond what aids comprehension · a theme switcher (system preference
only) · onboarding · an empty-account state · virtualising the transcript unless
measured slow · any new product feature.

## Consequence for the walkthrough

The current script describes layouts that will not exist. It needs a fourth
rewrite after R3 — about 30 minutes, inside the reserve. **Do not record until R3
is deployed and verified.**

---

**APPROVAL GATE.** Approving this approves **R1 up to the specimen checkpoint**.
R1's application, R2 and R3 each report before starting.
