import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GitlabFileResponse } from './gitlab-file-response';

@Injectable({
  providedIn: 'root',
})
export class CharteService {
  private http = inject(HttpClient);

  getCharte(): Observable<GitlabFileResponse> {
    return this.http.get<GitlabFileResponse>(environment.charteUrl);
  }
}
