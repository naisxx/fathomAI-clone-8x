"use client";

import { formatTimestamp } from "@/lib/types";

/**
 * A point in a recording, rendered one way everywhere.
 *
 * Before this, the same idea appeared in five different forms: a chip on action
 * items, plain mono text on transcript lines, a tinted pill on Ask citations,
 * a coloured span in search results, and something else again on highlights.
 * Same concept, five treatments, five sets of keyboard behaviour.
 *
 * The product's whole premise is that everything is an annotation on time, so
 * the thing that expresses a time should be a single component.
 */
export function Moment({
  sec,
  onSeek,
  variant = "chip",
  context,
  className = "",
}: {
  sec: number;
  onSeek: (sec: number) => void;
  /**
   * `chip`    — standalone, tinted, its own control
   * `inline`  — quiet, beside a speaker name
   * `display` — not interactive.
   *
   * `display` exists because several timestamps sit *inside* something that is
   * already a control: a transcript line button, a search-result link. Nesting
   * a button inside a button is invalid HTML and confuses assistive tech, so
   * those render the same mark without becoming a second target. The parent
   * already does the seeking.
   */
  variant?: "chip" | "inline" | "display";
  /** Added to the accessible name, e.g. a speaker or an action item. */
  context?: string;
  className?: string;
}) {
  const time = formatTimestamp(sec);
  const chip = variant === "chip";

  if (variant === "display") {
    return (
      <span
        className={`font-mono tabular-nums ${className}`}
        style={{ fontSize: "var(--text-micro)" }}
      >
        {time}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSeek(sec);
      }}
      aria-label={`Jump to ${time}${context ? `, ${context}` : ""}`}
      className={[
        "inline-flex min-h-6 shrink-0 items-center rounded-[var(--r-control)] font-mono tabular-nums",
        chip ? "px-2 py-1" : "px-1 py-0.5",
        className,
      ].join(" ")}
      style={
        chip
          ? { background: "var(--accent-tint)", color: "var(--accent)", fontSize: "var(--text-micro)" }
          : { color: "var(--faint)", fontSize: "var(--text-micro)" }
      }
    >
      {time}
    </button>
  );
}
