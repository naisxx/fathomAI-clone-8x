"use client";

import { useState } from "react";
import type { Meeting } from "@/lib/types";
import { Moment } from "./Moment";

/**
 * Pre-written Q&A over one meeting.
 *
 * There is no model behind this and the panel says so in plain language at the
 * top, not in a footnote. The honest version of "AI answers" without a runtime
 * API key is: generate them once, ground each in the transcript, cite the
 * timestamps, and let the reader check.
 *
 * Citations are the whole point — an answer you can jump into and verify is
 * worth more than one you have to trust.
 */
export function AskPanel({
  meeting,
  onSeek,
}: {
  meeting: Meeting;
  onSeek: (sec: number) => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(
    meeting.ask.length > 0 ? 0 : null
  );

  if (meeting.ask.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="t-body font-medium">Nothing prepared for this meeting</p>
        <p
          className="mx-auto mt-1 max-w-sm t-meta leading-relaxed"
          style={{ color: "var(--faint)" }}
        >
          Answers here are written in advance, so a meeting only has them if
          someone wrote them. This one has none rather than a generated guess.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div
        className="mb-3 flex gap-2 rounded-lg border px-3 py-2.5"
        style={{ borderColor: "var(--elevated)", background: "var(--elevated)" }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className="mt-px shrink-0"
          style={{ color: "var(--muted)" }}
        >
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 8h.01M11 12h1v4h1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <p className="t-meta leading-relaxed" style={{ color: "var(--muted)" }}>
          <span className="font-medium" style={{ color: "var(--muted)" }}>
            Pre-written answers.
          </span>{" "}
          There is no live model here — nothing is generated when you click. Each
          answer was written against this transcript and cites the moments it
          came from, so you can check it rather than trust it.
        </p>
      </div>

      <ul className="space-y-1.5">
        {meeting.ask.map((entry, i) => {
          const open = openIndex === i;
          return (
            <li
              key={i}
              className="overflow-hidden rounded-lg border"
              style={{ borderColor: "var(--border)" }}
            >
              <h3>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  aria-controls={`ask-panel-${i}`}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left t-meta font-medium"
                  style={{ color: "var(--text)" }}
                >
                  <span
                    aria-hidden
                    className="grid h-5 w-5 shrink-0 place-items-center rounded-full t-micro"
                    style={{ background: "var(--accent-tint)", color: "var(--accent)" }}
                  >
                    ?
                  </span>
                  <span className="min-w-0 flex-1">{entry.question}</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                    className="shrink-0 transition-transform"
                    style={{
                      color: "var(--faint)",
                      transform: open ? "rotate(180deg)" : "none",
                    }}
                  >
                    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </h3>

              {open && (
                <div id={`ask-panel-${i}`} className="px-3 pb-3 pl-[42px]">
                  <p
                    className="t-meta leading-relaxed"
                    style={{ color: "var(--muted)" }}
                  >
                    {entry.answer}
                  </p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    <span
                      className="t-label"
                      style={{ color: "var(--faint)" }}
                    >
                      From
                    </span>
                    {entry.citations.map((sec) => (
                      <Moment key={sec} sec={sec} onSeek={onSeek} context={entry.question} />
                    ))}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
