import { AfterViewChecked, Component, ElementRef, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Post } from '../posts/posts.interface';
import { PostsService } from '../posts/posts.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss'],
  standalone: false,
})
export class AccueilComponent implements OnInit, AfterViewChecked {
  featuredPost: Post | null = null;
  isFeaturedLoading = true;
  hasFeaturedError = false;
  showScrollHint = true;
  excerptOverflows = false;

  @ViewChild('featuredExcerpt') private featuredExcerptRef?: ElementRef<HTMLElement>;
  private postsService = inject(PostsService);

  constructor() {
    inject(Title).setTitle('AGEEI - Accueil');
    const meta = inject(Meta);
    const desc = "Association générale des étudiantes et étudiants en informatique de l'UQAM.";
    meta.updateTag({ name: 'description', content: desc });
    meta.updateTag({ property: 'og:title', content: 'AGEEI - Association des étudiant·e·s en informatique' });
    meta.updateTag({ property: 'og:description', content: desc });
    meta.updateTag({ property: 'og:url', content: 'https://ageei.org/' });
    meta.updateTag({ property: 'og:image', content: 'https://ageei.org/assets/logo.png' });
  }

  ngOnInit(): void {
    this.loadFeaturedPost();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.updateScrollHint();
  }

  loadFeaturedPost(): void {
    this.isFeaturedLoading = true;
    this.hasFeaturedError = false;
    this.postsService.getFeaturedPost().subscribe({
      next: (post) => {
        this.featuredPost = post;
        this.isFeaturedLoading = false;
      },
      error: () => {
        this.isFeaturedLoading = false;
        this.hasFeaturedError = true;
      },
    });
  }

  ngAfterViewChecked(): void {
    const el = this.featuredExcerptRef?.nativeElement;
    if (el) {
      const overflows = el.scrollHeight > el.clientHeight;
      if (overflows !== this.excerptOverflows) {
        this.excerptOverflows = overflows;
      }
    }
  }

  private updateScrollHint(): void {
    const scrolled = window.scrollY + window.innerHeight;
    const total = document.documentElement.scrollHeight;
    this.showScrollHint = scrolled < total - 80;
  }
}
