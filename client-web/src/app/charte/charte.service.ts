import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GitlabFileResponse } from './gitlab-file-response';

@Injectable({
  providedIn: 'root',
})
export class CharteService {
  constructor(private http: HttpClient) {}

  getCharte(): Observable<GitlabFileResponse> {
    return this.http.get<GitlabFileResponse>(environment.charteUrl);
  }
}
