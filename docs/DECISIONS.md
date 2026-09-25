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
