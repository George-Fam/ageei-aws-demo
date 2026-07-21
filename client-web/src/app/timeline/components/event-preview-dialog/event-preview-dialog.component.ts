import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CmsEvent } from '../../models/timeline.interface';

export interface EventPreviewDialogData {
  event: CmsEvent;
  posterUrl: string | null;
  isPast: boolean;
}

@Component({
  selector: 'app-event-preview-dialog',
  templateUrl: './event-preview-dialog.component.html',
  styleUrls: ['./event-preview-dialog.component.scss'],
  standalone: false,
})
export class EventPreviewDialogComponent {
  data = inject<EventPreviewDialogData>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<EventPreviewDialogComponent>);

  close(): void {
    this.dialogRef.close();
  }

  openLink(): void {
    this.dialogRef.close({ action: 'openLink' });
  }

  share(): void {
    this.dialogRef.close({ action: 'share' });
  }

  formatDescription(text: string): string {
    return text.replace(/\n/g, '<br>');
  }
}
