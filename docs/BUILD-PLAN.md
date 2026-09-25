# Build Plan

**Status: PROPOSED — awaiting approval. Nothing scaffolded, nothing installed.**

Evidence base: [`FINDINGS.md`](research/FINDINGS.md) (documentation) +
[`SCREENSHOT-RECONCILIATION.md`](research/SCREENSHOT-RECONCILIATION.md) (live test).

## Product goal

A meeting-review product that makes a one-hour, eight-person call **fast to
re-enter**. Not a recorder — a reader. The value is in what happens *after* the
call, which is the part we can build completely in a day.

## Target reviewer journey

The person grading this has ~4 minutes and will not sign up for anything.

1. Opens the public URL → lands on a meeting list with real-looking content, no login.
2. Opens the hour-long eight-person meeting.
3. Reads an AI summary that is actually about the meeting.
4. Clicks an action item → the player jumps to `00:41:12` and the transcript scrolls to that line.
5. Searches "pricing" → hits across meetings, each landing on a timestamp.
6. Opens the share link in a private window → a clean, reduced public view.
7. Notices the demo-data labelling and concludes we were honest about it.

Every one of those steps must work on the deployed URL with no account.

## Evidence-based feature scope

| Feature | Evidence | Priority |
|---|---|---|
| Meeting list, card grid grouped by date, duration badge | Screenshot 7 `[OBSERVED]` | **Must** |
| Review screen: two columns, video left + tabbed pane, meta rail right | Screenshot 1 `[OBSERVED]` — settles the layout conflict | **Must** |
| Tabs: Summary ǀ Transcript ǀ Ask | Screenshots 1–3 `[OBSERVED]` | **Must** |
| Transcript: speaker, `HH:MM:SS`, per-line | API `TranscriptItem` | **Must** |
| Summary: markdown + `template_name` | API `MeetingSummary`; screenshots 4–6 (16 templates) | **Must** |
| Action items: description, timestamp, assignee, `completed`, `user_generated` | API `ActionItem` | **Must** |
| Timestamp deep links `?t=645` | API `recording_playback_url` example, verbatim | **Must** |
| Click transcript line → seek | **Unverified in Fathom** — we build it because it is obviously right | **Must** |
| Speaker ↔ attendee matching, with a visible *unmatched* state | API: both join fields nullable — Fathom's own schema concedes it fails | **Must** (our differentiator) |
| Share view for an unsigned visitor | Docs only; **never tested** | **Should** |
| Branded 404 for a dead share link | `[OBSERVED]`: Fathom returns 404 + zero-length body | **Should** (cheap, visible win) |
| Cross-meeting search | Search box `[OBSERVED]`, never used | **Should** |
| Ask-AI tab over one meeting | Screenshot 3 `[OBSERVED]` | **Should** |
| Empty / too-short / processing states | Screenshot 1 `[OBSERVED]` — two real ones | **Should** |
| Highlights, Playlists, Alerts, Deals, Team Calls, CRM, templates picker, multi-team permissions, real bot | — | **Defer** |

**Cut line** is between Should and Defer. If time runs out, Shoulds go, Musts do not.

## Recommended stack — and what I am arguing *against*

Your preference (Next.js, TypeScript, Tailwind, Vercel) is right. I recommend
adding **nothing** to it.

| | Verdict | Why |
|---|---|---|
| **Next.js 15 + TS + Tailwind** | **Yes** | App Router, static rendering, zero-config Vercel deploy. |
| **Vercel** | **Yes** | Public URL in minutes, preview per commit. |
| **Database (Supabase)** | **No** | Every byte we serve is seeded and read-only. A DB adds env vars, a cold-start failure mode during the walkthrough, and a credential we must keep out of a public repo — in exchange for nothing a typed `.ts` seed file does not already do. |
| **Authentication** | **No** | Actively harmful. The reviewer must not hit a login. The signed/unsigned distinction is a *route* concern, not an auth concern. |
| **Runtime AI API** | **No** | Needs a server-side key, costs money per view, adds latency, and can fail live on camera. |

**So where is the AI?** In the content, generated once and committed. I write the
seed summary, action items and Ask-AI answers with Claude during the build, and
commit them as seed data with provenance stated in the repo and on screen. That is
what "seeded data, labelled honestly" means — it is not a workaround.

Optional Phase 9 adds a live Ask endpoint behind `ANTHROPIC_API_KEY`, degrading to
the canned answers when unset. Only if the buffer survives.

**Interactivity without a backend:** action-item `completed` toggles and Ask-AI
history live in `localStorage`, with a visible note that changes are local to the
browser. No account, no server, no lying.

### Architecture

```
Next.js App Router (all static / SSG)
  /                    meeting list
  /meetings/[id]       review screen  (?tab=, ?t= drive state)
  /share/[token]       reduced public view
  /share/[bad]         branded 404
  /api/ask             Phase 9 only, optional
data/  typed seed, shaped to Fathom's OpenAPI schema
```

Mirroring the real `Meeting` / `TranscriptItem` / `MeetingSummary` / `ActionItem` /
`Invitee` shapes costs nothing and means the data model is defensibly derived from
a published contract rather than invented.

## Data model

Named after the public spec (`developers.fathom.ai/api-reference/openapi.yaml`),
trimmed to what we render.

- **Meeting** — `id, title, meetingType, scheduledStart/End, recordingStart/End, durationSec, transcriptLanguage, shareToken, invitees[], recordedBy, summary, actionItems[], transcript[], isDemo: true`
- **TranscriptItem** — `speakerDisplayName, matchedInviteeEmail: string | null, text, timestampSec`
- **Invitee** — `name, email, emailDomain, isExternal, matchedSpeakerDisplayName: string | null`
- **MeetingSummary** — `templateName, markdown`
- **ActionItem** — `description, assignee, timestampSec, completed, userGenerated`

`matchedInviteeEmail` and `matchedSpeakerDisplayName` stay **nullable on purpose**
and we render the unmatched case visibly. Fathom's schema admits this fails; we
show it instead of hiding it.

### Seeded content

| Meeting | Shape | Purpose |
|---|---|---|
| **Q3 Platform Review** | **62 min, 8 speakers**, ~450 transcript lines, 9 action items, 2 deliberately unmatched speakers | The centrepiece. Proves scale. |
| Design sync | 24 min, 3 speakers | A normal second meeting so search has somewhere to go. |
| Customer call | 18 min, 2 speakers, 1 external domain | Exercises `isExternal`. |
| Standup | 4 min, 5 speakers, no action items | Empty action-items state. |
| Quick sync | 38 sec | **Too-short state** — the real one from screenshot 1. |

**Labelling.** A persistent `Demo data` badge in the header, a one-line banner on
the meeting list, and a `README` section stating that no real call was recorded,
that transcripts are synthetic, and that playback is simulated. The walkthrough
says it out loud.

### Playback — two tiers, and the difference is stated on screen

Per decision D2 the product has **two kinds of meeting**, and the UI never blurs
them.

**Tier 1 — Featured meeting: real playable media, real timestamp-aligned transcript.**
One short meeting (3–6 min) carries an actual audio/video file with a transcript
whose timestamps line up with it. Play, seek, click-a-line-to-seek and
`?t=` deep links are all genuinely driven by a media element. This is the meeting
the walkthrough demonstrates the core interaction on. Badge: **`Real recording`**.

Source, in order of preference:

1. **The user's own Fathom recording**, if it can be downloaded and they are happy
   to publish it. Fathom's docs confirm a Standard-role viewer "can download the
   call" ([help 295616](https://help.fathom.video/en/articles/295616)); free-plan
   owner download is unconfirmed — a 5-second check of the `⋮` menu beside Share
   settles it. The existing 1-min solo call is too thin to feature; the 5–6 min
   call with spoken commitments from check D4(a) is the right candidate.
2. **A short recording we make ourselves** — a few minutes, two voices, scripted
   so the summary and action items have something real to point at.

Either way the transcript is produced from the actual audio, so alignment is real
rather than asserted.

**Tier 2 — The 62-minute, eight-speaker meeting: simulated timeline, labelled.**
No audio. A simulated transport drives a real clock — play/pause, seek, speed,
transcript auto-follow, click-to-seek, `?t=` — against synthetic transcript
timings. Badge: **`Simulated timeline — no audio`**, and the README and
walkthrough say the same.

This exists to prove the product holds up at scale, which is the thing a short
real recording cannot show. Generating an hour of TTS is explicitly **not** being
done — the cost is hours and the gain is nil, since nobody listens to an hour of
synthetic speech in a 4-minute walkthrough.

**Why both.** Tier 1 proves the interaction is real. Tier 2 proves the interface
survives scale. Claiming either one is the other is the failure mode; two visibly
different badges is the fix.

## Phases

Each produces a deployable slice. Each has a cutoff: hit it, ship what works, move on.

| P | Slice | Acceptance (browser-checkable) | Est | Cutoff |
|---|---|---|---|---|
| **0** | Scaffold + **deploy to Vercel immediately** | Public URL serves a styled page. Shared from another device, it loads. | 0:45 | 1:00 |
| **1** | Types + seed generator + the 62-min 8-speaker meeting | `data/` typechecks; meeting has ≥400 lines, 8 speakers, ≥2 unmatched, 9 action items | 2:00 | 2:30 |
| **2** | Meeting list | Cards grouped by date, duration badge, demo banner; click → review route; 375px clean | 1:15 | 1:30 |
| **3** | Review shell + **Transcript tab** | Two columns; tabs switch without losing player; 450 lines scroll smoothly; speakers + `HH:MM:SS`; unmatched shown as *unmatched* | 2:30 | 3:00 |
| **4** | **Summary tab** | Markdown renders with template name; sections; no placeholder text | 1:15 | 1:30 |
| **5** | **Action items + deep links** | Each item shows assignee + `@HH:MM:SS`; click → player seeks + transcript scrolls to line; `completed` toggles and survives reload; AI vs manual distinguished | 2:00 | 2:30 |
| **6** | Player: real media (featured) + simulated transport (long meeting) | Featured meeting plays actual audio; click a transcript line → media seeks; long meeting's simulated clock does the same with no audio; `?t=645` deep-links on load; both badges visible and distinct | 2:00 | 2:30 |
| **7** | Share view + branded 404 | `/share/<token>` works in a **private window**; reduced view; bad token → branded 404, not a blank page | 1:30 | 1:45 |
| **8** | Cross-meeting search | Query returns hits across meetings with timestamps; click lands at that moment; empty-query and no-results states | 1:15 | 1:30 |
| **9** | Ask tab (canned, labelled) | Suggestion chips return grounded answers citing timestamps; clearly marked pre-generated | 1:00 | 1:15 |
| **10** | UX/UI pass — graded axis | Visual hierarchy; designed empty / too-short / 404 states; 375px genuinely usable; keyboard reach + visible focus; contrast AA; no jank at 450 lines; console clean | 2:30 | 3:00 |
| **11** | QA pass on the **deployed URL** + fixes | `verify-slice` checklist green on production, fresh tab, no session | 1:30 | 2:00 |
| **12** | Walkthrough recording | Under 5:00, camera on, deployed URL | 1:00 | 1:15 |

**Total 20:15 estimated, 24:15 at cutoffs.** Phases 0–6 are the Musts (~11:45).
Phases 7–9 are Shoulds and are the cut material if we slip.

**Earliest public link: end of Phase 0, ~45 minutes in.** Deploying before there is
anything to show is deliberate — it de-risks the deliverable that is hardest to
recover if it fails late.

## Risks

| Risk | Mitigation |
|---|---|
| **Featured media unavailable** — Fathom won't export and recording our own slips | Fall back to a 2-minute two-voice recording; tier 1 needs to be *real*, not *long*. If both fail, the featured meeting drops to tier 2 and the walkthrough says so. |
| **Seeding 450 realistic transcript lines eats the budget** | Biggest real risk. Generate structurally (scripted speaker turns over a topic outline), author only the passages the summary and action items point at. Cutoff 2:30, then ship fewer lines. |
| Simulated playback reads as fake on camera | Label it, and make every timestamp behaviour genuinely work. Decision D3 below. |
| Long transcript jank at 450 nodes | Virtualise only if measured slow. Do not pre-optimise. |
| Vercel build surprises | Phase 0 exists to find them at hour 1, not hour 20. |
| Full 8x brief still missing | `docs/ASSIGNMENT.md` gaps unresolved; release checklist has `[BRIEF]` holes. |

## Explicit deferrals

Highlights/bookmarks · Playlists · Alerts · Deals · Team Calls · CRM matching ·
multi-team permissions · template switching · transcript editing · speaker
renaming · trimming · exports · real recording bot · real auth · real database ·
mobile app.

The walkthrough will name these as deferred rather than implying they exist.

## Walkthrough outline — 4:30

| Time | Beat |
|---|---|
| 0:00–0:20 | Camera on. What it is, and that data is seeded — said first, not buried. |
| 0:20–0:50 | Public URL, no login. Meeting list. Open the 62-min eight-person call. |
| 0:50–1:40 | Summary tab: what the meeting decided, from an hour of talk. |
| 1:40–2:30 | Action item → click → seek to `00:41:12`, transcript follows. The core moment. |
| 2:30–3:00 | Transcript: 8 speakers, and the honestly-unmatched ones. Why that matters. |
| 3:00–3:30 | Search "pricing" across meetings → land on a timestamp. |
| 3:30–4:00 | Share link in a private window. Dead link → branded 404. |
| 4:00–4:30 | What is stubbed, what is deferred, and where the raw `.agent-logs/` are. |

---

**APPROVAL GATE — nothing is scaffolded or installed until you reply.**
Approving this plan approves Phase 0 and the stack. Each later phase still reports
before moving on.
