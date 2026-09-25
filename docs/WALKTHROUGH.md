# Walkthrough script — target 4:25, hard limit 5:00

Camera on throughout. Fourth revision: rewritten for the revamped interface
(R1 design system, R2 shell + command palette, R3 time as the primitive). Every
screen below was checked against the built app on 2026-09-26.

**Base URL:** `https://fathom-ai-clone-8x.vercel.app`

---

## Pre-flight (before you hit record)

- [ ] **Merge `feat/fathom-rebuild` into `develop`.** Production deploys from
      `develop`, and as of this rewrite `develop` is still on the pre-revamp
      merge — the live site has none of R1–R3. Merge, wait for the deploy, and
      confirm the Q3 meeting shows a **speaker ribbon** and a **Share or clip**
      button before you record anything.
- [ ] **Vercel → Settings → Security → Attack Challenge Mode: OFF.** It has
      re-armed twice. It shows a "Security Checkpoint" spinner before the site
      loads — harmless, but it looks broken on camera.
- [ ] **Incognito window.** Proves no login, and clears `localStorage` so the Q3
      meeting reads **1/9 done** with exactly **4 highlights**, not your test ones.
- [ ] **Window at least 1000px wide.** Below 900px the meetings rail collapses
      into a drawer, and the rail is part of what you are showing.
- [ ] **Test screen-audio capture.** The real-audio beat is the spine of this
      video. If audio is not captured, that beat is dead.
- [ ] Open these tabs in advance so you never type a URL on camera:
  1. `/`
  2. `/meetings/impromptu-google-meet-meeting`
  3. `/meetings/q3-platform-review`
  4. `/share/wyeuNaLtcntHnjRJmHL6YTmr?from=554&to=614`
- [ ] Browser zoom 100%, bookmarks bar closed.

---

## The script

### 0:00 – 0:18 — What's real, first

> "This is Recap, a meeting review tool I built for the 8x assignment. Before
> anything else: one meeting in here is a **real recording** I made. The rest is
> **seeded demo data**, and the app labels which is which on every screen. There's
> no recording bot — nothing here joins a call."

Lead with this. It is the claim everything else rests on.

### 0:18 – 0:35 — Public, no login, and one place for everything

**Tab 1 — `/`.** One green **Real recording** badge, four grey **Seeded demo data**.

> "Public URL, incognito, no account. Five meetings. And the list doesn't go
> away when you open one — it's a rail that stays, so you're never navigating
> back to find the next thing."

### 0:35 – 1:20 — The real meeting, and the mistake in it (KEY BEAT)

**Tab 2 — `/meetings/impromptu-google-meet-meeting`.**

**Press play. Let 5–6 seconds of real audio run.**

> "Forty-four seconds, me testing Fathom. Real audio, and the transcript follows it."

**Then, while the audio is still fresh:**

> "Listen to what I actually said versus what it wrote. I said *Fathom clone*.
> The transcript says *Fathom **drone***. And *8x assignment* came out as
> ***8x0***. That's Fathom's own transcription — I kept its mistakes rather than
> tidying them up, because that's the honest version, and it's exactly why every
> line is clickable."

**Click "to build a Fathom drone"** — the player jumps to 0:09.

> "Click any line and the audio seeks there. You can always check the machine."

**Open the Summary tab** (this meeting opens on Transcript, because there is no summary):

> "Fathom refused to summarise this — too short — and found no action items. So
> that's what it shows, with the reason. I didn't write a summary it never produced."

### 1:20 – 2:00 — Scale, and the shape of a meeting (KEY BEAT)

**Tab 3 — `/meetings/q3-platform-review`.** Point at the ribbon across the top.

> "Seeded, and says so. Sixty-two minutes, eight speakers. And this is the part
> I'd point at first: most tools open a meeting with a video player. I don't have
> video, so instead of a play button on a grey rectangle, the top of the page is
> **the meeting itself** — every turn, who took it, across the full hour.
> The wide bands are where one person held the floor."

**Click somewhere in the middle of the ribbon** — the transcript jumps there.

> "Click anywhere in it and you're at that moment. The ticks are where decisions
> were agreed and where the highlights are, on the same axis — so before you read
> a word, you know where the meeting's weight is."

### 2:00 – 2:20 — The bit I'd defend in an interview (KEY BEAT)

Point at the **hatched bands** and the legend entries reading **Speaker 7 (unmatched)**
and **Speaker 8 (unmatched)**.

> "Eight speakers, two the system couldn't match to a calendar invitee. They're
> hatched instead of coloured, and the legend says *unmatched* rather than
> guessing a name. Fathom's own API marks that join nullable — their schema
> admits it fails. A wrong name on a quote is worse than no name."

### 2:20 – 2:40 — Decisions first, anchored to time

**Summary tab**, then **click the action item "Audit all ~400 alert rules" `@ 9:14`**:

> "Decisions at the top, not a wall of prose. And every action item carries the
> moment it was agreed — click it and you're on the line where it happened.
> Same timestamp component everywhere, so it always means the same thing."

### 2:40 – 3:00 — Highlights

Point at the markers on the scrubber, then the Highlights rail.

> "Highlights. Four here already — click one and it jumps."

**Click a marker.** Then press play briefly, hit **Highlight**, type a word, save.

> "And you can mark your own. One honest difference: Fathom makes these *during*
> a call. There's no live call here, so mine are made while reviewing — the app
> says so rather than faking an in-call widget."

### 3:00 – 3:20 — Search, both distances

In the Transcript tab, type **`migration`** into the transcript's own search field:

> "Search inside a meeting — eight of seventy-two segments."

Then **⌘K**, type **`export`**:

> "And across all of them, from anywhere, with one shortcut. A hit isn't a page —
> it's a moment."

**Press Enter on a result.** It lands on that line, in that meeting.

### 3:20 – 3:55 — Sharing, clips, and a dead link

**Share or clip → 60s clip → open it.** (Or Tab 4, pre-opened.)

> "Share the whole meeting, or just a moment. This is a one-minute clip — the
> ribbon is bounded to it, there are only two speakers in it, the transcript has
> only those two segments, and the summary is withheld because it describes the
> whole meeting. It says that, rather than showing a blank tab."

> "The emails and action items aren't just hidden, they're stripped on the
> server, so they're not in the page source either. Clips aren't something
> Fathom's share dialog does — that one's ours."

**Edit the URL to `/share/nope`:**

> "And a dead link. Fathom serves a blank white page here, I checked. This one
> says what happened."

### 3:55 – 4:25 — Close honestly

> "What's not here: no recording bot, no database, no login. The long meeting
> runs on a simulated timeline because there's no audio for it, and the Ask
> answers are pre-written rather than generated — both labelled in the app.
> I also didn't get through every Fathom flow before building; a lot of the data
> model came from their public API schema, and I never tested an hour-long
> eight-person call — the long one is seeded. The repo scores that honestly.
> Every prompt and response that built this is committed raw in `.agent-logs`,
> including the wrong turns."

---

## Cut list, if you run long

In this order — each is self-contained:

1. The **⌘K** half of the search beat — keep the in-meeting search
2. Creating a *new* highlight — just click an existing marker
3. The dead-link 404 at 3:50
4. The action-item click at 2:30 (the ribbon click already showed seeking)

**Never cut:** the opening real-vs-seeded statement, the real audio playing, the
ASR mistake, the unmatched speakers, or the closing limitations.

---

## Things not to say

- NO: "I recorded an eight-person meeting." You did not. It is seeded.
- NO: "I went through all of Fathom first." Three of eleven named flows. Saying
  so costs eight seconds; a reviewer who has used Fathom noticing it unmentioned
  costs more.
- NO: "Fathom can't share clips." The *free-plan share dialog* has no time range.
  That is the limit of what you saw. Say "their share dialog doesn't do this."
- NO: "The AI generates answers." The Ask answers are pre-written; the panel says so.
- NO: "It transcribes your calls." There is no capture bot.
- YES: "One real recording, the rest seeded and labelled" — accurate, and stronger.

---

## Numbers you can say on camera

All read off the built app on 2026-09-26, not from memory:

| Where | What it says |
|---|---|
| `/` | 5 meetings, 1 real, 4 seeded |
| Q3 ribbon | `8 speakers` · `0:00 – 1:02:00` · `4 highlights` |
| Q3 legend | 8 names, 2 of them `(unmatched)` |
| Q3 transcript | `72 segments` · `6 from unmatched speakers` |
| Q3 transcript, "migration" | `8 of 72 segments` |
| Q3 action items | `1/9 done` in a fresh incognito window |
| `/search?q=export` | `16 results in 4 meetings` |
| Clip `?from=554&to=614` | `2 speakers` · `9:14 – 10:14` · `2 segments` |
| Real meeting | `1 speaker` · `0:00 – 0:43` · `7 segments` · `Audio only — no video` |
