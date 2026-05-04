import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TimelineService } from './timeline.service';
import { CmsEvent } from './timeline.interface';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  isLoading = true;
  hasError = false;

  constructor() {
    inject(Title).setTitle('AGEEI - Calendrier');
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.hasError = false;
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
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
      },
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
