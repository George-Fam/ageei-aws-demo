import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CmsEvent, CmsEventsResponse } from './timeline.interface';

@Injectable({
  providedIn: 'root',
})
export class TimelineService {
  private http = inject(HttpClient);

  getEvents(): Observable<CmsEvent[]> {
    return this.http
      .get<CmsEventsResponse>(`${environment.cmsUrl}/items/events`)
      .pipe(map((response) => response.data));
  }
}
