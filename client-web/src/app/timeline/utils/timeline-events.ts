import { CmsEvent } from '../models/timeline.interface';

export type TimelineFilter = 'all' | 'internal' | 'external' | 'upcoming' | 'past';

export function sortTimelineEventsDescending(events: CmsEvent[]): CmsEvent[] {
  return [...events].sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
}

export function filterTimelineEvents(events: CmsEvent[], filter: TimelineFilter, now: Date): CmsEvent[] {
  return events.filter((event) => {
    switch (filter) {
      case 'internal':
        return !isExternalTimelineEvent(event);
      case 'external':
        return isExternalTimelineEvent(event);
      case 'upcoming':
        return !isPastTimelineEvent(event, now);
      case 'past':
        return isPastTimelineEvent(event, now);
      default:
        return true;
    }
  });
}

export function countTimelineEvents(events: CmsEvent[], filter: TimelineFilter, now: Date): number {
  return filterTimelineEvents(events, filter, now).length;
}

export function getNextTimelineEvent(events: CmsEvent[], now: Date): CmsEvent | null {
  const upcoming = filterTimelineEvents(events, 'upcoming', now);
  upcoming.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  return upcoming[0] ?? null;
}

export function isPastTimelineEvent(event: CmsEvent, now: Date): boolean {
  return getTimelineEventEndTime(event) < now.getTime();
}

export function isExternalTimelineEvent(event: CmsEvent): boolean {
  return event.isExternal === true;
}

export function normalizeEventFragment(fragment: string | null): string | null {
  if (!fragment?.startsWith('event-')) {
    return null;
  }

  return fragment.slice('event-'.length);
}

function getTimelineEventEndTime(event: CmsEvent): number {
  return new Date(event.end_date || event.start_date).getTime();
}
