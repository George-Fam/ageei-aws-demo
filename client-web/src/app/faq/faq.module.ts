import { NgModule } from '@angular/core';
import { FaqComponent } from './faq.component';
import { SharedModule } from '../shared/shared.module';
import { FaqRoutingModule } from './faq-routing.module';

@NgModule({
  declarations: [FaqComponent],
  imports: [SharedModule, FaqRoutingModule],
})
export class FaqModule {}
