import type { Meeting } from "./types";

/**
 * Cross-meeting search.
 *
 * Runs entirely in the browser over the seeded data. There is no index and no
 * backend: the whole corpus is a few hundred short strings, so a linear scan is
 * both fast enough and one less thing that can be wrong.
 *
 * The point of the feature is that a hit inside a transcript carries the moment
 * it happened, so the result links to a timestamp rather than to a page.
 */

export type HitKind = "title" | "transcript" | "summary" | "action";

export interface SearchHit {
  kind: HitKind;
  /** Snippet with context around the match. */
  snippet: string;
  /** Offset of the match within `snippet`. */
  matchStart: number;
  matchLength: number;
  /** Present for transcript and action-item hits. */
  timestampSec?: number;
  speaker?: string;
}

export interface MeetingResults {
  meeting: Meeting;
  hits: SearchHit[];
  /** Total hits before truncation, so we can say "+4 more". */
  totalHits: number;
}

const CONTEXT = 70;
const MAX_HITS_PER_MEETING = 4;

/** Build a snippet centred on the match, with ellipses where trimmed. */
function snippetAround(text: string, at: number, len: number): Omit<SearchHit, "kind"> {
  const from = Math.max(0, at - CONTEXT);
  const to = Math.min(text.length, at + len + CONTEXT);
  const lead = from > 0 ? "…" : "";
  const tail = to < text.length ? "…" : "";
  return {
    snippet: lead + text.slice(from, to) + tail,
    matchStart: lead.length + (at - from),
    matchLength: len,
  };
}

function findIn(text: string, needle: string): number {
  return text.toLowerCase().indexOf(needle);
}

export function search(meetings: Meeting[], rawQuery: string): MeetingResults[] {
  const q = rawQuery.trim().toLowerCase();
  if (q.length < 2) return [];

  const results: MeetingResults[] = [];

  for (const meeting of meetings) {
    const hits: SearchHit[] = [];

    const titleAt = findIn(meeting.title, q);
    if (titleAt !== -1) {
      hits.push({ kind: "title", ...snippetAround(meeting.title, titleAt, q.length) });
    }

    for (const item of meeting.transcript) {
      const at = findIn(item.text, q);
      if (at === -1) continue;
      hits.push({
        kind: "transcript",
        ...snippetAround(item.text, at, q.length),
        timestampSec: item.startSec,
        speaker: item.speakerDisplayName,
      });
    }

    for (const action of meeting.actionItems) {
      const at = findIn(action.description, q);
      if (at === -1) continue;
      hits.push({
        kind: "action",
        ...snippetAround(action.description, at, q.length),
        timestampSec: action.timestampSec,
        speaker: action.assignee ?? undefined,
      });
    }

    if (meeting.summary) {
      // Strip the markdown scaffolding so a hit on "**Analytics" reads cleanly.
      const plain = meeting.summary.markdown
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/\*\*/g, "")
        .replace(/^-\s+/gm, "")
        .replace(/\s*\n\s*/g, " ");
      const at = findIn(plain, q);
      if (at !== -1) {
        hits.push({ kind: "summary", ...snippetAround(plain, at, q.length) });
      }
    }

    if (hits.length === 0) continue;

    // Title first, then chronological — a reader scanning results wants the
    // meeting's own order, not relevance guesswork we cannot justify.
    const order: Record<HitKind, number> = { title: 0, summary: 1, action: 2, transcript: 3 };
    hits.sort(
      (a, b) =>
        order[a.kind] - order[b.kind] ||
        (a.timestampSec ?? 0) - (b.timestampSec ?? 0)
    );

    results.push({
      meeting,
      hits: hits.slice(0, MAX_HITS_PER_MEETING),
      totalHits: hits.length,
    });
  }

  // Most hits first, so the meeting the query is really "about" leads.
  return results.sort((a, b) => b.totalHits - a.totalHits);
}

export function totalHitCount(results: MeetingResults[]): number {
  return results.reduce((n, r) => n + r.totalHits, 0);
}
