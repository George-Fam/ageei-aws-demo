export interface CmsEvent {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string | null;
  author_organizer: string;
  poster: string | null;
  link_url: string | null;
  link_label: string | null;
}

export interface CmsEventsResponse {
  data: CmsEvent[];
}
