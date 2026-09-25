import Link from "next/link";

/**
 * The dead-share-link state.
 *
 * Fathom returns HTTP 404 with a zero-length body here — a blank white page,
 * verified during research. Someone who follows an expired link gets no
 * explanation at all. Telling them what happened costs one component.
 */
export default function ShareNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p
        className="font-mono text-xs uppercase tracking-[0.15em]"
        style={{ color: "var(--text-faint)" }}
      >
        404 · link not found
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">
        This share link doesn&rsquo;t work
      </h1>
      <p
        className="mx-auto mt-3 max-w-sm text-sm leading-relaxed"
        style={{ color: "var(--text-muted)" }}
      >
        It may have been revoked, or the address may be mistyped. Nothing was
        deleted on your end — ask whoever sent it for a fresh link.
      </p>
      <p
        className="mx-auto mt-5 max-w-sm text-[12px] leading-relaxed"
        style={{ color: "var(--text-faint)" }}
      >
        Fathom serves a blank white page for this case. We would rather say what
        happened.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg px-4 py-2 text-sm font-medium"
        style={{ background: "var(--accent)", color: "var(--bg)" }}
      >
        Go to Recap
      </Link>
    </div>
  );
}
