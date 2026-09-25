"use client";

import { useEffect, useState } from "react";

/**
 * Lets the accent be compared on screen instead of in hex.
 *
 * Both options are already WCAG-verified in scripts/check-contrast.mjs, so
 * picking one is a two-line change to tokens.css rather than another round of
 * solving. Temporary, like the rest of this route.
 */
const OPTIONS = [
  {
    id: "violet",
    label: "Violet",
    dark: "#a78bfa",
    darkStrong: "#c4b0fc",
    onDark: "#17131f",
    light: "#6d28d9",
    lightStrong: "#5b21b6",
    onLight: "#ffffff",
    note: "5.31 dark · 5.64 light",
  },
  {
    id: "cyan",
    label: "Cyan",
    dark: "#3dd9f0",
    darkStrong: "#7ee8f8",
    onDark: "#07191d",
    light: "#0e728d",
    lightStrong: "#0a5a70",
    onLight: "#ffffff",
    note: "7.92 dark · 4.52 light",
  },
] as const;

export function AccentSwitcher() {
  const [active, setActive] = useState<string>("violet");

  useEffect(() => {
    const o = OPTIONS.find((x) => x.id === active);
    if (!o) return;
    const r = document.documentElement.style;
    const isLight =
      window.matchMedia?.("(prefers-color-scheme: light)").matches ?? false;
    r.setProperty("--accent-hue", o.dark);
    r.setProperty("--accent-strong-hue", o.darkStrong);
    r.setProperty("--on-accent-hue", o.onDark);
    r.setProperty("--accent-hue-light", o.light);
    r.setProperty("--accent-strong-hue-light", o.lightStrong);
    r.setProperty("--on-accent-hue-light", o.onLight);
    // The light-mode custom properties only apply inside the media query, so
    // set the resolved value too for immediate feedback while comparing.
    if (isLight) {
      r.setProperty("--accent", o.light);
      r.setProperty("--accent-strong", o.lightStrong);
      r.setProperty("--on-accent", o.onLight);
    } else {
      r.setProperty("--accent", o.dark);
      r.setProperty("--accent-strong", o.darkStrong);
      r.setProperty("--on-accent", o.onDark);
    }
  }, [active]);

  return (
    <div
      className="mb-[var(--s-8)] rounded-[var(--r-panel)] border p-[var(--s-4)]"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <p className="t-micro mb-[var(--s-3)]" style={{ color: "var(--faint)" }}>
        Accent — pick one, the whole page updates
      </p>
      <div className="flex flex-wrap gap-[var(--s-2)]">
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setActive(o.id)}
            aria-pressed={active === o.id}
            className="t-meta flex min-h-10 items-center gap-2 rounded-[var(--r-control)] border px-3"
            style={{
              borderColor:
                active === o.id ? "var(--accent)" : "var(--border-strong)",
              background: active === o.id ? "var(--accent-tint)" : "transparent",
              color: active === o.id ? "var(--accent)" : "var(--muted)",
            }}
          >
            <span
              aria-hidden
              className="h-4 w-4 rounded-full"
              style={{ background: o.dark }}
            />
            {o.label}
            <span className="t-micro" style={{ color: "var(--faint)" }}>
              {o.note}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
