# CLAUDE.md

Always-on rules for this repo. Details live in `docs/` — do not copy them here.

| Topic | Source of truth |
|---|---|
| Deliverables, judging criteria, final checks | [docs/ASSIGNMENT.md](docs/ASSIGNMENT.md) |
| Approval gates, roles, Git workflow, time budget | [docs/WORKFLOW.md](docs/WORKFLOW.md) |
| Decisions made and why | [docs/DECISIONS.md](docs/DECISIONS.md) |
| Product research plan | [docs/RESEARCH-PLAN.md](docs/RESEARCH-PLAN.md) |
| Feature scope (after research) | [docs/BUILD-PLAN.md](docs/BUILD-PLAN.md) |
| Capture mechanism | [CAPTURE-TEST.md](CAPTURE-TEST.md) |

## Project

A Fathom-style AI meeting notetaker. Three deliverables: a working public
deployment, this public repo including raw `.agent-logs/`, and a camera-on
walkthrough under five minutes.

## Plan approval gates

- Before any substantial phase or feature, write a plan — scope, user flow, data
  needs, implementation steps, acceptance criteria, estimate, deferrals — and
  **stop for explicit approval**.
- Approval of one phase never implies approval of the next.
- Use the `plan-feature` skill for the template.

## Evidence standards

- Separate **what was actually tested** from **what is assumed**. Never blur them.
- Screenshots or command output for behavioural claims. No claim of a test that
  did not run.
- Seeded or simulated data must be labelled as such in the UI and in docs. The
  capture bot may be stubbed; it may not pretend to be real.
- Never claim a real eight-person hour-long call was tested unless it was. A
  seeded long meeting is fine, labelled as demo data.

## Capture

- Hooks in `.claude/settings.json` → `.claude/hooks/capture.mjs` write every
  prompt and final response to `.agent-logs/`. This is automatic.
- **Never edit, summarise, delete, or reconstruct a log entry.** Dead ends stay in.
- Never add `.agent-logs/` to `.gitignore`.
- Do not modify the capture mechanism unless it is broken. If it breaks, repair it
  and say so.

## Git ownership

- Stable branch `develop`. Working branch `feat/fathom-rebuild`.
- Local commits only. **Never run `git push`**, create a remote, or change a
  remote. The user pushes.
- Use the existing `git config user.name` / `user.email` (`naisxx`,
  `onaisahmed02@gmail.com`). Never set author or committer to Claude/Anthropic.
- **Never add `Co-Authored-By: Claude` or any AI attribution trailer.** The raw
  `.agent-logs/` are the transparency record.
- Do not amend or rewrite commits to hide agent involvement.
- Commit each working slice together with the `.agent-logs/` entries it produced.
  Never save logs for one final dump.
- Before each commit: inspect staged changes for secrets, tokens, credentials and
  private calendar data; confirm new logs are staged.
- Message style: `chore: verify agent capture`, `docs: record product research`,
  `feat: add meeting review flow`.

## Working style

- Keep it short and practical. No boilerplate, no ceremony that slows delivery.
- Optimise for a complete meeting-review experience over many half-features.
- Use subagents only where specialisation genuinely helps. Never run two agents
  that edit the same files at once.
