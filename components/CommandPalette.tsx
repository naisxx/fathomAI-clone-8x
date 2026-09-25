"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { meetings } from "@/data";
import { search as searchAll } from "@/lib/search";
import { formatDuration, formatTimestamp } from "@/lib/types";

/**
 * One surface for finding anything.
 *
 * This replaces two competing search boxes — a header field that navigated to a
 * separate page, and a transcript field that filtered in place — and it answers
 * the complaint that started the revamp: the share control existed but could
 * not be found. A command palette means there is exactly one place to look for
 * any capability, rather than needing to know which rail it lives in.
 *
 * Deliberately absent from share views. A recipient was given one meeting, not
 * an account, and a palette that searched every other meeting would quietly
 * widen what the link grants.
 */

type Item = {
  id: string;
  kind: "action" | "meeting" | "moment";
  label: string;
  hint?: string;
  run: () => void;
};

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQ("");
    setActive(0);
    // Send focus back where it came from, or the palette strands keyboard users.
    restoreTo.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        restoreTo.current = document.activeElement as HTMLElement;
        setOpen((o) => !o);
        return;
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const items: Item[] = useMemo(() => {
    const term = q.trim();
    const out: Item[] = [];

    // Meetings, always available so the palette doubles as navigation.
    for (const m of meetings) {
      if (!term || m.title.toLowerCase().includes(term.toLowerCase())) {
        out.push({
          id: `m-${m.id}`,
          kind: "meeting",
          label: m.title,
          hint: `${formatDuration(m.durationSec)} · ${
            m.source === "real" ? "Real recording" : "Seeded"
          }`,
          run: () => router.push(`/meetings/${m.id}`),
        });
      }
    }

    // Moments — the reason this is more than a nav menu.
    if (term.length >= 2) {
      for (const group of searchAll(meetings, term)) {
        for (const hit of group.hits) {
          if (hit.timestampSec === undefined) continue;
          out.push({
            id: `h-${group.meeting.id}-${hit.timestampSec}-${hit.snippet.slice(0, 12)}`,
            kind: "moment",
            label: hit.snippet.replace(/\s+/g, " ").trim(),
            hint: `${group.meeting.title} · ${formatTimestamp(hit.timestampSec)}`,
            run: () =>
              router.push(
                `/meetings/${group.meeting.id}?t=${Math.floor(
                  hit.timestampSec!
                )}&tab=transcript`
              ),
          });
        }
      }
    }

    return out.slice(0, 40);
  }, [q, router]);

  useEffect(() => setActive(0), [q]);

  // Keep the highlighted row on screen while arrowing.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = items[active];
      if (item) {
        item.run();
        close();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-[var(--s-4)] pt-[12vh]"
      style={{ background: "color-mix(in srgb, #000 62%, transparent)" }}
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className="w-full overflow-hidden rounded-[var(--r-panel)] border shadow-2xl"
        style={{
          maxWidth: "36rem",
          borderColor: "var(--border-strong)",
          background: "var(--surface)",
        }}
      >
        <div
          className="flex items-center gap-[var(--s-3)] border-b px-[var(--s-4)]"
          style={{ borderColor: "var(--border)" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden style={{ color: "var(--faint)" }}>
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search meetings and moments…"
            aria-label="Search meetings and moments"
            aria-controls="palette-list"
            className="t-body h-12 w-full bg-transparent outline-none"
            style={{ color: "var(--text)" }}
          />
          <kbd className="t-micro shrink-0 rounded px-1.5 py-0.5" style={{ background: "var(--elevated)", color: "var(--faint)" }}>
            esc
          </kbd>
        </div>

        {items.length === 0 ? (
          <p className="t-meta p-[var(--s-6)] text-center" style={{ color: "var(--faint)" }}>
            Nothing matches &ldquo;{q.trim()}&rdquo;
          </p>
        ) : (
          <ul
            id="palette-list"
            ref={listRef}
            role="listbox"
            aria-label="Results"
            className="scroll-subtle max-h-[52vh] overflow-y-auto p-[var(--s-2)]"
          >
            {items.map((item, i) => (
              <li key={item.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => {
                    item.run();
                    close();
                  }}
                  className="flex w-full items-baseline gap-[var(--s-3)] rounded-[var(--r-control)] px-[var(--s-3)] py-[var(--s-2)] text-left"
                  style={{
                    background: i === active ? "var(--accent-tint)" : "transparent",
                  }}
                >
                  <span
                    className="t-micro w-14 shrink-0 uppercase"
                    style={{ color: "var(--faint)" }}
                  >
                    {item.kind}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className="t-meta block truncate"
                      style={{ color: i === active ? "var(--text)" : "var(--muted)" }}
                    >
                      {item.label}
                    </span>
                    {item.hint && (
                      <span className="t-micro block truncate" style={{ color: "var(--faint)" }}>
                        {item.hint}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
