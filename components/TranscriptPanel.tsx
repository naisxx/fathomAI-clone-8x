"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { formatTimestamp, type Meeting, type TranscriptItem } from "@/lib/types";
import { Moment } from "./Moment";
import type { Playback } from "./usePlayback";

/** Stable colour per speaker, so the eye can track who is talking. */
function speakerHue(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
}

function Avatar({ name, matched }: { name: string; matched: boolean }) {
  const initials = matched
    ? name
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "?";
  const hue = speakerHue(name);
  return (
    <span
      aria-hidden
      className="grid h-7 w-7 shrink-0 place-items-center rounded-full t-micro font-semibold"
      style={
        matched
          ? {
              background: `oklch(0.42 0.09 ${hue})`,
              color: `oklch(0.95 0.03 ${hue})`,
            }
          : {
              background: "transparent",
              color: "var(--faint)",
              border: "1px dashed var(--border-strong)",
            }
      }
    >
      {initials}
    </span>
  );
}

/** Wrap every occurrence of the query so a match is visible in place. */
function MarkedText({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const q = query.toLowerCase();
  const out: React.ReactNode[] = [];
  let i = 0;
  let n = 0;
  for (;;) {
    const at = text.toLowerCase().indexOf(q, i);
    if (at === -1) {
      out.push(text.slice(i));
      break;
    }
    if (at > i) out.push(text.slice(i, at));
    out.push(
      <mark
        key={n++}
        className="rounded-sm px-0.5"
        style={{ background: "var(--accent-tint)", color: "var(--accent-strong)" }}
      >
        {text.slice(at, at + q.length)}
      </mark>
    );
    i = at + q.length;
  }
  return <>{out}</>;
}

function Line({
  item,
  isActive,
  matched,
  onSeek,
  query,
}: {
  item: TranscriptItem;
  isActive: boolean;
  matched: boolean;
  onSeek: (sec: number) => void;
  query: string;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSeek(item.startSec)}
        data-active={isActive || undefined}
        className="flex w-full gap-3 rounded-lg p-2.5 text-left transition-colors"
        style={{
          background: isActive ? "var(--accent-tint)" : "transparent",
        }}
        aria-label={`Jump to ${formatTimestamp(item.startSec)}, ${item.speakerDisplayName}`}
      >
        <Avatar name={item.speakerDisplayName} matched={matched} />
        <span className="min-w-0 flex-1">
          <span className="mb-0.5 flex flex-wrap items-baseline gap-2">
            <span
              className="t-meta font-semibold"
              style={{ color: matched ? "var(--text)" : "var(--faint)" }}
            >
              {item.speakerDisplayName}
            </span>
            {!matched && (
              <span
                className="rounded px-1 py-px t-label"
                style={{ color: "var(--muted)", background: "var(--elevated)" }}
                title="Diarisation could not match this speaker to a calendar invitee. Fathom's own API models this as null, so we show it rather than guessing."
              >
                unmatched
              </span>
            )}
            <span
              className="font-mono t-micro tabular-nums"
              style={{ color: isActive ? "var(--accent)" : "var(--faint)" }}
            >
              {formatTimestamp(item.startSec)}
            </span>
          </span>
          <span
            className="block t-body leading-relaxed"
            style={{ color: isActive ? "var(--text)" : "var(--muted)" }}
          >
            <MarkedText text={item.text} query={query} />
          </span>
        </span>
      </button>
    </li>
  );
}

export function TranscriptPanel({
  meeting,
  playback,
  activeIndex,
  follow,
  onToggleFollow,
}: {
  meeting: Meeting;
  playback: Playback;
  activeIndex: number;
  follow: boolean;
  onToggleFollow: () => void;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  /**
   * Searching within one meeting is a different job from searching across them.
   * On a 72-segment hour-long transcript this is the one you actually reach for,
   * and Fathom puts it right here in the transcript tab.
   *
   * Filtering keeps the original index so a result still knows which line it is
   * — follow-playback and click-to-seek both depend on that.
   */
  const shown = useMemo(
    () =>
      meeting.transcript
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => !q || item.text.toLowerCase().includes(q)),
    [meeting.transcript, q]
  );

  const matchedNames = new Set(
    meeting.invitees
      .map((i) => i.matchedSpeakerDisplayName)
      .filter((n): n is string => n !== null)
  );

  // Keep the active line in view while following, without hijacking the page.
  useEffect(() => {
    if (!follow || activeIndex < 0) return;
    // While filtering, the active line may not be rendered at all.
    const pos = shown.findIndex((s) => s.index === activeIndex);
    if (pos === -1) return;
    const el = listRef.current?.children[pos] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [activeIndex, follow, shown]);

  if (meeting.transcript.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="t-body font-medium">No transcript</p>
        <p className="mx-auto mt-1 max-w-sm t-body" style={{ color: "var(--faint)" }}>
          {meeting.transcriptAbsentReason ?? "No transcript is available for this meeting."}
        </p>
      </div>
    );
  }

  const unmatchedCount = meeting.transcript.filter(
    (t) => !matchedNames.has(t.speakerDisplayName)
  ).length;

  return (
    <div className="flex min-h-0 flex-col">
      <div
        className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b px-3 py-2 t-micro"
        style={{ borderColor: "var(--border)", color: "var(--faint)" }}
      >
        <span aria-live="polite">
          {q
            ? `${shown.length} of ${meeting.transcript.length} segments`
            : `${meeting.transcript.length} segments`}
        </span>
        {unmatchedCount > 0 && (
          <span style={{ color: "var(--muted)" }}>
            {unmatchedCount} from unmatched speakers
          </span>
        )}
        {meeting.timingProvenance === "aligned-to-audio" && (
          <span title="Fathom exports no timestamps. Boundaries were derived from the audio with silence detection, then clauses placed proportionally — accurate to about ±1s.">
            timestamps manually aligned
          </span>
        )}
        <button
          type="button"
          onClick={onToggleFollow}
          className="ml-auto min-h-6 rounded px-1.5 py-1"
          style={{
            color: follow ? "var(--accent)" : "var(--faint)",
            background: follow ? "var(--accent-tint)" : "transparent",
          }}
          aria-pressed={follow}
        >
          {follow ? "Following playback" : "Follow playback"}
        </button>
      </div>

      <div className="border-b px-3 py-2" style={{ borderColor: "var(--border)" }}>
        <label htmlFor="transcript-search" className="sr-only">
          Search within this transcript
        </label>
        <div className="relative">
          <svg
            aria-hidden
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2"
            style={{ color: "var(--faint)" }}
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            id="transcript-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search this transcript"
            className="h-9 w-full rounded-lg border pl-8 pr-3 t-meta outline-none"
            style={{
              borderColor: "var(--border)",
              background: "var(--bg)",
              color: "var(--text)",
            }}
          />
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="p-8 text-center">
          <p className="t-body font-medium">
            Nothing in this transcript matches &ldquo;{query.trim()}&rdquo;
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-2 min-h-6 rounded px-2 py-1 t-meta"
            style={{ color: "var(--accent)", background: "var(--accent-tint)" }}
          >
            Clear search
          </button>
        </div>
      ) : (
        <ul
          ref={listRef}
          className="scroll-subtle min-h-0 flex-1 overflow-y-auto p-1.5"
          style={{ maxHeight: "min(58vh, 640px)" }}
        >
          {shown.map(({ item, index }) => (
            <Line
              key={`${item.startSec}-${index}`}
              item={item}
              isActive={index === activeIndex}
              matched={matchedNames.has(item.speakerDisplayName)}
              onSeek={playback.seek}
              query={q}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
