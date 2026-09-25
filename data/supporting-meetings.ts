import type { Meeting, TranscriptItem } from "@/lib/types";

/**
 * Supporting seeded meetings. Each earns its place by exercising a state the
 * two main meetings do not: a second search target, an external participant,
 * and a genuinely empty action-items list.
 *
 * All synthetic. All labelled.
 */

type Turn = [number, string, string];

function build(turns: Turn[], durationSec: number, emails: Record<string, string | null>): TranscriptItem[] {
  return turns.map(([start, speaker, text], i) => ({
    speakerDisplayName: speaker,
    matchedInviteeEmail: emails[speaker] ?? null,
    text,
    startSec: start,
    endSec: turns[i + 1] ? turns[i + 1][0] : durationSec,
  }));
}

const designEmails = {
  "Elena Fischer": "elena.fischer@northwind.dev",
  "Ravi Chandrasekaran": "ravi.c@northwind.dev",
  "Marcus Webb": "marcus.webb@northwind.dev",
};

export const designSync: Meeting = {
  id: "design-sync-export-flow",
  title: "Design Sync — Export Flow",
  meetingType: "One-on-One",
  scheduledStart: "2026-09-23T13:30:00.000Z",
  durationSec: 1440,
  transcriptLanguage: "en",
  shareToken: "dsgn24",
  recordedBy: "Elena Fischer",
  source: "seeded",
  mediaKind: "simulated",
  timingProvenance: "authored",
  provenanceNote:
    "Seeded demo data. No recording exists; playback runs on a simulated clock.",
  invitees: [
    { name: "Elena Fischer", email: "elena.fischer@northwind.dev", emailDomain: "northwind.dev", isExternal: false, matchedSpeakerDisplayName: "Elena Fischer" },
    { name: "Ravi Chandrasekaran", email: "ravi.c@northwind.dev", emailDomain: "northwind.dev", isExternal: false, matchedSpeakerDisplayName: "Ravi Chandrasekaran" },
    { name: "Marcus Webb", email: "marcus.webb@northwind.dev", emailDomain: "northwind.dev", isExternal: false, matchedSpeakerDisplayName: "Marcus Webb" },
  ],
  summary: {
    templateName: "Enhanced",
    markdown: `## Summary

The export rework was scoped down to **CSV and JSON only** for Q4, with PDF deferred. The blocking question was whether exports run synchronously or as background jobs; the decision was **background jobs with an email link**, because synchronous export times out on the largest accounts.

## Open question

Whether export respects the viewer's column preferences or always exports the full schema. Ravi to prototype both.`,
  },
  actionItems: [
    { id: "ds-1", description: "Prototype column-filtered vs full-schema export and compare with two enterprise datasets", assignee: "Ravi Chandrasekaran", timestampSec: 610, completed: false, userGenerated: false },
    { id: "ds-2", description: "Confirm the background-job queue can absorb export load without affecting checkout", assignee: "Marcus Webb", timestampSec: 900, completed: false, userGenerated: false },
  ],
  ask: [
    {
      question: "What was settled about export scope?",
      answer:
        "PDF was cut. CSV and JSON ship in Q4 and PDF becomes its own project if it is scoped properly at all — Ravi's point being that branded PDF export is a different project wearing the same name. The synchronous-versus-background question answered itself: the largest account has around four million rows, which no synchronous request survives whatever timeout is chosen.",
      citations: [240, 450],
    },
    {
      question: "What is still open?",
      answer:
        "Whether export respects the column preferences set in the table view or always exports the full schema. Ravi said he was genuinely unsure and is prototyping both rather than arguing it out. One design decision was made to avoid two code paths: everything runs as a background job, but a fast completion hands the file over directly so small exports still feel synchronous.",
      citations: [700, 1120],
    },
  ],
  transcript: build(
    [
      [15, "Elena Fischer", "The thing I want to settle today is scope, because export has been quietly growing since we wrote the original ticket."],
      [120, "Ravi Chandrasekaran", "It has. We started with CSV and now there's a line item for PDF with custom branding, which is a different project wearing the same name."],
      [240, "Elena Fischer", "Then let's cut PDF. CSV and JSON for Q4, and PDF becomes its own thing that we scope properly or not at all."],
      [360, "Marcus Webb", "I'd support that. The other question is synchronous versus background, and I think it's already answered for us."],
      [450, "Marcus Webb", "The largest account has roughly four million rows. There is no synchronous request that survives that, whatever timeout we pick."],
      [540, "Elena Fischer", "So background job, email a link when it's ready. That's a worse experience for small exports though — waiting for an email to download two hundred rows is silly."],
      [610, "Ravi Chandrasekaran", "We could branch on row count, but then there are two code paths and two sets of bugs. I'd rather do one thing properly."],
      [700, "Elena Fischer", "Agreed. Background for everything, but if it completes in under a few seconds we just hand them the file directly and skip the email."],
      [790, "Ravi Chandrasekaran", "That I can do. One path, with a fast case that feels synchronous."],
      [900, "Marcus Webb", "I'll check the queue has headroom. I don't want export jobs competing with checkout during a peak."],
      [1010, "Elena Fischer", "Last one: does export respect the column preferences someone has set in the table view, or is it always the full schema?"],
      [1120, "Ravi Chandrasekaran", "Genuinely unsure. I'll prototype both and we can look at real data rather than argue about it."],
      [1260, "Elena Fischer", "Good. That's the useful version of this meeting."],
    ],
    1440,
    designEmails
  ),
};

const customerEmails = {
  "Priya Raghunathan": "priya.raghunathan@northwind.dev",
  "Johanna Brecht": "j.brecht@meridian-logistics.com",
};

export const customerCall: Meeting = {
  id: "meridian-quarterly-check-in",
  title: "Meridian Logistics — Quarterly Check-in",
  meetingType: "Customer Success",
  scheduledStart: "2026-09-24T15:00:00.000Z",
  durationSec: 1080,
  transcriptLanguage: "en",
  shareToken: "mrdn18",
  recordedBy: "Priya Raghunathan",
  source: "seeded",
  mediaKind: "simulated",
  timingProvenance: "authored",
  provenanceNote:
    "Seeded demo data. No recording exists; playback runs on a simulated clock.",
  invitees: [
    { name: "Priya Raghunathan", email: "priya.raghunathan@northwind.dev", emailDomain: "northwind.dev", isExternal: false, matchedSpeakerDisplayName: "Priya Raghunathan" },
    { name: "Johanna Brecht", email: "j.brecht@meridian-logistics.com", emailDomain: "meridian-logistics.com", isExternal: true, matchedSpeakerDisplayName: "Johanna Brecht" },
  ],
  summary: {
    templateName: "Customer Success",
    markdown: `## Summary

Meridian are broadly happy but raised **export** twice unprompted, which matches what the roadmap discussion assumed. They are not blocked, but they are working around it with a manual process that costs them a day a month.

## Risk

Renewal is in February. Export landing in Q4 is not contractual, but it was discussed in the last renewal and they remember it.`,
  },
  actionItems: [
    { id: "cc-1", description: "Send Meridian written confirmation of the Q4 export timeline", assignee: "Priya Raghunathan", timestampSec: 720, completed: false, userGenerated: false },
  ],
  ask: [
    {
      question: "What is the risk on this account?",
      answer:
        "Export. Meridian raised it unprompted and are working around it manually — roughly a day a month across the team. They are not blocked and have stopped complaining, which is the risk rather than the reassurance: they stopped because they assumed it was coming. Renewal is in February and export was discussed in the last renewal conversation.",
      citations: [380, 860],
    },
  ],
  transcript: build(
    [
      [20, "Priya Raghunathan", "Thanks for making the time. I want to spend most of this on what isn't working rather than what is."],
      [140, "Johanna Brecht", "Honestly, most of it is working. The reliability has been noticeably better this quarter from our side, whatever you changed."],
      [260, "Priya Raghunathan", "That's good to hear, though I'd note internally we don't think we've earned it yet."],
      [380, "Johanna Brecht", "The one thing that still costs us is getting data out. My team exports to a spreadsheet by hand roughly once a week."],
      [500, "Priya Raghunathan", "How long does that take them?"],
      [560, "Johanna Brecht", "Call it a day a month across the team. It's not a crisis, it's just friction that we've stopped complaining about because we assumed it was coming."],
      [720, "Priya Raghunathan", "It is coming, and it's in Q4. I'd rather put that in writing than say it on a call."],
      [860, "Johanna Brecht", "That would help. It came up in the last renewal conversation and I've been asked about it since."],
      [980, "Priya Raghunathan", "Understood. You'll have something from me this week."],
    ],
    1080,
    customerEmails
  ),
};

const standupEmails = {
  "Marcus Webb": "marcus.webb@northwind.dev",
  "Tobias Lund": "tobias.lund@northwind.dev",
  "Aisha Okonkwo": "aisha.okonkwo@northwind.dev",
  "Ravi Chandrasekaran": "ravi.c@northwind.dev",
  "Daniel Reyes": "daniel.reyes@northwind.dev",
};

export const standup: Meeting = {
  id: "platform-standup",
  title: "Platform Standup",
  meetingType: "Stand Up",
  scheduledStart: "2026-09-25T09:05:00.000Z",
  durationSec: 240,
  transcriptLanguage: "en",
  shareToken: "stnd05",
  recordedBy: "Marcus Webb",
  source: "seeded",
  mediaKind: "simulated",
  timingProvenance: "authored",
  provenanceNote:
    "Seeded demo data. No recording exists; playback runs on a simulated clock.",
  invitees: [
    { name: "Marcus Webb", email: "marcus.webb@northwind.dev", emailDomain: "northwind.dev", isExternal: false, matchedSpeakerDisplayName: "Marcus Webb" },
    { name: "Tobias Lund", email: "tobias.lund@northwind.dev", emailDomain: "northwind.dev", isExternal: false, matchedSpeakerDisplayName: "Tobias Lund" },
    { name: "Aisha Okonkwo", email: "aisha.okonkwo@northwind.dev", emailDomain: "northwind.dev", isExternal: false, matchedSpeakerDisplayName: "Aisha Okonkwo" },
    { name: "Ravi Chandrasekaran", email: "ravi.c@northwind.dev", emailDomain: "northwind.dev", isExternal: false, matchedSpeakerDisplayName: "Ravi Chandrasekaran" },
    { name: "Daniel Reyes", email: "daniel.reyes@northwind.dev", emailDomain: "northwind.dev", isExternal: false, matchedSpeakerDisplayName: "Daniel Reyes" },
  ],
  summary: {
    templateName: "Stand Up",
    markdown: `## Summary

Short status round. Service eight retries are down after yesterday's pool change. The schema rollback rehearsal is scheduled. No blockers raised.`,
  },
  actionItems: [],
  actionItemsAbsentReason:
    "No action items were detected in this meeting, and none were added manually.",
  ask: [],
  transcript: build(
    [
      [10, "Marcus Webb", "Quick round. Service eight retries dropped about forty percent overnight after the connection pool change, so that's holding."],
      [55, "Tobias Lund", "Nothing paged over night. First clean night in about ten days."],
      [95, "Aisha Okonkwo", "Rollback rehearsal is booked for Thursday. I'll need someone from platform in the room."],
      [135, "Marcus Webb", "I'll be there."],
      [150, "Ravi Chandrasekaran", "Export prototype is half done. Nothing to show yet, nothing blocking."],
      [190, "Daniel Reyes", "Dependency patch is merged and out. No blockers."],
      [220, "Marcus Webb", "That's it, thanks all."],
    ],
    240,
    standupEmails
  ),
};
