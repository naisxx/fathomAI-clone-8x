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
