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
 * Transcript: supplied by the author for this call. It was described as verbatim
 * Fathom output, and was shipped on that basis - but a later observation of
 * Fathom's own rendered transcript (docs/research/SHARE-FLOW-OBSERVED.md) shows
 * the two differ: Fathom transcribed "Fathom API", "Fathom drone" and "8x0"
 * where this text reads "Fathom AI", "Fathom clone" and "8x Assignment", and the
 * closing sentence differs entirely. So this is what was SAID, with ordinary
 * speech-recognition errors corrected - not a byte-for-byte copy of Fathom's
 * output. No word was added by the agent.
 *
 * Fathom does not export timestamps, so the
 * segment boundaries below were derived from the audio itself using
 * `ffmpeg silencedetect` (noise=-34dB, d=0.30):
 *
 *   speech runs 3.43s -> 36.96s (3.4s lead-in, 6.2s trailing silence)
 *   largest internal pause 1.32s at 26.56s - which is exactly where the
 *   author's second paragraph begins, so the paragraph break is measured
 *   rather than guessed.
 *
 * Boundaries are snapped to detected pauses; clause placement within a segment
 * is proportional to voiced time, so it is accurate to roughly +/-1s. The UI
 * says "timestamps manually aligned" for precisely this reason.
 *
 * There are no action items and no summary because Fathom itself produced
 * neither - it reported "Meeting too short to generate a summary" and
 * "None detected" for action items. Those real empty states are the content.
 */
export const meetingOneReal: Meeting = {
  id: "impromptu-google-meet-meeting",
  title: "Impromptu Google Meet Meeting",
  meetingType: null,
  scheduledStart: "2026-09-25T08:38:00.000Z",
  durationSec: 43.62,
  transcriptLanguage: "en",
  shareToken: "r7k2m9",
  recordedBy: "Onais Ahmed",

  source: "real",
  mediaKind: "real-audio",
  audioSrc: "/media/meeting-01.m4a",
  timingProvenance: "aligned-to-audio",
  provenanceNote:
    "Real recording. The audio and every word of the transcript are from an actual Fathom call. Fathom produced no summary or action items for it, and those empty states are shown as they were.",

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
    "Fathom reported: “Meeting too short to generate a summary”. Rather than write one ourselves, we show what actually happened.",

  actionItems: [],
  actionItemsAbsentReason:
    "Fathom detected none in this 44-second call. Inventing some would make the one real meeting the dishonest one — see the Q3 Platform Review for action items, which is seeded and labelled as such.",


  /**
   * Two questions only, and both answers admit how little there is to say.
   * Writing a richer Q&A for a 43-second test call would be inventing content
   * about a real recording, which is the one place it must not happen.
   */
  ask: [
    {
      question: "What was this meeting about?",
      answer:
        "The speaker states the purpose directly: this is a test recording made to see how Fathom works before building a clone of it for an 8x assignment. He names what he intends to do with what he finds — clone some of it, improvise on some, and leave the rest behind. There is no other subject matter; the call is 44 seconds long and has one participant.",
      citations: [3.43, 18.47],
    },
    {
      question: "Were any decisions or commitments made?",
      answer:
        "No. One decision is mentioned as already taken — to build the clone — but nothing is agreed during the call, and no task is assigned to anyone. Fathom itself detected no action items here, and produced no summary because the recording was too short.",
      citations: [3.43, 27.89],
    },
  ],

  transcript: [
    {
      speakerDisplayName: "Onais Ahmed",
      matchedInviteeEmail: null,
      text: "Hello everyone, this is Fathom AI, actually I have decided",
      startSec: 3.43,
      endSec: 7.91,
    },
    {
      speakerDisplayName: "Onais Ahmed",
      matchedInviteeEmail: null,
      text: "to build a Fathom clone",
      startSec: 9.12,
      endSec: 10.7,
    },
    {
      speakerDisplayName: "Onais Ahmed",
      matchedInviteeEmail: null,
      text: "for my 8x Assignment.",
      startSec: 11.75,
      endSec: 15.52,
    },
    {
      speakerDisplayName: "Onais Ahmed",
      matchedInviteeEmail: null,
      text: "This demo is Just to test",
      startSec: 16.35,
      endSec: 17.63,
    },
    {
      speakerDisplayName: "Onais Ahmed",
      matchedInviteeEmail: null,
      text: "to see how Fathom works, what I'll be cloning, and I'll be improvising and what we are going to leave behind.",
      startSec: 18.47,
      endSec: 26.56,
    },
    {
      speakerDisplayName: "Onais Ahmed",
      matchedInviteeEmail: null,
      text: "This is just a demo for my clone,",
      startSec: 27.89,
      endSec: 32.92,
    },
    {
      speakerDisplayName: "Onais Ahmed",
      matchedInviteeEmail: null,
      text: "and nothing else in this demo.",
      startSec: 33.95,
      endSec: 36.96,
    },
  ],
};
