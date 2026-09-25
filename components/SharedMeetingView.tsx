"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatDuration, type Meeting } from "@/lib/types";
import { ProvenanceBadge, ProvenanceNote } from "./ProvenanceBadge";
import { usePlayback } from "./usePlayback";
import { Player } from "./Player";
import { TranscriptPanel } from "./TranscriptPanel";
import { SummaryPanel } from "./SummaryPanel";

type Tab = "summary" | "transcript";

const TABS: { id: Tab; label: string }[] = [
  { id: "summary", label: "Summary" },
  { id: "transcript", label: "Transcript" },
];

/**
 * What an unsigned visitor sees.
 *
 * Deliberately narrower than the owner's view: the recording, the summary and
 * the transcript, and nothing that belongs to the team around it. No action
 * items, no attendee email addresses, no route into any other meeting.
 *
 * The reduction is stated on the page rather than left to be noticed, because a
 * visitor cannot tell the difference between "this meeting has no action items"
 * and "you are not being shown them".
 */
export function SharedMeetingView({ meeting }: { meeting: Meeting }) {
  const playback = usePlayback(meeting.durationSec, meeting.audioSrc);
  const [tab, setTab] = useState<Tab>(meeting.summary ? "summary" : "transcript");
  const [follow, setFollow] = useState(true);

  const { seek } = playback;

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
    let idx = -1;
    for (let i = 0; i < meeting.transcript.length; i++) {
      if (meeting.transcript[i].startSec <= t + 0.01) idx = i;
      else break;
    }
    return idx;
  }, [playback.currentTime, meeting.transcript]);

  const onTabKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const i = TABS.findIndex((t) => t.id === tab);
      let next = i;
      if (e.key === "ArrowRight") next = (i + 1) % TABS.length;
      else if (e.key === "ArrowLeft") next = (i - 1 + TABS.length) % TABS.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = TABS.length - 1;
      else return;
      e.preventDefault();
      setTab(TABS[next].id);
      document.getElementById(`tab-${TABS[next].id}`)?.focus();
    },
    [tab]
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div
        className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border px-3.5 py-2.5 text-[13px]"
        style={{ borderColor: "var(--border)", background: "var(--bg-raised)" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden style={{ color: "var(--text-faint)" }}>
          <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span className="font-medium">Shared recording</span>
        <span style={{ color: "var(--text-faint)" }}>
          — read-only. You are seeing the recording, summary and transcript.
          Action items and attendee details stay with the team.
        </span>
      </div>

      <header className="mb-5">
        <h1 className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
          {meeting.title}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
          <ProvenanceBadge meeting={meeting} size="md" />
          <span className="text-[13px]" style={{ color: "var(--text-faint)" }}>
            {new Date(meeting.scheduledStart).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
              timeZone: "UTC",
            })}{" "}
            · {formatDuration(meeting.durationSec)}
          </span>
        </div>
      </header>

      <Player meeting={meeting} playback={playback} />

      <div className="mt-4">
        <ProvenanceNote meeting={meeting} />
      </div>

      <div
        className="mt-4 overflow-hidden rounded-xl border"
        style={{ borderColor: "var(--border)", background: "var(--bg-raised)" }}
      >
        <div
          role="tablist"
          aria-label="Meeting content"
          onKeyDown={onTabKeyDown}
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
                tabIndex={selected ? 0 : -1}
                onClick={() => setTab(t.id)}
                className="relative min-h-11 px-3 py-2.5 text-[13px] font-medium transition-colors"
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

        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} tabIndex={-1}>
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

      <p
        className="mt-4 text-[12px] leading-relaxed"
        style={{ color: "var(--text-faint)" }}
      >
        Speakers are shown by display name only. Email addresses are not included
        in a shared link.
      </p>
    </div>
  );
}
