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

  router = inject(Router);

  router_links = [
    { name: 'Accueil', url: '/' },
    { name: 'FAQ', url: '/faq' },
    { name: 'Calendrier', url: '/calendrier' },
    { name: 'Documents', url: '/documents' },
    { name: 'Charte', url: '/charte' },
    { name: 'Contact', url: '/contact' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    const currentScrollPos = window.pageYOffset;
    this.isHidden = this.prevScrollPos < currentScrollPos && currentScrollPos > 60;
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
