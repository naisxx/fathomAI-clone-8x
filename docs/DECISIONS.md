# Decisions

Append-only. Never edit or remove an entry — supersede it with a new one.

Format: `## NNN — <date> — <choice>` / **Reason** / **Tradeoff**.

---

## 001 — 2026-09-25 — Capture via Claude Code `UserPromptSubmit` + `Stop` hooks

**Reason.** Claude Code has a first-class hooks system that fires automatically;
the brief requires a mechanism that cannot be forgotten. `UserPromptSubmit`
carries the prompt verbatim, `Stop` carries the transcript path.
**Tradeoff.** Tied to Claude Code. Porting to another tool means a rewrite.

## 002 — 2026-09-25 — Final response = last unbroken run of assistant `text` blocks

**Reason.** The brief wants the prompt and final response only. Resetting the text
buffer on every `tool_use` drops thinking, tool calls and pre-tool narration
without needing to classify content.
**Tradeoff.** If a turn ends on a tool call with no closing text, the entry records
that fact rather than inventing a response.

## 003 — 2026-09-25 — Node.js for the hook script

**Reason.** Already installed (v24.11.0), handles JSONL and UTF-8 cleanly, and
`$CLAUDE_PROJECT_DIR` expansion was verified working on Windows.
**Tradeoff.** Adds a Node dependency to capture. Acceptable — the app will need
Node anyway.

## 004 — 2026-09-25 — Turn-1 model is backfilled, not guessed

**Reason.** The `UserPromptSubmit` payload has no `model` field and turn 1 has no
assistant line to read one from. Writing `unknown` and filling it from the
response is honest; guessing is not.
**Tradeoff.** A narrow in-place rewrite of one header line. Scoped to the literal
string `unknown` in a PROMPT header, never the body.

## 005 — 2026-09-25 — Commit `489748b` keeps its `Co-Authored-By: Claude` trailer

**Reason.** The no-attribution rule arrived after that commit. The same ruleset
forbids rewriting commits to hide agent involvement, and removing the trailer now
would do exactly that.
**Tradeoff.** One commit is inconsistent with the rest. Flagged for the user; all
later commits carry no trailer.

## 006 — 2026-09-25 — Working branch `feat/fathom-rebuild` cut from the capture commit

**Reason.** Work was already on a generated worktree branch
(`claude/agent-capture-setup-4f6c8a`) two commits ahead of `develop`, and
`develop` is checked out by the main worktree so it cannot be switched to here.
Branching from HEAD keeps the capture commit and rewrites no history.
**Tradeoff.** `develop` stays at `7ac5645` until the user merges.

## 007 — 2026-09-25 — `docs/ASSIGNMENT.md` records the missing brief rather than filling it in

**Reason.** Only the capture-setup portion of the 8x brief was provided. Judging
criteria and submission fields are unknown; inventing them would be the exact
failure mode the evidence rules exist to prevent.
**Tradeoff.** The release checklist is incomplete until the full brief arrives.

## 008 — 2026-09-25 — Research plan proposed, not executed

**Reason.** The working agreement puts an approval gate before research.
**Tradeoff.** ~1.5h of the 24h budget sits idle pending approval.

## 009 — 2026-09-25 — Research split: agent runs option B, user runs option C

**Reason.** User approved the research plan and chose to run option C (recording a
real call and sharing screenshots) themselves while the agent runs option B
(public surfaces only). Findings get compared before scope is finalised.
**Tradeoff.** Two partial evidence bases instead of one complete one, and a
comparison step. Worth it: option C supplies genuine observed UI that option B
cannot reach, and no credentials are ever handled by the agent.

## 010 — 2026-09-25 — D2/D3 defaults applied unchanged

**Reason.** User approved without overriding: D2 = 15-minute Granola skim only,
D3 = depth on the post-meeting review experience, shallow on capture/bot mechanics.
**Tradeoff.** Otter and Fireflies go unexamined. Acceptable — Granola gives the
sharpest contrast and the budget is better spent on our own build.

## 011 — 2026-09-25 — Competitor screenshots are linked, not committed

**Reason.** The browser pane returns screenshots to the model but cannot write them
to disk, so the plan's "≥6 screenshot files" is not achievable under option B.
Separately, committing a competitor's marketing images into a *public* repo is a
copyright risk worth avoiding.
**Tradeoff.** `FINDINGS.md` cites public asset URLs and describes what was seen
rather than embedding images. The user's option C run supplies the real visual
evidence, which resolves the gap rather than papering over it.

## 012 — 2026-09-25 — Screenshots read by conversion, originals untouched

**Reason.** The seven files in `recon/screenshots/` are HEIF carrying a `.paint`
extension. libheif/pillow-heif reject them (uncompressed `unci` variant), so they
were converted to PNG **read-only** via Windows WIC into the scratchpad and read
from there. Nothing in `recon/` was renamed, moved or rewritten.
**Tradeoff.** The originals will not render on GitHub or in most viewers. Whether
to commit PNG copies is left to the user — they show a real name and avatar and
this is a public repo.

## 013 — 2026-09-25 — Live test settles the layout conflict against the third-party review

**Reason.** Screenshot 1 shows a two-column layout — video + tabbed pane on the
left, meta and action items on the right — not the three-column
`video | summary | transcript` a third-party review described. FINDINGS §7 items 1
and 4 are closed by direct observation.
**Tradeoff.** That reviewer's other claims are now less trustworthy, including the
transcript-scrolling behaviour cited in FINDINGS §4.

## 014 — 2026-09-25 — No database, no auth, no runtime AI API

**Reason.** Every byte served is seeded and read-only. A DB adds env vars, a
cold-start failure mode during a live walkthrough, and a credential to keep out of
a public repo, for nothing a typed seed file does not do. Auth is actively harmful
— a reviewer must never hit a login. A runtime AI key costs money per view and can
fail on camera. AI content is generated once during the build and committed as
labelled seed data.
**Tradeoff.** Nothing persists across browsers; action-item toggles live in
`localStorage` and say so. A live Ask endpoint is optional Phase 9, behind an env
var, degrading to canned answers.

## 015 — 2026-09-25 — Deploy at the end of Phase 0, before there is anything to show

**Reason.** The public URL is the deliverable hardest to recover if it fails late.
Finding Vercel problems at hour one is worth more than a tidy first deploy.
**Tradeoff.** A live URL serving an empty shell for the first few hours.

## 016 — 2026-09-25 — Screenshots committed redacted; originals stay local and untouched

**Reason.** User decision D1. Redactions applied to full-resolution copies: solid
boxes over the Fathom call ID, a browser bookmark title, and the **Google Meet
join code** `bth-...` visible in the player header of three shots; Gaussian blur
over third-party faces in Fathom's own in-product onboarding media. The user's
name and avatar remain, as instructed.
**Tradeoff.** Slight loss of fidelity in the dashboard's onboarding row. The join
code was the genuinely material find — it is a live meeting credential, not just
an identifier.

## 017 — 2026-09-25 — Two tiers of meeting media, visibly distinguished

**Reason.** User decision D2. The featured meeting gets **real playable media with
a timestamp-aligned transcript**, so the core interaction is genuinely real. The
62-minute eight-speaker meeting gets a **labelled simulated timeline**, because it
exists to prove the interface survives scale and an hour of TTS would cost hours
for no gain. Distinct on-screen badges: `Real recording` vs
`Simulated timeline — no audio`.
**Tradeoff.** Two playback code paths behind one interface. Worth it — claiming
either tier is the other is precisely the dishonesty the evidence rules forbid.

## 018 — 2026-09-25 — UX/UI treated as a graded axis with its own budget

**Reason.** User decision D3: judging is speed, product judgment and UX/UI. The
UX/UI phase grew from 1:45 to 2:30 and gained explicit criteria (hierarchy,
designed empty states, real phone usability, focus, contrast, no jank at scale).
"No login in the graded path" is now recorded as a hard requirement rather than a
design preference.
**Tradeoff.** At worst-case cutoffs the plan now totals 24:15, i.e. the whole
budget. Phases 7–9 (share view, search, Ask tab) are the declared release valve.

## 019 — 2026-09-25 — The downloaded recording cannot be published as video

**Reason.** Verification of `recon/media/…mp4` (43.70 s, 1280×720, H.264 + AAC)
found the **Google Meet join code burned into every frame**, top-left, beside the
clock — the same live credential redacted from the screenshots. Twelve sampled
frames are otherwise identical: camera off, no screen share, no faces, no shared
documents. Container metadata is clean (encoder strings only).
**Tradeoff.** The video track cannot ship as-is. Since it is visually static and
carries no information, the recommendation is to **use the audio track only** and
render our own player visual — which removes the leak entirely rather than masking
it, and is the better product anyway.

## 020 — 2026-09-25 — Tier 1 is audio-only and carries no invented content

**Reason.** User decision: use the existing 43.70 s recording as the real-media
meeting, with no fabricated dialogue or action items. Fathom itself detected no
action items in it and refused to summarise it, so the real empty states are what
it shows. The transcript must come from Fathom's own `Copy Transcript`; absent
that, the transcript panel shows an honest "not available" state rather than
plausible filler.
**Tradeoff.** The real meeting demonstrates playback and transcript sync but not
summaries or action items. Those are demonstrated on tier 2, badged as seeded.
The two are visibly distinct in the UI.

## 021 — 2026-09-25 — MVP is P0–P4; extras ranked with a pre-declared cut order

**Reason.** User decision: first deployable MVP is the meetings list plus one
real-media detail view, with the seeded 62-minute eight-speaker meeting for the
scale case. Search, sharing and Ask are extras. Cut order is declared in advance
(8 → 7 → 6) so that running short is not a decision made under pressure. The
UX/UI pass is explicitly not cuttable, because it is a graded axis.
**Tradeoff.** 15:45 committed against ~22 h remaining. The slack is deliberate;
deployment testing and the walkthrough are reserved and not negotiable.

## 022 — 2026-09-25 — Audio extracted with ffmpeg; video track discarded and verified absent

**Reason.** User authorised a media dependency. `imageio-ffmpeg` (ffmpeg 7.1)
extracted the audio with `-vn`, re-encoded to mono 64 kbps AAC — 43.62 s, 355 KB.
Verified twice: ffmpeg reports a single audio stream, and an independent MP4 box
parse finds exactly one `trak` with handler `soun`, no `vide`. The bytes
`bth-bjtd` do not appear in the output. Source MP4 stays in `recon/`, untracked.
**Tradeoff.** A build-time dependency on ffmpeg, used once. The shipped asset is
audio-only by construction, not by masking.

## 023 — 2026-09-25 — Transcript timestamps aligned to detected speech, labelled manual

**Reason.** The user supplied the transcript verbatim but Fathom gives no
timestamps. Rather than distributing words evenly, alignment used
`ffmpeg silencedetect` (-34 dB, 0.30 s): speech runs 3.43 s → 36.96 s, and the
largest internal pause (1.32 s at 26.56 s) coincides with the paragraph break.
Segment boundaries were snapped to detected pauses, then natural clauses assigned
across them.
**Tradeoff.** Boundaries are accurate to roughly ±1 s; word placement inside a
segment is proportional, not measured. Surfaced in the UI as
**"timestamps manually aligned"**. No word was added, removed or altered.

## 024 — 2026-09-25 — node_modules installed outside the worktree and junctioned in

**Reason.** Both npm and pnpm hung repeatedly while extracting
`@next/swc-win32-x64-msvc` (108 MB) into
`…\.claude\worktrees\…\node_modules`, idling at 0 s CPU with the registry
reachable at 3.2 MB/s. Installing the same `package.json` into `C:\rcpdeps` and
junctioning `node_modules` into the project completed normally. The worktree
lives under a directory the desktop app watches, and the file watcher appears to
be the cause.
**Tradeoff.** `node_modules` is a junction on this machine, which is invisible to
Git and to Vercel (which installs from `package-lock.json`). Anyone cloning the
repo runs a plain `npm install`. Cost roughly 45 minutes.

## 025 — 2026-09-25 — Next pinned to 15.5.26

**Reason.** npm flagged `next@15.5.4` as carrying a security vulnerability
(CVE-2025-66478). This is going on a public URL, so it was upgraded to the
patched 15.5.26 rather than noted and deferred.
**Tradeoff.** None found; build and typecheck are clean on the patched version.

## 026 — 2026-09-25 — Tailwind source scanning scoped explicitly

**Reason.** Tailwind v4's automatic source detection walked the whole project
including `public/`, hit the binary `.m4a`, and threw
`RangeError: Invalid code point`. The build still reported success while
emitting **no stylesheet at all** — the app rendered completely unstyled. Fixed
with `@import "tailwindcss" source(none)` plus explicit `@source` directives.
**Tradeoff.** New top-level source directories must be added to the list. Worth
it: this failure was silent in the build log and only visible by loading the page.

## 027 — 2026-09-25 — Simulated clock runs on a timer, not requestAnimationFrame

**Reason.** The first implementation used `requestAnimationFrame`, which is
starved whenever the page is not compositing — measured at **0 frames per second**
with `visibilityState: "visible"`. Playback froze. It now runs on a 100 ms
interval, with position always derived from a wall-clock origin, so a throttled
timer costs smoothness but never accuracy.
**Tradeoff.** Slightly coarser updates than a frame-synced animation, invisible
at 10 Hz for a transcript follower.

## 028 — 2026-09-25 — Public URL is the production alias, not the deployment URL

**Reason.** The deployment-specific URL
(`…-bxq6cptjx-onaisahmeds-projects.vercel.app`) redirects to a Vercel login —
Deployment Protection covers preview/deployment URLs, so an unsigned visitor
cannot open it. That breaks a hard requirement. The production alias
<https://fathom-ai-clone-8x.vercel.app/> serves 200 with no auth redirect and is
the URL of record.
**Tradeoff.** Anyone sharing a per-deployment link will hit the login wall. The
alias must be the one used in the submission and the walkthrough.

## 029 — 2026-09-25 — Production verified by download, not by trusting the build

**Reason.** The live asset was fetched from
`https://fathom-ai-clone-8x.vercel.app/media/meeting-01.m4a` and parsed: 363,404
bytes, exactly one `trak` with handler `soun`, no `vide`, and no `bth-bjtd`
bytes. The join-code leak is confirmed absent from what is actually served, not
merely from what was built.
**Tradeoff.** None. This check should be repeated if the asset is ever rebuilt.

## 030 — 2026-09-25 — Contrast defect found by measurement, not by eye

**Reason.** A computed WCAG audit of every token pair found `--text-faint`
failing AA in **both** themes: 4.07:1 on `--bg` and 3.75:1 on `--bg-raised` in
dark, 3.33:1 in light — against a 4.5:1 requirement. That token carries most of
the 11–13px text in the app (timestamps, counts, captions, participant list), so
it was the worst possible token to get wrong. Replaced with `#828b9b` (5.67 /
5.23) and `#5f6874` (5.46).
**Tradeoff.** Slightly less recessive secondary text. It looked fine by eye,
which is exactly why it needed measuring.

## 031 — 2026-09-25 — Meeting title moved out of the side rail

**Reason.** The title sat in the right-hand rail, so the page led with a play
button and, on a phone where the rail stacks underneath, the title appeared below
the entire player and transcript. It is now a page header above both columns.
**Tradeoff.** Diverges from Fathom, which keeps the title in the rail. Hierarchy
beats fidelity here — this is a graded axis.

## 032 — 2026-09-25 — Hit targets raised to the 24px minimum

**Reason.** An automated sweep at a real viewport found undersized targets: the
seek slider (18px), the rate button, the follow toggle and the action-item
timestamp buttons (21px), and the checkboxes (16px). Fixed by raising heights;
the checkbox keeps its 18px visual inside a 24×24 clickable parent, which is the
WCAG 2.5.8 enclosure exception rather than an oversized box.
**Tradeoff.** None. Note the first sweep reported 81 failures against a
zero-width viewport — measurements were only meaningful after setting one.

## 033 — 2026-09-25 — Search is client-side, linear, and unranked beyond hit count

**Reason.** The whole corpus is a few hundred short strings in the bundle. A
linear case-insensitive scan is instant and has no index to fall out of sync.
Meetings are ordered by hit count; hits within a meeting are ordered
title → summary → action → transcript, then chronologically. No relevance
scoring, because any weighting would be invented rather than measured.
**Tradeoff.** No fuzzy matching, stemming or typo tolerance — "migrate" does not
find "migration". Acceptable for a seeded corpus; a real one would need an index.

## 034 — 2026-09-25 — A search hit carries its timestamp

**Reason.** The feature is only worth building if a hit takes you to the moment
rather than the page. Transcript and action-item hits link to
`/meetings/<id>?t=<sec>&tab=transcript`, reusing the deep-link path already
built in P4. Title and summary hits have no moment, so they link to the meeting.
**Tradeoff.** Two kinds of result behave differently, which the kind label on
each row makes visible.

## 035 — 2026-09-25 — Share view redacts on the server, after a real leak was found

**Reason.** The shared view rendered no action items and no attendee emails, and
looked correct. But it was handed the whole `Meeting`, and Next.js serialises
props into the HTML for hydration — so every invitee address was sitting in the
page source of a link meant for outsiders. Sixty-six matches across the seeded
meetings. **Not rendering something is not the same as not sending it.**
Redaction now happens server-side in `redactForShare`, which strips invitee
emails and domains, all action items, and the speaker→invitee email join.
**Tradeoff.** A second shape of the same type to keep in step, which decision 036
guards against.

## 036 — 2026-09-25 — The redaction is self-guarding at build time

**Reason.** A silent regression here is a privacy bug, not a cosmetic one, so
`redactForShare` asserts its own invariant: it scans the redacted payload for
address-shaped strings and throws if any survive. Verified by deliberately
reintroducing the leak — the production build **failed** with
`redactForShare left 5 address(es) in the shared payload for "platform-standup"`.
Confirmed on the prerendered output: five share pages contain zero emails while
the owner page still contains 74.
**Tradeoff.** A regex-based check, so it catches address-shaped data rather than
all private data. It covers the field that actually leaked.

## 037 — 2026-09-25 — Shared chrome differs from signed-in chrome

**Reason.** A share recipient was given one meeting, not an account. Offering a
search box across every other meeting, or a link to the full list, would quietly
widen what the link grants. The header on `/share` is a wordmark and a "Shared
link" chip — no search, no navigation, and the pages are `noindex, nofollow`.
**Tradeoff.** A pathname check in a client component rather than a route group,
which was the smaller change to existing routes.

## 038 — 2026-09-25 — Ask is pre-written, and says so above the answers

**Reason.** Decision 014 ruled out a runtime AI key: cost per view, latency, and
a live failure mode during a camera-on walkthrough. The honest substitute is to
write the answers once, ground each in the transcript, and disclose it. The
disclosure sits at the top of the panel in plain language — "There is no live
model here; nothing is generated when you click" — not in a footnote.
**Tradeoff.** No arbitrary questions. A meeting only has answers if someone
wrote them, and the empty state says exactly that rather than generating a guess
(the Platform Standup has none, deliberately).

## 039 — 2026-09-25 — Every Ask answer must cite timestamps

**Reason.** An answer you can jump into and check is worth more than one you
have to trust, and it is the difference between a demo and a claim. Citations
resolve through the same `at()` helper the action items use, so a timestamp
cannot drift silently when the transcript is edited. Verified end to end: the
budget answer's citation lands on "Nineteen percent over plan for Q3…", the line
that actually supports it.
**Tradeoff.** Answers must be written against real transcript lines, which is
slower than free-form prose — and is the point.

## 040 — 2026-09-25 — Ask entries are stripped from shared payloads

**Reason.** The shared view has no Ask tab, so the entries would never render —
but they would still ship in the hydration payload, and their answers paraphrase
who committed to what. That is the same content action items were stripped for
in decision 035. Caught while wiring P8, before it shipped.
**Tradeoff.** None. It reinforces that `redactForShare` must be revisited
whenever a field is added to `Meeting`.

## 041 — 2026-09-25 — QA run independently, and its findings acted on

**Reason.** The implementer is the worst reviewer of their own work, so the live
deployment was QA'd by a separate agent against `verify-slice` and the
`BUILD-PLAN` acceptance criteria. All ten criteria passed; four minor defects
were found, all verified in the source before being fixed rather than taken on
trust.
**Tradeoff.** None. Two of the four (D1, D4) were honesty-copy errors that no
functional test would have caught.

## 042 — 2026-09-25 — Deep links snap to the segment whose timestamp is displayed

**Reason.** Timestamps render floored, so a line starting at 18.47s displays as
"0:18". A reader who typed `?t=18` landed in the 0.84s of silence before it and
saw the *previous* line highlighted. `snapToSegmentStart` resolves a request to
the segment sharing its displayed second.
**Tradeoff.** A request genuinely mid-segment is left alone, so this only
affects the case it was written for.

## 043 — 2026-09-25 — The URL tracks the moment on screen

**Reason.** Deep links are the spine of the product — search results and Ask
citations are built on `?t=` — but jumping *inside* the app left the address bar
stale. The one thing you could not share was the moment you were actually
looking at, and a refresh contradicted the screen. Now kept in step with
`replaceState`, at most once per second.
**Tradeoff.** `replaceState`, not `push`, so the back button still means "the
previous page" rather than stepping back through every seek.

## 044 — 2026-09-25 — The share banner only claims to withhold what exists

**Reason.** The shared view said "Action items and attendee details stay with the
team" on every meeting, including the real 44-second one, which never had any.
Implying something is being withheld that was never produced is a small lie
inside the feature built to be honest. The flag is computed on the server from
the unredacted meeting, since by the time the view sees it the list is empty
either way.
**Tradeoff.** One more prop threaded through the share boundary.

## 045 — 2026-09-25 — A credential in the raw logs is left untouched, by decision

**Reason.** The QA pass found that a meeting join code from the author's test
call appears in the raw `.agent-logs/` — not in any source file or document, but
inside an agent response written at the moment the leak was discovered in the
video. The same code had already been redacted from the screenshots and the
entire video track discarded over it.

The author was given the choice and chose to leave it. Editing a log entry is
what the brief forbids most explicitly, and the value of an untampered record
outweighs the residual risk: the code belongs to an ad-hoc meeting that has
ended, and a stranger reaching it would find an empty call requiring admission.
**Tradeoff.** A low-value credential remains in a public repository. Recorded
here without repeating it or citing a line number, so this entry does not become
the pointer the decision was meant to avoid.

## 046 — 2026-09-25 — The "verbatim transcript" claim was not supportable, and is corrected

**Reason.** The author opened a real Fathom share link in incognito. The
transcript Fathom renders differs materially from the text shipped in
`data/meeting-01-real.ts`: Fathom produced "Fathom API", "Fathom drone", "8x0"
and a different closing sentence, where the shipped text reads "Fathom AI",
"Fathom clone", "8x Assignment". The shipped version is what the speaker meant;
Fathom's is what its ASR heard.

The README and the data file both claimed every word was Fathom's own output with
nothing "added, removed or altered". That is not supportable on this evidence, so
both claims are corrected to say what is actually true: this is the author's
transcription of the call, with ordinary recognition errors corrected.
**Tradeoff.** Which text to *ship* is a separate decision and is the author's.
The claim was corrected immediately because it was live and wrong; the content
was left alone because changing it is not the agent's call.

## 047 — 2026-09-25 — Observation shows our share view is stricter than Fathom's, deliberately

**Reason.** Fathom's anonymous share view shows the Ask tab, a Share button, Copy
Transcript and a within-transcript search field. Ours shows none of them. Our
removal of action items and attendee details **matches** Fathom and was guessed
correctly before any observation; the other four omissions are ours alone.
**Tradeoff.** The share view is a deliberate divergence, not a faithful clone,
and the repo now says so rather than letting the difference read as fidelity.

## 048 — 2026-09-25 — Clip sharing is an improvement, not a clone

**Reason.** The observed Share Recording dialog offers per-person access and a
two-option link scope, and **no time range whatsoever**. The brief asks for
sharing a clip, but the free-plan share flow cannot do it. Bounded clip sharing
therefore extends the product rather than reproducing it, and must be described
that way in the plan and the walkthrough.
**Tradeoff.** Loses "this is how Fathom does it" as justification; gains a
defensible answer to "what did you improve".

## 049 — 2026-09-26 — Ship Fathom's real ASR output, mistakes included

**Reason.** Author's decision, and the evidence backs it. Fathom transcribed
"Fathom API", "Fathom drone", "8x0" and "I can wait"; the text shipped earlier
was the author's corrected version. The machine transcript is now what the app
shows, labelled as machine transcription in the provenance note.

An independent check supports it: against the measured silence boundaries,
Fathom's text speaks at 2.87 words/s before the paragraph break and 2.80 after —
**0.07 apart**. The corrected text gave 3.07 and 2.18 — **0.89 apart**. The ASR
text fits the real audio markedly better, which corroborates both the boundaries
and the choice.
**Tradeoff.** The transcript now reads oddly in places. That is the point: a
transcript you can click into and check against audio is worth more precisely
because transcripts are wrong sometimes. The corrected version is removed from
the app entirely and survives only as evidence in the research notes.

## 050 — 2026-09-26 — Within-meeting transcript search, ahead of everything else

**Reason.** Observed in Fathom, visible even to anonymous visitors, and entirely
absent from our build. On a 72-segment hour-long transcript it is the search
people actually reach for — cross-meeting search answers a different question.
It was also the cheapest of the three candidate slices.
**Tradeoff.** Filtering hides lines, so follow-playback can have no line to
scroll to. The filter keeps each line's original index and the scroll effect
simply does nothing when the active line is filtered out, rather than jumping to
the wrong one.

## 051 — 2026-09-26 — Highlights are made while reviewing, and say so

**Reason.** Fathom's highlights are created mid-call; we have no live call. Ours
capture wherever the player currently is, which is a different action, so the
panel states it in plain words rather than faking an in-call widget. Seeded
highlights ship on the Q3 meeting so the feature is populated on arrival;
viewer-created ones persist in `localStorage` with the same "this browser only"
note the action-item ticks carry.
**Tradeoff.** Seeded highlights cannot be deleted — only ones you made. That is
deliberate: a viewer clearing the demo's own content would leave the next visitor
with an empty rail.

## 052 — 2026-09-26 — Opaque share tokens, and the links still labelled public

**Reason.** The share view presents itself as access-controlled, so `q3plat` and
`stnd05` were wrong — guessable tokens in a feature about controlled access.
Fathom uses 32 random characters; ours are now 24, from a 57-character alphabet
with no semantic content. The share panel also states plainly that there is no
account system behind them, so in this demo every link is effectively public.
**Tradeoff.** The walkthrough URLs got longer and had to be updated. Worth it —
the previous tokens undercut the feature's own story.

## 053 — 2026-09-26 — Highlights stripped from shared payloads

**Reason.** Third instance of the same leak class as P7 (emails) and P8 (Ask
entries): the shared view has no highlights UI, so nothing would render, but the
data would still ship in the hydration payload. A viewer's private marks are not
the recipient's business. Verified on the prerendered output — zero highlight
data across all five share pages, five labels on the owner page.
**Tradeoff.** None. It confirms the standing rule: every new field on `Meeting`
needs a decision in `redactForShare`, and so far every one has needed stripping.

## 054 — 2026-09-26 — Clips filter on the server, which makes /share dynamic

**Reason.** A clip that ships the whole transcript is not a clip. Filtering on
the client would leave every out-of-window segment in the page source — the same
leak class as P7 (emails), P8 (Ask entries) and P9 (highlights). Server-side
filtering means reading `searchParams`, which drops `/share/[token]` from static
prerendering to dynamic rendering.
**Tradeoff.** Five pages lose static generation. No database and no auth are
involved, the payload is small, and the guarantee is worth more than the
prerender. Verified: a 9:14–10:14 clip contains 2 segments and neither the
meeting's opening nor closing line appears anywhere in its source.

## 055 — 2026-09-26 — A clip withholds the summary

**Reason.** The summary describes the whole meeting. Someone handed one minute of
it was given a moment, not the meeting, so shipping the summary alongside would
hand over exactly what the clip was meant to narrow. The panel says why rather
than showing an unexplained gap.
**Tradeoff.** A clip is less useful standalone. That is what a clip is.

## 056 — 2026-09-26 — Bad clip parameters fall back to the full meeting

**Reason.** `clampRange` returns null for reversed, negative, non-numeric,
out-of-range or under-five-second input, and the page then serves the whole
recording. A malformed link degrades to something useful rather than to an empty
player or an error. Reversed and negative values are repaired rather than
rejected, since the intent is unambiguous.
**Tradeoff.** A typo can silently widen what is shared. Acceptable: the fallback
is the unbounded share the token already grants, never more.

## 057 — 2026-09-26 — Note on the dev server masking a fix

**Reason.** Bounded audio appeared broken after the fix was applied — starting at
0 and playing past the clip end. The fix was correct; the dev server was serving
stale chunks (`Cannot find module './58.js'`) because a production build had
overwritten `.next` underneath it. Third occurrence of this pattern.
**Tradeoff.** None, but the habit is worth keeping: when a verified fix appears
not to work, check the server is serving it before rewriting the code.

## 058 — 2026-09-26 — Dev and verification builds get separate output directories

**Reason.** `next dev` and `next build` both write `.next`. Running a production
build to verify a change, while the dev server was live, replaced the chunks that
server was mid-flight on, and it then died with
`Cannot find module './58.js'` — which reads like a code fault and is not one.
It cost time three times, and the fourth was the author hitting it in their own
browser.

`distDir` now honours `NEXT_DIST_DIR`, and verification builds run as
`NEXT_DIST_DIR=.next-verify npm run build:verify`. Vercel sets nothing and keeps
using `.next`. Proven by running a full production build with the dev server up:
the build succeeded and the dev server kept serving.
**Tradeoff.** One env var to remember. Cheap against a failure that masquerades
as a bug in the app.

## 059 — 2026-09-26 — The share control was findable in theory and not in practice

**Reason.** The author could not find sharing in the UI, and was right not to.
The control was an outlined button labelled only "Share", collapsed by default,
sitting in a right rail that stacks *below* the player and transcript on a narrow
window — three small decisions compounding into something invisible.

It is now a primary accent button reading **"Share or clip"** with a chevron, so
it reads as the headline action it is and as something that opens.
**Tradeoff.** More visual weight in the rail. Correct: sharing is one of the two
things this product is for, and "a user could not find it" is the only usability
evidence that matters.

## 060 — 2026-09-26 — Palette verified by computation before a line of CSS

**Reason.** The first proposed warm palette had **five pairs below AA** (4.18 to
4.48) — all of which would have looked fine. A solver found the minimum
adjustment that cleared every constraint, and the result is checked in as
`scripts/check-contrast.mjs`: **36 pairs, both themes, all ≥4.5**, runnable
before any future palette change.
**Tradeoff.** None. This is the second contrast failure this build would have
shipped on eye alone; the first reached production.

## 061 — 2026-09-26 — One accent, one semantic hue, seeded goes neutral

**Reason.** Three hues were competing for meaning. Now: warm amber for
interaction only, one muted green reserved for `Real recording`, and **seeded
rendered neutral** — an outlined chip carrying a label. Colour no longer carries
meaning on its own, which is both an accessibility rule and a clarity one.
**Tradeoff.** Seeded is less eye-catching. The label does the work, it appears on
every surface, and there are four seeded meetings against one real — making the
common case quiet is correct.

## 062 — 2026-09-26 — Compatibility aliases, because renaming tokens fails silently

**Reason.** Deleting the old palette left **~144 references across 9 variable
names** undefined. CSS does not throw for an undefined custom property — it just
drops the value. The page still rendered and looked almost right, while the
"Seeded demo data" chip had quietly lost all styling. Old names are now mapped
onto the new system and removed in the application step.
**Tradeoff.** A temporary aliasing layer. Far cheaper than 144 silent breakages,
and the failure mode is the point: a renamed token is invisible until someone
looks at the right chip.

## 063 — 2026-09-26 — Warmth dialled out; accent moved to violet

**Reason.** The warm ink-on-paper direction read as too warm on screen. The ramp
is now near-neutral graphite with the faintest cool lean, so the surface stays
out of the way and the accent carries the personality — which is what a
long-reading surface should do.

Amber was replaced with a brighter accent. Three candidates were solved against
WCAG rather than picked by taste:

| | dark | light | verdict |
|---|---|---|---|
| **Violet** | `#A78BFA` 5.31 | `#6D28D9` 5.64 | **passes outright** |
| Cyan | `#3DD9F0` 7.92 | `#0E728D` 4.52 after darkening | passes, kept as the alternate |
| Lime | `#B6F24C` 9.51 | 4.17 — fails | **dropped** |

Lime was dropped for a second reason beyond contrast: it collides with the green
reserved for `Real recording`, and the whole point of one-accent-plus-one-semantic
is that those two never compete.

Violet ships. Cyan is verified in the checker so switching is a two-line change.
**Tradeoff.** Violet is a more opinionated choice than a neutral blue. That is
deliberate — the brief invites doing better than the original, and Fathom is blue.
