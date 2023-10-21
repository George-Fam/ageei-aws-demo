import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TimelineComponent } from './timeline.component';
import { TimelineRoutingModule } from './timeline-routing.module';

@NgModule({
  declarations: [TimelineComponent],
  imports: [SharedModule, TimelineRoutingModule],
})
export class TimelineModule {}
