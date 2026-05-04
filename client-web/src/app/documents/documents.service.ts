import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DirectusDocument, ImportantDocument } from './documents.interface';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private http = inject(HttpClient);

  getDocuments(): Observable<DirectusDocument[]> {
    return this.http.get<{ data: DirectusDocument[] }>(`${environment.documentsReunionUrl}?limit=-1`).pipe(
      map((response) =>
        response.data.map((doc) => ({
          ...doc,
          file_md: doc.file_md ? `${environment.cmsUrl}/assets/${doc.file_md}` : null,
          file_pdf: doc.file_pdf ? `${environment.cmsUrl}/assets/${doc.file_pdf}` : null,
        }))
      )
    );
  }

  getImportantDocuments(): Observable<ImportantDocument[]> {
    return this.http.get<{ data: ImportantDocument[] }>(`${environment.documentsUrl}?sort=sort`).pipe(
      map((response) =>
        response.data.map((doc) => ({
          ...doc,
          file_pdf: doc.file_pdf ? `${environment.cmsUrl}/assets/${doc.file_pdf}` : null,
        }))
      )
    );
  }
}
