"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchBox } from "./SearchBox";

/**
 * The header adapts to who is looking.
 *
 * On a share link the visitor was given one meeting, not an account. Offering
 * them a search box across every other meeting, or a link to the full list,
 * would quietly widen what the link grants. So the shared chrome is a wordmark
 * and nothing else.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const isShared = pathname?.startsWith("/share") ?? false;

  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur"
      style={{
        borderColor: "var(--border)",
        background: "color-mix(in srgb, var(--bg) 88%, transparent)",
      }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        {isShared ? (
          <span className="flex items-center gap-2 font-semibold tracking-tight">
            <Wordmark />
          </span>
        ) : (
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <Wordmark />
          </Link>
        )}

        <span
          className="hidden text-xs lg:inline"
          style={{ color: "var(--text-faint)" }}
        >
          meeting review
        </span>

        {isShared ? (
          <span
            className="ml-auto rounded-full border px-2.5 py-1 text-[11px] font-medium"
            style={{ borderColor: "var(--border-strong)", color: "var(--text-muted)" }}
          >
            Shared link
          </span>
        ) : (
          <>
            <SearchBox />
            <div className="shrink-0">
              <span
                className="hidden rounded-full border px-2.5 py-1 text-[11px] font-medium sm:inline-block"
                style={{
                  borderColor: "var(--border-strong)",
                  color: "var(--text-muted)",
                }}
                title="This is a portfolio build. Meetings are labelled individually as real or seeded."
              >
                Demo build
              </span>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

function Wordmark() {
  return (
    <>
      <span
        aria-hidden
        className="grid h-6 w-6 place-items-center rounded"
        style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M2 8h2.5l1.75-4.5L9.5 12l1.75-4H14"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      Recap
    </>
  );
}
