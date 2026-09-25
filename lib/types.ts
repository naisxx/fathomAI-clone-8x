/**
 * Domain types.
 *
 * Deliberately named after Fathom's published OpenAPI schema
 * (developers.fathom.ai/api-reference/openapi.yaml) so the data model is
 * traceable to a real contract rather than invented. Trimmed to what we render.
 *
 * Two fields are nullable ON PURPOSE and must stay that way:
 * `matchedInviteeEmail` and `matchedSpeakerDisplayName`. Fathom's own schema
 * marks both nullable with "Null if no exact match found" — speaker-to-attendee
 * matching genuinely fails, and we render that rather than hiding it.
 */

/** Where a meeting's content came from. Drives the honesty badge in the UI. */
export type MeetingSource = "real" | "seeded";

/** How playback works for a meeting. */
export type MediaKind =
  /** A real audio file. Playback, seeking and transcript sync are genuine. */
  | "real-audio"
  /** No media. A simulated clock drives the same interactions. */
  | "simulated";

/** How a transcript's timestamps were produced. Shown to the reader. */
export type TimingProvenance =
  /** Timestamps measured from the audio. */
  | "aligned-to-audio"
  /** Timestamps authored alongside synthetic content. */
  | "authored";

export interface Invitee {
  name: string;
  email: string | null;
  emailDomain: string | null;
  isExternal: boolean;
  /** Null when no transcript speaker could be matched to this invitee. */
  matchedSpeakerDisplayName: string | null;
}

export interface TranscriptItem {
  /** The label the transcript carries, e.g. "Onais Ahmed" or "Speaker 3". */
  speakerDisplayName: string;
  /** Null when this speaker could not be matched to a calendar invitee. */
  matchedInviteeEmail: string | null;
  text: string;
  /** Seconds from the start of the recording. */
  startSec: number;
  /** Seconds from the start of the recording. */
  endSec: number;
}

export interface MeetingSummary {
  /** Fathom calls these templates; ours mirrors that field. */
  templateName: string;
  markdown: string;
}

export interface ActionItem {
  id: string;
  description: string;
  /** Null when the item is not attributed to anyone. */
  assignee: string | null;
  /** Seconds from the start of the recording. Drives the deep link. */
  timestampSec: number;
  completed: boolean;
  /** True when added by a person, false when extracted by AI. */
  userGenerated: boolean;
}

export interface Meeting {
  id: string;
  title: string;
  meetingType: string | null;
  /** ISO 8601. */
  scheduledStart: string;
  durationSec: number;
  transcriptLanguage: string;
  shareToken: string;
  invitees: Invitee[];
  recordedBy: string;

  source: MeetingSource;
  mediaKind: MediaKind;
  /** Path under /public. Present only when mediaKind is "real-audio". */
  audioSrc?: string;
  timingProvenance: TimingProvenance;
  /**
   * One sentence shown in the UI explaining exactly what is real and what is
   * not for this meeting. Required on every meeting - there is no default that
   * lets an unlabelled meeting slip through.
   */
  provenanceNote: string;

  summary: MeetingSummary | null;
  /** Why there is no summary, when there isn't one. */
  summaryAbsentReason?: string;
  actionItems: ActionItem[];
  /** Why there are no action items, when there aren't any. */
  actionItemsAbsentReason?: string;
  transcript: TranscriptItem[];
  /** Why there is no transcript, when there isn't one. */
  transcriptAbsentReason?: string;
}

/** Speakers in a transcript that no invitee matched. */
export function unmatchedSpeakers(meeting: Meeting): string[] {
  const matched = new Set(
    meeting.invitees
      .map((i) => i.matchedSpeakerDisplayName)
      .filter((n): n is string => n !== null)
  );
  const seen = new Set<string>();
  for (const item of meeting.transcript) {
    if (!matched.has(item.speakerDisplayName)) seen.add(item.speakerDisplayName);
  }
  return [...seen];
}

/** "62 min" / "44 sec" — matches how Fathom labels its cards. */
export function formatDuration(totalSec: number): string {
  if (totalSec < 60) return `${Math.round(totalSec)} sec`;
  return `${Math.round(totalSec / 60)} min`;
}

/** Seconds to H:MM:SS, or M:SS when under an hour. */
export function formatTimestamp(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(r)}` : `${m}:${pad(r)}`;
}
