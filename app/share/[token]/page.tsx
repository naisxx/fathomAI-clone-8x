import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMeetingByShareToken, meetings } from "@/data";
import { SharedMeetingView } from "@/components/SharedMeetingView";
import { redactForShare } from "@/lib/share";

export function generateStaticParams() {
  return meetings.map((m) => ({ token: m.shareToken }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const meeting = getMeetingByShareToken(token);
  if (!meeting) return { title: "Link not found — Recap" };
  return {
    title: `${meeting.title} — shared via Recap`,
    description: meeting.provenanceNote,
    // A share link is handed to a specific person; it should not accumulate in
    // search results.
    robots: { index: false, follow: false },
  };
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const meeting = getMeetingByShareToken(token);
  if (!meeting) notFound();
  // Redact on the server: the client never receives the private fields.
  return (
    <SharedMeetingView
      meeting={redactForShare(meeting)}
      withheldActionItems={meeting.actionItems.length > 0}
    />
  );
}
