import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMeeting, meetings } from "@/data";
import { ReviewScreen } from "@/components/ReviewScreen";

/** Static params so every meeting is prerendered. */
export function generateStaticParams() {
  return meetings.map((m) => ({ id: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const meeting = getMeeting(id);
  if (!meeting) return { title: "Meeting not found — Recap" };
  return {
    title: `${meeting.title} — Recap`,
    description: meeting.provenanceNote,
  };
}

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meeting = getMeeting(id);
  if (!meeting) notFound();
  return <ReviewScreen meeting={meeting} />;
}
