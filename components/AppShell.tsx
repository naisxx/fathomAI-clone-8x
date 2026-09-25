"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { meetings } from "@/data";
import { formatDuration } from "@/lib/types";

/**
 * The persistent shell.
 *
 * Before this the app was four unrelated page layouts: opening a meeting threw
 * away the list, and the only route back was the browser button or a "All
 * meetings" link. Meetings now live in a rail that is part of the layout, so
 * React keeps it mounted across navigation and your scroll position in it
 * survives opening something.
 *
 * Share views get none of it. A recipient was handed one meeting; a rail
 * listing every other meeting would quietly widen what the link grants — the
 * same reasoning that keeps the command palette off those pages.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const [drawerOpen, setDrawerOpen] = useState(false);

  const bare = pathname.startsWith("/share");

  // Close the drawer on navigation, or it covers the thing you just opened.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Escape closes the drawer, same as the palette.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  if (bare) return <>{children}</>;

  return (
    <div className="flex">
      {/* Backdrop, drawer mode only */}
      {drawerOpen && (
        <button
          type="button"
          aria-label="Close meetings"
          onClick={() => setDrawerOpen(false)}
          className="app-rail-backdrop fixed inset-0 z-30"
          style={{ background: "color-mix(in srgb, #000 55%, transparent)" }}
        />
      )}

      <nav
        aria-label="Meetings"
        data-open={drawerOpen ? "true" : "false"}
        className="app-rail border-r"
        style={
          {
            borderColor: "var(--border)",
            background: "var(--bg)",
            "--rail-x": drawerOpen ? "0%" : "-100%",
          } as React.CSSProperties
        }
      >
        <div className="scroll-subtle h-full overflow-y-auto p-[var(--s-3)]">
          <div className="mb-[var(--s-2)] flex items-center justify-between px-[var(--s-2)]">
            <h2 className="t-label" style={{ color: "var(--faint)" }}>
              Meetings
            </h2>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close meetings"
              className="app-rail-close t-meta min-h-6 rounded px-1.5"
              style={{ color: "var(--muted)" }}
            >
              ✕
            </button>
          </div>

          <ul className="space-y-0.5">
            {meetings.map((m) => {
              const active = pathname === `/meetings/${m.id}`;
              return (
                <li key={m.id}>
                  <Link
                    href={`/meetings/${m.id}`}
                    aria-current={active ? "page" : undefined}
                    className="block rounded-[var(--r-control)] px-[var(--s-2)] py-[var(--s-2)]"
                    style={{
                      background: active ? "var(--accent-tint)" : "transparent",
                    }}
                  >
                    <span className="flex items-start gap-[var(--s-2)]">
                      <span
                        aria-hidden
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{
                          background:
                            m.source === "real" ? "var(--real)" : "var(--border-strong)",
                        }}
                      />
                      <span className="min-w-0 flex-1">
                        <span
                          className="t-meta block truncate"
                          style={{ color: active ? "var(--accent)" : "var(--text)" }}
                        >
                          {m.title}
                        </span>
                        <span className="t-micro block" style={{ color: "var(--faint)" }}>
                          {formatDuration(m.durationSec)}
                          {m.source === "real" ? " · Real recording" : " · Seeded"}
                        </span>
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <p
            className="t-micro mt-[var(--s-4)] px-[var(--s-2)] leading-relaxed"
            style={{ color: "var(--faint)" }}
          >
            One real recording, four seeded. Press{" "}
            <kbd
              className="rounded px-1"
              style={{ background: "var(--elevated)" }}
            >
              ⌘K
            </kbd>{" "}
            to search moments.
          </p>
        </div>
      </nav>

      <div className="min-w-0 flex-1">
        {/* Drawer trigger, below 900px only */}
        <div
          className="app-rail-trigger sticky top-14 z-20 border-b px-[var(--s-4)] py-[var(--s-2)]"
          style={{ borderColor: "var(--border)", background: "var(--bg)" }}
        >
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-expanded={drawerOpen}
            className="t-meta flex min-h-9 items-center gap-2 rounded-[var(--r-control)] border px-3"
            style={{ borderColor: "var(--border-strong)", color: "var(--muted)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Meetings
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
