import { NgModule } from '@angular/core';
import { ContactComponent } from './contact.component';
import { SharedModule } from '../shared/shared.module';
import { ContactRoutingModule } from './contact-routing.module';
import { NgOptimizedImage } from '@angular/common';

@NgModule({
  declarations: [ContactComponent],
  imports: [SharedModule, ContactRoutingModule, NgOptimizedImage],
})
export class ContactModule {}
