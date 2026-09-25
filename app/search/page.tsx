import { Suspense } from "react";
import { Container } from "@/components/Container";
import { SearchResults } from "@/components/SearchResults";

export const metadata = { title: "Search — Recap" };

/**
 * The page owns the heading and the container; SearchResults owns only the
 * interactive part.
 *
 * Previously both rendered an <h1>Search</h1> — the Suspense fallback and the
 * component — so the page shipped two level-one headings. Keeping the heading
 * out here means it appears exactly once and lives in the static shell.
 *
 * useSearchParams needs the Suspense boundary for this route to prerender.
 */
export default function SearchPage() {
  return (
    <Container width="reading" className="py-[var(--s-8)]">
      <h1 className="t-display">Search</h1>
      <p className="mt-[var(--s-2)] t-body" style={{ color: "var(--muted)" }}>
        Across every meeting — transcripts, summaries, action items and titles.
        A transcript hit takes you to the moment it was said.
      </p>

      <Suspense
        fallback={
          <div
            className="mt-[var(--s-6)] h-12 w-full animate-pulse rounded-[var(--r-panel)] border"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          />
        }
      >
        <SearchResults />
      </Suspense>
    </Container>
  );
}
