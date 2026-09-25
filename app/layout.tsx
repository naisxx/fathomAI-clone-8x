import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
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

        <SiteHeader />

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
