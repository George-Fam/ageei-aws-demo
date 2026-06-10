import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, Meta, SafeResourceUrl, Title } from '@angular/platform-browser';
import { TimelineService } from './timeline.service';
import { CmsEvent } from './timeline.interface';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventPreviewDialogComponent } from './event-preview-dialog.component';

type TimelineFilter = 'all' | 'internal' | 'external' | 'upcoming' | 'past';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  standalone: false,
})
export class TimelineComponent implements OnInit {
  private timelineService = inject(TimelineService);
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  events: CmsEvent[] = [];
  upcomingCount = 0;
  currentDate: Date = new Date();
  showCalendar = false;
  calendarUrl: SafeResourceUrl | undefined;
  calendarOpen = false;
  subscribeUrl: string | undefined;
  expandedEvents: Set<string> = new Set();
  futureFurtherExpanded = false;
  isLoading = true;
  hasError = false;
  activeFilter: TimelineFilter = 'all';
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
    this.pendingFragmentEventId = this.normalizeEventFragment(this.route.snapshot.fragment);

    if (environment.googleCalendarId && environment.googleCalendarId.length > 0) {
      const base = 'https://calendar.google.com/calendar/embed';
      const params = new URLSearchParams({
        src: environment.googleCalendarId,
        ctz: environment.googleCalendarTimeZone || 'UTC',
      });

      const url = `${base}?${params.toString()}`;
      this.calendarUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.showCalendar = true;

      if (environment.googleCalendarId) {
        this.subscribeUrl = `https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(
          environment.googleCalendarId
        )}`;
      }
    }
    this.timelineService.getEvents().subscribe({
      next: (data) => {
        data.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
        this.upcomingCount = data.filter((e) => new Date(e.start_date).getTime() >= this.currentDate.getTime()).length;
        this.events = data;
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
    return this.events.filter((event) => {
      switch (this.activeFilter) {
        case 'internal':
          return !this.isExternalEvent(event);
        case 'external':
          return this.isExternalEvent(event);
        case 'upcoming':
          return !this.isPastEvent(event);
        case 'past':
          return this.isPastEvent(event);
        default:
          return true;
      }
    });
  }

  get filteredUpcomingCount(): number {
    return this.filteredEvents.filter((event) => !this.isPastEvent(event)).length;
  }

  get nextEvent(): CmsEvent | null {
    const upcoming = this.events.filter((event) => !this.isPastEvent(event));
    upcoming.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
    return upcoming[0] ?? null;
  }

  selectFilter(filter: TimelineFilter): void {
    this.activeFilter = filter;
  }

  filterCount(filter: TimelineFilter): number {
    return this.events.filter((event) => {
      if (filter === 'internal') return !this.isExternalEvent(event);
      if (filter === 'external') return this.isExternalEvent(event);
      if (filter === 'upcoming') return !this.isPastEvent(event);
      if (filter === 'past') return this.isPastEvent(event);
      return true;
    }).length;
  }

  toggleCalendar() {
    this.calendarOpen = !this.calendarOpen;
  }

  toggleFutureFurther() {
    this.futureFurtherExpanded = !this.futureFurtherExpanded;
  }

  goToLink(url: string) {
    const fullUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
    window.open(fullUrl, '_blank');
  }

  isPastEvent(entry: CmsEvent): boolean {
    return new Date(entry.start_date).getTime() < this.currentDate.getTime();
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
    const dialogRef = this.dialog.open(EventPreviewDialogComponent, {
      width: 'min(760px, calc(100vw - 24px))',
      maxWidth: '100vw',
      panelClass: 'ageei-dialog-panel',
      data: {
        event: entry,
        posterUrl: entry.poster ? this.posterUrl(entry.poster) : null,
        isPast: this.isPastEvent(entry),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'openLink' && entry.link_url) this.goToLink(entry.link_url);
      if (result?.action === 'share') this.shareEvent(entry);
    });
  }

  shareEvent(entry: CmsEvent): void {
    const url = this.eventShareUrl(entry);
    const shareNavigator = navigator as Navigator & {
      share?: (data: { title: string; text?: string; url: string }) => Promise<void>;
    };

    if (shareNavigator.share) {
      shareNavigator.share({ title: entry.title, text: "Événement de l'AGEEI", url }).catch(() => this.copyUrl(url));
    } else {
      this.copyUrl(url);
    }
  }

  eventShareUrl(entry: CmsEvent): string {
    return `${window.location.origin}/calendrier#event-${entry.id}`;
  }

  isExternalEvent(entry: CmsEvent): boolean {
    return !entry.author_organizer?.toLowerCase().includes('ageei');
  }

  formatDescription(text: string): string {
    return text.replace(/\n/g, '<br>');
  }

  posterUrl(posterId: string): string {
    return `${environment.cmsUrl}/assets/${posterId}`;
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

    const eventIndex = this.events.findIndex((event) => event.id === eventId);
    if (this.isPastEvent(entry)) {
      this.expandedEvents.add(entry.id);
    } else if (!this.shouldShowEvent(entry, eventIndex)) {
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

  private normalizeEventFragment(fragment: string | null): string | null {
    if (!fragment?.startsWith('event-')) {
      return null;
    }

    return fragment.slice('event-'.length);
  }

  private copyUrl(url: string): void {
    navigator.clipboard
      ?.writeText(url)
      .then(() => this.snackBar.open('Lien copié', 'OK', { duration: 2500 }))
      .catch(() => this.snackBar.open('Impossible de copier le lien', 'OK', { duration: 2500 }));
  }
}
