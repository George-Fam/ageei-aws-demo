import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CharteRoutingModule } from './charte-routing.module';
import { CharteComponent } from './charte.component';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [CharteComponent],
  imports: [
    SharedModule,
    CharteRoutingModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
  ],
})
export class CharteModule {}
