import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CmsEvent, CmsEventsResponse } from '../models/timeline.interface';

@Injectable({
  providedIn: 'root',
})
export class TimelineService {
  private http = inject(HttpClient);

  getEvents(): Observable<CmsEvent[]> {
    const params = new HttpParams().set('filter[isDraft][_neq]', 'true');

    return this.http
      .get<CmsEventsResponse>(`${environment.cmsUrl}/items/events`, { params })
      .pipe(map((response) => response.data.filter((event) => event.isDraft !== true)));
  }
}
