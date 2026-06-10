import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Post } from './posts.interface';
import { PostsService } from './posts.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  standalone: false,
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];
  isLoading = true;
  hasError = false;
  private postsService = inject(PostsService);
  private snackBar = inject(MatSnackBar);

  constructor() {
    inject(Title).setTitle('AGEEI - Publications');
    const meta = inject(Meta);
    const desc = "Publications et annonces officielles de l'AGEEI.";
    meta.updateTag({ name: 'description', content: desc });
    meta.updateTag({ property: 'og:title', content: 'AGEEI - Publications' });
    meta.updateTag({ property: 'og:description', content: desc });
    meta.updateTag({ property: 'og:url', content: 'https://ageei.org/posts' });
    meta.updateTag({ property: 'og:image', content: 'https://ageei.org/assets/logo.png' });
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.isLoading = true;
    this.hasError = false;
    this.postsService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
      },
    });
  }

  sharePost(post: Post): void {
    const url = `${window.location.origin}/posts#post-${post.id}`;
    const shareNavigator = navigator as Navigator & {
      share?: (data: { title: string; text?: string; url: string }) => Promise<void>;
    };

    if (shareNavigator.share) {
      shareNavigator.share({ title: post.title, text: "Publication de l'AGEEI", url }).catch(() => this.copyUrl(url));
    } else {
      this.copyUrl(url);
    }
  }

  private copyUrl(url: string): void {
    navigator.clipboard
      ?.writeText(url)
      .then(() => this.snackBar.open('Lien copié', 'OK', { duration: 2500 }))
      .catch(() => this.snackBar.open('Impossible de copier le lien', 'OK', { duration: 2500 }));
  }
}
