import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { EventPreviewDialogComponent } from '../components/event-preview-dialog/event-preview-dialog.component';
import { CmsEvent } from '../models/timeline.interface';

interface EventPreviewDialogResult {
  action?: 'openLink' | 'share';
}

@Injectable({
  providedIn: 'root',
})
export class TimelineEventActionsService {
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  openPreview(entry: CmsEvent, isPast: boolean): void {
    const dialogRef = this.dialog.open(EventPreviewDialogComponent, {
      width: 'min(760px, calc(100vw - 24px))',
      maxWidth: '100vw',
      panelClass: 'ageei-dialog-panel',
      data: {
        event: entry,
        posterUrl: entry.poster ? this.posterUrl(entry.poster) : null,
        isPast,
      },
    });

    dialogRef.afterClosed().subscribe((result?: EventPreviewDialogResult) => {
      if (result?.action === 'openLink' && entry.link_url) this.openLink(entry.link_url);
      if (result?.action === 'share') this.share(entry);
    });
  }

  share(entry: CmsEvent): void {
    const url = this.eventShareUrl(entry);
    const shareNavigator = navigator as Navigator & {
      share?: (data: { title: string; text?: string; url: string }) => Promise<void>;
    };

    if (shareNavigator.share) {
      shareNavigator.share({ title: entry.title, text: "Événement de l'AGEEI", url }).catch(() => this.copyUrl(url));
    } else {
      this.copyUrl(url);
    }
  }

  openLink(url: string): void {
    const fullUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
    window.open(fullUrl, '_blank');
  }

  posterUrl(posterId: string): string {
    return `${environment.cmsUrl}/assets/${posterId}`;
  }

  private eventShareUrl(entry: CmsEvent): string {
    return `${window.location.origin}/calendrier#event-${entry.id}`;
  }

  private copyUrl(url: string): void {
    navigator.clipboard
      ?.writeText(url)
      .then(() => this.snackBar.open('Lien copié', 'OK', { duration: 2500 }))
      .catch(() => this.snackBar.open('Impossible de copier le lien', 'OK', { duration: 2500 }));
  }
}
