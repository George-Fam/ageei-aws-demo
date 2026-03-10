import { Component, OnInit } from '@angular/core';
import { TimelineService } from './timeline.service';
import { Timeline } from './timeline.interface';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  standalone: false,
})
export class TimelineComponent implements OnInit {
  timeLine: Array<Timeline> = [];
  currentDate: Date = new Date();
  scrollToId: number | undefined;
  showCalendar = false;
  calendarUrl: SafeResourceUrl | undefined;
  calendarOpen = false;
  subscribeUrl: string | undefined;
  expandedEvents: Set<number> = new Set();

  public constructor(private timelineService: TimelineService, private sanitizer: DomSanitizer) {}

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

      // Build subscribe URL for CTA
      if (environment.googleCalendarId) {
        this.subscribeUrl = `https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(
          environment.googleCalendarId
        )}`;
      }
    }
    this.timelineService.getTimelime().subscribe((data) => {
      data.reverse();
      this.timeLine = data;
      let currentID = 0;
      for (let item of this.timeLine) {
        if (item.date && new Date(item.date).getTime() > this.currentDate.getTime()) {
          if (this.scrollToId === undefined || this.scrollToId === null) {
            this.scrollToId = currentID;
          }
        }
        currentID += 1;
      }
    });
  }

  toggleCalendar() {
    this.calendarOpen = !this.calendarOpen;
  }

  scroll() {
    if (this.scrollToId !== undefined && this.scrollToId !== null) {
      let el = document.getElementById(String(this.scrollToId));
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  goToLink(url: string) {
    // Ensure URL has a protocol
    const fullUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
    window.open(fullUrl, '_blank');
  }

  isPastEvent(entry: Timeline): boolean {
    if (!entry.date) return false;
    return new Date(entry.date).getTime() < this.currentDate.getTime();
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
}
