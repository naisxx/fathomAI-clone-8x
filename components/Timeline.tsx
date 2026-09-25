"use client";

import { useMemo, useRef } from "react";
import { formatTimestamp, type Highlight, type Meeting } from "@/lib/types";

/**
 * The shape of a meeting, on one axis.
 *
 * This replaces a 345px gradient box that rendered a play button over nothing —
 * 36% of the fold spent depicting the *absence* of video. Fathom leads with
 * video because it has video; we have audio for one meeting and none for the
 * rest, so the honest move is to stop imitating a player and show the thing a
 * reader actually needs: who spoke when, and where the decisions are.
 *
 * Speakers are distinguished by lightness rather than hue, because the system
 * has one accent and one semantic colour and eight speakers cannot each have
 * their own. Unmatched speakers are hatched rather than tinted — a pattern
 * carries the distinction without inventing a ninth colour, and it survives
 * being printed or viewed by someone who cannot separate the greys.
 */

/** Deterministic lightness step per speaker, stable across renders. */
function speakerShade(index: number, total: number): string {
  const lo = 28;
  const hi = 62;
  const t = total <= 1 ? 0.5 : index / (total - 1);
  return `oklch(${lo + (hi - lo) * t}% 0.012 275)`;
}

export function Timeline({
  meeting,
  currentTime,
  onSeek,
  highlights,
  lo,
  hi,
}: {
  meeting: Meeting;
  currentTime: number;
  onSeek: (sec: number) => void;
  highlights: Highlight[];
  /** Visible window. Equals the whole meeting unless this is a clip. */
  lo: number;
  hi: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const span = Math.max(0.001, hi - lo);
  const pct = (sec: number) => ((sec - lo) / span) * 100;

  const speakers = useMemo(() => {
    const seen: string[] = [];
    for (const t of meeting.transcript) {
      if (!seen.includes(t.speakerDisplayName)) seen.push(t.speakerDisplayName);
    }
    return seen;
  }, [meeting.transcript]);

  const matched = useMemo(
    () =>
      new Set(
        meeting.invitees
          .map((i) => i.matchedSpeakerDisplayName)
          .filter((n): n is string => n !== null)
      ),
    [meeting.invitees]
  );

  const bands = meeting.transcript
    .filter((t) => t.endSec > lo && t.startSec < hi)
    .map((t) => {
      const idx = speakers.indexOf(t.speakerDisplayName);
      const isMatched = matched.has(t.speakerDisplayName);
      return {
        t,
        idx,
        isMatched,
        left: Math.max(0, pct(t.startSec)),
        width: Math.max(0.4, pct(Math.min(t.endSec, hi)) - Math.max(0, pct(t.startSec))),
      };
    });

  const seekFromPointer = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    onSeek(lo + ratio * span);
  };

  const inWindow = (sec: number) => sec >= lo && sec <= hi;

  return (
    <section
      className="rounded-[var(--r-panel)] border p-[var(--s-3)]"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      aria-label="Meeting timeline"
    >
      <div className="mb-[var(--s-2)] flex flex-wrap items-center gap-x-[var(--s-3)] gap-y-1">
        <span className="t-label" style={{ color: "var(--faint)" }}>
          {speakers.length === 1 ? "1 speaker" : `${speakers.length} speakers`}
        </span>
        <span className="t-micro" style={{ color: "var(--faint)" }}>
          {formatTimestamp(lo)} – {formatTimestamp(hi)}
        </span>
        {highlights.length > 0 && (
          <span className="t-micro" style={{ color: "var(--faint)" }}>
            {highlights.length} highlight{highlights.length === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {/* Speaker bands. Click anywhere to seek. */}
      <div
        ref={ref}
        onClick={(e) => seekFromPointer(e.clientX)}
        className="relative h-11 w-full cursor-pointer overflow-hidden rounded-[var(--r-control)]"
        style={{ background: "var(--elevated)" }}
      >
        {bands.map((b, i) => (
          <span
            key={`${b.t.startSec}-${i}`}
            title={`${b.t.speakerDisplayName} · ${formatTimestamp(b.t.startSec)}${
              b.isMatched ? "" : " · unmatched"
            }`}
            className="absolute top-0 h-full"
            style={{
              left: `${b.left}%`,
              width: `${b.width}%`,
              background: b.isMatched
                ? speakerShade(b.idx, speakers.length)
                : // Hatching, so an unmatched speaker is distinguishable without
                  // a ninth colour.
                  `repeating-linear-gradient(45deg, var(--border-strong) 0 3px, transparent 3px 6px)`,
            }}
          />
        ))}

        {/* Action items and highlights ride the same axis as the speech. */}
        {meeting.actionItems
          .filter((a) => inWindow(a.timestampSec))
          .map((a) => (
            <span
              key={a.id}
              aria-hidden
              title={`Action item · ${formatTimestamp(a.timestampSec)}`}
              className="absolute bottom-0 h-2 w-0.5"
              style={{ left: `${pct(a.timestampSec)}%`, background: "var(--accent)" }}
            />
          ))}
        {highlights
          .filter((h) => inWindow(h.startSec))
          .map((h) => (
            <span
              key={h.id}
              aria-hidden
              title={`Highlight · ${formatTimestamp(h.startSec)}`}
              className="absolute top-0 h-2 w-0.5"
              style={{ left: `${pct(h.startSec)}%`, background: "var(--real)" }}
            />
          ))}

        {/* Playhead */}
        <span
          aria-hidden
          className="pointer-events-none absolute top-0 h-full w-0.5"
          style={{
            left: `${Math.min(100, Math.max(0, pct(currentTime)))}%`,
            background: "var(--text)",
          }}
        />
      </div>

      {/* Legend. Names, not just colours. */}
      <ul className="mt-[var(--s-2)] flex flex-wrap gap-x-[var(--s-3)] gap-y-1">
        {speakers.map((name, i) => {
          const isMatched = matched.has(name);
          return (
            <li key={name} className="flex items-center gap-1.5">
              <span
                aria-hidden
                className="h-2 w-2 rounded-sm"
                style={{
                  background: isMatched
                    ? speakerShade(i, speakers.length)
                    : "repeating-linear-gradient(45deg, var(--border-strong) 0 2px, transparent 2px 4px)",
                }}
              />
              <span className="t-micro" style={{ color: "var(--faint)" }}>
                {name}
                {!isMatched && " (unmatched)"}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
