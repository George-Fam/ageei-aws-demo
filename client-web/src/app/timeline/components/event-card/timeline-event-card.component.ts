import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CmsEvent } from '../../models/timeline.interface';

@Component({
  selector: 'app-timeline-event-card',
  templateUrl: './timeline-event-card.component.html',
  styleUrls: ['./timeline-event-card.component.scss'],
  standalone: false,
})
export class TimelineEventCardComponent {
  @Input({ required: true }) entry!: CmsEvent;
  @Input({ required: true }) index = 0;
  @Input({ required: true }) isPast = false;
  @Input({ required: true }) isExpanded = false;
  @Input({ required: true }) isNext = false;
  @Input({ required: true }) isExternal = false;
  @Input() posterUrl: string | null = null;

  @Output() preview = new EventEmitter<CmsEvent>();
  @Output() share = new EventEmitter<CmsEvent>();
  @Output() openLink = new EventEmitter<string>();
  @Output() toggleDetails = new EventEmitter<string>();

  get sideClass(): 'left' | 'right' {
    return this.index % 2 !== 0 ? 'left' : 'right';
  }

  formatDescription(text: string): string {
    return text.replace(/\n/g, '<br>');
  }
}
