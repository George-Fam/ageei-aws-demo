import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DocumentPreviewDialogData {
  title: string;
  description?: string | null;
  category?: string | null;
  date?: string | null;
  type?: string | null;
  url: string | null;
}

@Component({
  selector: 'app-document-preview-dialog',
  templateUrl: './document-preview-dialog.component.html',
  styleUrls: ['./document-preview-dialog.component.scss'],
  standalone: false,
})
export class DocumentPreviewDialogComponent {
  data = inject<DocumentPreviewDialogData>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<DocumentPreviewDialogComponent>);

  close(): void {
    this.dialogRef.close();
  }

  openDocument(): void {
    this.dialogRef.close({ action: 'open' });
  }
}
