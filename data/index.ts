import type { Meeting } from "@/lib/types";
import { meetingOneReal } from "./meeting-01-real";
import { meetingTwoSeeded } from "./meeting-02-q3-platform-review";
import { designSync, customerCall, standup } from "./supporting-meetings";

/** Newest first, which is how the list renders. */
export const meetings: Meeting[] = [
  meetingOneReal,
  standup,
  customerCall,
  designSync,
  meetingTwoSeeded,
].sort(
  (a, b) =>
    new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime()
);

export function getMeeting(id: string): Meeting | undefined {
  return meetings.find((m) => m.id === id);
}

export function getMeetingByShareToken(token: string): Meeting | undefined {
  return meetings.find((m) => m.shareToken === token);
}
