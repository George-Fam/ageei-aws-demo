import { Component, OnInit } from '@angular/core';
import { TimelineService } from './timeline.service';
import { Timeline } from './timeline.interface';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit {
  timeLine: Array<Timeline> = [];
  currentDate: Date = new Date();
  scrollToId: number | undefined;
  showCalendar = false;
  calendarUrl: SafeResourceUrl | undefined;
  calendarOpen = false;
  subscribeUrl: string | undefined;

  public constructor(private timelineService: TimelineService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {

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
    window.open(url, "_blank");
  }
}
