import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { DocumentsComponent } from './documents.component';
import { SharedModule } from '../shared/shared.module';
import { DocumentsRoutingModule } from './documents-routing.module';

@NgModule({
  declarations: [DocumentsComponent],
  imports: [SharedModule, DocumentsRoutingModule, MatDividerModule],
})
export class DocumentsModule {}
