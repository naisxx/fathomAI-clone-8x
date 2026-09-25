# Capture Test

Proof that automatic prompt/response capture is installed and firing before any
assignment work started.

## Tool and model

| | |
|---|---|
| **Tool** | Claude Code `2.1.281` (desktop app, Code tab, Windows 11) |
| **Model (this build session)** | `claude-opus-5` — single model, plans *and* executes. No separate planner/executor split. |
| **Model (canary sessions)** | `claude-opus-5-5` — the `claude -p` CLI resolves a different default than the desktop session. Left as-is rather than forced, because making a model switch visible in the log is the point of the `model:` field. |
| **Runtime** | Node.js v24.11.0 |

## Mechanism

Claude Code has a first-class hooks system: lifecycle events declared in
`.claude/settings.json` that run a shell command automatically. Two events cover
the requirement:

- **`UserPromptSubmit`** — fires the moment a prompt is submitted. Its stdin
  payload contains the prompt verbatim.
- **`Stop`** — fires when the turn ends. Its stdin payload contains
  `transcript_path` (the session `.jsonl`) and `last_assistant_message`.

Nothing has to be remembered or run by hand. The hook is declared once and the
harness invokes it.

**Config file changed:** [`.claude/settings.json`](.claude/settings.json)

```json
{
  "hooks": {
    "UserPromptSubmit": [
      { "hooks": [ { "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/capture.mjs\" prompt", "timeout": 15 } ] }
    ],
    "Stop": [
      { "matcher": "", "hooks": [ { "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/capture.mjs\" response", "timeout": 15 } ] }
    ]
  }
}
```

**Script:** [`.claude/hooks/capture.mjs`](.claude/hooks/capture.mjs)

### How the final response is isolated

Claude Code writes several `assistant` lines per turn, each holding a mix of
`thinking`, `text` and `tool_use` blocks. The script walks the transcript
keeping a buffer of `text` blocks and **resetting that buffer on every
`tool_use`** (and on every new user turn). Whatever survives to the end is the
last unbroken run of assistant text — i.e. the final answer. Preamble narration
written before a tool call is discarded as an intermediate step, and `thinking`
blocks are never read at all.

Verified on a real two-turn session that used shell tools: the log contains only
`337` and `10896`, not the commands that produced them
(`.agent-logs/2026-09-25_12-38-18_14ba884e-....md`).

## Where the canaries landed

Both canaries were run as genuinely separate `claude` sessions, each with its own
session id, to prove the hook is not scoped to the session that installed it.

| # | Log file | Session |
|---|---|---|
| 1 | [`.agent-logs/2026-09-25_12-35-43_cee83e57-2bce-4142-a7c4-67aa240ae03b.md`](.agent-logs/2026-09-25_12-35-43_cee83e57-2bce-4142-a7c4-67aa240ae03b.md) | `cee83e57` |
| 2 | [`.agent-logs/2026-09-25_12-37-47_e0ea22b6-295a-4dc1-9c33-7fa6b275f73a.md`](.agent-logs/2026-09-25_12-37-47_e0ea22b6-295a-4dc1-9c33-7fa6b275f73a.md) | `e0ea22b6` |

### Canary 1 — raw

```
[LOG_ENTRY type=PROMPT num=1 session=cee83e57]
timestamp: 2026-09-25T12:35:43.145Z
model: unknown

CAPTURE TEST — 8x assignment, OnaisAhmed


[LOG_ENTRY type=RESPONSE num=1 session=cee83e57]
timestamp: 2026-09-25T12:35:47.261Z
model: claude-opus-5-5

I got your capture test message. I haven't run any commands or changed anything yet.

Here's where the session stands: I'm in the worktree `agent-capture-setup-2f1499` on branch `claude/agent-capture-setup-4f6c8a`. The repo has one commit ("Initial commit"), plus an untracked `.claude/` directory.

What would you like to do for the 8x assignment?
```

This one is the **pre-fix** version and is left in place, unedited, with its two
bugs visible (`model: unknown`, and `project: agent-capture-setup-2f1499` in its
frontmatter). See *What did not work* below.

### Canary 2 — raw

```
[LOG_ENTRY type=PROMPT num=1 session=e0ea22b6]
timestamp: 2026-09-25T12:37:47.812Z
model: claude-opus-5-5

CAPTURE TEST — 8x assignment, OnaisAhmed (second session)


[LOG_ENTRY type=RESPONSE num=1 session=e0ea22b6]
timestamp: 2026-09-25T12:37:52.915Z
model: claude-opus-5-5

Your "CAPTURE TEST — 8x assignment, OnaisAhmed (second session)" message came through in this session. I haven't run any commands or changed any files.

- **Worktree:** `agent-capture-setup-2f1499`
- **Branch:** `claude/agent-capture-setup-4f6c8a`
- **Base branch:** `develop`, with one commit, `7ac5645 Initial commit`
- **Untracked:** `.agent-logs/` and `.claude/`

Tell me what the 8x assignment is and I'll start on it.
```

## What I tried first that did not work

**1. `model: unknown` on the first prompt of a session.**
The `UserPromptSubmit` payload has no `model` field at all — confirmed by dumping
the raw stdin of both hooks (keys are `session_id, transcript_path, cwd,
scratchpad_dir, prompt_id, permission_mode, hook_event_name, prompt`). On turn 1
the transcript also has no `assistant` line yet, so there is genuinely nothing to
read the model off. Fixed by writing `unknown` and backfilling it from the
response hook. The backfill is deliberately narrow: it rewrites the literal
string `unknown` on a PROMPT *header's* model line and stops at the blank line
before the body, so prompt and response text are never touched. Canary 1 predates
this fix and still shows `unknown`.

**2. `project:` was the throwaway worktree name.**
Work is happening in a git worktree, where `.git` is a *file* containing
`gitdir: C:/FathomAI Clone - 8x/.git/worktrees/agent-capture-setup-2f1499`, so
`basename(repoRoot)` gave `agent-capture-setup-2f1499` instead of the project.
Fixed by parsing that pointer back to the main repo when `.git` is a file.

**3. Writing the hook script with a bash heredoc.**
The script's regex literals broke shell quoting (`unexpected EOF while looking
for matching '`). Switched to writing the file directly.

**4. A first attempt at verifying the extractor used the wrong transcript.**
I tested `finalResponse()` against session `9d56f9ea` and got an empty string,
which looked like a bug. It wasn't — that session contains **zero** `assistant`
lines (it was released to the desktop app before it ever answered). The extractor
was correct; the fixture was empty.

**5. Debug scaffolding, now removed.**
While working out the payload shape the script dumped raw stdin to
`.agent-logs/.raw-payloads.jsonl`, gated on a `.claude/hooks/.debug` marker file.
The marker and the dump are both deleted; the gated code remains in the script
but is inert. That dump was scaffolding, not a log entry — no captured exchange
has been edited or removed.

## Known gap, stated rather than hidden

The hook was installed *during* the first turn of the desktop session
`c96ca3a8`, so that turn's prompt was submitted before `UserPromptSubmit`
existed. The response hook correctly declines to write an orphan RESPONSE with no
matching PROMPT, so this session's log file simply begins at its second exchange.
The full text of that first prompt is the assignment brief itself.

## Design notes

- **Append-only.** Entries are only ever appended. The one exception is the
  frontmatter counter block (`total_exchanges`, `last_prompt_time`, `model`),
  which is rewritten in place, plus the narrow turn-1 model backfill above.
- **Fails quiet.** The whole script is wrapped so it always exits `0`. A broken
  hook must never take a session down. Errors go to
  `.agent-logs/.capture-errors.log` (currently empty).
- **No double-counting.** `Stop` can fire more than once per prompt; the script
  writes a RESPONSE only when one is genuinely outstanding.
- **`.agent-logs/` is not gitignored** and ships with the repo.

## Defect found during QA, and repaired — 2026-09-25

A QA pass over the committed logs found **23 PROMPT entries against 15 RESPONSE
entries** and, at first glance, eight missing responses. That would have been a
serious problem, so it was traced rather than assumed.

**Nothing was missing.** Classifying every entry by its body showed:

| | count |
|---|---|
| Real user prompts | 16 |
| Harness `<task-notification>` events logged *as* prompts | 7 |
| Responses | 15 (the 16th was the in-flight turn) |

Every genuine user prompt had its response. The mechanism was not dropping
anything — it was **mislabelling**. `UserPromptSubmit` fires for harness-generated
events as well as typed input, and those were being written as `PROMPT`. Two
consequences, both real:

1. The prompt count was inflated by 7.
2. Because responses were numbered `previousResponses + 1` while prompts counted
   system events too, the two sequences drifted apart — `RESPONSE 6` did not
   answer `PROMPT 6`. A number that points at the wrong prompt is worse than no
   number.

**Repair** (`CLAUDE.md` permits fixing the mechanism when it is broken, and
requires saying so):

- Harness events are now written as `type=SYSTEM_EVENT` with their own counter.
  They are still recorded in full — hiding what the model received would be its
  own dishonesty — they are simply not counted as prompts.
- A response is numbered after **the prompt it answers**, not after the previous
  response, so the two can no longer drift.

Verified on a synthetic session with an event interleaved between two real
turns: `PROMPT 1 → RESPONSE 1 → SYSTEM_EVENT 1 → PROMPT 2 → RESPONSE 2`, with
`total_exchanges: 2`.

**No existing log entry was edited, renumbered or removed.** Entries written
before this repair keep their original numbering, so logs from earlier in the
build still show the drift described above. That is what actually happened, and
correcting it retroactively would be exactly the tampering the brief forbids.

Two other things ruled out while tracing this, so they are not the cause: the
hook is not timing out (202 ms against a 9 MB transcript, limit 15 s), and no
errors were ever written to `.agent-logs/.capture-errors.log`.
