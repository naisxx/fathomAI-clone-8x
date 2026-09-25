import Link from "next/link";
import { meetings } from "@/data";
import { formatDuration, type Meeting } from "@/lib/types";
import { ProvenanceBadge } from "@/components/ProvenanceBadge";

export const metadata = { title: "Recap — meetings" };

/** Group by calendar day, preserving the newest-first order. */
function groupByDay(list: Meeting[]) {
  const groups = new Map<string, Meeting[]>();
  for (const m of list) {
    const key = new Date(m.scheduledStart).toISOString().slice(0, 10);
    const bucket = groups.get(key);
    if (bucket) bucket.push(m);
    else groups.set(key, [m]);
  }
  return [...groups.entries()];
}

/** "Today" / "Yesterday" / "Tue 22 Sep" — relative to the newest meeting. */
function dayLabel(iso: string, newestIso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  const newest = new Date(`${newestIso.slice(0, 10)}T00:00:00Z`);
  const diff = Math.round((newest.getTime() - d.getTime()) / 86_400_000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

function SpeakerCount({ meeting }: { meeting: Meeting }) {
  const n = meeting.invitees.length;
  return (
    <>
      {n} {n === 1 ? "participant" : "participants"}
    </>
  );
}

function MeetingCard({ meeting, newestIso }: { meeting: Meeting; newestIso: string }) {
  void newestIso;
  const hasAudio = meeting.mediaKind === "real-audio";

  return (
    <li>
      <Link
        href={`/meetings/${meeting.id}`}
        className="group block rounded-xl border p-4 transition-colors"
        style={{ borderColor: "var(--border)", background: "var(--bg-raised)" }}
      >
        <div
          className="mb-3 grid aspect-video place-items-center rounded-lg border"
          style={{
            borderColor: "var(--border)",
            background:
              "radial-gradient(120% 90% at 50% 40%, color-mix(in srgb, var(--accent) 16%, var(--bg)) 0%, var(--bg) 78%)",
          }}
        >
          <span
            aria-hidden
            className="grid h-11 w-11 place-items-center rounded-full"
            style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
          >
            {hasAudio ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M8 5v14l11-7-11-7Z" fill="currentColor" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M3 12h3l2.5-6 4 13 2.5-7H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
        </div>

        <div className="mb-2 flex flex-wrap items-center gap-2">
          <ProvenanceBadge meeting={meeting} />
          <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>
            {formatDuration(meeting.durationSec)}
          </span>
        </div>

        <h3
          className="text-[15px] font-semibold leading-snug transition-colors group-hover:text-[color:var(--accent-strong)]"
          style={{ color: "var(--text)" }}
        >
          {meeting.title}
        </h3>

        <p className="mt-1.5 text-xs" style={{ color: "var(--text-faint)" }}>
          <SpeakerCount meeting={meeting} />
          {meeting.meetingType ? ` · ${meeting.meetingType}` : ""}
        </p>
      </Link>
    </li>
  );
}

export default function MeetingListPage() {
  const groups = groupByDay(meetings);
  const newestIso = meetings[0]?.scheduledStart ?? new Date().toISOString();
  const realCount = meetings.filter((m) => m.source === "real").length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Meetings</h1>
        <p
          className="mt-2 max-w-2xl text-sm leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          {meetings.length} meetings. {realCount} uses a real recording with real
          audio; the rest are seeded so the interface can be judged at a scale a
          44-second call cannot show. Every card says which is which.
        </p>
      </div>

      {groups.length === 0 ? (
        <div
          className="rounded-xl border p-10 text-center"
          style={{ borderColor: "var(--border)", background: "var(--bg-raised)" }}
        >
          <p className="text-sm font-medium">No meetings yet</p>
          <p className="mt-1 text-sm" style={{ color: "var(--text-faint)" }}>
            Recorded meetings will appear here, newest first.
          </p>
        </div>
      ) : (
        groups.map(([day, list]) => (
          <section key={day} className="mb-10">
            <h2
              className="mb-3 text-xs font-semibold uppercase tracking-[0.08em]"
              style={{ color: "var(--text-faint)" }}
            >
              {dayLabel(day, newestIso)}
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((m) => (
                <MeetingCard key={m.id} meeting={m} newestIso={newestIso} />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
