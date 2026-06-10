import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TimelineComponent } from './timeline.component';
import { TimelineRoutingModule } from './timeline-routing.module';
import { EventPreviewDialogComponent } from './event-preview-dialog.component';

@NgModule({
  declarations: [TimelineComponent, EventPreviewDialogComponent],
  imports: [SharedModule, TimelineRoutingModule],
})
export class TimelineModule {}
