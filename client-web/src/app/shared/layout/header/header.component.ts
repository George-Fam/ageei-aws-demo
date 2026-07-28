import { Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';

interface NavLink {
  name: string;
  url: string;
  note?: string;
}

interface NavGroup {
  name: string;
  links: NavLink[];
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent implements OnInit, OnDestroy {
  menuOpened = false;
  isHidden = false;
  private prevScrollPos = 0;
  private suppressReveal = false;
  private suppressRevealTimer: ReturnType<typeof setTimeout> | null = null;
  private routerSubscription?: Subscription;

  router = inject(Router);

  primaryLinks: NavLink[] = [
    { name: 'Accueil', url: '/' },
    { name: 'Actualités', url: '/posts' },
  ];

  navGroups: NavGroup[] = [
    {
      name: 'Vie étudiante',
      links: [
        { name: 'Calendrier', url: '/calendrier', note: 'Événements et activités' },
        { name: 'Clubs', url: '/clubs', note: 'Initiatives étudiantes' },
        { name: 'Finissant·e·s', url: '/finissants', note: 'Cohortes et photos' },
      ],
    },
    {
      name: 'Ressources',
      links: [
        { name: 'Documents', url: '/documents', note: 'Archives et formulaires' },
        { name: 'Ordinateurs CLIC-OPEQ', url: '/ordinateurs', note: 'Portables abordables' },
        { name: 'Charte', url: '/charte', note: 'Règles de l’association' },
        { name: 'FAQ', url: '/faq', note: 'Réponses rapides' },
      ],
    },
    {
      name: 'Association',
      links: [
        { name: 'Nous joindre', url: '/contact', note: 'Exécutif et coordonnées' },
        { name: 'Commandites', url: '/sponsors/fr', note: 'Forfait 2026–2027' },
        { name: 'Sponsorship', url: '/sponsors/en', note: 'English package' },
      ],
    },
  ];

  ngOnInit(): void {
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        (document.activeElement as HTMLElement | null)?.blur();
      });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

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
    if (this.menuOpened) return;
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
    this.closeMenu();
  }

  toggleMenu(): void {
    this.menuOpened = !this.menuOpened;
    this.isHidden = false;
    document.body.classList.toggle('mobile-menu-open', this.menuOpened);
    document.body.classList.remove('nav-hidden');
  }

  closeMenu(): void {
    this.menuOpened = false;
    document.body.classList.remove('mobile-menu-open');
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

  isActiveGroup(group: NavGroup): boolean {
    return group.links.some((link) => this.isActiveLink(link.url));
  }
}
