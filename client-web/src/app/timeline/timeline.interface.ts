export interface Timeline {
  title: string;
  detail: string;
  organizator: string;
  date?: number;
  approximateMonth?: number;
  image?: string;
  button?: {
    title: string;
    link: string;
  };
}
