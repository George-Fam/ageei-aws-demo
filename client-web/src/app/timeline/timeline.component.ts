import { Component, OnInit, inject } from '@angular/core';
import { DomSanitizer, Meta, SafeResourceUrl, Title } from '@angular/platform-browser';
import { TimelineService } from './timeline.service';
import { CmsEvent } from './timeline.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  standalone: false,
})
export class TimelineComponent implements OnInit {
  private timelineService = inject(TimelineService);
  private sanitizer = inject(DomSanitizer);

  events: CmsEvent[] = [];
  upcomingCount = 0;
  currentDate: Date = new Date();
  showCalendar = false;
  calendarUrl: SafeResourceUrl | undefined;
  calendarOpen = false;
  subscribeUrl: string | undefined;
  expandedEvents: Set<number> = new Set();

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
    this.timelineService.getEvents().subscribe((data) => {
      data.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
      this.upcomingCount = data.filter((e) => new Date(e.start_date).getTime() >= this.currentDate.getTime()).length;
      this.events = data;
    });
  }

  toggleCalendar() {
    this.calendarOpen = !this.calendarOpen;
  }

  goToLink(url: string) {
    const fullUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
    window.open(fullUrl, '_blank');
  }

  isPastEvent(entry: CmsEvent): boolean {
    return new Date(entry.start_date).getTime() < this.currentDate.getTime();
  }

  isEventExpanded(index: number): boolean {
    return this.expandedEvents.has(index);
  }

  toggleEventDetails(index: number): void {
    if (this.expandedEvents.has(index)) {
      this.expandedEvents.delete(index);
    } else {
      this.expandedEvents.add(index);
    }
  }

  formatDescription(text: string): string {
    return text.replace(/\n/g, '<br>');
  }

  posterUrl(posterId: string): string {
    return `${environment.cmsUrl}/assets/${posterId}`;
  }
}
