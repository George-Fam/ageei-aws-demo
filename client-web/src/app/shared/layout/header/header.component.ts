import { Component, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent {
  menuOpened = false;
  isHidden = false;
  private prevScrollPos = 0;
  private suppressReveal = false;
  private suppressRevealTimer: ReturnType<typeof setTimeout> | null = null;

  router = inject(Router);

  router_links = [
    { name: 'Accueil', url: '/' },
    { name: 'FAQ', url: '/faq' },
    { name: 'Calendrier', url: '/calendrier' },
    { name: 'Documents', url: '/documents' },
    { name: 'Publications', url: '/posts' },
    { name: 'Charte', url: '/charte' },
    { name: 'Contact', url: '/contact' },
  ];

  @HostListener('window:toc-scroll')
  onTocScroll(): void {
    this.suppressReveal = true;
    if (this.suppressRevealTimer) clearTimeout(this.suppressRevealTimer);
    this.suppressRevealTimer = setTimeout(() => {
      this.suppressReveal = false;
      this.suppressRevealTimer = null;
    }, 1000);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const currentScrollPos = window.pageYOffset;
    const scrollingDown = this.prevScrollPos < currentScrollPos;
    if (scrollingDown && currentScrollPos > 60) {
      this.isHidden = true;
      document.body.classList.add('nav-hidden');
    } else if (!scrollingDown && !this.suppressReveal) {
      this.isHidden = false;
      document.body.classList.remove('nav-hidden');
    }
    this.prevScrollPos = currentScrollPos;
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    this.menuOpened = false;
  }

  isActiveLink(url: string): boolean {
    if (url === '/') {
      return this.router.isActive('/', {
        paths: 'exact',
        queryParams: 'exact',
        fragment: 'ignored',
        matrixParams: 'ignored',
      });
    }
    return this.router.isActive(url, {
      paths: 'subset',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }
}
