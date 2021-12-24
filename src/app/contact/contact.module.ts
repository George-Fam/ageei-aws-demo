import { NgModule } from '@angular/core';
import { ContactComponent } from './contact.component';
import { SharedModule } from '../shared/shared.module';
import { ContactRoutingModule } from './contact-routing.module';

@NgModule({
  declarations: [ContactComponent],
  imports: [SharedModule, ContactRoutingModule],
})
export class ContactModule {}
