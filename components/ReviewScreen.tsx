"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatDuration, type Meeting } from "@/lib/types";
import { ProvenanceBadge, ProvenanceNote } from "./ProvenanceBadge";
import { usePlayback } from "./usePlayback";
import { Player } from "./Player";
import { TranscriptPanel } from "./TranscriptPanel";
import { SummaryPanel } from "./SummaryPanel";
import { ActionItems } from "./ActionItems";

type Tab = "summary" | "transcript";

const TABS: { id: Tab; label: string }[] = [
  { id: "summary", label: "Summary" },
  { id: "transcript", label: "Transcript" },
];

export function ReviewScreen({ meeting }: { meeting: Meeting }) {
  const playback = usePlayback(meeting.durationSec, meeting.audioSrc);
  const [tab, setTab] = useState<Tab>(meeting.summary ? "summary" : "transcript");
  const [follow, setFollow] = useState(true);

  const { seek } = playback;

  // Deep link: ?t=645 lands at that second, ?tab= picks the pane.
  // Read once on mount — after that the user's clicks own the state.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = Number(params.get("t"));
    const requested = params.get("tab");
    if (requested === "transcript" || requested === "summary") setTab(requested);
    if (Number.isFinite(t) && t > 0) {
      seek(t);
      if (!requested) setTab("transcript");
    }
  }, [seek]);

  const activeIndex = useMemo(() => {
    const t = playback.currentTime;
    // Last segment that has started. Linear is fine at this size and avoids
    // an index that can drift out of sync with the array.
    let idx = -1;
    for (let i = 0; i < meeting.transcript.length; i++) {
      if (meeting.transcript[i].startSec <= t + 0.01) idx = i;
      else break;
    }
    return idx;
  }, [playback.currentTime, meeting.transcript]);

  /** Seeking from anywhere should show you the moment you asked for. */
  const seekAndShow = useCallback(
    (sec: number) => {
      seek(sec);
      setTab("transcript");
      setFollow(true);
    },
    [seek]
  );

  const unmatched = meeting.invitees.filter(
    (i) => i.matchedSpeakerDisplayName === null
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px]"
        style={{ color: "var(--text-muted)" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        All meetings
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Left: player + tabbed pane */}
        <div className="min-w-0">
          <Player meeting={meeting} playback={playback} />

          <div
            className="mt-4 overflow-hidden rounded-xl border"
            style={{ borderColor: "var(--border)", background: "var(--bg-raised)" }}
          >
            <div
              role="tablist"
              aria-label="Meeting content"
              className="flex gap-1 border-b px-2"
              style={{ borderColor: "var(--border)" }}
            >
              {TABS.map((t) => {
                const selected = tab === t.id;
                return (
                  <button
                    key={t.id}
                    role="tab"
                    id={`tab-${t.id}`}
                    aria-selected={selected}
                    aria-controls={`panel-${t.id}`}
                    onClick={() => setTab(t.id)}
                    className="relative px-3 py-2.5 text-[13px] font-medium transition-colors"
                    style={{ color: selected ? "var(--accent)" : "var(--text-muted)" }}
                  >
                    {t.label}
                    {selected && (
                      <span
                        aria-hidden
                        className="absolute inset-x-2 -bottom-px h-0.5 rounded-full"
                        style={{ background: "var(--accent)" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div
              role="tabpanel"
              id={`panel-${tab}`}
              aria-labelledby={`tab-${tab}`}
              tabIndex={-1}
            >
              {tab === "summary" ? (
                <SummaryPanel meeting={meeting} />
              ) : (
                <TranscriptPanel
                  meeting={meeting}
                  playback={playback}
                  activeIndex={activeIndex}
                  follow={follow}
                  onToggleFollow={() => setFollow((f) => !f)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right: meta rail */}
        <aside className="min-w-0 space-y-5">
          <div>
            <h1 className="text-xl font-semibold leading-tight tracking-tight">
              {meeting.title}
            </h1>
            <p className="mt-1.5 text-[13px]" style={{ color: "var(--text-faint)" }}>
              {new Date(meeting.scheduledStart).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })}{" "}
              · {formatDuration(meeting.durationSec)}
            </p>
            <div className="mt-2.5">
              <ProvenanceBadge meeting={meeting} size="md" />
            </div>
          </div>

          <ProvenanceNote meeting={meeting} />

          <ActionItems meeting={meeting} onSeek={seekAndShow} />

          <section>
            <h2
              className="mb-2 text-xs font-semibold uppercase tracking-[0.08em]"
              style={{ color: "var(--text-faint)" }}
            >
              Participants ({meeting.invitees.length})
            </h2>
            <ul className="space-y-1">
              {meeting.invitees.map((p) => (
                <li
                  key={p.name}
                  className="flex items-center gap-2 text-[13px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span className="truncate">{p.name}</span>
                  {p.isExternal && (
                    <span
                      className="shrink-0 rounded px-1 py-px text-[10px] uppercase tracking-wide"
                      style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
                    >
                      external
                    </span>
                  )}
                  {p.matchedSpeakerDisplayName === null && (
                    <span
                      className="shrink-0 rounded px-1 py-px text-[10px] uppercase tracking-wide"
                      style={{ background: "var(--seeded-dim)", color: "var(--seeded)" }}
                      title="This invitee could not be matched to any transcript speaker."
                    >
                      unmatched
                    </span>
                  )}
                </li>
              ))}
            </ul>

            {unmatched.length > 0 && (
              <p
                className="mt-2 text-[11px] leading-relaxed"
                style={{ color: "var(--text-faint)" }}
              >
                {unmatched.length} participant{unmatched.length > 1 ? "s" : ""} could not
                be matched to a transcript speaker. Fathom&rsquo;s own API models this
                join as nullable, so we show the gap instead of guessing.
              </p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
