import type { Meeting } from "./types";

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
export function redactForShare(meeting: Meeting): Meeting {
  const redacted = buildRedacted(meeting);

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

function buildRedacted(meeting: Meeting): Meeting {
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

    // The speaker→invitee join is an email address.
    transcript: meeting.transcript.map((t) => ({
      ...t,
      matchedInviteeEmail: null,
    })),
  };
}

/** Assert no address-shaped string survives redaction. Used by the guard test. */
export function findEmails(value: unknown): string[] {
  const json = JSON.stringify(value) ?? "";
  return json.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi) ?? [];
}
