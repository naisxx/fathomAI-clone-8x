# Recap

A meeting-review tool: transcript, AI summary and action items anchored to the
moment they happened. Built for the 8x Careers assignment.

**Live:** <https://fathom-ai-clone-8x.vercel.app/>

---

## What is real and what is not

This matters more than any feature, so it is the first thing in the README.

| | |
|---|---|
| **One meeting is real.** "Impromptu Google Meet Meeting" is a genuine 44-second Fathom recording made by the author. The audio is real. Every word of the transcript is Fathom's own output, copied verbatim. | Badged **Real recording** |
| **Everything else is seeded.** The 62-minute eight-speaker "Q3 Platform Review" and three supporting meetings are written, not recorded. There is no audio; a simulated clock drives playback so seeking, transcript sync and timestamp links behave exactly as they do with real media. | Badged **Seeded demo data** |

Specifically **not** claimed:

- **No eight-person call was ever recorded or tested.** The eight-speaker meeting
  is seeded, and says so on every screen it appears on.
- **There is no recording bot.** Nothing here joins a meeting. Capture is out of
  scope and is not stubbed to look otherwise.
- **The real meeting has no summary and no action items**, because Fathom
  produced neither — it reported "Meeting too short to generate a summary" and
  detected no action items. Those real empty states are shown as they were
  rather than filled in.

### Two things worth knowing about the real recording

**The video track was discarded, not masked.** The original download had the
Google Meet join code burned into every frame — a live meeting credential. Since
all frames were an identical static avatar, the video carried no information, so
only the audio ships. The published asset is verified to contain a single audio
track and no video track.

**Timestamps were aligned manually.** Fathom exports no timestamps. Segment
boundaries were derived from the audio itself using `ffmpeg silencedetect`:
speech runs 3.43 s → 36.96 s, and the largest internal pause (1.32 s at 26.56 s)
falls exactly at the paragraph break in the transcript. Clause placement within a
segment is proportional, so it is accurate to roughly ±1 s. The UI says
"timestamps manually aligned" for this reason.

---

## How it was built

Every prompt and final response is captured automatically and committed in
[`.agent-logs/`](.agent-logs/), interleaved with the code it produced. Start with
[`CAPTURE-TEST.md`](CAPTURE-TEST.md).

The research behind the product decisions is in [`docs/research/`](docs/research/):
[`FINDINGS.md`](docs/research/FINDINGS.md) from Fathom's public surfaces and API
spec, and [`SCREENSHOT-RECONCILIATION.md`](docs/research/SCREENSHOT-RECONCILIATION.md)
reconciling that against a real test call.

Decisions and their tradeoffs are logged append-only in
[`docs/DECISIONS.md`](docs/DECISIONS.md).

---

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS · deployed on Vercel.

**No database, no authentication, no runtime AI API** — on purpose:

- Everything served is seeded and read-only, so a database would add a
  credential, an env var and a cold-start failure mode in exchange for nothing.
- Auth would be actively harmful: the app must work for an unsigned visitor.
- A runtime AI key costs money per view and can fail live. AI-written content was
  generated once during the build and committed as labelled seed data.

Action-item ticks persist in `localStorage`, per browser, and the UI says so.

The data model is named after
[Fathom's published OpenAPI schema](https://developers.fathom.ai/api-reference/openapi.yaml)
so it is traceable to a real contract. Two fields stay deliberately nullable —
`matchedInviteeEmail` and `matchedSpeakerDisplayName` — because Fathom's own
schema marks them "Null if no exact match found". Speaker-to-attendee matching
genuinely fails, and the UI renders that gap instead of hiding it.

---

## Running locally

```bash
npm install
npm run dev
```

---

## Not built

Highlights · playlists · alerts · deals · team calls · CRM matching · multi-team
permissions · template switching · transcript editing · speaker renaming ·
trimming · exports · a real recording bot · real auth · a real database.

These are absent, not stubbed to look present.
