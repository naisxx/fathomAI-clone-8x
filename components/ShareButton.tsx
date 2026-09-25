"use client";

import { useEffect, useState } from "react";
import type { Meeting } from "@/lib/types";

/**
 * Copies the share link to the clipboard and shows the URL, so the link can
 * still be used when the clipboard API is unavailable (insecure origin, denied
 * permission) rather than the button silently doing nothing.
 */
export function ShareButton({ meeting }: { meeting: Meeting }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [href, setHref] = useState("");

  useEffect(() => {
    setHref(`${window.location.origin}/share/${meeting.shareToken}`);
  }, [meeting.shareToken]);

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
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border text-[13px] font-medium"
        style={{
          borderColor: "var(--border-strong)",
          background: "var(--bg-raised)",
          color: "var(--text)",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        Share
      </button>

      {open && (
        <div
          className="mt-2 rounded-lg border p-3"
          style={{ borderColor: "var(--border)", background: "var(--bg-raised)" }}
        >
          <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Anyone with this link can view the recording, summary and transcript.
            Action items and attendee details are not included.
          </p>

          <div className="mt-2 flex gap-1.5">
            <input
              readOnly
              value={href}
              onFocus={(e) => e.currentTarget.select()}
              aria-label="Share link"
              className="min-w-0 flex-1 rounded border px-2 py-1.5 font-mono text-[11px] outline-none"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg)",
                color: "var(--text-muted)",
              }}
            />
            <button
              type="button"
              onClick={copy}
              className="min-h-8 shrink-0 rounded px-2.5 text-[12px] font-medium"
              style={{ background: "var(--accent)", color: "var(--bg)" }}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <a
            href={`/share/${meeting.shareToken}`}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-[12px]"
            style={{ color: "var(--accent)" }}
          >
            Open the shared view →
          </a>
        </div>
      )}
    </section>
  );
}
