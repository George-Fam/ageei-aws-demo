import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { TimelineService } from './timeline.service';
import { Timeline } from './timeline.interface';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit {
  timeLine: Array<Timeline>;
  currentDate: Date = new Date();
  scrollToId: number | undefined;

  public constructor(private timelineService: TimelineService) { }

  ngOnInit(): void {
    const url: string = '/assets/events.json';
    this.timelineService.getTimelime().subscribe((data) => {
      data.reverse();
      this.timeLine = data;
      let currentID = 0;
      for (let item of this.timeLine) {
        item.date = item.date;

        if (item.date && new Date(item.date).getTime() > this.currentDate.getTime()) {
          console.log(this.scrollToId);
          if (this.scrollToId === undefined) {
            this.scrollToId = currentID;
          }
        }
        currentID += 1;
      }
    });
  }

  scroll() {
    if (this.scrollToId) {
      let el = document.getElementById(String(this.scrollToId));
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }
}
