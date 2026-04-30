import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DirectusCharteResponse } from './directus-charte-response';

@Injectable({
  providedIn: 'root',
})
export class CharteService {
  private http = inject(HttpClient);

  getCharte(): Observable<string> {
    return this.http.get<DirectusCharteResponse>(environment.charteUrl).pipe(map(({ data }) => data.content));
  }
}
