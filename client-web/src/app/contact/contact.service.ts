import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  ComiteGroup,
  ComiteMembreInterface,
  DirectusComitesResponse,
  DirectusExecutivesResponse,
  ExecInterface,
} from './exec.interface';

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

  getComiteGroups(): Observable<ComiteGroup[]> {
    return this.http.get<DirectusComitesResponse>(environment.comitesUrl).pipe(
      map(({ data }) => {
        const membres: ComiteMembreInterface[] = data.map((m) => ({
          id: m.id,
          name: m.name,
          comite: m.comite,
          email: m.email,
          image: m.image ? `${environment.cmsUrl}/assets/${m.image}` : null,
          linkedin: m.linkedin,
          github: m.github,
        }));

        const groupMap = new Map<string, ComiteMembreInterface[]>();
        for (const membre of membres) {
          if (!groupMap.has(membre.comite)) groupMap.set(membre.comite, []);
          groupMap.get(membre.comite)!.push(membre);
        }

        return Array.from(groupMap.entries()).map(([comite, ms]) => ({ comite, membres: ms }));
      })
    );
  }
}
