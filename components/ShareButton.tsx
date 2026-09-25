"use client";

import { useEffect, useState } from "react";
import { formatDuration, formatTimestamp, type Meeting } from "@/lib/types";

/**
 * Copies the share link to the clipboard and shows the URL, so the link can
 * still be used when the clipboard API is unavailable (insecure origin, denied
 * permission) rather than the button silently doing nothing.
 */
const CLIP_LENGTHS = [30, 60, 120];

export function ShareButton({
  meeting,
  currentTime = 0,
}: {
  meeting: Meeting;
  /** Where the player is, so a clip can start from the moment you are on. */
  currentTime?: number;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");
  /** null = share the whole meeting. */
  const [clipSec, setClipSec] = useState<number | null>(null);
  const [clipFrom, setClipFrom] = useState(0);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // Freeze the start when clipping begins, so the link does not drift as the
  // player keeps moving underneath it.
  const startClip = (len: number) => {
    setClipFrom(currentTime);
    setClipSec(len);
  };

  const clipTo = Math.min(meeting.durationSec, clipFrom + (clipSec ?? 0));
  const href = origin
    ? clipSec === null
      ? `${origin}/share/${meeting.shareToken}`
      : `${origin}/share/${meeting.shareToken}?from=${Math.floor(clipFrom)}&to=${Math.ceil(clipTo)}`
    : "";

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section>
      {/*
        Sharing is a headline feature, so it gets a primary button rather than a
        quiet outlined one, and a chevron so it reads as something that opens.
        It was previously easy to miss: an outlined button labelled only "Share",
        collapsed by default, sitting in a rail that drops below the fold on a
        narrow window.
      */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg t-meta font-semibold"
        style={{ background: "var(--accent)", color: "var(--bg)" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        Share or clip
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className="transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        >
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          className="mt-2 rounded-lg border p-3"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <p className="t-meta leading-relaxed" style={{ color: "var(--muted)" }}>
            Anyone with this link can view the recording, summary and transcript.
            Action items and attendee details are not included.
          </p>
          <div className="mt-2.5">
            <p
              className="mb-1.5 t-label"
              style={{ color: "var(--faint)" }}
            >
              What to share
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setClipSec(null)}
                aria-pressed={clipSec === null}
                className="min-h-7 rounded-full border px-2.5 t-meta"
                style={{
                  borderColor: clipSec === null ? "var(--accent)" : "var(--border)",
                  color: clipSec === null ? "var(--accent)" : "var(--muted)",
                  background: clipSec === null ? "var(--accent-tint)" : "transparent",
                }}
              >
                Whole meeting
              </button>
              {CLIP_LENGTHS.map((len) => (
                <button
                  key={len}
                  type="button"
                  onClick={() => startClip(len)}
                  aria-pressed={clipSec === len}
                  className="min-h-7 rounded-full border px-2.5 t-meta"
                  style={{
                    borderColor: clipSec === len ? "var(--accent)" : "var(--border)",
                    color: clipSec === len ? "var(--accent)" : "var(--muted)",
                    background: clipSec === len ? "var(--accent-tint)" : "transparent",
                  }}
                >
                  {len}s clip
                </button>
              ))}
            </div>
            <p className="mt-1.5 t-micro" style={{ color: "var(--muted)" }}>
              {clipSec === null
                ? `The full ${formatDuration(meeting.durationSec)} recording.`
                : `A ${formatDuration(clipTo - clipFrom)} clip, from ${formatTimestamp(clipFrom)} to ${formatTimestamp(clipTo)}. Only that part of the transcript is included.`}
            </p>
          </div>

          <p className="mt-2.5 t-micro leading-relaxed" style={{ color: "var(--faint)" }}>
            Tokens are random and unguessable, but there is no account system
            behind them — in this demo every share link is effectively public.
          </p>

          <div className="mt-2 flex gap-1.5">
            <input
              readOnly
              value={href}
              onFocus={(e) => e.currentTarget.select()}
              aria-label="Share link"
              className="min-w-0 flex-1 rounded border px-2 py-1.5 font-mono t-micro outline-none"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg)",
                color: "var(--muted)",
              }}
            />
            <button
              type="button"
              onClick={copy}
              className="min-h-8 shrink-0 rounded px-2.5 t-meta font-medium"
              style={{ background: "var(--accent)", color: "var(--bg)" }}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <a
            href={href.replace(origin, "") || `/share/${meeting.shareToken}`}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block t-meta"
            style={{ color: "var(--accent)" }}
          >
            {clipSec === null ? "Open the shared view →" : "Open the clip →"}
          </a>
        </div>
      )}
    </section>
  );
}
