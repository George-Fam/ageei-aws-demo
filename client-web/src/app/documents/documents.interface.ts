export interface DirectusDocument {
  id: number;
  title: string;
  date: string;
  type: string;
  school_year: string;
  file_md: string | null;
  file_pdf: string | null;
}

export interface DirectusDocumentResponse {
  data: DirectusDocument[];
}

export interface ImportantDocument {
  id: number;
  sort: number | null;
  title: string;
  description: string | null;
  file_pdf: string | null;
  category: string | null;
}

export interface ImportantDocumentResponse {
  data: ImportantDocument[];
}
