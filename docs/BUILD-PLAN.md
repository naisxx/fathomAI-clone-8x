# Build Plan — revised

**Status: PROPOSED — awaiting approval. Nothing scaffolded, no dependencies installed.**

Revision 2, 2026-09-25 14:30 UTC. Supersedes revision 1 (see `DECISIONS.md` 017,
019–021). Evidence: [`FINDINGS.md`](research/FINDINGS.md) ·
[`SCREENSHOT-RECONCILIATION.md`](research/SCREENSHOT-RECONCILIATION.md).

## Time remaining

Work began 2026-09-25 ~12:30 UTC. On a 24-hour budget that ends **~12:30 UTC on
26 Sep**. About **22 hours** remain; this plan commits **15:45** of work and
leaves the rest as slack, because the estimate that always slips is the last one.

> **Correct me if your real deadline is earlier** — it is the one input that
> changes the cut line, and I have assumed rather than been told it.

**No further Fathom research.** Gate 3 is closed. Research reopens only if a
specific build decision needs it, and only for that decision.

## Product goal

Make a one-hour, eight-person meeting fast to re-enter. A reader, not a recorder.

## Target reviewer journey

Graded on speed, product judgment and UX/UI. The reviewer has minutes and will not
sign up.

1. Public URL → meeting list, no login.
2. Open the **real-media meeting** → hear actual audio, transcript follows along.
3. Click a transcript line → audio seeks. This is the proof the product is real.
4. Open the **62-min eight-speaker meeting** → the interface holds at scale.
5. Click an action item → jumps to its moment.
6. Notice the honesty labelling and believe the rest.

## The two meetings, and why they differ

Decision 017, amended by 019.

### Tier 1 — "Impromptu Google Meet Meeting" — REAL

Badge: **`Real recording — audio only`**

- **Source:** the user's own downloaded Fathom recording, 43.70 s.
- **Audio only.** The video track is discarded — not masked, discarded — because
  the **Google Meet join code is burned into every frame**. Discarding it also
  costs nothing: all twelve sampled frames were an identical static avatar.
- We render our own player visual (avatar, waveform/progress, speaker chip).
- **Transcript must come from Fathom's own `Copy Transcript`.** Timestamps get
  aligned to the real 43.70 s audio. **No dialogue is invented.** If the transcript
  is unavailable, tier 1 ships as audio + player with the transcript panel showing
  an honest "transcript not available for this recording" state — it does **not**
  get filled with plausible-sounding text.
- **Action items: none.** Fathom itself detected none, and the call is 43 seconds.
  The action-items panel shows the real empty state, quoting Fathom's own wording.
  Action items are demonstrated on tier 2, which is labelled seeded.

### Tier 2 — "Q3 Platform Review" — SEEDED

Badge: **`Seeded demo data — simulated timeline, no audio`**

- 62 min, 8 speakers, ~400 transcript lines, 9 action items, 2 deliberately
  unmatched speakers.
- Simulated transport: real clock, play/pause, seek, speed, transcript auto-follow,
  click-to-seek, `?t=` deep links. Everything works; there is simply no audio.
- Exists to prove the interface survives scale — the thing 43 seconds cannot show.

**The whole honesty position is that these two are visibly different.** One badge
each, stated in the README and said out loud in the walkthrough.

### Supporting seeded meetings (list needs somewhere to go)

| Meeting | Shape | Earns its place by |
|---|---|---|
| Design sync | 24 min, 3 speakers | giving search a second target |
| Customer call | 18 min, 2 speakers, 1 external domain | exercising `isExternal` |
| Standup | 4 min, 5 speakers, no action items | empty action-items state |

## Stack — unchanged, and still nothing added

Next.js 15 (App Router) · TypeScript · Tailwind · Vercel. **No database, no auth,
no runtime AI API** (decision 014). No-auth is now a *hard requirement*, not a
preference. AI content is generated once during the build and committed as
labelled seed data. Action-item toggles use `localStorage`, and say so.

```
/                    meeting list
/meetings/[id]       review screen   (?tab= and ?t= drive state)
/share/[token]       reduced public view      (P7)
/share/<bad>         branded 404              (P7)
public/media/        audio asset, video track discarded
data/                typed seed, shaped to Fathom's published OpenAPI schema
```

## Data model

Named after `developers.fathom.ai/api-reference/openapi.yaml`, trimmed to what we
render.

- **Meeting** — `id, title, meetingType, scheduledStart/End, durationSec, transcriptLanguage, shareToken, invitees[], recordedBy, summary, actionItems[], transcript[], mediaKind: 'real-audio' | 'simulated', source: 'real' | 'seeded'`
- **TranscriptItem** — `speakerDisplayName, matchedInviteeEmail: string | null, text, timestampSec`
- **Invitee** — `name, email, emailDomain, isExternal, matchedSpeakerDisplayName: string | null`
- **MeetingSummary** — `templateName, markdown`
- **ActionItem** — `description, assignee, timestampSec, completed, userGenerated`

`matchedInviteeEmail` / `matchedSpeakerDisplayName` stay nullable **on purpose**
and the unmatched case is rendered visibly. Fathom's own schema concedes this
matching fails; we show it instead of hiding it.

## Phases

MVP = **P0–P4**. Everything after is ranked, with cutoffs. Hit a cutoff, ship what
works, move on.

### MVP — first deployable product (7:15)

| P | Slice | Acceptance criteria | Est | Cutoff |
|---|---|---|---|---|
| **0** | Scaffold + **deploy to Vercel at once** | Public URL serves a styled page from another device with no session. Build is green. | 0:45 | 1:00 |
| **1** | Types + seed infrastructure + tier-1 meeting | `data/` typechecks. Audio extracted, **video track absent from the shipped asset** (verified by inspecting the file, not by trusting the pipeline). Tier-1 transcript aligned to real audio, or the honest not-available state. | 2:00 | 2:30 |
| **2** | Meeting list | Cards grouped by date; duration badge; per-meeting `Real` / `Seeded` badge; demo banner; click → detail; clean at 375px. | 1:15 | 1:30 |
| **3** | Review screen + transcript + audio player | Two columns, tabbed left pane. Audio plays on the deployed URL. Transcript follows playback. **Click a line → audio seeks.** `?t=` deep-links on load. Speaker + `HH:MM:SS` per line. | 2:30 | 3:00 |
| **4** | Summary tab + action items + tier-2 meeting | Summary renders markdown with template name. Tier-2 meeting present: 8 speakers, ~400 lines, 9 action items, ≥2 unmatched shown as unmatched. Action item click → seek. `completed` toggles, survives reload, AI vs manual distinguished. Tier-1 shows the real empty action-items state. | 2:45 | 3:15 |

**End of P4 = a complete, honest, deployable product.** If everything after this is
cut, the submission still stands on its own.

### Ranked extras — strict order, cut from the bottom (5:30)

| P | Slice | Acceptance criteria | Est | Cutoff |
|---|---|---|---|---|
| **5** | **UX/UI pass** — a graded axis | Visual hierarchy holds. Designed empty / too-short / error states. 375px genuinely usable. Keyboard reach + visible focus. Contrast AA. No jank at 400 lines. Console clean. | 2:30 | 2:45 |
| **6** | Cross-meeting search | Query returns hits across meetings with timestamps; click lands on that moment; empty-query and no-results states. | 1:15 | 1:30 |
| **7** | Share view + branded 404 | `/share/<token>` works in a private window; reduced view; bad token → **branded 404**, the gap we found in Fathom. | 1:15 | 1:30 |
| **8** | Ask tab (canned, labelled) | Suggestion chips return grounded answers citing timestamps; visibly marked pre-generated. | 0:30 | 0:45 |

Cut order if time runs short: **8, then 7, then 6.** P5 is not cuttable — UX/UI is
graded.

### Reserved — not negotiable (3:00)

| P | Slice | Acceptance criteria | Est |
|---|---|---|---|
| **9** | Deployment testing on the **live URL** | `verify-slice` green on production in a fresh tab, no session. Audio plays from the deployed origin. Mobile checked on a real phone viewport. | 1:30 |
| **10** | Camera-on walkthrough | Under 5:00, camera on, deployed URL, states what is real and what is seeded. | 1:30 |

**Totals: MVP 7:15 · extras 5:30 · reserved 3:00 = 15:45 committed** against ~22 h.

## Risks

| Risk | Mitigation |
|---|---|
| **No transcript for tier 1** | The one open dependency. Needs Fathom's `Copy Transcript` output. Without it, tier 1 ships audio + honest empty transcript state — never invented dialogue. |
| **Audio extraction without ffmpeg** | No ffmpeg, no pyav, no moviepy on this machine. Fallbacks in order: (a) decode + re-encode in-browser via Web Audio, (b) pure-Python AAC→ADTS remux, (c) `pip install imageio-ffmpeg` for a static binary — **I will ask before installing anything.** |
| **Seeding ~400 transcript lines eats budget** | Generate structurally from a topic outline; hand-author only the passages the summary and action items point at. Cutoff 3:15, then ship fewer lines. |
| Vercel build surprises | P0 exists to find them at hour one. |
| Deadline earlier than assumed | Stated above as an assumption, not a fact. Cut order is pre-declared so the decision is already made. |

## Explicit deferrals

Highlights · Playlists · Alerts · Deals · Team Calls · CRM matching · multi-team
permissions · template switching · transcript editing · speaker renaming ·
trimming · exports · real recording bot · real auth · real database · mobile app.

The walkthrough names these as deferred rather than implying they exist.

## Earliest public link

**End of P0, ~45 minutes in** — deliberately before there is anything to show.

## Walkthrough outline — 4:30

| Time | Beat |
|---|---|
| 0:00–0:20 | Camera on. What it is. Which data is real and which is seeded — said first, not buried. |
| 0:20–0:45 | Public URL, no login. Meeting list, badges visible. |
| 0:45–1:30 | **Real** meeting: play actual audio, transcript follows, click a line → it seeks. |
| 1:30–2:30 | **Seeded** 62-min eight-speaker meeting: summary, then action item → jump to its moment. |
| 2:30–3:00 | Transcript at scale, including honestly unmatched speakers, and why that matters. |
| 3:00–3:40 | Search across meetings; share link in a private window; dead link → branded 404. |
| 3:40–4:30 | What is stubbed, what is deferred, where the raw `.agent-logs/` are. |

---

**APPROVAL GATE.** Approving this approves **P0–P4 (the MVP) and the stack**, and
authorises implementation to begin. P5–P8 report before starting. Nothing is
scaffolded or installed until you reply.
