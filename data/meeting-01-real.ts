import type { Meeting } from "@/lib/types";

/**
 * THE ONE REAL MEETING.
 *
 * Audio: the author's own Fathom test recording, 25 Sep 2026, 43.62 s.
 * The original download was an MP4 whose every frame had the Google Meet join
 * code burned into it, so the video track was discarded outright rather than
 * masked. What ships is audio only - verified to contain a single `soun` track
 * and no `vide` track.
 *
 * Transcript: Fathom's own machine transcription, exactly as Fathom renders it,
 * recognition errors included. It says "Fathom API" where the speaker said
 * "Fathom AI", "Fathom drone" for "Fathom clone", "8x0" for "8x Assignment",
 * and "I can wait" for the closing phrase.
 *
 * Those errors are kept on purpose. This is the only real recording in the
 * product, and showing what the machine actually heard - next to audio you can
 * click into and check - argues for the whole design better than a tidied
 * transcript would. A cleaned-up version was shipped earlier by mistake; it now
 * exists only as evidence in docs/research/SHARE-FLOW-OBSERVED.md and appears
 * nowhere in the app.
 *
 * Timestamps: Fathom exports none, so boundaries were derived from the audio
 * with `ffmpeg silencedetect` (noise=-34dB, d=0.30): speech runs 3.43s to
 * 36.96s (3.4s lead-in, 6.2s trailing silence), and the largest internal pause
 * (1.32s at 26.56s) falls exactly at Fathom's own paragraph break between its
 * two transcript bubbles. Boundaries snap to those pauses; clause placement
 * inside a segment is proportional to voiced time, so it is good to about
 * +/-1s. The UI says "timestamps manually aligned" for that reason.
 *
 * A useful check: against these boundaries Fathom's text speaks at 2.87 words/s
 * before the break and 2.80 after - 0.07 apart. The cleaned-up version gave
 * 3.07 and 2.18, i.e. 0.89 apart. The machine transcript fits the measured
 * audio far better, which is independent support both for these boundaries and
 * for shipping this text.
 *
 * No summary and no action items, because Fathom produced neither - it reported
 * "Meeting too short to generate a summary" and "None detected".
 */
export const meetingOneReal: Meeting = {
  id: "impromptu-google-meet-meeting",
  title: "Impromptu Google Meet Meeting",
  meetingType: null,
  scheduledStart: "2026-09-25T08:38:00.000Z",
  durationSec: 43.62,
  transcriptLanguage: "en",
  shareToken: "ZGkdsNfbMnG2hXRXVWZer9PV",
  recordedBy: "Onais Ahmed",

  source: "real",
  mediaKind: "real-audio",
  audioSrc: "/media/meeting-01.m4a",
  timingProvenance: "aligned-to-audio",
  provenanceNote:
    "Real recording. The audio is from an actual Fathom call, and the transcript is Fathom's own machine transcription \u2014 including its mistakes. Fathom produced no summary or action items for it, and those empty states are shown as they were.",

  invitees: [
    {
      name: "Onais Ahmed",
      email: null,
      emailDomain: null,
      isExternal: false,
      matchedSpeakerDisplayName: "Onais Ahmed",
    },
  ],

  summary: null,
  summaryAbsentReason:
    "Fathom reported: \u201cMeeting too short to generate a summary\u201d. Rather than write one ourselves, we show what actually happened.",

  actionItems: [],
  actionItemsAbsentReason:
    "Fathom detected none in this 44-second call. Inventing some would make the one real meeting the dishonest one \u2014 see the Q3 Platform Review for action items, which is seeded and labelled as such.",

  ask: [
    {
      question: "What was this meeting about?",
      answer:
        "A test recording. The speaker says he has decided to build a Fathom clone for an 8x assignment, and that the call exists to see how Fathom works before deciding what to clone, what to change and what to leave out. Worth noting that the transcript garbles several of those words \u2014 it renders \u201cFathom AI\u201d as \u201cFathom API\u201d and \u201cclone\u201d as \u201cdrone\u201d \u2014 which is exactly why the audio sits next to it.",
      citations: [3.43, 18.47],
    },
    {
      question: "Were any decisions or commitments made?",
      answer:
        "No. One decision is mentioned as already taken \u2014 to build the clone \u2014 but nothing is agreed during the call and no task is assigned to anyone. Fathom itself detected no action items here, and produced no summary because the recording was too short.",
      citations: [3.43, 27.89],
    },
  ],

  highlights: [],

  transcript: [
    {
      speakerDisplayName: "Onais Ahmed",
      matchedInviteeEmail: null,
      text: "Hello everyone, this is Fathom API, actually I have decided",
      startSec: 3.43,
      endSec: 7.91,
    },
    {
      speakerDisplayName: "Onais Ahmed",
      matchedInviteeEmail: null,
      text: "to build a Fathom drone",
      startSec: 9.12,
      endSec: 10.7,
    },
    {
      speakerDisplayName: "Onais Ahmed",
      matchedInviteeEmail: null,
      text: "for my 8x0.",
      startSec: 11.75,
      endSec: 15.52,
    },
    {
      speakerDisplayName: "Onais Ahmed",
      matchedInviteeEmail: null,
      text: "Just to test the same",
      startSec: 16.35,
      endSec: 17.63,
    },
    {
      speakerDisplayName: "Onais Ahmed",
      matchedInviteeEmail: null,
      text: "how Fathom works, what I've been searching for, and I've been searching for what we are going to leave behind.",
      startSec: 18.47,
      endSec: 26.56,
    },
    {
      speakerDisplayName: "Onais Ahmed",
      matchedInviteeEmail: null,
      text: "This is not a bad thing for my drone,",
      startSec: 27.89,
      endSec: 32.92,
    },
    {
      speakerDisplayName: "Onais Ahmed",
      matchedInviteeEmail: null,
      text: "this is just a demo, and I can wait.",
      startSec: 33.95,
      endSec: 36.96,
    },
  ],
};
