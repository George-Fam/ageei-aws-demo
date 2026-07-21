import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ComputersComponent } from './computers.component';
import { MemberServicesRoutingModule } from './member-services-routing.module';

@NgModule({
  declarations: [ComputersComponent],
  imports: [SharedModule, MemberServicesRoutingModule],
})
export class MemberServicesModule {}
