export interface DirectusFinissantCohorte {
  id: number;
  sort: number | null;
  name: string | null;
  year_start: number | null;
  year_end: number | null;
  mosaic_image: string | null;
}

export interface FinissantCohorte extends DirectusFinissantCohorte {
  mosaicImageUrl: string | null;
}
