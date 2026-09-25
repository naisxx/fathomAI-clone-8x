import { renderMarkdown } from "@/lib/markdown";
import type { Meeting } from "@/lib/types";

export function SummaryPanel({ meeting }: { meeting: Meeting }) {
  if (!meeting.summary) {
    return (
      <div className="p-6">
        <div
          className="rounded-lg border px-4 py-3"
          style={{
            borderColor: "var(--seeded-dim)",
            background: "var(--seeded-dim)",
          }}
        >
          <p
            className="flex items-center gap-2 text-sm font-medium"
            style={{ color: "var(--seeded)" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 9v4m0 4h.01M10.3 3.9 1.8 18.1A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-2.9L13.7 3.9a2 2 0 0 0-3.4 0Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            No summary was generated
          </p>
          <p
            className="mt-1.5 text-[13px] leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {meeting.summaryAbsentReason ??
              "No summary is available for this meeting."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div
        className="mb-4 flex items-center gap-2 text-[11px]"
        style={{ color: "var(--text-faint)" }}
      >
        <span
          className="rounded px-1.5 py-0.5 font-medium"
          style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
        >
          {meeting.summary.templateName}
        </span>
        <span>template</span>
      </div>
      <div className="prose-summary max-w-none text-[14px]">
        {renderMarkdown(meeting.summary.markdown)}
      </div>
    </div>
  );
}
