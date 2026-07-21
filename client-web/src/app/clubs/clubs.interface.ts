export interface DirectusClub {
  id: number;
  sort: number | null;
  name: string;
  slug: string | null;
  summary: string | null;
  description: string | null;
  tags: string[] | null;
  logo: string | null;
  cover_image: string | null;
  contact_label: string | null;
  contact_url: string | null;
  discord_url: string | null;
  meeting_info: string | null;
  category: string | null;
}

export interface Club extends DirectusClub {
  logoUrl: string | null;
  coverImageUrl: string | null;
}
