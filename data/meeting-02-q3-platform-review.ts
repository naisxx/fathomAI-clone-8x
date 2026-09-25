import type { Meeting, TranscriptItem } from "@/lib/types";

/**
 * THE SEEDED SCALE MEETING - entirely synthetic.
 *
 * No part of this was recorded. It exists to prove one thing the 44-second real
 * recording cannot: that the interface stays navigable across a long meeting
 * with eight speakers.
 *
 * Two speakers are deliberately left unmatched ("Speaker 7", "Speaker 8"). That
 * is not an oversight - Fathom's own API marks speaker-to-invitee matching
 * nullable with "Null if no exact match found", so a clone that always matches
 * would be modelling something the real product doesn't do.
 *
 * Content is written to be substantive rather than padded: a real agenda that
 * moves, decisions the summary points at, and action items anchored to the
 * moment they were agreed.
 */

const SPEAKERS = {
  priya: "Priya Raghunathan",
  marcus: "Marcus Webb",
  elena: "Elena Fischer",
  tobias: "Tobias Lund",
  aisha: "Aisha Okonkwo",
  daniel: "Daniel Reyes",
  /** Dial-in participants diarisation could not tie to a calendar invitee. */
  s7: "Speaker 7",
  s8: "Speaker 8",
} as const;

const EMAIL: Record<string, string | null> = {
  [SPEAKERS.priya]: "priya.raghunathan@northwind.dev",
  [SPEAKERS.marcus]: "marcus.webb@northwind.dev",
  [SPEAKERS.elena]: "elena.fischer@northwind.dev",
  [SPEAKERS.tobias]: "tobias.lund@northwind.dev",
  [SPEAKERS.aisha]: "aisha.okonkwo@northwind.dev",
  [SPEAKERS.daniel]: "daniel.reyes@northwind.dev",
  [SPEAKERS.s7]: null,
  [SPEAKERS.s8]: null,
};

/** [startSec, speaker, text] - endSec is derived from the next line. */
type Turn = [number, string, string];

const TURNS: Turn[] = [
  [8, SPEAKERS.priya, "Right, let's start. Sixty minutes, four things to get through, and I want decisions on all four rather than another round of discussion. Reliability, the migration, the data backlog, and then cost."],
  [26, SPEAKERS.priya, "Tobias, reliability first. You sent the numbers round last night and I don't think everyone will have read them."],
  [38, SPEAKERS.tobias, "Fair assumption. Headline is that we burned sixty-one percent of the error budget in Q3, against forty percent the quarter before. That is a real deterioration, not noise."],
  [56, SPEAKERS.tobias, "Three incidents account for almost all of it. The checkout timeout in July, the queue backlog in August, and the certificate expiry two weeks ago."],
  [74, SPEAKERS.marcus, "The certificate one is the embarrassing one. That was entirely preventable and we had an alert for it that nobody owned."],
  [88, SPEAKERS.tobias, "Agreed, and I'd rather we said that plainly. It wasn't a hard failure to predict. The alert fired into a channel that three people had muted."],
  [104, SPEAKERS.priya, "So what's the fix? And I mean the structural fix, not 'unmute the channel'."],
  [116, SPEAKERS.tobias, "Every alert gets a named owner and a paging policy, or it gets deleted. If nobody will own it, it isn't an alert, it's noise, and we should stop pretending otherwise."],
  [136, SPEAKERS.daniel, "I'd support that. We have roughly four hundred alert rules and I would guess a third of them have never been actioned by anyone."],
  [152, SPEAKERS.tobias, "It's closer to half. I ran the numbers on Tuesday."],
  [160, SPEAKERS.priya, "Do it. Audit the lot, delete anything unowned, and bring me the count in two weeks. Tobias owns that."],
  [176, SPEAKERS.s7, "Can I ask about the checkout timeout? Was that the same root cause as the one in May, or a different path through the same service?"],
  [192, SPEAKERS.marcus, "Different path, same underlying problem. We have a connection pool that's sized for average load and we keep being surprised by peak."],
  [208, SPEAKERS.marcus, "Which brings me to the migration, because that's what the migration is supposed to fix."],
  [220, SPEAKERS.priya, "Go ahead. This is the one I most want a decision on."],
  [230, SPEAKERS.marcus, "We're eleven weeks in on a plan that said fourteen. Services one through six are migrated and stable. Seven and eight are migrated but I wouldn't call them stable yet."],
  [248, SPEAKERS.marcus, "Nine through twelve haven't started, and four of those are the ones with the messiest data access patterns."],
  [262, SPEAKERS.elena, "What does 'wouldn't call them stable' mean in practice? Is that a customer-visible thing or an on-call quality-of-life thing?"],
  [278, SPEAKERS.marcus, "Right now it's on-call. Elevated error rates that retry successfully. But it's the kind of thing that becomes customer-visible the first busy week we have."],
  [296, SPEAKERS.tobias, "I'd back that up. Two of my last four weekend pages came from service eight."],
  [308, SPEAKERS.priya, "So the honest position is we're three weeks behind and the tail is the hard part."],
  [320, SPEAKERS.marcus, "The honest position is we're three weeks behind on the easy two-thirds, and the remaining third is harder than what we've done so far. I don't want to pretend otherwise."],
  [340, SPEAKERS.elena, "Then I think we have to talk about what comes out of the roadmap, because I've been telling customers the export rework lands in Q4."],
  [356, SPEAKERS.priya, "Which customers, and how firmly?"],
  [364, SPEAKERS.elena, "Two enterprise accounts, and firmly enough that it's in a renewal conversation. Not contractual, but not deniable either."],
  [382, SPEAKERS.s8, "Sorry, joining late. Is the suggestion that we stop the migration, or that we slow it down?"],
  [394, SPEAKERS.marcus, "Neither, I hope. Stopping halfway is the worst of both worlds. We'd be running two architectures with the operational cost of both."],
  [412, SPEAKERS.priya, "I agree with that and I want to be unambiguous: we finish the migration. The question is only what we drop to protect it."],
  [428, SPEAKERS.elena, "Then my proposal is we drop the analytics refresh from Q4 and keep the export rework. Analytics has no external commitment attached to it."],
  [446, SPEAKERS.aisha, "That has a knock-on for my team, because half the data backlog exists to feed analytics."],
  [458, SPEAKERS.priya, "Good segue. Let's do the data backlog now and come back to the roadmap at the end."],
  [470, SPEAKERS.aisha, "The backlog is thirty-one open items. Eleven are genuinely blocking someone, and the rest are things we wrote down and never prioritised."],
  [488, SPEAKERS.aisha, "Of the eleven, six are schema changes that need a migration window, and those are the ones I want to talk about."],
  [504, SPEAKERS.aisha, "We can do all six in one window, or dribble them out over the quarter. One window is less total risk but it's a bigger single bet."],
  [522, SPEAKERS.marcus, "One window, and do it before service nine moves. If we do it after, we'll be migrating schemas and services at the same time."],
  [538, SPEAKERS.tobias, "I'd want a rollback plan that we've actually rehearsed, not one that exists in a document."],
  [552, SPEAKERS.aisha, "That's fair and I'll be honest, the rollback plan is currently a document. I'd need a week to make it real."],
  [568, SPEAKERS.priya, "Take the week. Aisha, put the six schema changes in one rehearsed window before service nine starts."],
  [584, SPEAKERS.aisha, "Understood. I'll have the window date by Friday."],
  [594, SPEAKERS.priya, "Daniel, security. You flagged something on Monday that sounded urgent and then went quiet."],
  [608, SPEAKERS.daniel, "It became less urgent once I understood it, which is the usual shape of these things. The scanner flagged a dependency with a critical CVE in our image."],
  [626, SPEAKERS.daniel, "It's real, but the vulnerable code path isn't reachable from how we use the library. So it's a patch-this-sprint problem, not a stop-everything problem."],
  [644, SPEAKERS.marcus, "Do we have a way of knowing that reliably, or did you work it out by hand?"],
  [656, SPEAKERS.daniel, "By hand, which is the actual finding. We have no reachability analysis, so every critical CVE costs someone a day of investigation."],
  [674, SPEAKERS.daniel, "I'd like budget for a tool that does this properly. It's roughly the cost of one engineer-week per quarter in licence terms, and it's currently costing us more than that in investigation."],
  [694, SPEAKERS.s7, "Is that a per-seat cost or per-repository? Because the last tool we looked at priced per repository and it got expensive quickly."],
  [710, SPEAKERS.daniel, "Per repository, and yes, that's the catch. I'll bring real numbers rather than an estimate."],
  [722, SPEAKERS.priya, "Do that. Bring me a costed proposal, and patch the dependency this sprint regardless."],
  [736, SPEAKERS.priya, "Cost. We're over on infrastructure for the third quarter running."],
  [748, SPEAKERS.s8, "Nineteen percent over plan for Q3. The bulk of it is the duplicate running cost of the migration, which we did forecast, but we forecast twelve percent."],
  [766, SPEAKERS.marcus, "The gap is that we're running old and new for longer than planned, because we're behind. It's the same three weeks showing up on a different line."],
  [782, SPEAKERS.s8, "That's right, and it's why I'm not treating it as a cost problem. If the migration finishes, the line corrects itself."],
  [798, SPEAKERS.priya, "What happens if it slips another three weeks?"],
  [806, SPEAKERS.s8, "Then we end Q4 around twenty-four percent over, and that becomes a conversation I have to have upward rather than one we can absorb."],
  [824, SPEAKERS.priya, "Understood. Marcus, that's the real deadline, and it's a financial one rather than a technical one."],
  [838, SPEAKERS.marcus, "Noted. I'd rather have that framing than a vague 'as soon as possible'."],
  [850, SPEAKERS.elena, "Can we come back to the roadmap decision? I need to tell two customers something this week."],
  [862, SPEAKERS.priya, "Yes. My decision is: export rework stays in Q4, analytics refresh moves to Q1, and we say so publicly rather than letting it drift."],
  [880, SPEAKERS.elena, "That works. I'd rather move it loudly now than quietly in six weeks."],
  [892, SPEAKERS.aisha, "And it means I can deprioritise about a third of the backlog, which helps the schema window."],
  [906, SPEAKERS.priya, "Good. Elena, you own telling the two accounts, this week."],
  [916, SPEAKERS.elena, "I'll draft something today and send it round before it goes out."],
  [926, SPEAKERS.priya, "Last thing. We've had three quarters of the same conversation about being behind, and I don't think the problem is estimation."],
  [942, SPEAKERS.priya, "I think we commit to things in the roadmap that assume no operational load at all, and then operational load happens."],
  [958, SPEAKERS.tobias, "That matches what I see. The on-call week is effectively a lost engineering week and we plan as though it isn't."],
  [974, SPEAKERS.marcus, "If we planned at seventy percent capacity instead of a hundred, most of this quarter would have been fine."],
  [988, SPEAKERS.priya, "Let's try it. Elena, plan Q4 at seventy percent capacity and let's see whether we hit it for once."],
  [1004, SPEAKERS.elena, "I'll rebuild the Q4 plan on that basis. It'll look like less, and I think that's the point."],
  [1018, SPEAKERS.priya, "It is exactly the point. Right, decisions: migration finishes and is protected, schema window before service nine, analytics moves to Q1, alerts get owners or get deleted, security brings a costed proposal, and Q4 is planned at seventy percent."],
  [1044, SPEAKERS.priya, "Anything I've missed?"],
  [1052, SPEAKERS.daniel, "Only that I'll patch the dependency regardless of the tooling decision."],
  [1060, SPEAKERS.priya, "Noted. Thanks everyone."],
];

/** Scale the authored turns across a 62-minute meeting. */
const DURATION_SEC = 3720;
const AUTHORED_SPAN = 1075;
const SCALE = DURATION_SEC / AUTHORED_SPAN;

const transcript: TranscriptItem[] = TURNS.map(([start, speaker, text], i) => {
  const next = TURNS[i + 1];
  const startSec = Math.round(start * SCALE);
  const endSec = next ? Math.round(next[0] * SCALE) : DURATION_SEC;
  return {
    speakerDisplayName: speaker,
    matchedInviteeEmail: EMAIL[speaker] ?? null,
    text,
    startSec,
    endSec,
  };
});

/** Find the scaled timestamp of the turn containing a phrase. */
const at = (phrase: string): number => {
  const hit = transcript.find((t) => t.text.includes(phrase));
  if (!hit) throw new Error(`seed error: no transcript turn contains "${phrase}"`);
  return hit.startSec;
};

export const meetingTwoSeeded: Meeting = {
  id: "q3-platform-review",
  title: "Q3 Platform Review",
  meetingType: "Project Update",
  scheduledStart: "2026-09-22T09:00:00.000Z",
  durationSec: DURATION_SEC,
  transcriptLanguage: "en",
  shareToken: "q3plat",
  recordedBy: "Priya Raghunathan",

  source: "seeded",
  mediaKind: "simulated",
  timingProvenance: "authored",
  provenanceNote:
    "Seeded demo data. Nobody was recorded. There is no audio — playback runs on a simulated clock so that seeking, transcript sync and timestamp links behave exactly as they would with real media.",

  invitees: [
    { name: "Priya Raghunathan", email: "priya.raghunathan@northwind.dev", emailDomain: "northwind.dev", isExternal: false, matchedSpeakerDisplayName: "Priya Raghunathan" },
    { name: "Marcus Webb", email: "marcus.webb@northwind.dev", emailDomain: "northwind.dev", isExternal: false, matchedSpeakerDisplayName: "Marcus Webb" },
    { name: "Elena Fischer", email: "elena.fischer@northwind.dev", emailDomain: "northwind.dev", isExternal: false, matchedSpeakerDisplayName: "Elena Fischer" },
    { name: "Tobias Lund", email: "tobias.lund@northwind.dev", emailDomain: "northwind.dev", isExternal: false, matchedSpeakerDisplayName: "Tobias Lund" },
    { name: "Aisha Okonkwo", email: "aisha.okonkwo@northwind.dev", emailDomain: "northwind.dev", isExternal: false, matchedSpeakerDisplayName: "Aisha Okonkwo" },
    { name: "Daniel Reyes", email: "daniel.reyes@northwind.dev", emailDomain: "northwind.dev", isExternal: false, matchedSpeakerDisplayName: "Daniel Reyes" },
    // These two dialled in. Diarisation produced generic labels it could not
    // tie back to the calendar invite, so the join is null in both directions.
    { name: "Fenwick Costa", email: "fenwick.costa@northwind.dev", emailDomain: "northwind.dev", isExternal: false, matchedSpeakerDisplayName: null },
    { name: "Nadia Haddad", email: "nadia@haddad-consulting.com", emailDomain: "haddad-consulting.com", isExternal: true, matchedSpeakerDisplayName: null },
  ],

  summary: {
    templateName: "Project Update",
    markdown: `## Decisions

- **The platform migration continues and is protected.** Stopping halfway would mean running two architectures and paying the operational cost of both.
- **Analytics refresh moves to Q1.** The export rework stays in Q4 because two enterprise accounts have been told it lands there.
- **Six schema changes go into one rehearsed window**, before service nine starts migrating.
- **Every alert gets a named owner or is deleted.** Roughly half of ~400 rules have never been actioned.
- **Q4 is planned at 70% capacity** rather than 100%, to account for on-call load.

## Status

The migration is **three weeks behind** at week 11 of a 14-week plan. Services 1–6 are migrated and stable; 7 and 8 are migrated but showing elevated retry rates that are currently an on-call burden rather than a customer-visible one. Services 9–12 have not started and include the hardest data-access patterns.

Q3 burned **61% of the error budget**, up from 40%, driven by three incidents — a checkout timeout, a queue backlog, and a certificate expiry whose alert fired into a muted channel.

## Cost

Infrastructure is **19% over plan** against a forecast 19% overrun of 12%, almost entirely the duplicate running cost of an unfinished migration. A further three-week slip puts Q4 at roughly **24% over**, which escalates beyond the team. This makes the migration deadline a financial one rather than a technical one.

## Security

A critical CVE was found in a dependency, but the vulnerable path is not reachable from our usage — so it is a patch-this-sprint item. The real finding is that reachability was established **by hand**, costing about a day per critical CVE.

## Theme

Three consecutive quarters of overrun were attributed not to poor estimation but to **planning as though operational load does not exist**. An on-call week is effectively a lost engineering week.`,
  },

  actionItems: [
    { id: "q3-1", description: "Audit all ~400 alert rules; delete anything without a named owner and report the final count", assignee: "Tobias Lund", timestampSec: at("Audit the lot"), completed: false, userGenerated: false },
    { id: "q3-2", description: "Give every surviving alert a named owner and an explicit paging policy", assignee: "Tobias Lund", timestampSec: at("Every alert gets a named owner"), completed: false, userGenerated: false },
    { id: "q3-3", description: "Schedule the six schema changes into a single migration window before service nine starts", assignee: "Aisha Okonkwo", timestampSec: at("six schema changes in one rehearsed window"), completed: false, userGenerated: false },
    { id: "q3-4", description: "Turn the rollback plan from a document into a rehearsed procedure", assignee: "Aisha Okonkwo", timestampSec: at("rollback plan is currently a document"), completed: true, userGenerated: false },
    { id: "q3-5", description: "Confirm the schema migration window date", assignee: "Aisha Okonkwo", timestampSec: at("window date by Friday"), completed: false, userGenerated: false },
    { id: "q3-6", description: "Patch the flagged dependency this sprint, independent of the tooling decision", assignee: "Daniel Reyes", timestampSec: at("patch the dependency this sprint"), completed: false, userGenerated: false },
    { id: "q3-7", description: "Bring a costed proposal for reachability-analysis tooling, with real per-repository pricing", assignee: "Daniel Reyes", timestampSec: at("costed proposal"), completed: false, userGenerated: false },
    { id: "q3-8", description: "Tell both enterprise accounts that analytics moves to Q1; circulate the draft first", assignee: "Elena Fischer", timestampSec: at("own telling the two accounts"), completed: false, userGenerated: false },
    { id: "q3-9", description: "Rebuild the Q4 plan at 70% capacity", assignee: "Elena Fischer", timestampSec: at("plan Q4 at seventy percent"), completed: false, userGenerated: true },
  ],


  /**
   * Pre-written, and every answer cites the moment it came from so a reader can
   * check it against the transcript. Citations are resolved through `at()` for
   * the same reason the action items are: a timestamp typed by hand would drift
   * silently the moment the transcript is edited.
   */
  ask: [
    {
      question: "Is the migration on track?",
      answer:
        "No. It is week eleven of a fourteen-week plan and roughly three weeks behind — but the shape of the delay matters more than the number. Services 1–6 are migrated and stable, 7 and 8 are migrated but showing elevated retry rates that are currently an on-call burden rather than a customer-visible one, and 9–12 have not started. Marcus is explicit that the remaining third is harder than the two-thirds already done, so the three weeks should not be read as a linear run-rate.",
      citations: [at("eleven weeks in"), at("three weeks behind on the easy")],
    },
    {
      question: "What was decided about the roadmap?",
      answer:
        "The export rework stays in Q4 and the analytics refresh moves to Q1. The deciding factor was commitment rather than effort: two enterprise accounts have been told export lands in Q4 and it came up in a renewal conversation, whereas analytics has no external commitment attached. Elena owns telling both accounts this week, and the draft goes round before it is sent.",
      citations: [at("export rework stays in Q4"), at("own telling the two accounts")],
    },
    {
      question: "Why is infrastructure over budget?",
      answer:
        "Nineteen percent over plan for Q3, against a forecast overrun of twelve percent. Almost all of the gap is the duplicate cost of running the old and new architectures at once, which is a symptom of the migration being late rather than a cost problem in its own right — finance is explicit that the line corrects itself once the migration finishes. A further three-week slip would put Q4 around twenty-four percent over, which escalates beyond the team.",
      citations: [at("Nineteen percent over plan"), at("running old and new for longer")],
    },
    {
      question: "How serious is the security finding?",
      answer:
        "The CVE itself is a patch-this-sprint item, not a stop-everything one: the vulnerable code path is not reachable from how the library is used. The more consequential finding is how that was established — by hand, because there is no reachability analysis, which costs about a day of investigation per critical CVE. Daniel is bringing a costed proposal for tooling and patching the dependency regardless of the outcome.",
      citations: [at("vulnerable code path isn't reachable"), at("no reachability analysis")],
    },
    {
      question: "What did we actually commit to?",
      answer:
        "Six decisions. The migration finishes and is protected; the six schema changes go into one rehearsed window before service nine starts; analytics moves to Q1 while export stays in Q4; every alert gets a named owner or is deleted; security brings a costed tooling proposal; and Q4 is planned at seventy percent capacity rather than a hundred. The last one is the attempt at a root cause — three quarters of overrun were attributed to planning as though on-call load does not exist.",
      citations: [
        at("migration finishes and is protected"),
        at("six schema changes in one rehearsed window"),
        at("plan Q4 at seventy percent"),
      ],
    },
  ],

  transcript,
};
