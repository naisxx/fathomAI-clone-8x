# Walkthrough script — target 4:30, hard limit 5:00

Camera on throughout. Every URL below is live and was verified on production.

**Base URL:** `https://fathom-ai-clone-8x.vercel.app`

> **Budget note.** The earlier script ran 4:20 with no clips, no highlights and
> no ASR beat. Adding three beats needed about 65s, so the scale and search beats
> are tightened and cross-meeting search is folded in rather than given its own
> slot. Net 4:30.

---

## Pre-flight (before you hit record)

- [ ] **Vercel -> Settings -> Security -> Attack Challenge Mode: OFF.** It has
      re-armed twice. It shows a "Security Checkpoint" spinner before the site
      loads - harmless, but it looks broken on camera.
- [ ] **Incognito window.** Proves no login, and clears `localStorage` so the Q3
      meeting reads **1/9 done** with exactly **4 highlights**, not your test ones.
- [ ] **Test screen-audio capture.** The real-audio beat is the spine of this
      video. If audio is not captured, that beat is dead.
- [ ] Open these tabs in advance so you never type a URL on camera:
  1. `/`
  2. `/meetings/impromptu-google-meet-meeting`
  3. `/meetings/q3-platform-review`
  4. `/share/wyeuNaLtcntHnjRJmHL6YTmr?from=554&to=614`
- [ ] Browser zoom 100%, about 1280px wide, bookmarks bar closed.

---

## The script

### 0:00 - 0:20 - What's real, first

> "This is Recap, a meeting review tool I built for the 8x assignment. Before
> anything else: one meeting in here is a **real recording** I made. The rest is
> **seeded demo data**, and the app labels which is which on every screen. There's
> no recording bot - nothing here joins a call."

Lead with this. It is the claim everything else rests on.

### 0:20 - 0:40 - Public, no login

**Tab 1 - `/`** - one green **Real recording** badge, four amber **Seeded demo data**.

> "Public URL, incognito, no account. Five meetings grouped by day."

### 0:40 - 1:30 - The real meeting, and the mistake in it (KEY BEAT)

**Tab 2 - `/meetings/impromptu-google-meet-meeting`**

**Press play. Let 5-6 seconds of real audio run.**

> "Forty-four seconds, me testing Fathom. Real audio, and the transcript follows it."

**Then the beat that matters, while the audio is still fresh:**

> "Listen to what I actually said versus what it wrote. I said *Fathom clone*.
> The transcript says *Fathom **drone***. And *8x Assignment* came out as
> ***8x0***. That's Fathom's own transcription - I kept its mistakes rather than
> tidying them up, because that's the honest version, and it's exactly why every
> line is clickable."

**Click "to build a Fathom drone"** - the player jumps to 0:09.

> "Click any line and the audio seeks there. You can always check the machine."

**Open Summary:**

> "Fathom refused to summarise this - too short - and found no action items. So
> that's what it shows. I didn't write a summary it never produced."

### 1:30 - 2:15 - Scale

**Tab 3 - `/meetings/q3-platform-review`**

> "Seeded, and says so. Sixty-two minutes, eight speakers - the thing a
> 44-second call can't tell me: does this hold up."

**Summary tab**, then **click the action item "Audit all ~400 alert rules" `@ 9:14`**:

> "Decisions first. And action items carry the moment they were agreed - click
> one and you're at the line where it happened."

### 2:15 - 2:40 - The bit I'd defend in an interview (KEY BEAT)

Scroll to a **`Speaker 7`** line with the amber **UNMATCHED** chip.

> "Eight speakers, two the system couldn't match to a calendar invitee. It says
> *unmatched* rather than guessing. Fathom's own API marks that join nullable -
> their schema admits it fails. A wrong name on a quote is worse than no name."

### 2:40 - 3:05 - Highlights

Point at the **amber markers on the scrubber**, then the Highlights rail.

> "Highlights. Four here already - click one and it jumps."

**Click a marker.** Then press play briefly, hit **Highlight**, type a word, save.

> "And you can mark your own. One honest difference: Fathom makes these *during*
> a call. There's no live call here, so mine are made while reviewing - the app
> says so rather than faking an in-call widget."

### 3:05 - 3:30 - Search, both kinds

In the transcript tab, type **`migration`** into **Search this transcript**:

> "Search inside a meeting - eight of seventy-two segments."

Then the header search, type **`export`**:

> "And across all of them. Sixteen hits in four meetings - and a hit isn't a
> page, it's a moment."

### 3:30 - 4:05 - Sharing, clips, and a dead link

**Share panel -> pick "60s clip" -> open it.** (Or Tab 4, pre-opened.)

> "Share the whole meeting, or just a moment. This is a one-minute clip - the
> player is bounded to it, the transcript only has those two segments, and the
> summary is withheld because it describes the whole meeting."

> "The emails and action items aren't just hidden, they're stripped on the
> server, so they're not in the page source either. Clips aren't something
> Fathom's share dialog does - that one's ours."

**Edit the URL to `/share/nope`:**

> "And a dead link. Fathom serves a blank white page here, I checked. This one
> says what happened."

### 4:05 - 4:30 - Close honestly

> "What's not here: no recording bot, no database, no login, and the long meeting
> runs on a simulated timeline because there's no audio for it - all labelled.
> I also didn't get through every Fathom flow before building; a lot of the data
> model came from their public API schema, and I never tested an hour-long
> eight-person call. The repo scores that honestly. Every prompt and response
> that built this is committed raw in `.agent-logs`, including the wrong turns."

---

## Cut list, if you run long

In this order - each is self-contained:

1. The second half of the search beat (cross-meeting) - keep within-meeting
2. Creating a *new* highlight - just click an existing marker
3. The dead-link 404 at 3:55
4. The action-item click at 2:00 (the highlight click already shows seeking)

**Never cut:** the opening real-vs-seeded statement, the real audio playing, the
ASR mistake, or the closing limitations.

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
- YES: "One real recording, the rest seeded and labelled" - accurate, and stronger.
