import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { DocumentsComponent } from './documents.component';
import { SharedModule } from '../shared/shared.module';
import { DocumentsRoutingModule } from './documents-routing.module';
import { DocumentPreviewDialogComponent } from './document-preview-dialog.component';

@NgModule({
  declarations: [DocumentsComponent, DocumentPreviewDialogComponent],
  imports: [SharedModule, DocumentsRoutingModule, MatDividerModule],
})
export class DocumentsModule {}
