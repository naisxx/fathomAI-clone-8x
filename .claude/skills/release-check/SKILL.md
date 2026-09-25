---
name: release-check
description: Final 8x submission checklist covering the public deployment, public repo, raw agent logs, capture test, walkthrough and honesty review. Use immediately before submitting.
---

# Release check

Check things in the order a reviewer meets them. Open everything cold — fresh tab,
no session, logged-out view.

> Items marked **[BRIEF]** depend on the full 8x brief, which is not yet in the
> repo. See `docs/ASSIGNMENT.md`. Complete them once it arrives.

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

## 6. Submission

- [ ] **[BRIEF]** Every required submission field filled
- [ ] **[BRIEF]** Any required format or naming followed
- [ ] Deployment URL, repo URL and walkthrough link all resolve from a clean browser

## Verdict

Report **go** or **no-go**, blockers first, each with the evidence seen. Do not fix
— report, and let the user decide.
