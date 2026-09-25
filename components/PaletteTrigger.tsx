"use client";

import { useEffect } from "react";
import { openPalette } from "./paletteBus";

/**
 * The visible way in to the command palette.
 *
 * This used to be a real search field that submitted to /search, sitting beside
 * a palette that opened on ⌘K — two surfaces answering the same question, and
 * the field even rendered a ⌘K hint it did not honour. Typing in one and
 * pressing the shortcut for the other gave you different results for the same
 * word, which is the exact confusion the palette was introduced to remove.
 *
 * So it keeps the shape of a search field, because that is what tells someone
 * they can search here, but it is a button: there is one place a query goes.
 */
export function PaletteTrigger() {
  // "/" is the other convention for "start searching", and it has to open the
  // palette rather than focus something, now that there is nothing to focus.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement;
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable);
      if (typing) return;
      e.preventDefault();
      openPalette();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <button
      type="button"
      onClick={openPalette}
      aria-keyshortcuts="Meta+K Control+K"
      className="relative flex h-9 min-w-0 flex-1 items-center gap-2 rounded-[var(--r-control)] border pl-2.5 pr-2 text-left sm:max-w-xs"
      style={{
        borderColor: "var(--border)",
        background: "var(--surface)",
        color: "var(--faint)",
      }}
    >
      <svg
        aria-hidden
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        className="shrink-0"
      >
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="t-meta truncate">Search meetings and moments</span>
      <kbd
        aria-hidden
        className="t-micro ml-auto hidden shrink-0 rounded px-1.5 py-0.5 sm:block"
        style={{ background: "var(--elevated)", color: "var(--faint)" }}
      >
        ⌘K
      </kbd>
    </button>
  );
}
