import { Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
import { DirectusDocument, ImportantDocument } from './documents.interface';
import { DocumentsService } from './documents.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  standalone: false,
})
export class DocumentsComponent implements OnInit {
  pvDocuments: DirectusDocument[] = [];
  pvByYear: { year: string; docs: DirectusDocument[] }[] = [];
  expandedYears: Set<string> = new Set<string>();

  importantDocuments: ImportantDocument[] = [];
  importantByCategory: { category: string; docs: ImportantDocument[] }[] = [];
  isLoading = true;
  hasError = false;

  private service = inject(DocumentsService);

  constructor() {
    inject(Title).setTitle('AGEEI - Documents');
    const meta = inject(Meta);
    const desc = "Procès-verbaux et documents officiels de l'AGEEI.";
    meta.updateTag({ name: 'description', content: desc });
    meta.updateTag({ property: 'og:title', content: 'AGEEI - Documents' });
    meta.updateTag({ property: 'og:description', content: desc });
    meta.updateTag({ property: 'og:url', content: 'https://ageei.org/documents' });
    meta.updateTag({ property: 'og:image', content: 'https://ageei.org/assets/logo.png' });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.hasError = false;
    forkJoin({
      pvs: this.service.getDocuments(),
      important: this.service.getImportantDocuments(),
    }).subscribe({
      next: ({ pvs, important }) => {
        this.pvDocuments = pvs;
        this.groupPvByYear();
        if (this.pvByYear.length > 0) {
          this.expandedYears.add(this.pvByYear[0].year);
        }
        this.importantDocuments = important;
        this.groupImportantByCategory();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
      },
    });
  }

  private groupPvByYear(): void {
    const grouped = new Map<string, DirectusDocument[]>();
    for (const doc of this.pvDocuments) {
      const year = doc.school_year || 'Autre';
      if (!grouped.has(year)) grouped.set(year, []);
      grouped.get(year)?.push(doc);
    }
    this.pvByYear = Array.from(grouped.entries())
      .map(([year, docs]) => ({
        year,
        docs: docs.sort((a, b) => b.date.localeCompare(a.date)),
      }))
      .sort((a, b) => b.year.localeCompare(a.year));
  }

  private groupImportantByCategory(): void {
    const grouped = new Map<string, ImportantDocument[]>();
    for (const doc of this.importantDocuments) {
      const cat = doc.category || 'Général';
      if (!grouped.has(cat)) grouped.set(cat, []);
      grouped.get(cat)?.push(doc);
    }
    this.importantByCategory = Array.from(grouped.entries())
      .map(([category, docs]) => ({ category, docs }))
      .sort((a, b) => (a.docs[0].sort ?? 0) - (b.docs[0].sort ?? 0));
  }

  toggleYear(year: string): void {
    if (this.expandedYears.has(year)) {
      this.expandedYears.delete(year);
    } else {
      this.expandedYears.add(year);
    }
  }

  isYearExpanded(year: string): boolean {
    return this.expandedYears.has(year);
  }

  openPv(doc: DirectusDocument): void {
    const url = doc.file_pdf || doc.file_md;
    if (url) window.open(url, '_blank');
  }

  hasPvFile(doc: DirectusDocument): boolean {
    return !!(doc.file_pdf || doc.file_md);
  }

  openImportantDoc(doc: ImportantDocument): void {
    if (doc.file_pdf) window.open(doc.file_pdf, '_blank');
  }

  hasImportantDocFile(doc: ImportantDocument): boolean {
    return !!doc.file_pdf;
  }
}
