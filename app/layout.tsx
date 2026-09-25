import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Recap — meeting review",
  description:
    "A meeting review tool: transcript, summary and action items anchored to the moment they happened.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:px-3 focus:py-2"
          style={{ background: "var(--bg-raised)", color: "var(--text)" }}
        >
          Skip to content
        </a>

        <header
          className="sticky top-0 z-30 border-b backdrop-blur"
          style={{
            borderColor: "var(--border)",
            background: "color-mix(in srgb, var(--bg) 88%, transparent)",
          }}
        >
          <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <span
                aria-hidden
                className="grid h-6 w-6 place-items-center rounded"
                style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M2 8h2.5l1.75-4.5L9.5 12l1.75-4H14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Recap
            </Link>

            <span
              className="hidden text-xs sm:inline"
              style={{ color: "var(--text-faint)" }}
            >
              meeting review
            </span>

            <div className="ml-auto">
              <span
                className="rounded-full border px-2.5 py-1 text-[11px] font-medium"
                style={{
                  borderColor: "var(--border-strong)",
                  color: "var(--text-muted)",
                }}
                title="This is a portfolio build. Meetings are labelled individually as real or seeded."
              >
                Demo build
              </span>
            </div>
          </div>
        </header>

        <main id="main">{children}</main>

        <footer
          className="mt-16 border-t py-8"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="mx-auto max-w-6xl px-4 text-xs leading-relaxed"
            style={{ color: "var(--text-faint)" }}
          >
            <p>
              Recap is a portfolio build, not a product. One meeting uses a real
              recording; the rest are seeded demo data and say so on every screen.
              No recording bot exists — nothing here joins a call.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
