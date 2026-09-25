import type { Meeting } from "@/lib/types";

/**
 * The honesty label. Every meeting carries one, everywhere it appears.
 *
 * This is the single most important component in the app: it is what stops a
 * seeded meeting being mistaken for a recorded one. It takes the whole meeting
 * rather than a boolean so there is no way to render a badge that disagrees
 * with the data behind it.
 */
export function ProvenanceBadge({
  meeting,
  size = "sm",
}: {
  meeting: Meeting;
  size?: "sm" | "md";
}) {
  const isReal = meeting.source === "real";
  const label = isReal ? "Real recording" : "Seeded demo data";

  return (
    <span
      className={
        size === "md"
          ? "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 t-meta font-medium"
          : "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 t-micro font-medium"
      }
      style={{
        background: isReal ? "var(--real-tint)" : "var(--elevated)",
        color: isReal ? "var(--real)" : "var(--muted)",
      }}
      title={meeting.provenanceNote}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: "currentColor" }}
      />
      {label}
    </span>
  );
}

/** The longer explanation, shown once on the review screen. */
export function ProvenanceNote({ meeting }: { meeting: Meeting }) {
  const isReal = meeting.source === "real";
  return (
    <div
      className="rounded-lg border px-3.5 py-3 t-meta leading-relaxed"
      style={{
        borderColor: isReal ? "var(--real-tint)" : "var(--border)",
        background: isReal ? "var(--real-tint)" : "var(--elevated)",
        color: "var(--muted)",
      }}
    >
      <span
        className="font-medium"
        style={{ color: isReal ? "var(--real)" : "var(--muted)" }}
      >
        {isReal ? "Real recording." : "Seeded demo data."}
      </span>{" "}
      {meeting.provenanceNote.replace(/^(Real recording|Seeded demo data)\.\s*/, "")}
    </div>
  );
}
