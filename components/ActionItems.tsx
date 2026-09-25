"use client";

import { useEffect, useState } from "react";
import { formatTimestamp, type Meeting } from "@/lib/types";

/**
 * Completion state lives in localStorage, per browser.
 *
 * That is a deliberate limit, not an oversight: there is no account and no
 * database, so there is nowhere honest to persist a shared value. The UI says
 * so rather than implying the tick travels with the meeting.
 */
function useLocalCompletion(meetingId: string, initial: Record<string, boolean>) {
  const key = `recap:completed:${meetingId}`;
  const [state, setState] = useState(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setState({ ...initial, ...JSON.parse(raw) });
    } catch {
      // Private mode, blocked storage — fall back to the seeded values.
    }
    setHydrated(true);
    // Seeded defaults are stable for a given meeting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const toggle = (id: string) => {
    setState((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Nothing to do; the toggle still works for this session.
      }
      return next;
    });
  };

  return { state, toggle, hydrated };
}

export function ActionItems({
  meeting,
  onSeek,
}: {
  meeting: Meeting;
  onSeek: (sec: number) => void;
}) {
  const initial = Object.fromEntries(
    meeting.actionItems.map((a) => [a.id, a.completed])
  );
  const { state, toggle } = useLocalCompletion(meeting.id, initial);

  if (meeting.actionItems.length === 0) {
    return (
      <section>
        <h2
          className="mb-2 t-label"
          style={{ color: "var(--faint)" }}
        >
          Action items
        </h2>
        <div
          className="rounded-lg border p-4"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <p className="t-meta font-medium">None detected</p>
          <p
            className="mt-1 t-meta leading-relaxed"
            style={{ color: "var(--faint)" }}
          >
            {meeting.actionItemsAbsentReason ??
              "No action items were detected in this meeting."}
          </p>
        </div>
      </section>
    );
  }

  const done = meeting.actionItems.filter((a) => state[a.id]).length;

  return (
    <section>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <h2
          className="t-label"
          style={{ color: "var(--faint)" }}
        >
          Action items
        </h2>
        <span className="t-micro" style={{ color: "var(--faint)" }}>
          {done}/{meeting.actionItems.length} done
        </span>
      </div>

      <ul className="space-y-1.5">
        {meeting.actionItems.map((item) => {
          const completed = Boolean(state[item.id]);
          return (
            <li
              key={item.id}
              className="rounded-lg border p-2.5"
              style={{
                borderColor: "var(--border)",
                background: "var(--surface)",
              }}
            >
              <div className="flex items-start gap-2.5">
                {/*
                  The box is 18px for visual weight, but the label around it is a
                  24x24 hit area so it clears the WCAG 2.5.8 minimum without the
                  checkbox itself looking oversized.
                */}
                <span
                  onClick={() => toggle(item.id)}
                  className="-mt-0.5 -ml-0.5 grid h-6 w-6 shrink-0 cursor-pointer place-items-center"
                >
                  <input
                    id={`ai-${item.id}`}
                    type="checkbox"
                    checked={completed}
                    onChange={() => toggle(item.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-[18px] w-[18px] cursor-pointer accent-[color:var(--accent)]"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <label
                    htmlFor={`ai-${item.id}`}
                    className="block cursor-pointer t-meta leading-snug"
                    style={{
                      color: completed ? "var(--faint)" : "var(--text)",
                      textDecoration: completed ? "line-through" : "none",
                    }}
                  >
                    {item.description}
                  </label>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <button
                      type="button"
                      onClick={() => onSeek(item.timestampSec)}
                      className="inline-flex min-h-6 items-center rounded px-2 py-1 font-mono t-micro tabular-nums transition-colors"
                      style={{ background: "var(--accent-tint)", color: "var(--accent)" }}
                      aria-label={`Jump to ${formatTimestamp(item.timestampSec)} in the recording`}
                    >
                      @ {formatTimestamp(item.timestampSec)}
                    </button>

                    {item.assignee && (
                      <span className="t-micro" style={{ color: "var(--faint)" }}>
                        {item.assignee}
                      </span>
                    )}

                    <span
                      className="ml-auto t-label"
                      style={{ color: "var(--faint)" }}
                      title={
                        item.userGenerated
                          ? "Added by a person"
                          : "Extracted automatically"
                      }
                    >
                      {item.userGenerated ? "manual" : "auto"}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-2 t-micro" style={{ color: "var(--faint)" }}>
        Ticks are saved in this browser only — there is no account behind them.
      </p>
    </section>
  );
}
