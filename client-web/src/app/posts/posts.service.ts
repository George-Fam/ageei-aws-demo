import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, map, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  DirectusCollectionResponse,
  DirectusItemResponse,
  DirectusPost,
  FeaturedPostReference,
  Post,
} from './posts.interface';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private http = inject(HttpClient);

  getPosts(): Observable<Post[]> {
    return this.http
      .get<DirectusCollectionResponse<DirectusPost>>(`${environment.postsUrl}?sort=-date_created&limit=-1`)
      .pipe(map(({ data }) => data.map((post) => this.toPost(post))));
  }

  getFeaturedPost(): Observable<Post | null> {
    return this.http.get<{ data: FeaturedPostReference }>(environment.featuredPostUrl).pipe(
      map(({ data }) => data.post),
      switchMap((featuredPostId) => {
        if (!featuredPostId) {
          return of(null);
        }
        return this.http
          .get<DirectusItemResponse<DirectusPost>>(`${environment.postsUrl}/${encodeURIComponent(featuredPostId)}`)
          .pipe(map(({ data }) => this.toPost(data)));
      })
    );
  }

  private toPost(post: DirectusPost): Post {
    return {
      ...post,
      imageUrl: post.image ? `${environment.cmsUrl}/assets/${post.image}` : null,
    };
  }
}
