import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DirectusFinissantCohorte, FinissantCohorte } from './finissants.interface';

@Injectable({
  providedIn: 'root',
})
export class FinissantsService {
  private http = inject(HttpClient);

  getCohortes(): Observable<FinissantCohorte[]> {
    return this.http
      .get<{ data: DirectusFinissantCohorte[] }>(`${environment.finissantCohortesUrl}?sort=-year_start&limit=-1`)
      .pipe(map(({ data }) => data.map((cohorte) => this.toCohorte(cohorte))));
  }

  private toCohorte(cohorte: DirectusFinissantCohorte): FinissantCohorte {
    return {
      ...cohorte,
      mosaicImageUrl: cohorte.mosaic_image ? `${environment.cmsUrl}/assets/${cohorte.mosaic_image}` : null,
    };
  }
}
