import type { Metadata } from "next";
import { AccentSwitcher } from "./AccentSwitcher";

/**
 * TEMPORARY. Delete before submission. (Route is /specimen; Next excludes
 * underscore-prefixed folders from routing, so it cannot be /_specimen.)
 *
 * A specimen of the proposed design system, so the palette and type scale can
 * be judged on screen before they are applied across the app. Agreeing this
 * here costs ten minutes; discovering it after a rebuild costs hours.
 */
export const metadata: Metadata = {
  title: "Specimen — Recap",
  robots: { index: false, follow: false },
};

function Swatch({
  name,
  varName,
  note,
}: {
  name: string;
  varName: string;
  note?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className="h-10 w-10 shrink-0 rounded-[var(--r-control)] border"
        style={{ background: `var(${varName})`, borderColor: "var(--border-strong)" }}
      />
      <span className="min-w-0">
        <span className="t-meta block" style={{ color: "var(--text)" }}>
          {name}
        </span>
        <span className="t-micro block" style={{ color: "var(--faint)" }}>
          {note ?? varName}
        </span>
      </span>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-[var(--s-12)]">
      <h2 className="t-micro mb-[var(--s-4)]" style={{ color: "var(--faint)" }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function SpecimenPage() {
  return (
    <div
      className="mx-auto px-[var(--s-4)] py-[var(--s-8)]"
      style={{ maxWidth: "var(--w-content)" }}
    >
      <header className="mb-[var(--s-12)]">
        <h1 className="t-display" style={{ color: "var(--text)" }}>
          Design specimen
        </h1>
        <p
          className="t-body mt-[var(--s-2)]"
          style={{ color: "var(--muted)", maxWidth: "var(--w-reading)" }}
        >
          Proposed system for the revamp. Every colour pair here clears WCAG AA
          at 4.5:1, verified by <code>scripts/check-contrast.mjs</code> rather
          than by eye. Switch your OS between light and dark to see both.
        </p>
      </header>

      <AccentSwitcher />

      <Section title="Type scale — five steps">
        <div
          className="rounded-[var(--r-panel)] border p-[var(--s-6)]"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <p className="t-display" style={{ color: "var(--text)" }}>
            Display 28/34 — page titles
          </p>
          <p className="t-title mt-[var(--s-4)]" style={{ color: "var(--text)" }}>
            Title 19/26 — meeting titles and section heads
          </p>
          <p
            className="t-body mt-[var(--s-4)]"
            style={{ color: "var(--muted)", maxWidth: "var(--w-reading)" }}
          >
            Body 15/25 — transcript and summary. This is the size the product is
            actually read at, and it was previously served at 13px. At a 680px
            measure a line lands near 68 characters, which is where sustained
            reading is comfortable.
          </p>
          <p className="t-meta mt-[var(--s-4)]" style={{ color: "var(--muted)" }}>
            Meta 13/20 — timestamps, speakers, counts
          </p>
          <p className="t-micro mt-[var(--s-4)]" style={{ color: "var(--faint)" }}>
            Micro 11/16 — labels and chips
          </p>
        </div>
      </Section>

      <Section title="Surface — near-neutral graphite, neutral paper">
        <div className="grid gap-[var(--s-4)] sm:grid-cols-2 lg:grid-cols-4">
          <Swatch name="Background" varName="--bg" />
          <Swatch name="Surface" varName="--surface" />
          <Swatch name="Elevated" varName="--elevated" />
          <Swatch name="Border" varName="--border" />
        </div>
      </Section>

      <Section title="Text — three weights of emphasis">
        <div className="grid gap-[var(--s-4)] sm:grid-cols-3">
          <Swatch name="Text" varName="--text" note="16.6:1 on bg" />
          <Swatch name="Muted" varName="--muted" note="8.2:1 on bg" />
          <Swatch name="Faint" varName="--faint" note="5.4:1 on bg" />
        </div>
      </Section>

      <Section title="Colour — one accent, one semantic hue">
        <div className="grid gap-[var(--s-4)] sm:grid-cols-2">
          <Swatch name="Accent — interaction only" varName="--accent" note="8.6:1 on bg" />
          <Swatch name="Real recording — the only semantic hue" varName="--real" note="8.6:1 on bg" />
        </div>
        <p
          className="t-meta mt-[var(--s-4)]"
          style={{ color: "var(--muted)", maxWidth: "var(--w-reading)" }}
        >
          Down from three competing hues. Seeded data is deliberately neutral —
          an outlined chip carrying a label — so colour never carries meaning on
          its own.
        </p>
      </Section>

      <Section title="Provenance chips — the labels that must survive the revamp">
        <div className="flex flex-wrap items-center gap-[var(--s-3)]">
          <span
            className="t-micro inline-flex items-center gap-1.5 rounded-[var(--r-pill)] px-2.5 py-1"
            style={{ background: "var(--real-tint)", color: "var(--real)" }}
          >
            <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: "currentColor" }} />
            Real recording
          </span>
          <span
            className="t-micro inline-flex items-center gap-1.5 rounded-[var(--r-pill)] border px-2.5 py-1"
            style={{ borderColor: "var(--border-strong)", color: "var(--muted)" }}
          >
            <span aria-hidden className="h-1.5 w-1.5 rounded-full border" style={{ borderColor: "currentColor" }} />
            Seeded demo data
          </span>
          <span
            className="t-micro inline-flex items-center rounded-[var(--r-pill)] border px-2.5 py-1"
            style={{ borderColor: "var(--border-strong)", color: "var(--faint)" }}
          >
            Unmatched
          </span>
        </div>
      </Section>

      <Section title="Controls">
        <div className="flex flex-wrap items-center gap-[var(--s-3)]">
          <button
            type="button"
            className="t-meta min-h-10 rounded-[var(--r-control)] px-4 font-semibold"
            style={{ background: "var(--accent)", color: "var(--on-accent)" }}
          >
            Primary action
          </button>
          <button
            type="button"
            className="t-meta min-h-10 rounded-[var(--r-control)] border px-4"
            style={{ borderColor: "var(--border-strong)", color: "var(--text)" }}
          >
            Secondary
          </button>
          <button
            type="button"
            className="t-meta min-h-10 rounded-[var(--r-control)] px-3"
            style={{ color: "var(--muted)" }}
          >
            Quiet
          </button>
          <span
            className="t-meta rounded-[var(--r-control)] px-2 py-1 font-mono tabular-nums"
            style={{ background: "var(--accent-tint)", color: "var(--accent)" }}
          >
            41:38
          </span>
        </div>
      </Section>

      <Section title="Panel and reading measure">
        <div
          className="rounded-[var(--r-panel)] border p-[var(--s-6)]"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <h3 className="t-title" style={{ color: "var(--text)" }}>
            Q3 Platform Review
          </h3>
          <p
            className="t-body mt-[var(--s-3)]"
            style={{ color: "var(--muted)", maxWidth: "var(--w-reading)" }}
          >
            The migration is three weeks behind at week 11 of a 14-week plan.
            Services 1–6 are migrated and stable; 7 and 8 are migrated but
            showing elevated retry rates that are currently an on-call burden
            rather than a customer-visible one.
          </p>
          <p className="t-meta mt-[var(--s-4)]" style={{ color: "var(--faint)" }}>
            72 segments · 6 from unmatched speakers · timestamps manually aligned
          </p>
        </div>
      </Section>
    </div>
  );
}
