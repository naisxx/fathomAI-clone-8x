"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatTimestamp, type Highlight, type Meeting } from "@/lib/types";

/**
 * Highlights — marked moments on a recording.
 *
 * Fathom's are made mid-call. We have no live call, so ours are made while
 * reviewing, which is a different action; the UI says so rather than pretending
 * otherwise.
 *
 * Seeded highlights come from the meeting data. Ones a viewer makes live in
 * localStorage, per browser, with the same honesty note the action-item ticks
 * carry — there is no account to attach them to.
 */

const key = (meetingId: string) => `recap:highlights:${meetingId}`;

function loadLocal(meetingId: string): Highlight[] {
  try {
    const raw = localStorage.getItem(key(meetingId));
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Hand-written storage can be anything; only keep well-formed entries.
    return parsed.filter(
      (h): h is Highlight =>
        !!h &&
        typeof (h as Highlight).id === "string" &&
        typeof (h as Highlight).startSec === "number"
    );
  } catch {
    return [];
  }
}

function saveLocal(meetingId: string, list: Highlight[]) {
  try {
    localStorage.setItem(key(meetingId), JSON.stringify(list));
  } catch {
    // Private mode or blocked storage — the session still works, it just
    // will not survive a reload. Not worth interrupting anyone over.
  }
}

/** Seeded + local, in recording order. */
export function useHighlights(meeting: Meeting) {
  const [local, setLocal] = useState<Highlight[]>([]);

  useEffect(() => {
    setLocal(loadLocal(meeting.id));
  }, [meeting.id]);

  const all = useMemo(
    () => [...meeting.highlights, ...local].sort((a, b) => a.startSec - b.startSec),
    [meeting.highlights, local]
  );

  const add = useCallback(
    (startSec: number, label: string) => {
      const h: Highlight = {
        id: `hl-local-${Date.now()}`,
        label: label.trim() || null,
        startSec,
        userGenerated: true,
      };
      setLocal((prev) => {
        const next = [...prev, h];
        saveLocal(meeting.id, next);
        return next;
      });
    },
    [meeting.id]
  );

  const remove = useCallback(
    (id: string) => {
      setLocal((prev) => {
        const next = prev.filter((h) => h.id !== id);
        saveLocal(meeting.id, next);
        return next;
      });
    },
    [meeting.id]
  );

  return { all, add, remove };
}

/** Markers along the player scrubber. */
export function HighlightMarkers({
  highlights,
  rangeFrom,
  rangeTo,
  onSeek,
}: {
  highlights: Highlight[];
  /** The span the scrubber represents — the clip window, or the whole meeting. */
  rangeFrom: number;
  rangeTo: number;
  onSeek: (sec: number) => void;
}) {
  const span = Math.max(0.001, rangeTo - rangeFrom);
  if (highlights.length === 0) return null;
  return (
    <>
      {highlights.map((h) => (
        <button
          key={h.id}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSeek(h.startSec);
          }}
          className="absolute top-1/2 h-3.5 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: `${Math.min(100, Math.max(0, ((h.startSec - rangeFrom) / span) * 100))}%`,
            background: "var(--muted)",
            // Markers can land within a pixel of each other; a hairline keeps
            // two adjacent ones readable as two rather than one fat blob.
            boxShadow: "0 0 0 1px var(--bg)",
          }}
          title={`${formatTimestamp(h.startSec)} — ${h.label ?? "Highlight"}`}
          aria-label={`Jump to highlight at ${formatTimestamp(h.startSec)}${
            h.label ? `: ${h.label}` : ""
          }`}
        />
      ))}
    </>
  );
}

export function HighlightsPanel({
  meeting,
  currentTime,
  onSeek,
  highlights,
  onAdd,
  onRemove,
}: {
  meeting: Meeting;
  currentTime: number;
  onSeek: (sec: number) => void;
  highlights: Highlight[];
  onAdd: (sec: number, label: string) => void;
  onRemove: (id: string) => void;
}) {
  const [composing, setComposing] = useState(false);
  const [label, setLabel] = useState("");
  const [capturedAt, setCapturedAt] = useState(0);

  const start = () => {
    setCapturedAt(currentTime);
    setLabel("");
    setComposing(true);
  };

  const commit = () => {
    onAdd(capturedAt, label);
    setComposing(false);
    setLabel("");
  };

  return (
    <section>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <h2
          className="t-label"
          style={{ color: "var(--faint)" }}
        >
          Highlights
        </h2>
        {highlights.length > 0 && (
          <span className="t-micro" style={{ color: "var(--faint)" }}>
            {highlights.length}
          </span>
        )}
      </div>

      {composing ? (
        <div
          className="rounded-lg border p-2.5"
          style={{ borderColor: "var(--accent-tint)", background: "var(--surface)" }}
        >
          <p className="mb-1.5 t-micro" style={{ color: "var(--faint)" }}>
            Marking{" "}
            <span className="font-mono tabular-nums" style={{ color: "var(--accent)" }}>
              {formatTimestamp(capturedAt)}
            </span>
          </p>
          <input
            autoFocus
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") setComposing(false);
            }}
            placeholder="What happened here? (optional)"
            aria-label="Highlight label"
            className="h-8 w-full rounded border px-2 t-meta outline-none"
            style={{
              borderColor: "var(--border)",
              background: "var(--bg)",
              color: "var(--text)",
            }}
          />
          <div className="mt-2 flex gap-1.5">
            <button
              type="button"
              onClick={commit}
              className="min-h-7 flex-1 rounded px-2 t-meta font-medium"
              style={{ background: "var(--accent)", color: "var(--bg)" }}
            >
              Save highlight
            </button>
            <button
              type="button"
              onClick={() => setComposing(false)}
              className="min-h-7 rounded px-2 t-meta"
              style={{ color: "var(--muted)" }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={start}
          className="flex min-h-9 w-full items-center justify-center gap-2 rounded-lg border t-meta font-medium"
          style={{
            borderColor: "var(--border-strong)",
            background: "var(--surface)",
            color: "var(--text)",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M5 3.5h14v16l-7-4.5-7 4.5v-16Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
          Highlight {formatTimestamp(currentTime)}
        </button>
      )}

      {highlights.length === 0 ? (
        <p
          className="mt-2 t-meta leading-relaxed"
          style={{ color: "var(--faint)" }}
        >
          No highlights yet. Play to a moment worth keeping and mark it — the
          button captures wherever the player currently is.
        </p>
      ) : (
        <ul className="mt-2 space-y-1">
          {highlights.map((h) => (
            <li key={h.id} className="group flex items-start gap-1.5">
              <button
                type="button"
                onClick={() => onSeek(h.startSec)}
                className="flex min-h-8 flex-1 items-start gap-2 rounded-lg border p-2 text-left"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface)",
                }}
                aria-label={`Jump to ${formatTimestamp(h.startSec)}${
                  h.label ? `: ${h.label}` : ""
                }`}
              >
                <span
                  className="mt-px shrink-0 font-mono t-micro tabular-nums"
                  style={{ color: "var(--muted)" }}
                >
                  {formatTimestamp(h.startSec)}
                </span>
                <span
                  className="min-w-0 flex-1 t-meta leading-snug"
                  style={{ color: "var(--muted)" }}
                >
                  {h.label ?? <em style={{ color: "var(--faint)" }}>Unlabelled</em>}
                </span>
              </button>
              {h.userGenerated && (
                <button
                  type="button"
                  onClick={() => onRemove(h.id)}
                  className="grid h-8 w-6 shrink-0 place-items-center rounded"
                  style={{ color: "var(--faint)" }}
                  aria-label={`Delete highlight at ${formatTimestamp(h.startSec)}`}
                >
                  ×
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-2 t-micro leading-relaxed" style={{ color: "var(--faint)" }}>
        Fathom makes highlights during a call. There is no live call here, so
        these are made while reviewing. Ones you add are saved in this browser
        only.
      </p>
    </section>
  );
}
