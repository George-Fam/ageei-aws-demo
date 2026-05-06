export interface DirectusPost {
  id: string;
  date_created: string;
  title: string;
  content: string;
  image: string | null;
  link: string | null;
  link_label?: string | null;
}

export interface Post extends Omit<DirectusPost, 'image'> {
  image: string | null;
  imageUrl: string | null;
}

export interface DirectusCollectionResponse<T> {
  data: T[];
}

export interface DirectusItemResponse<T> {
  data: T;
}

export interface FeaturedPostReference {
  id: number;
  post: string | null;
}
