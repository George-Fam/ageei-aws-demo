import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Timeline } from './timeline.interface';

@Injectable({
  providedIn: 'root',
})
export class TimelineService {
  private http = inject(HttpClient);

  getTimelime(): Observable<Array<Timeline>> {
    return this.http.get<Array<Timeline>>(environment.eventJson);
  }
}
