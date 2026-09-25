/**
 * The two containers this app is allowed to have.
 *
 * Before this, four surfaces used three different widths — `max-w-6xl` on the
 * list and review, `max-w-3xl` on search and share — so the layout visibly
 * re-flowed as you navigated between them. Width is a system decision, not a
 * per-page one.
 *
 * `wide`    — layout: lists, the review screen, the header
 * `reading` — prose: search results, the shared view, error pages
 */
export function Container({
  width = "wide",
  className = "",
  children,
}: {
  width?: "wide" | "reading";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`mx-auto w-full px-[var(--s-4)] ${className}`}
      style={{
        maxWidth: width === "wide" ? "var(--w-content)" : "var(--w-reading)",
      }}
    >
      {children}
    </div>
  );
}
