"use client";

import { formatTimestamp, type Meeting } from "@/lib/types";
import type { Playback } from "./usePlayback";
import { HighlightMarkers } from "./Highlights";
import type { Highlight } from "@/lib/types";

const RATES = [1, 1.25, 1.5, 2];

/**
 * Transport for both media kinds. The only visible difference is the label
 * under it — the controls behave identically, because they are driven by the
 * same hook.
 */
export function Player({
  meeting,
  playback,
  highlights = [],
  onSeekHighlight,
}: {
  meeting: Meeting;
  playback: Playback;
  highlights?: Highlight[];
  onSeekHighlight?: (sec: number) => void;
}) {
  const { currentTime, isPlaying, rate, toggle, seek, setRate, audioRef, lo, hi, isClip } =
    playback;
  // A clip's scrubber spans the clip, not the whole recording - otherwise the
  // handle sits in a sliver and most of the track is unreachable.
  const span = Math.max(0.001, hi - lo);
  const pct = ((currentTime - lo) / span) * 100;

  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      {meeting.audioSrc ? (
        // Native controls are intentionally off: the transport below drives it,
        // and two sets of controls would disagree about state.
        <audio ref={audioRef} src={meeting.audioSrc} preload="metadata" />
      ) : null}

      <div
        className="grid aspect-[16/7] place-items-center sm:aspect-[16/6]"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 40%, color-mix(in srgb, var(--accent) 18%, var(--bg)) 0%, var(--bg) 78%)",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="grid h-14 w-14 place-items-center rounded-full transition-transform hover:scale-105 active:scale-95"
            style={{ background: "var(--accent)", color: "var(--bg)" }}
          >
            {isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
                <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                <path d="M8 5v14l11-7-11-7Z" fill="currentColor" />
              </svg>
            )}
          </button>
          <span className="t-micro" style={{ color: "var(--faint)" }}>
            {isClip
              ? `Clip · ${formatTimestamp(lo)}–${formatTimestamp(hi)}`
              : playback.isReal
                ? "Audio only — no video"
                : "Simulated timeline — no audio"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t px-3 py-2.5" style={{ borderColor: "var(--border)" }}>
        <button
          type="button"
          onClick={toggle}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full"
          style={{ background: "var(--accent-tint)", color: "var(--accent)" }}
        >
          {isPlaying ? (
            <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden>
              <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
              <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden>
              <path d="M8 5v14l11-7-11-7Z" fill="currentColor" />
            </svg>
          )}
        </button>

        <span
          className="shrink-0 font-mono t-meta tabular-nums"
          style={{ color: "var(--muted)" }}
        >
          {formatTimestamp(currentTime)}
        </span>

        <label className="relative flex-1">
          <span className="sr-only">Seek</span>
          <input
            type="range"
            min={lo}
            max={hi}
            step={0.1}
            value={Math.min(Math.max(currentTime, lo), hi)}
            onChange={(e) => seek(Number(e.target.value))}
            className="range-bare peer relative z-10 w-full cursor-pointer"
            style={{ height: 24 }}
            aria-label="Seek"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 rounded-full"
            style={{ background: "var(--border-strong)" }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full"
            style={{ width: `${pct}%`, background: "var(--accent)" }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ left: `${pct}%`, background: "var(--accent)" }}
          />
          <HighlightMarkers
            highlights={highlights.filter((h) => h.startSec >= lo && h.startSec <= hi)}
            rangeFrom={lo}
            rangeTo={hi}
            onSeek={onSeekHighlight ?? seek}
          />
        </label>

        <span
          className="shrink-0 font-mono t-meta tabular-nums"
          style={{ color: "var(--faint)" }}
          title={isClip ? "End of this clip" : undefined}
        >
          {formatTimestamp(hi)}
        </span>

        <button
          type="button"
          onClick={() => setRate(RATES[(RATES.indexOf(rate) + 1) % RATES.length])}
          className="min-h-6 min-w-9 shrink-0 rounded px-1.5 py-1 font-mono t-meta"
          style={{ color: "var(--muted)" }}
          aria-label={`Playback speed ${rate} times. Click to change.`}
        >
          {rate}×
        </button>
      </div>
    </div>
  );
}
