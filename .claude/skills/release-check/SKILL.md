---
name: release-check
description: Final 8x submission checklist covering the public deployment, public repo, raw agent logs, capture test, walkthrough and honesty review. Use immediately before submitting.
---

# Release check

Check things in the order a reviewer meets them. Open everything cold — fresh tab,
no session, logged-out view.

> Judging is on **speed, product judgement and UX/UI**. The brief's own final
> gate is three lines: the live link opens for somebody not signed in, the repo is
> public with `.agent-logs/` in it, and the walkthrough is camera-on and under five
> minutes. Verbatim brief in `docs/ASSIGNMENT.md`.

## 1. Capture — the first file they open

- [ ] `CAPTURE-TEST.md` exists at repo root
- [ ] It names tool, model, mechanism and the config file changed
- [ ] The log paths it names **actually exist** and contain the canaries
- [ ] Both canary entries are pasted raw
- [ ] It records what was tried first and failed
- [ ] `.agent-logs/` is committed and **not** gitignored
- [ ] Prompts are verbatim and untruncated
- [ ] Responses contain no thinking and no tool calls
- [ ] Every entry has a UTC timestamp and a model name
- [ ] Log commits are **interleaved** through history, not one final dump
      (`git log --oneline --stat -- .agent-logs/`)
- [ ] No entry was edited, summarised or removed

## 2. Public deployment

- [ ] URL loads in a fresh tab, no session, no VPN
- [ ] **No login anywhere in the graded path** — an unsigned visitor reaches every
      graded screen (hard requirement)
- [ ] The core flow works there, not only locally
- [ ] Unsigned-visitor view behaves correctly
- [ ] No console errors on the main screens
- [ ] Works at 375px phone width
- [ ] Seeded data is visibly labelled as demo data

## 3. Public repository

- [ ] Repo is public and loads logged out
- [ ] README states what it is and links the live URL
- [ ] **No secrets, tokens, credentials, `.env` or private calendar data**
      (`git log -p | grep -iE 'api[_-]?key|secret|token|password'`)
- [ ] Commit history shows real progression, not one squashed commit
- [ ] Commit author is the user, not Claude or Anthropic
- [ ] No AI attribution trailers in commit messages

## 4. Walkthrough

- [ ] Exists and plays
- [ ] **Under five minutes**
- [ ] **Camera on**
- [ ] Shows the deployed public app, not localhost
- [ ] States plainly what is stubbed or seeded

## 5. Honesty review

- [ ] No claim of a real eight-person hour-long call unless one happened
- [ ] Stubbed capture bot described as stubbed, in the app and the walkthrough
- [ ] Nothing in README or walkthrough overstates what was tested
- [ ] Known limitations stated somewhere a reviewer will find them

## 6. UX/UI — a graded axis, not polish

- [ ] Visual hierarchy holds on the review screen: the thing that matters is the
      thing you see first
- [ ] Empty, loading and error states are designed, not default
- [ ] 375px phone width is genuinely usable, not merely non-broken
- [ ] Keyboard reach and visible focus on every interactive element
- [ ] Contrast meets AA
- [ ] Nothing janky at long-content scale (hour-long, eight-speaker transcript)

## 7. Submission

- [ ] Public live link, public repo with `.agent-logs/`, camera-on walkthrough
      under five minutes — all three present
- [ ] Live link and repository pasted into the **links field**, each one labelled
- [ ] Walkthrough pasted into the **walkthrough field**
- [ ] Meetings list is seeded — "an empty meetings list tells us nothing"
- [ ] Deployment URL, repo URL and walkthrough link all resolve from a clean browser

## Verdict

Report **go** or **no-go**, blockers first, each with the evidence seen. Do not fix
— report, and let the user decide.
