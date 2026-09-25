import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMeetingByShareToken } from "@/data";
import { SharedMeetingView } from "@/components/SharedMeetingView";
import { clampRange, redactForShare } from "@/lib/share";

/*
 * Deliberately NOT statically prerendered.
 *
 * A clip is defined by ?from/&to, and the whole point is that segments outside
 * that window never reach the page. Filtering on the client would leave the
 * full transcript sitting in the page source - the same leak class fixed in P7,
 * P8 and P9. Reading searchParams makes this route dynamic, and that is the
 * price of the guarantee.
 */
type Params = Promise<{ token: string }>;
type Search = Promise<{ from?: string; to?: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { token } = await params;
  const meeting = getMeetingByShareToken(token);
  if (!meeting) return { title: "Link not found — Recap" };
  return {
    title: `${meeting.title} — shared via Recap`,
    description: meeting.provenanceNote,
    robots: { index: false, follow: false },
  };
}

export default async function SharePage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Search;
}) {
  const { token } = await params;
  const { from, to } = await searchParams;

  const meeting = getMeetingByShareToken(token);
  if (!meeting) notFound();

  // Anything nonsensical clamps to null and serves the whole meeting.
  const clip = clampRange(meeting, from, to);

  return (
    <SharedMeetingView
      meeting={redactForShare(meeting, clip)}
      withheldActionItems={meeting.actionItems.length > 0}
      clip={clip}
    />
  );
}
