import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p
        className="font-mono text-xs uppercase tracking-[0.15em]"
        style={{ color: "var(--text-faint)" }}
      >
        404
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">
        That meeting isn&rsquo;t here
      </h1>
      <p
        className="mx-auto mt-3 max-w-sm text-sm leading-relaxed"
        style={{ color: "var(--text-muted)" }}
      >
        The link may be wrong, or the meeting may have been removed. Fathom
        returns a blank white page for this case; we would rather tell you what
        happened.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg px-4 py-2 text-sm font-medium"
        style={{ background: "var(--accent)", color: "var(--bg)" }}
      >
        Back to meetings
      </Link>
    </div>
  );
}
