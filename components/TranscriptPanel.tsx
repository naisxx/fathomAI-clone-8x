"use client";

import { useEffect, useRef } from "react";
import { formatTimestamp, type Meeting, type TranscriptItem } from "@/lib/types";
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
      className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-semibold"
      style={
        matched
          ? {
              background: `oklch(0.42 0.09 ${hue})`,
              color: `oklch(0.95 0.03 ${hue})`,
            }
          : {
              background: "transparent",
              color: "var(--text-faint)",
              border: "1px dashed var(--border-strong)",
            }
      }
    >
      {initials}
    </span>
  );
}

function Line({
  item,
  isActive,
  matched,
  onSeek,
}: {
  item: TranscriptItem;
  isActive: boolean;
  matched: boolean;
  onSeek: (sec: number) => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSeek(item.startSec)}
        data-active={isActive || undefined}
        className="flex w-full gap-3 rounded-lg p-2.5 text-left transition-colors"
        style={{
          background: isActive ? "var(--accent-dim)" : "transparent",
        }}
        aria-label={`Jump to ${formatTimestamp(item.startSec)}, ${item.speakerDisplayName}`}
      >
        <Avatar name={item.speakerDisplayName} matched={matched} />
        <span className="min-w-0 flex-1">
          <span className="mb-0.5 flex flex-wrap items-baseline gap-2">
            <span
              className="text-[13px] font-semibold"
              style={{ color: matched ? "var(--text)" : "var(--text-faint)" }}
            >
              {item.speakerDisplayName}
            </span>
            {!matched && (
              <span
                className="rounded px-1 py-px text-[10px] font-medium uppercase tracking-wide"
                style={{ color: "var(--seeded)", background: "var(--seeded-dim)" }}
                title="Diarisation could not match this speaker to a calendar invitee. Fathom's own API models this as null, so we show it rather than guessing."
              >
                unmatched
              </span>
            )}
            <span
              className="font-mono text-[11px] tabular-nums"
              style={{ color: isActive ? "var(--accent)" : "var(--text-faint)" }}
            >
              {formatTimestamp(item.startSec)}
            </span>
          </span>
          <span
            className="block text-[14px] leading-relaxed"
            style={{ color: isActive ? "var(--text)" : "var(--text-muted)" }}
          >
            {item.text}
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
  const matchedNames = new Set(
    meeting.invitees
      .map((i) => i.matchedSpeakerDisplayName)
      .filter((n): n is string => n !== null)
  );

  // Keep the active line in view while following, without hijacking the page.
  useEffect(() => {
    if (!follow || activeIndex < 0) return;
    const el = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [activeIndex, follow]);

  if (meeting.transcript.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm font-medium">No transcript</p>
        <p className="mx-auto mt-1 max-w-sm text-sm" style={{ color: "var(--text-faint)" }}>
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
        className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b px-3 py-2 text-[11px]"
        style={{ borderColor: "var(--border)", color: "var(--text-faint)" }}
      >
        <span>{meeting.transcript.length} segments</span>
        {unmatchedCount > 0 && (
          <span style={{ color: "var(--seeded)" }}>
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
            color: follow ? "var(--accent)" : "var(--text-faint)",
            background: follow ? "var(--accent-dim)" : "transparent",
          }}
          aria-pressed={follow}
        >
          {follow ? "Following playback" : "Follow playback"}
        </button>
      </div>

      <ul
        ref={listRef}
        className="scroll-subtle min-h-0 flex-1 overflow-y-auto p-1.5"
        style={{ maxHeight: "min(58vh, 640px)" }}
      >
        {meeting.transcript.map((item, i) => (
          <Line
            key={`${item.startSec}-${i}`}
            item={item}
            isActive={i === activeIndex}
            matched={matchedNames.has(item.speakerDisplayName)}
            onSeek={playback.seek}
          />
        ))}
      </ul>
    </div>
  );
}
