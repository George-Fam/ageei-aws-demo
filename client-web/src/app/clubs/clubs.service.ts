import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Club, DirectusClub } from './clubs.interface';

@Injectable({
  providedIn: 'root',
})
export class ClubsService {
  private http = inject(HttpClient);

  getClubs(): Observable<Club[]> {
    return this.http
      .get<{ data: DirectusClub[] }>(
        `${environment.clubsUrl}?sort=sort,name&limit=-1&filter[status][_eq]=published`,
      )
      .pipe(map(({ data }) => data.map((club) => this.toClub(club))));
  }

  private toClub(club: DirectusClub): Club {
    return {
      ...club,
      logoUrl: club.logo ? `${environment.cmsUrl}/assets/${club.logo}` : null,
      coverImageUrl: club.cover_image ? `${environment.cmsUrl}/assets/${club.cover_image}` : null,
    };
  }
}
