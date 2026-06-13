import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, Meta, SafeResourceUrl, Title } from '@angular/platform-browser';
import { TimelineService } from './services/timeline.service';
import { CmsEvent } from './models/timeline.interface';
import { environment } from 'src/environments/environment';
import { TimelineEventActionsService } from './services/timeline-event-actions.service';
import {
  TimelineFilter,
  countTimelineEvents,
  filterTimelineEvents,
  getNextTimelineEvent,
  isExternalTimelineEvent,
  isPastTimelineEvent,
  normalizeEventFragment,
  sortTimelineEventsDescending,
} from './utils/timeline-events';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  standalone: false,
})
export class TimelineComponent implements OnInit {
  private timelineService = inject(TimelineService);
  private eventActions = inject(TimelineEventActionsService);
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);

  events: CmsEvent[] = [];
  currentDate: Date = new Date();
  showCalendar = false;
  calendarUrl: SafeResourceUrl | undefined;
  calendarOpen = false;
  subscribeUrl: string | undefined;
  expandedEvents: Set<string> = new Set();
  futureFurtherExpanded = false;
  isLoading = true;
  hasError = false;
  activeFilter: TimelineFilter = 'upcoming';
  private pendingFragmentEventId: string | null = null;
  private fragmentPreviewOpened = false;
  filters: { value: TimelineFilter; label: string }[] = [
    { value: 'all', label: 'Tous' },
    { value: 'internal', label: 'AGEEI' },
    { value: 'external', label: 'Externe' },
    { value: 'upcoming', label: 'À venir' },
    { value: 'past', label: 'Passés' },
  ];

  constructor() {
    inject(Title).setTitle('AGEEI - Calendrier');
    const meta = inject(Meta);
    const desc = "Tous les événements organisés par l'AGEEI au fil de l'année.";
    meta.updateTag({ name: 'description', content: desc });
    meta.updateTag({ property: 'og:title', content: 'AGEEI - Calendrier des événements' });
    meta.updateTag({ property: 'og:description', content: desc });
    meta.updateTag({ property: 'og:url', content: 'https://ageei.org/calendrier' });
    meta.updateTag({ property: 'og:image', content: 'https://ageei.org/assets/logo.png' });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.hasError = false;
    this.pendingFragmentEventId = normalizeEventFragment(this.route.snapshot.fragment);

    if (environment.googleCalendarUrl && environment.googleCalendarUrl.length > 0) {
      this.calendarUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.googleCalendarUrl);
      this.showCalendar = true;
      this.subscribeUrl = environment.googleCalendarSubscribeUrl || undefined;
    }
    this.timelineService.getEvents().subscribe({
      next: (data) => {
        this.events = sortTimelineEventsDescending(data);
        this.isLoading = false;
        this.revealFragmentEvent();
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
      },
    });
  }

  get filteredEvents(): CmsEvent[] {
    return filterTimelineEvents(this.events, this.activeFilter, this.currentDate);
  }

  get filteredUpcomingCount(): number {
    return countTimelineEvents(this.filteredEvents, 'upcoming', this.currentDate);
  }

  get nextEvent(): CmsEvent | null {
    return getNextTimelineEvent(this.events, this.currentDate);
  }

  selectFilter(filter: TimelineFilter): void {
    this.activeFilter = filter;
  }

  filterCount(filter: TimelineFilter): number {
    return countTimelineEvents(this.events, filter, this.currentDate);
  }

  toggleCalendar() {
    this.calendarOpen = !this.calendarOpen;
  }

  toggleFutureFurther() {
    this.futureFurtherExpanded = !this.futureFurtherExpanded;
  }

  goToLink(url: string) {
    this.eventActions.openLink(url);
  }

  isPastEvent(entry: CmsEvent): boolean {
    return isPastTimelineEvent(entry, this.currentDate);
  }

  isEventExpanded(id: string): boolean {
    return this.expandedEvents.has(id);
  }

  toggleEventDetails(id: string): void {
    if (this.expandedEvents.has(id)) {
      this.expandedEvents.delete(id);
    } else {
      this.expandedEvents.add(id);
    }
  }

  shouldShowEvent(entry: CmsEvent, index: number): boolean {
    return index >= this.filteredUpcomingCount - 1 || this.futureFurtherExpanded || this.isPastEvent(entry);
  }

  isNextEvent(entry: CmsEvent): boolean {
    return this.nextEvent?.id === entry.id;
  }

  shouldShowPastSeparator(index: number): boolean {
    const events = this.filteredEvents;
    return index > 0 && this.isPastEvent(events[index]) && !this.isPastEvent(events[index - 1]);
  }

  openEventPreview(entry: CmsEvent): void {
    this.eventActions.openPreview(entry, this.isPastEvent(entry));
  }

  shareEvent(entry: CmsEvent): void {
    this.eventActions.share(entry);
  }

  isExternalEvent(entry: CmsEvent): boolean {
    return entry.isExternal === true;
  }

  formatDescription(text: string): string {
    return text.replace(/\n/g, '<br>');
  }

  posterUrl(posterId: string): string {
    return this.eventActions.posterUrl(posterId);
  }

  private revealFragmentEvent(): void {
    const eventId = this.pendingFragmentEventId;
    if (!eventId) {
      return;
    }

    const entry = this.events.find((event) => event.id === eventId);
    if (!entry) {
      return;
    }

    if (this.isPastEvent(entry)) {
      this.activeFilter = 'past';
      this.expandedEvents.add(entry.id);
    }

    const eventIndex = this.filteredEvents.findIndex((event) => event.id === eventId);
    if (eventIndex < 0) {
      return;
    }

    if (!this.isPastEvent(entry) && !this.shouldShowEvent(entry, eventIndex)) {
      this.futureFurtherExpanded = true;
    }

    requestAnimationFrame(() => {
      document.getElementById(`event-${eventId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (!this.fragmentPreviewOpened) {
        this.fragmentPreviewOpened = true;
        this.openEventPreview(entry);
      }
    });
  }
}
