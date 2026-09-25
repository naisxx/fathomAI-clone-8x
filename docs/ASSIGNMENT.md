# Assignment

The verbatim brief, received 2026-09-25 (late — the build was carried out against
a summary of it, which is itself recorded in the agent logs).

---

## The brief, verbatim

> Rebuild a live product in 24 hours. Better than the original if you want.
> That window is deliberately generous and we do not expect you to use all of it.
> The clock is tracked, never enforced.
>
> **The product**
> [fathom.video](https://fathom.video/) — the AI meeting notetaker.
>
> Start by using it. Sign up on the free plan and go through the flows properly,
> every one of them, end to end. Take screenshots as you go. Understand the
> product fully before you write any code.
>
> At minimum that means: connect a calendar, get the notetaker into a real meeting
> (a two-minute call with yourself on Zoom, Meet or Teams is enough), let it
> record, then live with what comes out the other side. Watch the playback against
> the transcript. Read the AI summary, switch templates, pull the action items.
> Highlight a moment mid-call and see where it lands. Search across meetings.
> Share a clip with someone who was not on the call. Then look at what happens on
> an eight-person call that runs an hour, because that is the case that actually
> matters.
>
> You do not have to make the recording bot work. Faking or stubbing the capture
> layer is a legitimate call — say so in the walkthrough and spend the time on what
> you decided matters more.
>
> **Before you write anything**
> Run through this so your agent captures its prompts and responses into the
> repository: 8x agent capture setup. It takes about ten minutes. Do not start
> building until the capture test passes, and commit the `.agent-logs/` directory
> as you go rather than in one lump at the end.
>
> **What you hand in**
> - A live link. Deployed and open, not a localhost recording.
> - A public repository. With `.agent-logs/` committed in it.
> - A walkthrough. Loom or anything similar, five minutes at most, camera on. Put
>   it in the walkthrough field.
>
> Paste the live link and the repository into the links field, and label each one.
> Seed it with real data. An empty meetings list tells us nothing about what you
> built.
>
> **How it is judged**
> - Speed. How much working product you got to in the time.
> - Product judgement. What you chose to build first, and what you left out.
> - UX and UI. Whether the thing you shipped is good to use.
>
> **Before you send it**
> - The live link opens for somebody who is not signed in as you.
> - The repository is public, and `.agent-logs/` is in it.
> - Your camera is on in the walkthrough, and it is under five minutes.

---

## Deliverables — status

| | Status |
|---|---|
| Live link, deployed and open | **Done** — <https://fathom-ai-clone-8x.vercel.app/> verified loading unauthenticated |
| Public repository with `.agent-logs/` | **Done** — `naisxx/fathomAI-clone-8x`, `private: false`, 5 log files visible unauthenticated |
| Walkthrough, ≤5 min, camera on | **Outstanding** — script at [WALKTHROUGH.md](WALKTHROUGH.md); recording is the author's |
| Seeded with real data | **Done** — 5 meetings, one real recording + four seeded |
| Links field, each labelled | **Outstanding** — author's to submit |

## The research instruction — honest scorecard

The brief asks for **every flow, end to end, before writing code**. That is the
requirement this submission met least well. Recorded here rather than glossed,
because the gap shaped what got built.

| Flow the brief names | Done? | Note |
|---|---|---|
| Connect a calendar | **No** | Never attempted |
| Notetaker into a real meeting, let it record | **Yes** | 44-second Google Meet call |
| Watch playback against the transcript | **Partly** | Transcript copied out; never watched in sync inside Fathom |
| Read the AI summary | **No** | Fathom refused — "Meeting too short to generate a summary" |
| Switch templates | **No** | Picker observed (16 templates); none applied — all but one appear plan-gated |
| Pull the action items | **No** | Fathom detected none in 44 seconds |
| Highlight a moment mid-call | **No** | Never exercised. The brief names it explicitly |
| Search across meetings | **No** | Search box observed, never used |
| Share a clip with a non-attendee | **Partly** | Done *after* the build started, not before. The **Share Recording** dialog and the resulting link opened in a real incognito window were both observed — [`SHARE-FLOW-OBSERVED.md`](research/SHARE-FLOW-OBSERVED.md). No **clip** was shared: the free-plan dialog offered link scope only, with no time-range control |
| Eight-person call running an hour | **No** | Never attempted. The brief calls this "the case that actually matters" |

**Why:** the call was cut short for time, and the follow-up checks (a 5–6 minute
call with spoken commitments, and a share link opened in a private window) were
planned, scoped, and then skipped under deadline pressure. The share check was
later carried out — but after the build had started, which is the thing the brief
asked not to do, so it is scored as *Partly* rather than promoted to *Yes*.

**Consequence:** the build leaned on Fathom's **published OpenAPI schema** and
help centre instead of on observed behaviour. That turned out to be a strong
substitute for the *data model* — it is a machine contract, not marketing — but it
is no substitute for knowing how the product *feels* at eight speakers and an
hour, which is exactly the case the brief singles out.

## Stubbing the capture layer

The brief permits it: "Faking or stubbing the capture layer is a legitimate call
— say so in the walkthrough." This build goes further than stubbing: there is **no
recording bot at all**, and the app says so in the footer, the README and the
walkthrough script. The time went into the post-meeting review experience.
