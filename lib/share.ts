import type { Meeting } from "./types";

/** A bounded window over a recording. Seconds from the start. */
export interface ClipRange {
  fromSec: number;
  toSec: number;
}

const MIN_CLIP_SEC = 5;

/**
 * Turn whatever arrived in the URL into a usable range, or nothing.
 *
 * Returns null for anything nonsensical — reversed, negative, non-numeric,
 * out of bounds, or too short to be a clip — and the caller then serves the
 * whole meeting. A bad link degrades to the full recording rather than to an
 * empty player or an error.
 */
export function clampRange(
  meeting: Meeting,
  rawFrom: unknown,
  rawTo: unknown
): ClipRange | null {
  const from = Number(rawFrom);
  const to = Number(rawTo);
  if (!Number.isFinite(from) || !Number.isFinite(to)) return null;

  const lo = Math.max(0, Math.min(from, to));
  const hi = Math.min(meeting.durationSec, Math.max(from, to));
  if (hi - lo < MIN_CLIP_SEC) return null;
  if (lo >= meeting.durationSec) return null;

  return { fromSec: lo, toSec: hi };
}

/**
 * Strip everything a share link should not carry, before the object reaches the
 * client.
 *
 * This exists because of a real defect found while testing P7. The shared view
 * rendered no action items and no attendee emails — but it was handed the whole
 * `Meeting`, and Next.js serialises component props into the HTML for
 * hydration. Every invitee's email address was sitting in the page source of a
 * link meant for outsiders. Not rendering something is not the same as not
 * sending it.
 *
 * So the redaction happens here, on the server, and the shared view is given an
 * object that simply does not contain the private fields.
 */
export function redactForShare(meeting: Meeting, clip?: ClipRange | null): Meeting {
  const redacted = buildRedacted(meeting, clip ?? null);

  // Guard the invariant at the point it matters. If a future field carries an
  // address into the shared payload, this fails the build during prerender
  // rather than shipping quietly — which is how the original defect escaped.
  const leaked = findEmails(redacted);
  if (leaked.length > 0) {
    throw new Error(
      `redactForShare left ${leaked.length} address(es) in the shared payload for ` +
        `"${meeting.id}": ${leaked.slice(0, 3).join(", ")}`
    );
  }

  return redacted;
}

function buildRedacted(meeting: Meeting, clip: ClipRange | null): Meeting {
  /*
   * A clip that ships the whole transcript is not a clip. Segments outside the
   * window are dropped HERE, on the server, so they never reach the page source
   * — the same reasoning that moved email redaction server-side in P7.
   */
  const transcript = clip
    ? meeting.transcript.filter(
        (t) => t.endSec > clip.fromSec && t.startSec < clip.toSec
      )
    : meeting.transcript;

  return {
    ...meeting,

    // Display names stay — they are already spoken aloud in the transcript.
    // Addresses and domains do not.
    invitees: meeting.invitees.map((i) => ({
      name: i.name,
      email: null,
      emailDomain: null,
      isExternal: i.isExternal,
      matchedSpeakerDisplayName: i.matchedSpeakerDisplayName,
    })),

    // Action items belong to the team, not to the recipient of a link.
    actionItems: [],
    actionItemsAbsentReason: undefined,

    // The shared view has no Ask tab, but the entries would still ship in the
    // hydration payload — and their answers paraphrase who committed to what,
    // which is the same content the action items were stripped for. Exactly the
    // class of leak this module exists to prevent, so it goes too.
    ask: [],

    // A viewer's own marked moments are not the recipient's business, and
    // seeded ones are noise in a shared view. Stripped for the same reason as
    // action items and Ask entries.
    highlights: [],

    // The speaker→invitee join is an email address.
    transcript: transcript.map((t) => ({
      ...t,
      matchedInviteeEmail: null,
    })),

    // A clip's summary describes the whole meeting, so it is not the clip's to
    // show. The recipient was given a moment, not the meeting.
    summary: clip ? null : meeting.summary,
    summaryAbsentReason: clip
      ? "This is a clip. The summary covers the whole meeting, so it is not included."
      : meeting.summaryAbsentReason,
  };
}

/** Assert no address-shaped string survives redaction. Used by the guard test. */
export function findEmails(value: unknown): string[] {
  const json = JSON.stringify(value) ?? "";
  return json.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi) ?? [];
}
