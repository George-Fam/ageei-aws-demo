import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TimelineComponent } from './timeline.component';
import { TimelineRoutingModule } from './timeline-routing.module';
import { EventPreviewDialogComponent } from './components/event-preview-dialog/event-preview-dialog.component';
import { TimelineEventCardComponent } from './components/event-card/timeline-event-card.component';

@NgModule({
  declarations: [TimelineComponent, EventPreviewDialogComponent, TimelineEventCardComponent],
  imports: [SharedModule, TimelineRoutingModule],
})
export class TimelineModule {}
