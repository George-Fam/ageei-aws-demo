import { NgModule } from '@angular/core';
import { FaqComponent } from './faq.component';
import { SharedModule } from '../shared/shared.module';
import { FaqRoutingModule } from './faq-routing.module';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [FaqComponent],
  imports: [
    SharedModule,
    FaqRoutingModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
  ],
})
export class FaqModule {}
