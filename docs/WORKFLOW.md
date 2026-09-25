# Workflow

## Approval gates

Each gate is a full stop. Nothing downstream starts without an explicit "approved"
or revisions from the user.

| # | Gate | Artifact | Status |
|---|---|---|---|
| 0 | Capture verified | `CAPTURE-TEST.md` | **Done** (2026-09-25) |
| 1 | Project setup | this commit | **Awaiting review** |
| 2 | Research plan | `docs/RESEARCH-PLAN.md` | **Awaiting approval** |
| 3 | Research findings | `docs/research/FINDINGS.md` | Blocked by gate 2 |
| 4 | Product scope | `docs/BUILD-PLAN.md` | Blocked by gate 3 |
| 5 | Per-slice plans | one plan per slice | Blocked by gate 4 |
| 6 | Release | `release-check` skill | Blocked by gate 5 |

Approving one gate approves **only** that gate.

## Roles

Subagents in `.claude/agents/`. Use one when its specialisation genuinely helps a
phase — not to tick a box. Never run two agents that write the same files.

| Agent | Phase | Model alias | Resolves to |
|---|---|---|---|
| `researcher` | 3 | `sonnet` | `claude-sonnet-5` |
| `product-planner` | 4 | `opus` | `claude-opus-5` |
| `ui-designer` | 5 | `opus` | `claude-opus-5` |
| `fullstack-builder` | 5 | `inherit` | session model (`claude-opus-5`) |
| `qa-reviewer` | 5–6 | `opus` | `claude-opus-5` |
| `release-reviewer` | 6 | `sonnet` | `claude-sonnet-5` |

Aliases are what Claude Code accepts in agent frontmatter. The right-hand column
records what they actually resolve to in this install, per the rule against
inventing model IDs.

## Git

- **`develop`** — stable. **`feat/fathom-rebuild`** — working branch, current.
- Local commits only. The user pushes. Never `git push`, never touch remotes.
- Author is always the existing git config (`naisxx` / `onaisahmed02@gmail.com`).
  No AI author, no `Co-Authored-By: Claude`, no AI attribution trailer.
- No amending or rewriting to hide agent involvement.
- Every slice commits with the `.agent-logs/` entries it produced.
- Pre-commit: scan staged diff for secrets/tokens/credentials/private calendar
  data; confirm new logs are staged.
- Messages: `chore:`, `docs:`, `feat:`, `fix:`, `test:` + short imperative.

### Checkpoints

1. `chore: verify agent capture` — capture setup *(committed, see note below)*
2. `chore: add project setup, agents and skills` — this commit
3. `docs: record product research` — after gate 3
4. `feat: …` — one per approved slice

> **Note on checkpoint 1.** Commit `489748b` was made before the no-AI-attribution
> rule was given and carries a `Co-Authored-By: Claude Opus 5` trailer. It has not
> been amended, because the rules also forbid rewriting commits to hide agent
> involvement. Flagged for the user to decide. All commits from checkpoint 2
> onward carry no attribution trailer.

## 24-hour time budget

Wall-clock from setup complete. Indicative, not a contract.

| Phase | Budget | Cumulative |
|---|---|---|
| Setup (this) | 0:45 | 0:45 |
| Research Fathom | 1:30 | 2:15 |
| Scope + build plan | 0:45 | 3:00 |
| Core build — capture → transcript → review | 8:00 | 11:00 |
| AI summary, action items, search | 4:00 | 15:00 |
| Seed realistic demo meeting | 1:00 | 16:00 |
| Deploy public | 1:30 | 17:30 |
| QA + fixes | 2:30 | 20:00 |
| Walkthrough recording | 1:00 | 21:00 |
| Buffer | 3:00 | 24:00 |

Three hours of buffer is deliberate. If a phase overruns, cut scope, not the
buffer — a complete meeting-review experience beats many half-features.
