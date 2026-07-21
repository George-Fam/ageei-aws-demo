import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ClubsRoutingModule } from './clubs-routing.module';
import { ClubsComponent } from './clubs.component';

@NgModule({
  declarations: [ClubsComponent],
  imports: [SharedModule, ClubsRoutingModule],
})
export class ClubsModule {}
