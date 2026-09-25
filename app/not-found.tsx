import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p
        className="font-mono t-meta uppercase tracking-[0.15em]"
        style={{ color: "var(--faint)" }}
      >
        404
      </p>
      <h1 className="mt-3 t-display font-semibold tracking-tight">
        That meeting isn&rsquo;t here
      </h1>
      <p
        className="mx-auto mt-3 max-w-sm t-body leading-relaxed"
        style={{ color: "var(--muted)" }}
      >
        The link may be wrong, or the meeting may have been removed. Fathom
        returns a blank white page for this case; we would rather tell you what
        happened.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg px-4 py-2 t-body font-medium"
        style={{ background: "var(--accent)", color: "var(--bg)" }}
      >
        Back to meetings
      </Link>
    </div>
  );
}
