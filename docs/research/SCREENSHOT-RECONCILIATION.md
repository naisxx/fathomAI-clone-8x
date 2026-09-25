# Screenshot reconciliation — live test call vs. documentation research

**Date:** 2026-09-25
**Live evidence:** 7 screenshots from a real Fathom test call recorded by the user
(`naisxx`) on a Fathom **free plan**, Chrome on Windows, dark theme.
**Documentation evidence:** [`FINDINGS.md`](FINDINGS.md) — option B, public surfaces
only, no account.

## What the live test does and does not establish

The recorded call was **~1 minute long with a single participant** (the user). The
dashboard card reads `1 min`; the player reads `0:00`.

That means these screenshots are **excellent evidence of the application chrome and
of its degenerate/empty states**, and **almost no evidence of populated content**.
Specifically, the call was too short for Fathom to produce a summary, and it
detected no action items. So the review screen was never seen carrying a real
summary, a real transcript body, or real action items.

This distinction is load-bearing and is maintained throughout the table below.

> **Not tested, and not claimed anywhere in this repo:** sharing, the unsigned-visitor
> view, cross-meeting search, click-to-seek on a transcript line, multi-speaker
> attribution, an eight-person call, a long call, Team Calls, Playlists, Alerts, or
> Deals. Several of these surfaces were *visible* but never *exercised*.

### File locations

Originals are the user's and are untouched: `recon/screenshots/` in the **main
checkout** (`C:\FathomAI Clone - 8x\recon\screenshots\`), not in this worktree.

They are HEIF images carrying a `.paint` extension, which most viewers and GitHub
will not render. PNG conversions were produced read-only via Windows WIC (libheif
rejects them — uncompressed `unci` HEIF). **Whether to commit PNG copies into this
public repo is an open decision — see the summary; they show the user's name,
avatar and a test meeting title.**

## Reconciliation table

| # | Path | Visible screen / section | Directly observed | Documented behaviour (source) | Conflict | Unverified |
|---|---|---|---|---|---|---|
| 1 | `recon/screenshots/1.paint` | Call page `fathom.video/calls/<id>` (real ID redacted — private call), SUMMARY tab | Two-column layout. **Left:** video player (avatar tile, `0:00`, volume, scrubber, `1×`, PiP, watermark "Onais's Fathom Notetaker") above tab strip **SUMMARY ǀ TRANSCRIPT ǀ ASK FATHOM**. Amber banner **"Meeting too short to generate a summary"**. Below it `SELECT TEMPLATE` grid. **Right rail:** title "Impromptu Google Meet Meeting", date "Sep 25, 2026", **Share** button (link icon) + kebab, `ACTION ITEMS` → *"None detected. Add manually on transcript tab"*. Global bar: logo, **Search Call Recordings**, Refer, Settings, Help & Feedback, ⭐25, avatar. | Vendor screenshots show a `SUMMARY ǀ TRANSCRIPT` tab pair with a template picker and Customize gear ([help 3239809](https://help.fathom.video/en/articles/3239809)); an `ACTION ITEMS` block exists ([vendor PNG](https://usw2.frontkb-cdn.com/attachments/5508513/20480/00580fab-c482-447b-8af8-75be20224c61.png)). API models `MeetingSummary.template_name` + `markdown_formatted` ([openapi.yaml](https://developers.fathom.ai/api-reference/openapi.yaml)). | **Resolves the open conflict.** A third-party review described a three-column `video ǀ summary ǀ transcript` layout ([bluedothq](https://www.bluedothq.com/blog/fathom-review)); FINDINGS §3 could not reconcile it. The live product is **two columns with a tabbed left pane**. The reviewer's description does not match this build. | Whether the video player is sticky while the pane scrolls. Whether the right rail gains sections when content exists. What a populated summary looks like. |
| 2 | `recon/screenshots/2.paint` | Same call, **TRANSCRIPT** tab active | Tab switches in place — right rail unchanged, video stays mounted. A **`Copy Transcript`** button appears in the tab strip, scoped to the transcript tab only. Transcript body is **below the fold and not visible**. Page is scrolled such that a large white band sits above the app — a rendering artefact of the scroll position. | Copy-transcript is a documented feature ([help 296000](https://help.fathom.video/en/articles/296000)). Transcript is modelled as `TranscriptItem[]` with `speaker`, `text`, `timestamp` (`HH:MM:SS`) ([openapi.yaml](https://developers.fathom.ai/api-reference/openapi.yaml)). Vendor images show chat-bubble blocks with a per-block `…` menu — Edit transcript / Change speaker / Trim ([vendor PNG](https://usw2.frontkb-cdn.com/attachments/5508513/20480/93826dbc-ffd3-44bd-a217-587910281f2a.png)). | None. Consistent. | **Everything about transcript rendering.** Speaker labels, timestamp display, whether clicking a line seeks the video, the per-block menu, how an unmatched speaker is shown. The body was never visible. |
| 3 | `recon/screenshots/3.paint` | Same call, **ASK FATHOM** tab active | A per-meeting chat pane: Fathom glyph, prompt *"Hi, what can I tell you about this meeting?"*, input **"Ask Fathom AI"** with a send arrow. Empty conversation state. | Ask Fathom is documented ([help 3239425](https://help.fathom.video/en/articles/3239425)). FINDINGS §4 recorded the vendor's ambiguous phrasing — "on the right-hand side of the page, next to the Summary tab" — and listed as `[UNKNOWN] #4` whether it is a third tab or a separate panel. | **Resolves `[UNKNOWN] #4`.** It is a **third tab**, peer to SUMMARY and TRANSCRIPT — not a side panel. | Whether it answers usefully on a real transcript. Rate limits. Whether it cites timestamps in replies. |
| 4 | `recon/screenshots/4.paint` | Crop — template picker, rows 1–3 | Cards: **Enhanced** badged green **FREE**, plus **Sales**, **Sales - Sandler**, **Sales - SPICED**, **Sales - MEDDPICC**, **Sales - BANT**. Every card except Enhanced is visibly **dimmed**. | Customisable AI summaries with selectable templates ([help 3239809](https://help.fathom.video/en/articles/3239809)); `template_name` is a first-class field ([openapi.yaml](https://developers.fathom.ai/api-reference/openapi.yaml)). Pricing page gates advanced summaries to paid tiers ([pricing](https://fathom.video/pricing)) — FINDINGS §1 could not extract the feature matrix. | None, and it **fills a FINDINGS gap**: the free/paid split is now visible at the template level rather than inferred from a pricing table. | That dimmed = plan-locked. Strongly implied by the `FREE` badge on the only undimmed card, but **not confirmed** — no card was clicked, no upsell seen. Recorded as inference, not fact. |
| 5 | `recon/screenshots/5.paint` | Crop — template picker, rows 4–6 | **Customer Success**, **Customer Success - REACH™**, **Candidate Interview**, **Demo**, **One-on-One**, **Project Kick-Off**. All dimmed. Each card = icon + name + one-line description. | As above. | None. | As above. |
| 6 | `recon/screenshots/6.paint` | Crop — template picker, tail | **One-on-One**, **Project Kick-Off**, **Project Update**, **Q&A**, **Retrospective**, **Stand Up**. All dimmed. | As above. | None. | Whether the list ends here. **16 distinct templates** observed across 4–6; there may be more below the crop. |
| 7 | `recon/screenshots/7 - Main Dashboard.paint` | **Main dashboard** (`My Calls`) | Sub-nav **My Calls ǀ Team Calls ǀ Playlists ǀ Alerts ǀ Deals**. Meetings are a **card grid grouped by date** under a `Today` heading — thumbnail, duration badge `1 min`, title. One call present. **Right rail = account-level ASK FATHOM**, collapsible, with amber banner *"Account-level Ask Fathom is here! We're gifting you unlimited use until Oct 1…"*, suggestion chips (*Summarize my meetings from this week* / *Things I promised I'd do by this week* / *Surprise me with an insight*), input "Ask anything…" and a **scope dropdown reading `My Calls`**. Bottom: `LEARN HOW TO USE FATHOM` onboarding row — Self-Guided Tutorial, Start Test Call, Attend Tips & Tricks Webinar — plus a floating onboarding bubble. | FINDINGS §3 recorded a tab strip and call-card grid from vendor images ([vendor PNG](https://usw2.frontkb-cdn.com/attachments/5508513/20480/cef25399-d425-4940-ab65-1b16e2e9327c.png)); Playlists/Alerts/Deals are documented surfaces. | None on structure. **Minor discrepancy:** dashboard shows `1 min`, player shows `0:00` — rounding-up of a sub-minute recording, or the player had not loaded. Not resolved. | Every sub-nav tab except My Calls. Search. Sorting/filtering. What the grid does at 50+ meetings. Whether account-level Ask Fathom differs from the per-meeting tab beyond scope. |

## What changed in our understanding

**Three things the live test settled that documentation could not:**

1. **Layout is two columns with a tabbed left pane** — not three columns. FINDINGS
   §7 item 1 is closed; the third-party reviewer was describing a different build.
2. **Ask Fathom is a third tab**, not a side panel. FINDINGS §7 item 4 is closed.
3. **Ask Fathom also exists account-wide** on the dashboard with a scope selector —
   a two-level feature the documentation research did not surface at all.

**Two states documentation never showed, now observed:**

- `Meeting too short to generate a summary` — an explicit degenerate state. The
  string "too short" appears nowhere in FINDINGS.
- `None detected. Add manually on transcript tab` — the empty action-items state,
  which also **cross-confirms** the API's `ActionItem.user_generated: boolean`:
  manual addition is real, and it happens on the transcript tab.

**One thing weakened:** the bluedothq review is now known to be unreliable on
layout for this build, so its other claims — including the transcript-scrolling
behaviour cited in FINDINGS §4 — should be treated with more caution.

## Highest-value missing checks — ~17 minutes total

Ordered by value. Each is a single action with a stated time limit.

| # | Check | Exact steps | Limit |
|---|---|---|---|
| 1 | **Populated review screen** — the single biggest gap | Start a call. **Talk for 5–6 minutes** and deliberately say 2–3 commitments aloud ("I'll send the deck by Friday", "Onais will follow up Monday"). End it. Wait for processing, open the call. Screenshot: summary body, transcript body, action-items block. | 10 min |
| 2 | **Unsigned-visitor view** — highest-value unknown in the whole project | On that call click **Share** → screenshot the modal and its scope options → copy the link → open it in a **private/incognito window**. Screenshot what a stranger sees. | 3 min |
| 3 | **Click-to-seek** | On the TRANSCRIPT tab, click a transcript line. Does the video jump to it? Screenshot before/after the player timestamp. | 1 min |
| 4 | **Search** | Type a distinctive word from the call into **Search Call Recordings**. Screenshot the results — per-meeting hits, or transcript-level hits with timestamps? | 1 min |
| 5 | **Template switch** | Click a dimmed template (e.g. **One-on-One**). Screenshot whatever happens — upsell, or it applies. Confirms or kills the plan-gating inference. | 1 min |
| 6 | **Multi-speaker attribution** *(optional, needs a second person)* | Have someone join for 60 seconds. Screenshot the transcript showing two speakers. | 5 min |

Checks 1 and 2 are worth more than 3–6 combined. If time is short, do those two.

> Nothing here is required before building. The build plan is written so that
> Phase 1 does not depend on any of it; these checks raise fidelity, not viability.
