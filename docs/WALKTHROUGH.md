# Walkthrough script — target 4:20, hard limit 5:00

Camera on throughout. Every URL below is live and was verified on production.

**Base URL:** `https://fathom-ai-clone-8x.vercel.app`

---

## Pre-flight (do this before you hit record)

- [ ] **Vercel → Settings → Security → Attack Challenge Mode: OFF.** It is
      currently on and shows a "Vercel Security Checkpoint" spinner before the
      site loads. Harmless, but it looks broken on camera.
- [ ] Record in a **private/incognito window** — proves no login, and clears the
      `localStorage` action-item ticks so the Q3 meeting shows **1/9 done** as seeded.
- [ ] **Test your audio capture.** The single most important beat is hearing the
      real recording. If screen audio is not captured, that beat is dead.
- [ ] Open these four tabs in advance so you never type a URL on camera:
  1. `/`
  2. `/meetings/impromptu-google-meet-meeting`
  3. `/meetings/q3-platform-review`
  4. `/share/q3plat`
- [ ] Browser zoom 100%, window ~1280px wide. Close bookmarks bar.

---

## The script

### 0:00 – 0:20 · Say what it is, and what's real, first

> "This is Recap — a meeting review tool I built for the 8x assignment. Before
> anything else: one meeting in here is a **real recording** I made. The rest is
> **seeded demo data**, and the app labels which is which on every screen. There's
> no recording bot — nothing here joins a call."

**Lead with this.** Do not save it for the end. It is the claim everything else rests on.

### 0:20 – 0:45 · Public, no login

**Tab 1 — `/`**

> "Public URL, incognito window, no account. Five meetings, grouped by day."

Point at the badges: one green **Real recording**, four amber **Seeded demo data**.

### 0:45 – 1:35 · The real meeting — the proof

**Tab 2 — `/meetings/impromptu-google-meet-meeting`**

> "This one's real. Forty-four seconds, me testing Fathom."

**Press play. Let 5–6 seconds of actual audio run.** Watch the transcript
highlight follow.

> "Real audio, and the transcript follows it."

**Click the line "for my 8x Assignment."** → the player jumps to 0:11.

> "Click any line, the audio seeks there."

Then the honest part — open **Summary**:

> "Fathom refused to summarise this — too short — and found no action items. So
> that's what it shows. I didn't write a summary it never produced. The empty
> states are the real ones."

*(The video was audio-only for a reason — mention only if you have time: the
original had a live Google Meet join code burned into every frame, so the video
track was discarded rather than masked.)*

### 1:35 – 2:35 · Scale — the seeded meeting

**Tab 3 — `/meetings/q3-platform-review`**

> "This one is seeded, and says so. Sixty-two minutes, eight speakers — which is
> the thing a 44-second call can't show me: does the interface hold up."

**Summary tab:**

> "Decisions first. An hour of talk, and what actually got decided."

**Click the action item "Audit all ~400 alert rules" `@ 9:14`:**

> "Action items carry the moment they were agreed. Click it —"

→ jumps to Transcript at 9:14, highlights the line.

> "— and you're at the line where it happened."

### 2:35 – 3:00 · The thing I'd defend in an interview

Scroll the transcript to a **`Speaker 7`** line with the amber **UNMATCHED** chip.

> "Eight speakers, and two the system couldn't match to a calendar invitee. It
> says *unmatched* rather than guessing. Fathom's own API marks that join
> nullable — their schema admits the match fails. Most clones would hide it. I
> show it, because a wrong name on a quote is worse than no name."

### 3:00 – 3:30 · Search across meetings

**Header search → type `export`** → Enter.

> "Search runs across every meeting — transcripts, summaries, action items."

Point at "16 results in 4 meetings", then **click a transcript hit**.

> "And a hit isn't a page, it's a moment — it drops you straight into the recording."

### 3:30 – 4:05 · Sharing, and the gap I found in Fathom

**Tab 4 — `/share/q3plat`**

> "A share link. Recording, summary, transcript — no action items, no attendee
> emails, no search into the rest of the account. And the emails aren't just
> hidden; they're stripped on the server, so they're not in the page source either."

**Edit the URL to `/share/nope`:**

> "And a dead link. Fathom returns a blank white page here — I checked. This one
> says what happened."

### 4:05 – 4:20 · Close honestly

> "What's not here: no recording bot, no database, no login, and the long meeting
> has a simulated timeline because there's no audio for it — all labelled in the
> app. Every prompt and response that built this is committed raw in
> `.agent-logs`, including the wrong turns. Thanks."

---

## Cut list, if you run long

Drop in this order — each is self-contained:

1. The **Ask tab** (not in the script above; add only if you're running short)
2. The video/join-code aside at 1:35
3. The search beat (3:00–3:30) — shorten to just typing and pointing at the count

**Never cut:** the opening real-vs-seeded statement, the real audio playing, or
the closing limitations.

---

## Things not to say

- ❌ "I recorded an eight-person meeting." You did not. It is seeded.
- ❌ "The AI generates answers." The Ask answers are pre-written; the panel says so.
- ❌ "It transcribes your calls." There is no capture bot.
- ✅ "One real recording, the rest seeded and labelled" — accurate, and stronger.
