import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FinissantsRoutingModule } from './finissants-routing.module';
import { FinissantsComponent } from './finissants.component';

@NgModule({
  declarations: [FinissantsComponent],
  imports: [SharedModule, FinissantsRoutingModule],
})
export class FinissantsModule {}
