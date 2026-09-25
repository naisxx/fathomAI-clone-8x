# Share flow — observed, 2026-09-25

**Access route: the author's own Fathom account (free plan), share link opened in
a real incognito window.** This is the first `[OBSERVED]` evidence of the
anonymous share experience. Everything about our share view until now was
designed from documentation.

Two screenshots: the Share Recording dialog, and the resulting link opened
logged-out.

---

## 1. The Share Recording dialog `[OBSERVED]`

- Title **"Share Recording"**, close X.
- **"Add users and emails"** search field at the top — per-person sharing.
- **PEOPLE WITH ACCESS**: the owner, listed with name, email address and the
  role **Owner**.
- A link-scope dropdown, open in the screenshot, offering exactly **two** options:
  - **"Anyone with the link can view"** ✓ (selected)
  - **"Only people added can view"**
- **"Copy Link"** button.

### Against our documentation research

`FINDINGS.md §5` recorded the vendor's claim of **three** scopes — *anyone with
the link / anyone on the domain / only people added*. Only **two** appear on this
account. The domain option is most likely Team-plan-only; the free plan does not
show it. Recorded as a plan-gating difference, not a contradiction.

### What is NOT in the dialog

**No time range. No clip controls.** Sharing is whole-recording only.

This matters for planning: the brief says "share a **clip** with someone who was
not on the call", but this dialog offers no way to do that. Either clips live
somewhere else in the product (plausibly attached to highlights, which were not
tested), or the free plan does not have them. **Bounded clip sharing is therefore
an improvement over the observed product, not a clone of it, and must be
described that way.**

---

## 2. The anonymous share view `[OBSERVED]`

URL shape: `fathom.video/share/<32-char opaque token>` — e.g. a 32-character
mixed-case random string, not a short slug.

What a logged-out visitor sees:

| Element | Present? |
|---|---|
| Fathom wordmark | **Yes** |
| **"Get your own free AI Notetaker" promo banner** | **Yes** — the share page is a growth surface |
| **"Sign In"** button | **Yes** |
| Video player, full transport (volume, scrubber, `1×`, PiP) | **Yes** |
| Meeting title and date | **Yes** |
| **Share button** | **Yes** — a recipient can re-share |
| **SUMMARY / TRANSCRIPT / ASK FATHOM tabs** | **Yes — all three** |
| **"Copy Transcript"** | **Yes** |
| **"Search Transcript"** field | **Yes** — within-meeting search |
| Transcript with speaker names, chat-bubble style | **Yes** |
| **ACTION ITEMS block** | **No** — absent entirely |
| Attendee list / emails | **No** |

The owner's view of this same meeting **did** show an `ACTION ITEMS` block
reading "None detected". The anonymous view omits the block altogether, so its
absence is a removal, not an empty state.

---

## 3. How our share view differs

Ours is **substantially more restrictive** than Fathom's.

| | Fathom | Ours |
|---|---|---|
| Action items | removed | removed ✅ same |
| Attendee emails | not shown | stripped from the payload ✅ stricter |
| Ask tab | **shown** | removed ❌ diverges |
| Share button | **shown** | removed ❌ diverges |
| Copy transcript | **shown** | absent ❌ diverges |
| Search within transcript | **shown** | absent ❌ diverges |
| Sign-in / promo | shown | n/a — no auth |
| Token | 32-char opaque | 6-char slug ❌ guessable |

**The action-items decision is vindicated by observation** — we guessed it and we
guessed right.

**Four divergences are ours, not Fathom's.** Removing Ask, Share, Copy Transcript
and within-transcript search from the shared view was a defensible privacy
choice, but it was a choice, and the repo should say so rather than imply the
shared view is a faithful clone.

**Our share tokens are guessable.** `q3plat`, `stnd05`, `dsgn24` are short and
semantic; Fathom uses 32 random characters. For seeded demo data nothing is at
risk, but it is a real difference in a feature whose whole point is controlled
access.

---

## 4. A gap this exposes: within-meeting transcript search

Fathom has a **"Search Transcript"** field inside the transcript tab, visible
even to anonymous visitors. We built cross-meeting search and have nothing for
searching *within* one meeting — which, on a 72-segment hour-long transcript, is
the more frequently useful of the two.

This was not on any plan. It is observed, it is cheap, and it sits exactly where
our product is weakest at scale.

---

## 5. The transcript discrepancy — the most important finding

The transcript rendered in the share view is **not** the text this project
shipped.

**What Fathom actually transcribed** (read from the screenshot, two bubbles):

> "Hello everyone, this is Fathom **API**, actually I have decided to build a
> Fathom **drone** for my **8x0**. Just to test **the same** how Fathom works,
> what **I've been searching for**, and **I've been searching for** what we are
> going to leave behind."
>
> "This is **not a bad thing for my drone**, this is just a demo, and **I can
> wait**."

**What `data/meeting-01-real.ts` contains** (as supplied to the agent):

> "Hello everyone, this is Fathom **AI**, actually I have decided to build a
> Fathom **clone** for my **8x Assignment**. This demo is Just to test **to see**
> how Fathom works, what **I'll be cloning**, and **I'll be improvising** and what
> we are going to leave behind."
>
> "This is just a demo **for my clone, and nothing else in this demo**."

These differ materially: `API`/`AI`, `drone`/`clone`, `8x0`/`8x Assignment`, and
an entire closing clause. The supplied text is what the speaker **meant**; the
Fathom output contains ordinary speech-recognition errors.

**Consequence:** the README and the data file both state that every word is
Fathom's own output, "copied verbatim", with nothing "added, removed or altered".
On this evidence that claim is **not supportable** and has been corrected —
see the decision log. Which text to ship is the author's call.

There is a genuine product argument for shipping **Fathom's real output, errors
and all**: it is honest, it is what the product actually produces, and a
transcript you can click to verify against audio is *more* valuable precisely
because transcripts are wrong sometimes.
