import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CharteRoutingModule } from './charte-routing.module';
import { CharteComponent } from './charte.component';

@NgModule({
  declarations: [CharteComponent],
  imports: [SharedModule, CharteRoutingModule],
})
export class CharteModule {}
