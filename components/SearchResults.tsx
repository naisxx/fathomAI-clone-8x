"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { meetings } from "@/data";
import { search, totalHitCount, type HitKind, type SearchHit } from "@/lib/search";
import { formatTimestamp, type Meeting } from "@/lib/types";
import { ProvenanceBadge } from "./ProvenanceBadge";

const KIND_LABEL: Record<HitKind, string> = {
  title: "Title",
  summary: "Summary",
  action: "Action item",
  transcript: "Transcript",
};

function Highlighted({ hit }: { hit: SearchHit }) {
  const before = hit.snippet.slice(0, hit.matchStart);
  const match = hit.snippet.slice(hit.matchStart, hit.matchStart + hit.matchLength);
  const after = hit.snippet.slice(hit.matchStart + hit.matchLength);
  return (
    <>
      {before}
      <mark
        className="rounded-sm px-0.5"
        style={{ background: "var(--accent-dim)", color: "var(--accent-strong)" }}
      >
        {match}
      </mark>
      {after}
    </>
  );
}

function HitRow({ meeting, hit }: { meeting: Meeting; hit: SearchHit }) {
  const href =
    hit.timestampSec !== undefined
      ? `/meetings/${meeting.id}?t=${Math.floor(hit.timestampSec)}&tab=transcript`
      : `/meetings/${meeting.id}`;

  return (
    <li>
      <Link
        href={href}
        className="flex gap-3 rounded-lg p-2.5 transition-colors"
        style={{ background: "transparent" }}
      >
        <span className="flex w-16 shrink-0 flex-col items-start gap-1">
          <span
            className="rounded px-1 py-px text-[10px] uppercase tracking-wide"
            style={{ background: "var(--bg-hover)", color: "var(--text-faint)" }}
          >
            {KIND_LABEL[hit.kind]}
          </span>
          {hit.timestampSec !== undefined && (
            <span
              className="font-mono text-[11px] tabular-nums"
              style={{ color: "var(--accent)" }}
            >
              {formatTimestamp(hit.timestampSec)}
            </span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          {hit.speaker && (
            <span
              className="mb-0.5 block text-[11px] font-medium"
              style={{ color: "var(--text-faint)" }}
            >
              {hit.speaker}
            </span>
          )}
          <span
            className="block text-[13px] leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            <Highlighted hit={hit} />
          </span>
        </span>
      </Link>
    </li>
  );
}

export function SearchResults() {
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [q, setQ] = useState(initial);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Keep the URL shareable without pushing a history entry per keystroke.
  useEffect(() => {
    const id = setTimeout(() => {
      const url = q.trim()
        ? `/search?q=${encodeURIComponent(q.trim())}`
        : "/search";
      window.history.replaceState(null, "", url);
    }, 250);
    return () => clearTimeout(id);
  }, [q]);

  const results = useMemo(() => search(meetings, q), [q]);
  const total = totalHitCount(results);
  const tooShort = q.trim().length > 0 && q.trim().length < 2;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Search</h1>
      <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
        Across every meeting — transcripts, summaries, action items and titles.
        A transcript hit takes you to the moment it was said.
      </p>

      <div className="relative mt-5">
        <label htmlFor="search-page-input" className="sr-only">
          Search query
        </label>
        <svg
          aria-hidden
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--text-faint)" }}
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          id="search-page-input"
          ref={inputRef}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try “pricing”, “migration”, or “Friday”"
          className="h-12 w-full rounded-xl border pl-10 pr-3 text-[15px] outline-none"
          style={{
            borderColor: "var(--border)",
            background: "var(--bg-raised)",
            color: "var(--text)",
          }}
        />
      </div>

      <p
        className="mt-3 text-[13px]"
        aria-live="polite"
        style={{ color: "var(--text-faint)" }}
      >
        {q.trim().length < 2
          ? tooShort
            ? "Keep typing — at least two characters."
            : "Start typing to search."
          : `${total} ${total === 1 ? "result" : "results"} in ${results.length} ${
              results.length === 1 ? "meeting" : "meetings"
            }`}
      </p>

      {/* Empty query */}
      {q.trim().length < 2 && (
        <div className="mt-8">
          <p
            className="mb-2 text-xs font-semibold uppercase tracking-[0.08em]"
            style={{ color: "var(--text-faint)" }}
          >
            Try one of these
          </p>
          <div className="flex flex-wrap gap-2">
            {["pricing", "migration", "Friday", "export", "error budget"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQ(s)}
                className="min-h-8 rounded-full border px-3 py-1.5 text-[13px]"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {q.trim().length >= 2 && results.length === 0 && (
        <div
          className="mt-8 rounded-xl border p-10 text-center"
          style={{ borderColor: "var(--border)", background: "var(--bg-raised)" }}
        >
          <p className="text-sm font-medium">
            Nothing matches &ldquo;{q.trim()}&rdquo;
          </p>
          <p
            className="mx-auto mt-1.5 max-w-sm text-[13px] leading-relaxed"
            style={{ color: "var(--text-faint)" }}
          >
            Search covers all {meetings.length} meetings — one real recording and{" "}
            {meetings.length - 1} seeded. Try a shorter word, or a term from the Q3
            Platform Review, which has the most content.
          </p>
        </div>
      )}

      {/* Results */}
      <div className="mt-6 space-y-4">
        {results.map(({ meeting, hits, totalHits }) => (
          <section
            key={meeting.id}
            className="overflow-hidden rounded-xl border"
            style={{ borderColor: "var(--border)", background: "var(--bg-raised)" }}
          >
            <div
              className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b px-3 py-2.5"
              style={{ borderColor: "var(--border)" }}
            >
              <Link
                href={`/meetings/${meeting.id}`}
                className="text-[14px] font-semibold"
              >
                {meeting.title}
              </Link>
              <ProvenanceBadge meeting={meeting} />
              <span
                className="ml-auto text-[11px]"
                style={{ color: "var(--text-faint)" }}
              >
                {totalHits} {totalHits === 1 ? "hit" : "hits"}
              </span>
            </div>
            <ul className="p-1.5">
              {hits.map((hit, i) => (
                <HitRow key={i} meeting={meeting} hit={hit} />
              ))}
            </ul>
            {totalHits > hits.length && (
              <div
                className="border-t px-3 py-2 text-[12px]"
                style={{ borderColor: "var(--border)", color: "var(--text-faint)" }}
              >
                +{totalHits - hits.length} more in this meeting
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
