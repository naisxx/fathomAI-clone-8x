import { Suspense } from "react";
import { SearchResults } from "@/components/SearchResults";

export const metadata = { title: "Search — Recap" };

/**
 * useSearchParams needs a Suspense boundary for this route to prerender, so the
 * shell is static and the query-dependent part hydrates on the client.
 */
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-8">
          <h1 className="text-2xl font-semibold tracking-tight">Search</h1>
          <div
            className="mt-5 h-12 w-full animate-pulse rounded-xl border"
            style={{ borderColor: "var(--border)", background: "var(--bg-raised)" }}
          />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
