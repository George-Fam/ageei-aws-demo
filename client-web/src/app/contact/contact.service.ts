import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DirectusExecutivesResponse, ExecInterface } from './exec.interface';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private http = inject(HttpClient);

  getExecs(): Observable<ExecInterface[]> {
    return this.http.get<DirectusExecutivesResponse>(environment.executivesUrl).pipe(
      map(({ data }) =>
        data.map((exec) => ({
          id: exec.id,
          name: exec.name,
          role: exec.role,
          email: exec.email,
          image: `${environment.cmsUrl}/assets/${exec.image}`,
          linkedin: exec.linkedin,
          github: exec.github,
        }))
      )
    );
  }
}
