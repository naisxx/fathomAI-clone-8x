# Findings — Fathom (fathom.video / fathom.ai), 2026-09-25

**Access route: Option B — public surfaces only. No account. No sign-in was attempted and no
credentials were entered anywhere.**
Timebox: 1h00 Fathom + 0h15 Granola (planned) / ~1h00 + ~0h12 (actual).

## Provenance tags used in this document

| Tag | Means |
|---|---|
| `[OBSERVED]` | I loaded the page/asset myself and saw this. |
| `[MARKETING]` | Fathom's own claim — marketing site, help centre, API docs. Unverified. |
| `[THIRD-PARTY]` | A review site or article. Someone else's screenshot or account. |
| `[ASSUMED]` | My inference. The basis is stated. |
| `[UNKNOWN]` | I could not determine it. Section 7 lists these in full. |

**Critical caveat about `[OBSERVED]` in this run.** Under option B, I never saw the Fathom
product UI. Everything I `[OBSERVED]` is a *marketing or documentation page*, or a
*vendor-published screenshot file*, not the running application. Where I describe the review
screen I viewed the vendor's own PNGs hosted on their help-centre CDN — those are tagged
`[MARKETING]` with the public URL, because they are the vendor's depiction of their UI, cropped
and annotated by their support team, possibly out of date. **Nothing in this document should be
treated as confirmation of live product behaviour.** Section 7 is the important section.

No screenshot files were created. Where a visual matters, the public URL of the image is cited and
what it shows is described in words.

Cookie consent: the help centre showed a cookie banner; I clicked **Reject**. `[OBSERVED]`
The marketing site and developer docs showed no consent prompt in this session. `[OBSERVED]`

---

## 1. What it is

`[MARKETING]` Fathom positions itself as an "AI Notetaker" that "summarizes your meetings so you
can focus on the conversation", now "available bot-free". Headline claims on
<https://fathom.ai>: AI summaries instantly available after the call; meeting data exposed to
ChatGPT/Claude; automatic monitoring of key topics ("Trackers"); "Used at 300K+ companies".
Compliance badges: SOC 2 Type II, GDPR, HIPAA, SSO/SCIM.

`[MARKETING]` Capture modes (<https://www.fathom.ai/overview>, <https://www.fathom.ai/whats-new>):
bot with full video + audio; bot-free video (limited beta, Zoom, Mac); bot-free audio + transcript;
bot-free transcript only.

`[MARKETING]` Version 3.0 shipped a redesign whose stated centrepiece is a "unified post-meeting
workspace ... your summary, transcript, and action items are all exactly where you expect them –
without bouncing between tabs". That sentence is the closest thing to a design brief the vendor
publishes for the screen we care about.

`[OBSERVED]` <https://fathom.video/home> is a sign-in wall offering **Continue with Google /
Continue with Microsoft / Continue with SSO** only — there is no password field at all. This is
why option B stops here: there is no anonymous route into the app.

### 1.1 Plan gating (R1)

`[MARKETING]` From <https://fathom.video/pricing> (redirects to fathom.ai):

| Plan | Price | Gate |
|---|---|---|
| Free (individual) | $0 | Unlimited recordings + transcription, choice of bot-free/bot capture, instant AI summaries, clips, playlists, search across calls |
| Premium (individual) | $16/user/mo | + advanced call summaries, **AI-generated action items**, conversational assistant (Ask Fathom), custom meeting bot |
| Team | $15/user/mo (2 min) | + global search across calls, playlists of highlights, comments, folders, keyword alerts |
| Business | $25/user/mo | + CRM field sync, Deal View, coaching metrics / AI scorecards, **custom summaries** |
| Enterprise | $35/user/mo | + onboarding program, org-wide security controls, SSO and SCIM, custom retention, CSM |

`[MARKETING]` Notable gates for a clone: **AI action items are a paid feature** (Premium+), as is
Ask Fathom. Summary *customization* is Premium/Team (help article 3239809). Comments, folders and
keyword alerts are Team-and-up. Unlimited recording and transcription are free.

`[UNKNOWN]` The full feature-comparison matrix on the pricing page uses tick glyphs that do not
survive text extraction, so for many rows I cannot say which plan has the tick. The list above is
from the plan cards, which are prose and did extract.

---

## 2. Flows observed

Only two flows could be exercised without an account. Both are thin.

### Flow: Reaching the app as an unsigned visitor   `[OBSERVED]`

Entry point: <https://fathom.video/home>

1. Load the URL → a centred "Sign in to Fathom" card with three buttons: Continue with Google,
   Continue with Microsoft, Continue with SSO. Below: "New to Fathom? Sign up", ToS/Privacy line,
   a rotating testimonial, "#1 rated / 6,500+ reviews", "Used at over 290K+ companies".
2. No password field, no demo mode, no guest preview.

Ends at: a hard auth wall. **I stopped here and entered nothing.**

Notes: the sign-in page advertises "290K+ companies" while the marketing home page says "300K+" —
a harmless inconsistency, but a reminder that marketing numbers are not data.

### Flow: Opening an invalid share link logged out   `[OBSERVED]`

Entry point: `https://fathom.video/share/zzzzzzzzzzzzzzzzzzzz` (a deliberately bogus token)

1. Navigate → completely blank white page, no branding, no "not found" copy.
2. Fetching the same URL returns **HTTP 404 with a zero-length body**.

Ends at: a bare 404.

Notes: this tells us the share route is token-addressed and server-validated, and that Fathom does
**not** ship a branded 404 for bad share links. For our clone, a designed "this link is no longer
available" state is a cheap visible win. It does **not** tell us what a *valid* share link renders
— see section 7.

### Flow NOT performed: the post-meeting review screen

`[UNKNOWN]` I did not load a single Fathom product page. Everything in section 3 is reconstructed
from the vendor's own screenshots and prose.

---

## 3. The core screen (R3) — reconstructed, not observed

Everything in this section is `[MARKETING]` unless marked otherwise. I viewed each cited PNG
myself; they are the vendor's support-article images, so they are cropped, annotated with red
boxes, and in several cases blurred for privacy.

### 3.1 Global chrome

`[MARKETING]` <https://usw2.frontkb-cdn.com/attachments/5508513/20480/478055fe-6ce6-45a5-911d-735938b78b84.png>
shows the web app top bar: **FATHOM** wordmark, a centre search field reading "Search with AI…"
with a **NEW** badge, a bell icon. Below it a tab strip: **My Calls, Team Calls, Folders,
Playlists, Alerts**. Dark theme throughout. The call grid is grouped by time bucket with headings
— "Last Week", "August".

`[MARKETING]` A second, wider crop
(<https://usw2.frontkb-cdn.com/attachments/5508513/20480/cef25399-d425-4940-ab65-1b16e2e9327c.png>)
shows a longer tab strip on a paid account: **My Calls, Team Calls, Folders, Playlists, Alerts,
Trackers (NEW), Deals, Coaching**.

### 3.2 The call list item

`[MARKETING]` Same image. Each call is a **card**, three across, consisting of:

- a video thumbnail — a 2-up grid of participant video tiles, platform watermark ("zoom") bottom-right
- a **duration pill** bottom-right of the thumbnail ("20 mins", "33 mins", "16 mins")
- a yellow **eye-with-slash** badge top-right (visibility / not-shared indicator) `[ASSUMED]`
- below the thumbnail: **call title** in bold ("Discovery Call", "Customer Feedback Session",
  "Contract Negotiation Meeting")
- a metadata row: **date** ("Jul 9"), optionally a **company chip** ("FauxCorp L…", truncated), and
  a **meeting-type dropdown chip** ("Project Sync", "Misc sales call")
- the third card has date only — company and meeting type are conditional, not always present

`[MARKETING]` Company attribution is derived, not entered (help article 13115841): external
calendar organizer first, else external attendee domains, else the most frequent guest domain; ties
break to whichever company row was created first. The article admits "manual override isn't
currently available in the UX" — a named weakness.

`[MARKETING]` Infinite scroll: "scroll down on your Fathom Dashboard … Fathom will automatically
begin loading your older recordings … You will notice the Fathom icon appearing" (article 7573185).
So the list is cursor-paginated with a spinner, not numbered pages.

### 3.3 The single-call review screen

`[THIRD-PARTY]` A review article describes the layout as "the left side showing the video, the
middle showing the AI summary, and the right side showing the full transcript"
(<https://www.bluedothq.com/blog/fathom-review>). **Treat this as one reviewer's account of one
version.** Fathom's own screenshots below are consistent with a *video + tabbed rail* rather
than a strict three-column split, so these two descriptions may not describe the same release.

`[MARKETING]` What the vendor screenshots establish about the call page:

- **A tab pair over the content panel: SUMMARY | TRANSCRIPT.** Visible in
  <https://usw2.frontkb-cdn.com/attachments/5508513/20480/831ec0f3-f7d8-4d94-87d5-6bdaf1cf1847.png>,
  where SUMMARY is the active tab (blue label, blue underline) and TRANSCRIPT is the inactive one.
- **Directly under the tabs, a summary-template picker**: a pill reading "Sales" with a chevron, an
  adjacent **gear** whose tooltip reads **"Customize"**, and to its right a **flag control**
  (partially cropped, a US flag) — almost certainly output language. Same image.
- **A Share button sits below the meeting title** — the help text is explicit: "Click the 'Share'
  button below the meeting title in the call recording view" (article 295616).
- **A visibility dropdown sits below the Share button** with values *No Team Visibility / Visible to
  Support Only / Visible to All Teams / Visible to Multiple Teams* (article 7573185). Team
  visibility and link sharing are two separate controls.
- **An ACTION ITEMS block.**
  <https://usw2.frontkb-cdn.com/attachments/5508513/20480/00580fab-c482-447b-8af8-75be20224c61.png>
  shows the section heading "ACTION ITEMS" with two buttons under it: a solid blue **"Copy for …"**
  (opening a menu of Asana / Google Docs / GMail / Todoist / Microsoft Word) and an outlined
  **"Copy Follow-up Email"** with an envelope icon. Each item below renders as: item text, a
  **sparkle glyph**, an **"@ MM:SS" timestamp**, and a **person-icon + assignee name in yellow**.
  One visible item reads: Integrations, sparkle, "@ 56:39", "Anne Ardon".
- **The summary appears to be sectioned with ALL-CAPS headings.** The background of
  <https://usw2.frontkb-cdn.com/attachments/5508513/20480/61e86899-a776-4c4f-b1ab-066f48c95d9d.png>
  shows a rail containing lines like "Share management advice with Aia and Dar … @ 18:…"
  with a yellow assignee under it, a banner reading "Action Items Generated by…", and a section
  heading "SCREEN SHARING". So summary sections, action items and per-line timestamps share one
  scrolling rail.

### 3.4 What is primary / secondary / hidden — my reading

`[ASSUMED]`, resting on the screenshots and help-article ordering above:

- **Primary:** the video player, the meeting title, and the SUMMARY tab. The summary is what the
  product opens on; the transcript is one click away. Action items are inside that same rail,
  high up, with their own heading and two prominent export buttons.
- **Secondary:** transcript (second tab), Ask Fathom (a panel "on the right-hand side of the page,
  next to the Summary tab", article 3239425), highlights (a rail of clips), share/visibility
  controls under the title.
- **Hidden / on-demand:** trimming, transcript editing and speaker correction live behind a
  per-block **"…" menu** in the transcript — see
  <https://usw2.frontkb-cdn.com/attachments/5508513/20480/93826dbc-ffd3-44bd-a217-587910281f2a.png>,
  whose menu reads **Edit transcript / Change speaker / Trim this section / Trim all sections before
  this section**. Highlight creation is likewise hidden behind a hover affordance (a blue **+** that
  appears to the left of the transcript, article 295680).

`[UNKNOWN]` Whether the player is left-column or top, whether the rail is fixed-width, whether
there is a keyword-search field scoped to the open call, and what the page looks like at narrow
widths. Nothing public answers these.

---

## 4. Transcript, summary, action items (R4)

### 4.1 Transcript

`[MARKETING]` Rendered as **chat-style bubbles**, one per utterance, speaker name above the run.
Visible in <https://usw2.frontkb-cdn.com/attachments/5508513/20480/8b3e7023-c38a-4305-8f52-a3e199c2a740.png>
(blue bubbles) and in the trim screenshot, where the speaker name "Alyssa Medina (she/her)" is
printed above a block — so **speaker labels carry pronouns from the calendar/profile**.

`[MARKETING]` Vendor-published OpenAPI spec (<https://developers.fathom.ai/api-reference/openapi.yaml>)
models a transcript as an array of
`TranscriptItem { speaker{display_name, matched_calendar_invitee_email}, text, timestamp "HH:MM:SS" }`.
So: **utterance-level granularity, HH:MM:SS timestamps, and an explicit fuzzy join from speaker
display name to calendar invitee email that is allowed to be null.** The `Invitee` schema carries
the reverse pointer, `matched_speaker_display_name`, also nullable, and notes it is "only available
for meetings after Feb 1, 2025". That is a real, admitted edge case: **speaker-to-attendee matching
fails sometimes and the model is designed for that.**

`[MARKETING]` Transcript language is a single per-meeting field (`transcript_language: "en"`).
Summaries and action items are "**always displayed in English**" per the spec, regardless of
transcript language.

`[MARKETING]` Transcripts **cannot be downloaded** — only "Copy Transcript", a button "directly
above your transcript" (article 296000). Recordings download as MP4; MP3 is not available
(article 7974977).

`[THIRD-PARTY]` "As you scroll through the transcript, Fathom will also jump to that particular
point in the recording" — bluedothq review. This describes scroll/playhead coupling; it does
**not** establish click-to-seek.

`[MARKETING]` Click-to-seek is nonetheless strongly implied by the API: action items carry
`recording_playback_url: "https://fathom.video/calls/xyz123?timestamp=645"` — a **seconds-valued
query parameter on the call URL**. Highlights carry `start_time` / `end_time` in seconds (floats,
e.g. 27.5). So the player is addressable by second from outside the page.

### 4.2 AI summary

`[MARKETING]` Templated. The API models it as
`MeetingSummary { template_name: "general", markdown_formatted: "## Summary ..." }` — i.e. **the
summary is stored as markdown with a template name**, not as structured sections. Templates named
in public sources: `general` (the default, formerly "Enhanced"; per release notes the
"Chronological" template was deprecated in May 2026 and everyone was migrated to General/Enhanced),
plus sales-oriented deal templates **Sales, Sales – SPICED, Sales – MEDDPICC, Sales – BANT**
(article 3239809).

`[MARKETING]` Templates are **per-meeting-type assignable** and customizable: each template has a
base prompt, the user appends free-text instructions, clicks **Regenerate Summary**, then optionally
**Apply to Future Summaries**; a pencil icon edits the instructions and an arrow reverts to default
(article 3239809). Meeting types are a first-class org-level entity with `name` and
`status: active|inactive` (API `/meeting_types`), assignable and removable on individual calls from
call galleries, call lists and call detail pages (release notes, Oct 2025).

So: **yes, summaries are templated per meeting type**, and the template is both selectable on the
call page and defaulted by meeting type. `[MARKETING]`

### 4.3 Action items

`[MARKETING]` API shape:
`ActionItem { description, user_generated, completed, recording_timestamp "HH:MM:SS", recording_playback_url, assignee{name,email,team} }`.

Four things fall out of that and matter for the build:

1. **Action items are both AI-generated and hand-written** — `user_generated` distinguishes them.
   The UI marks the AI ones with a sparkle and a banner "Action Items Generated by…".
2. **They are checkable** — `completed` is a stored boolean.
3. **They are assignable to a person** with name/email/team, rendered in yellow with a person icon.
4. **Every one is anchored to a moment in the recording** and carries its own deep link.

`[MARKETING]` Export is copy-to-clipboard, not integration-push, for the lightweight targets:
"Copy for …" offers Asana / Google Docs / GMail / Todoist / Microsoft Word, and there is a separate
"Copy Follow-up Email". Copying a summary offers a **with-or-without-hyperlinks toggle** (release
notes, Sep 2025).

### 4.4 Highlights and clips

`[MARKETING]` Created post-hoc by hovering the transcript, clicking a blue **+**, choosing a
**highlight type**, then dragging the bracket to extend the span (article 295680). The screenshot
shows the result as a bracketed range of transcript bubbles with a "HIGHLIGHT" label, a "…" menu,
and an **AI-written one-line description of the highlighted moment** ("The speakers are discussing a
Zoom video issue with multiple login requirements and password confusion.").

`[MARKETING]` API: `Highlight { type, summary, text, start_time, end_time }` where `type` is "the
label of the bookmark this highlight was created from" (e.g. "Objection") and the times are seconds
as floats. Each highlight has its own shareable clip link, copied from a share-link icon next to
the "…" (article 295680). Playlists are curated sets of highlights across calls.

---

## 5. Sharing and the unsigned visitor (R5)

`[MARKETING]` The Share dialog — viewed at
<https://usw2.frontkb-cdn.com/attachments/5508513/20480/e8a9c3fc-4bff-459b-b2ca-dd1e7bba5cbe.png>
and <https://usw2.frontkb-cdn.com/attachments/5508513/20480/61e86899-a776-4c4f-b1ab-066f48c95d9d.png>:

- Modal titled **Share Recording** with an X.
- A single search input: "Add teams, users, and emails" (the individual-plan variant reads "Add
  users and emails" — so the teams affordance is plan-gated).
- A **PEOPLE WITH ACCESS** list: name, email, and a role control on the right. The owner row reads
  **Owner** as static text; other rows show a dropdown, e.g. **Limited**.
- A footer row: a link-scope dropdown on the left, **Copy Link** button on the right.
- The link-scope menu has exactly three options, with a tick on the current one:
  **Anyone with the link can view** (globe icon) / **Anyone @yourdomain can view** (building icon) /
  **Only people added can view** (padlock icon).

`[MARKETING]` Per-person access levels (article 295616):

- **Limited** — can view transcript, summary and recording, but not the sharing details; sees a
  prompt to ask the owner for more access.
- **Standard** — all content, download, comments (Team plan), highlights and action items, plus
  sharing details (external users do not see internal role names).
- **Admin** — all of the above plus reshare, trim, and edit the transcript.
- **Remove** — revoke.

`[MARKETING]` Granularity is therefore **three-layered**: org/team visibility (a separate dropdown
under the Share button), link scope (three values), and per-recipient role (three values). Separate
share links exist for **individual highlight clips** and for **playlists**.

### What an unsigned visitor sees

`[MARKETING]` Fathom says a recipient "can easily access the recording without signing up for or
downloading Fathom", and that the link contains "the video, transcript, and any associated
questions" (articles 296128, 295616). "Questions" refers to questions attendees asked during the
call.

`[MARKETING]` A caveat the vendor states plainly: on a Team Plan, accessing the call may require
signing in with the same domain, depending on the team's settings (article 296128).

`[OBSERVED]` An invalid share token returns a bare HTTP 404 with an empty body and renders a blank
white page. No branded error state.

`[UNKNOWN]` **I could not see a real shared recording.** I searched for a publicly posted
`fathom.video/share/...` link and found none — every result was Fathom's own help centre or a
tutorial site. So I cannot say what the logged-out share page actually renders: whether it has the
SUMMARY/TRANSCRIPT tabs, whether action items appear, whether there is a Fathom header or an
upsell CTA, whether comments are visible, whether the video is downloadable, or whether the page is
server-rendered or an SPA behind a token fetch. **This is the single most valuable thing for the
option C run to capture.**

---

## 6. Data model (inferred, but unusually well-grounded)

This is the strongest part of the public surface. Fathom publishes a full OpenAPI 3.1 spec at
<https://developers.fathom.ai/api-reference/openapi.yaml> (base URL
`https://api.fathom.ai/external/v1`). The field names and enums below are **quoted from that spec**
— `[MARKETING]` in provenance, since it is a vendor artefact I did not exercise, but it is a
machine contract rather than prose, so it is the most reliable public evidence available. The
*relations* I draw are `[ASSUMED]`.

### Entities and fields

**Meeting** (the aggregate root; there is no separate Recording resource in the list response — the
recording is folded in via `recording_id`)

- `title` — Fathom's display title
- `meeting_title` — the calendar event title, nullable (since Mar 2026 these are said to match)
- `meeting_type` — name of assigned meeting type, nullable
- `recording_id` — integer
- `url` — e.g. `https://fathom.video/xyz123`
- `meeting_url` — the underlying Zoom/Meet/Teams/Slack-huddle join URL, nullable
- `share_url` — e.g. `https://fathom.video/share/xyz123` (**a separate token from `url`**)
- `created_at`, `scheduled_start_time`, `scheduled_end_time`, `recording_start_time`,
  `recording_end_time` — all ISO-8601. **Scheduled and actual times are distinct fields.**
- `calendar_invitees_domains_type` — `only_internal | one_or_more_external`
- `shared_with` — `no_teams | single_team | multiple_teams | all_teams`
- `transcript_language` — e.g. `"en"`
- `transcript[]`, `default_summary`, `action_items[]`, `highlights[]`, `crm_matches` — all nullable,
  all opt-in via `include_*` query flags
- `calendar_invitees[]`, `recorded_by`

**TranscriptItem** — `speaker{display_name, matched_calendar_invitee_email?}`, `text`,
`timestamp "HH:MM:SS"`

**MeetingSummary** — `template_name`, `markdown_formatted` (both nullable; always displayed in
English)

**ActionItem** — `description`, `user_generated`, `completed`, `recording_timestamp "HH:MM:SS"`,
`recording_playback_url` (`/calls/xyz123?timestamp=645`), `assignee{name,email,team}` (all nullable)

**Highlight** — `type`, `summary`, `text` (only present when it differs from `summary`),
`start_time`, `end_time` (seconds, float)

**Invitee** — `name?`, `email?`, `email_domain?`, `is_external`, `matched_speaker_display_name?`

**FathomUser** (the recorder) — `name`, `email`, `email_domain`, `team?`

**MeetingType** — `name`, `status: active|inactive`, `created_at`

**Team** — `name`, `created_at`;  **TeamMember** — `name`, `email`, `created_at`

**User** — `name?`, `email`, `created_at`, `status: active|deactivated|invited`,
`permissions{ settings_access{level: none|team_admin|account_admin, teams[]}, view_access{level: own_meetings|team|multiple_teams|all_teams, teams[]} }`

**CRMMatches** — `contacts[]`, `companies[]`, `deals[]{name, amount, record_url}`, `error?`

**Webhook** — `id`, `url`, `secret`, `created_at`, `include_transcript`, `include_crm_matches`,
`include_summary`, `include_action_items`,
`triggered_for[]: my_recordings | shared_external_recordings | my_shared_with_team_recordings | shared_team_recordings`

**RecordingDownload** — `download_id`, `recording_id`,
`status: processing|completed|failed|expired`,
`video|audio{url, content_type, file_size_bytes, expires_at}`,
`failure_reason: generation_failed|generation_timeout`

### Relations `[ASSUMED]`

    User      1--*  Meeting          (recorded_by)
    Meeting   1--1  Recording        (recording_id; video / audio / transcript-only)
    Meeting   1--*  TranscriptItem   (ordered by timestamp)
    Meeting   1--?  Summary          (default_summary; other templates regenerate the same slot)
    Meeting   1--*  ActionItem       (assignee -> Invitee/User by email; anchored by timestamp)
    Meeting   1--*  Highlight        (span [start_time, end_time]; type -> bookmark vocabulary)
    Meeting   1--*  Invitee          (from the calendar event, NOT from who actually spoke)
    Meeting   *--?  MeetingType      (drives which summary template is applied)
    Meeting   *--*  Team             (via shared_with; org visibility separate from link sharing)
    Speaker   ?--?  Invitee          (fuzzy, nullable both ways, matched on name <-> email)

`[ASSUMED]` The load-bearing insight for our build: **Invitee and Speaker are different things and
the join between them is explicitly allowed to fail.** Fathom models attendance (from the calendar)
separately from speech (from the diarizer) and stores a nullable pointer in each direction. A clone
that assumes speaker == attendee will look naive on any real call.

`[ASSUMED]` The minimum viable model for the screen we are cloning is six tables:
`meeting`, `speaker`, `transcript_segment`, `summary` (markdown + template_name), `action_item`,
`share_link`. Everything else (teams, deals, trackers, scorecards, playlists, folders, CRM) is out
of scope.

---

## 7. Could not determine — the `[UNKNOWN]` list

Under option B this list is long by design. It is written to be directly actionable in an option-C
run where a real call is recorded and the UI captured.

### The review screen — layout

1. Whether the layout is three columns (video | summary | transcript) or two (video + tabbed rail).
   The reviewer says three; Fathom's own screenshots suggest a tab pair. Cannot reconcile.
2. Where the video player sits, whether it is sticky while the rail scrolls, and its aspect/size.
3. Whether SUMMARY and TRANSCRIPT are genuinely mutually exclusive tabs or two simultaneous panes.
4. What other tabs exist beside SUMMARY/TRANSCRIPT. Ask Fathom is described as "on the right-hand
   side of the page, next to the Summary tab" — is that a third tab or a separate panel?
5. The exact contents and order of the meeting header: title, date, duration, attendee avatars,
   company, meeting-type chip, Share, visibility dropdown, overflow menu. I have evidence that
   several of these exist; I have evidence for the order of none of them.
6. Responsive / narrow-width behaviour. No public evidence at all.
7. Light mode. FAQ article 7574145 is titled "Can I switch between dark and light mode in Fathom?"
   and opens "We've heard this request…" — I did not read the rest. Assume dark-only, verify.
8. Whether there is an overview/stats strip (talk-time ratio, longest monologue) on the call page.
   Coaching metrics exist as a paid feature but I do not know whether they surface here.

### Transcript interaction — the most important gap after sharing

9. **Whether clicking a transcript line seeks the video.** Only third-party prose about *scrolling*
   exists. The API proves URL-level `?timestamp=` deep links exist; it does not prove in-page
   click-to-seek.
10. Whether the transcript auto-scrolls to follow the playhead, and whether the currently-playing
    line is visually marked (and how).
11. Whether there is a search-within-transcript field, whether it highlights hits, and whether it
    offers next/previous navigation.
12. How speaker runs are grouped — one bubble per sentence, per utterance, or per contiguous run by
    the same speaker.
13. Whether speakers get stable colours or avatars, and what eight of them looks like.
14. What an unmatched speaker renders as — "Speaker 1", a raw diarizer label, or blank.
15. Whether the transcript is virtualised, and what a 60-minute transcript does to scroll
    performance and to the browser tab (release notes mention a past Chrome crash on the My Calls
    page, so performance has been a real problem for them).
16. Whether timestamps are shown per line in the UI at all, or only on hover.

### Summary and action items

17. Whether the summary renders as flat markdown or as UI-structured sections with per-section
    timestamps. The API stores a markdown blob; the screenshot shows ALL-CAPS section headings and
    "@ MM:SS" stamps in the same rail — I cannot tell whether those stamps belong to summary lines
    or only to action items.
18. Whether summary section headings or bullets are clickable and seek the player.
19. What the `general` template's actual section list is.
20. Whether an action item can be created by selecting a transcript range, or only typed.
21. What checking off an action item does visually, and whether completion propagates anywhere.
22. How action-item assignment is chosen — a dropdown of invitees, a free-text field, or both.
23. Whether action items can be reordered or filtered by assignee.
24. Whether the summary can be edited inline, or only regenerated.

### States

25. **Empty state** — what a brand-new account with zero calls shows. No public evidence.
26. **Processing state** — what the call page shows between meeting end and summary ready, and how
    long that takes. Marketing says "instantly"; that is not a measurement.
27. **Error state** — a failed transcription, or a call where the bot did not join.
28. **Long content** — an hour-long, eight-speaker call. No public screenshot of one exists.
29. Loading skeletons anywhere in the product.
30. What a trimmed call looks like afterwards — whether the removed span leaves a visible seam in
    the transcript.

### Sharing

31. **What a valid share link renders to an unsigned visitor** — the whole of it: header, tabs,
    whether action items and highlights appear, whether there is a Fathom CTA, whether a "Limited
    access" banner appears, whether the video is downloadable.
32. Whether the share page is server-rendered (for link previews / SEO) or an SPA behind a token
    fetch.
33. Whether there is an OpenGraph preview card for a shared call.
34. What a *revoked* share link renders — distinct from the bare 404 I saw for a never-valid token.
35. Whether comments are visible to link visitors, and whether an unsigned visitor can add one.
36. What a shared **highlight clip** link renders versus a full-call share link.

### Other

37. The plan-by-plan tick matrix on the pricing page — the glyphs did not survive text extraction.
38. Whether keyword/attendee search is a single field or a filter panel, and what facets exist.
39. Real latency of anything. I measured nothing about the product.
40. Accessibility of any product surface. Explicitly deferred by the plan and not attempted.
41. Whether "questions" (referenced in the share help copy) is a distinct first-class entity. It
    does not appear anywhere in the OpenAPI spec, so it may be legacy copy for a removed feature.

---

## 8. Answers to the plan's six questions

### 1. What single screen makes Fathom feel valuable?

`[ASSUMED]` **The single-call review screen** — recording plus a tabbed SUMMARY/TRANSCRIPT rail,
with action items inside the summary rail and every item timestamp-anchored to the recording. The
vendor's own framing for the 3.0 redesign is "a unified post-meeting workspace means your summary,
transcript, and action items are all exactly where you expect them – without bouncing between
tabs", which is as close to a statement of intent as they publish.

What makes it *feel* valuable rather than merely useful, `[ASSUMED]`, is that **every generated
artefact is clickable back into the source moment**. The AI output is never a dead block of text;
it is an index into a recording. A clone that generates a perfect summary but cannot jump from a
bullet to 56:39 will feel like a worse product even if the text is identical.

The list screen is secondary but not skippable — it is what proves the product has memory.

### 2. Minimum data model behind it?

`[ASSUMED]`, grounded in the published OpenAPI spec (section 6):

    meeting(id, title, meeting_title, meeting_type, started_at, ended_at,
            scheduled_start, scheduled_end, duration_s, language,
            recording_url, share_token, share_scope, owner_id)
    speaker(id, meeting_id, display_name, matched_invitee_email NULL, colour_index)
    transcript_segment(id, meeting_id, speaker_id, start_s, end_s, text)
    summary(meeting_id, template_name, markdown)
    action_item(id, meeting_id, description, assignee_name NULL, assignee_email NULL,
                timestamp_s, completed BOOL, user_generated BOOL)
    invitee(id, meeting_id, name, email, email_domain, is_external, matched_speaker_id NULL)

An optional seventh table for a visible differentiator:
`highlight(id, meeting_id, type, summary, start_s, end_s)`.

Three design points worth copying deliberately:

- store timestamps in **seconds** internally and format to HH:MM:SS at the edge. Fathom returns
  HH:MM:SS for transcript and action items but float seconds for highlights — pick one, seconds.
- keep **scheduled** and **actual** start/end as separate columns.
- make the speaker-to-invitee link **nullable in both directions**.

### 3. How does it stay usable at hour-long, eight-speaker scale?

`[UNKNOWN]` — **I have no evidence.** No public screenshot of a long, many-speaker call exists and
I could not load one. What I can offer is what the model and the copy imply, labelled `[ASSUMED]`:

- The summary is the default tab, so the hour of transcript is *opt-in*. You read ~400 words, not
  9,000. That is the main scaling move and it is a product decision, not an engineering one.
- Highlights (a `type` label plus an AI one-line `summary` plus a span) give a second, shorter
  index — a layer between the summary and the raw transcript.
- Action items collapse the call to a handful of rows, each with its own jump link.
- `[MARKETING]` Speaker attribution quality is a stated selling point ("multiple speakers, accents,
  cross-talk, languages, and side conversations"), and the model's nullable speaker-to-invitee join
  concedes that attribution degrades.
- `[MARKETING]` For the *list* at scale: infinite scroll with a loading indicator, time-bucket
  headings ("Last Week", "August"), and short per-call summaries in the desktop list "making it
  easy to skim calls to find exactly what you're looking for".
- `[MARKETING]` Fathom has had real performance trouble here: a March 2026 release note records
  that leaving the My Calls page open too long "would sometimes cause Chrome to crash".

`[ASSUMED]` The honest lesson for our build: **summary-first with a collapsed transcript is what
makes an hour tolerable.** Virtualised rendering and sticky speaker headers are the implementation
details that keep it from stuttering.

### 4. What does a shared link show an unsigned visitor?

`[MARKETING]` Fathom's claim: no account needed; the link carries "the video, transcript, and any
associated questions"; link scope is one of *anyone with the link / anyone on the domain / only
people added*; a recipient added explicitly gets a role of Limited, Standard or Admin, where
**Limited** sees transcript, summary and recording but not the sharing details. On a Team Plan,
same-domain sign-in may be required depending on org settings.

`[OBSERVED]` An invalid share token returns HTTP 404 with an empty body and a blank white page. No
branded error.

`[UNKNOWN]` **What a valid share link actually renders, I do not know** — see items 31–36. I could
not find a single publicly posted Fathom share URL. This is the highest-value gap in the whole
report and the first thing to capture in option C.

### 5. Where is it weak or slow?

Weaknesses Fathom documents about itself. These are `[MARKETING]` in provenance but they are
admissions against interest, so they are unusually trustworthy:

- **Transcripts cannot be downloaded.** Copy-to-clipboard only (article 296000). MP3 audio download
  is also unavailable (article 7974977).
- **Trimming is irreversible** and requires emailing support to attempt a restore; it is entirely
  unsupported for audio-only calls (article 295744).
- **Company attribution is heuristic with no manual override** — "Multiple external domains can
  produce imperfect attribution, and manual override isn't currently available in the UX" (13115841).
- **Ask Fathom keeps no history** — "once you exit the call recording view, your previous search
  results will be lost" (3239425). A conversational assistant that forgets on navigation.
- **Account-wide Ask Fathom excludes deal data, scorecards and trackers** (3239425).
- **Shares cannot be unsent**, only revoked — and revocation does nothing if the link scope is
  "anyone with the link" (7574785).
- **Capability is fragmented across surfaces.** Summary customization is web-only and not in the
  new desktop app; search is "coming soon" to the desktop app; bot-free video is a Mac/Zoom-only
  beta. The same product does different things depending on where you open it.
- **Speaker-to-attendee matching is nullable and only exists for meetings after Feb 2025.**
- **Known performance history**: a fixed-but-telling Chrome crash on a long-open call list.
- `[OBSERVED]` **No branded 404 for a bad share link** — a blank white page.
- `[MARKETING]` Dark mode appears to be the only mode (FAQ 7574145 exists and opens "We've heard
  this request…").
- `[MARKETING]` Action items and Ask Fathom are **paywalled** at Premium. A free user gets a summary
  and no extracted to-dos.

`[UNKNOWN]` Anything about actual speed. I measured nothing.

`[ASSUMED]` Our openings, in order of effort-to-payoff: a real transcript export; designed
empty/processing/error/revoked-link states; visible, obviously-correct speaker handling *including*
the failure case; and click-to-seek that is unmistakable (active-line highlighting, scroll
coupling) rather than merely present.

### 6. What is out of reach in 24h, and the honest substitute?

| Out of reach | Honest substitute |
|---|---|
| Real meeting capture — a bot joining Zoom/Meet/Teams, or bot-free device-audio capture | Upload an audio/video file, or ship a small set of seeded fixture meetings. Say plainly in the README that capture is stubbed. |
| Production ASR with diarisation at Fathom's claimed accuracy | An off-the-shelf transcription API on an uploaded file, or pre-transcribed fixtures. Do not claim accuracy we have not measured. |
| Calendar integration, auto-share, attendee sync | A manual attendee list on the meeting record. The Invitee entity still exists; it is just hand-entered. |
| CRM sync, Deals, Coaching, AI Scorecards, Trackers | Out of scope. Named as deferred, not attempted. |
| Account-wide Ask Fathom across a corpus | At most single-meeting Q&A over one transcript. Cheaper and demos just as well. |
| Teams, folders, playlists, comments, three-tier roles | One owner plus a public/private share link. Two states, not nine. |
| Real-time / live summaries | Post-hoc only. |

`[ASSUMED]` The 24-hour build that is defensible: **the single-call review screen, done properly** —
player, speaker-attributed transcript with working click-to-seek and active-line tracking, a
templated summary, checkable timestamp-anchored action items, and a public share link whose
unsigned view is deliberately designed (including its empty, long-content and revoked states).
That is one screen and six tables, and it is the screen that carries the product.

---

## 9. Implications for our build

1. **Build the review screen first and the list second.** The list only needs to exist well enough
   to reach the review screen and to prove more than one meeting can exist.
2. **Seconds are the spine.** Every generated artefact — summary section, action item, highlight —
   should carry an anchor in seconds and be clickable. Design the player API for this on day one;
   retrofitting seek is where clones fall down.
3. **Summary-first, transcript-on-demand.** This is the scale answer. Do not open on the transcript.
4. **Model attendee and speaker separately, with a nullable join** — then actually show the failure
   case in the UI. An unmatched speaker rendered honestly is more convincing than a fake-perfect one.
5. **Design the states Fathom neglects.** Empty account, processing, failed transcription, revoked
   share link, hour-long transcript. Fathom ships a blank white 404; a designed state is a cheap,
   visible win, and the `verify-slice` skill will ask for exactly these.
6. **Make the unsigned share view a first-class screen, not a degraded one.** It is the surface a
   reviewer is most likely to click.
7. **Ship transcript export.** One line of code and a documented Fathom gap.
8. **Do not claim capture works.** State in the README that capture is stubbed and that the
   transcript came from an upload or a fixture.

---

## 10. Competitor skim — Granola (granola.ai), ~12 minutes

All `[MARKETING]` — marketing site and pricing page only, no account, no app installed.

**The core difference: Granola has no recording.** Its pricing comparison table lists
"**Audio deleted after transcription**" as an included feature on every plan. There is no video, no
playback, no timeline. Fathom's review experience is an *index into a recording*; Granola's is a
*document*.

**Notes-first, not transcript-first.** The pitch is "The AI notepad for back-to-back meetings" —
"Write down as much or as little as you like - Granola uses meeting context to write clear notes,
personal to you." The user's own typed notes are the spine; the AI *enhances* them rather than
replacing them. The landing-page mock shows a document with a title, a date, an attendee count and
prose sections with nested bullets ("ICP Alignment Confirmation", "Deal Stalls: Sales Input", "Next
Steps"). It reads like a page in Notion, not like a call record.

**Three-phase framing.** Before the meeting, a **Brief** (who is attending, what you discussed last
time, what is still open — Business plan and up). During, a free-form notepad. After, notes, action
items and follow-ups ready at meeting end, with one-click "List actions / Write follow-up email /
Draft project plan".

**Bot-free by construction.** "Uses your computer audio, so doesn't invite a bot" — Granola's
founding constraint, whereas for Fathom bot-free is a 2026 addition alongside the bot.

**Private by default.** "Your notes are just for you… then send them as you like." Fathom's default
gravity is the opposite: team libraries, auto-share to calendar attendees, org visibility settings.

**Pricing** $0 / $14 / $35 per user per month. The free tier's gate is **30 days of history**, not
feature removal — notes are unlimited, you just lose access to the old ones. Contrast Fathom, which
gives unlimited retention free and paywalls *action items*.

### What this means for us `[ASSUMED]`

- Granola proves a review screen can be valuable **with no media at all**. If our capture stub makes
  playback awkward, a notes-first, document-shaped review screen is a legitimate design rather than
  a cop-out — but we should then commit to it rather than shipping a broken player.
- Conversely, if we do ship playback, **click-to-seek is the entire reason to choose the Fathom
  model over the Granola model.** It has to work.
- Granola's "your notes beside the AI notes" is a genuinely different primitive and the clearest
  thing Fathom's post-meeting view lacks. A user-notes column next to the AI summary would be a
  visible, cheap differentiator.
- Both products have converged on MCP/LLM export. Neither treats it as the review screen's job.

`[UNKNOWN]` Granola's actual app UI, its share view, whether its notes link back to transcript
positions, and whether a transcript is even exposed to the user. I did not install it and there is
no web app to load.

---

## 11. Sources

Vendor (Fathom):

- <https://fathom.ai> · <https://fathom.video/pricing> · <https://www.fathom.ai/overview> ·
  <https://www.fathom.ai/whats-new>
- <https://fathom.video/home> — the sign-in wall, `[OBSERVED]`
- Help centre articles, all at `https://help.fathom.video/en/articles/<id>`: 7573185 (find your
  calls), 295616 (sharing call recordings), 296128 (client needs no account), 7574785 (auto-share),
  3239809 (customizing AI summaries), 295680 (post-call highlights), 296000 (copy transcript),
  295744 (trimming calls), 6331521 (copy for Asana), 3239425 (using Ask Fathom), 11497793 (Fathom
  MCP), 8368641 (public API), 13115841 (company matching), 6220097 (release notes), 11578049
  (coming soon to 3.0)
- API docs: <https://developers.fathom.ai> · <https://developers.fathom.ai/llms.txt> ·
  <https://developers.fathom.ai/api-reference/openapi.yaml>
- Vendor screenshots viewed, all under
  `https://usw2.frontkb-cdn.com/attachments/5508513/20480/`:
  `478055fe-6ce6-45a5-911d-735938b78b84.png` (My Calls top bar and grid),
  `cef25399-d425-4940-ab65-1b16e2e9327c.png` (full tab strip and call cards),
  `e8a9c3fc-4bff-459b-b2ca-dd1e7bba5cbe.png` and `61e86899-a776-4c4f-b1ab-066f48c95d9d.png`
  (Share Recording modal and link-scope menu),
  `93826dbc-ffd3-44bd-a217-587910281f2a.png` (transcript per-block menu),
  `8b3e7023-c38a-4305-8f52-a3e199c2a740.png` (highlight bracket on chat-bubble transcript),
  `831ec0f3-f7d8-4d94-87d5-6bdaf1cf1847.png` (SUMMARY/TRANSCRIPT tabs, template picker, Customize
  gear), `00580fab-c482-447b-8af8-75be20224c61.png` (ACTION ITEMS block and Copy-for menu)

Third-party:

- <https://www.bluedothq.com/blog/fathom-review> · <https://zapier.com/blog/fathom-features/>

Granola:

- <https://www.granola.ai> · <https://www.granola.ai/pricing>
