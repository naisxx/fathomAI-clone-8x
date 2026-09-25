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
