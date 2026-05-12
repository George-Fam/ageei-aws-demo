import { Component, HostListener, NgZone, OnDestroy, OnInit, SecurityContext, inject } from '@angular/core';
import { DomSanitizer, Meta, SafeHtml, Title } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
import { ContactService } from '../contact/contact.service';
import { ComiteGroup, ExecInterface } from '../contact/exec.interface';
import { CharteService } from './charte.service';

interface TocSection {
  id: string;
  text: string;
  level: number;
  children: TocSection[];
}

@Component({
  selector: 'app-charte',
  templateUrl: './charte.component.html',
  styleUrls: ['./charte.component.scss'],
  standalone: false,
})
export class CharteComponent implements OnInit, OnDestroy {
  private charteService = inject(CharteService);
  private contactService = inject(ContactService);
  private sanitizer = inject(DomSanitizer);
  private ngZone = inject(NgZone);

  charte: SafeHtml = '';
  execs: ExecInterface[] = [];
  comiteGroups: ComiteGroup[] = [];
  isLoading = true;
  hasError = false;

  tocItems: TocSection[] = [];
  activeSectionId: string | null = null;
  isTocMobileOpen = false;

  private observer: IntersectionObserver | null = null;
  private suppressObserverUntil = 0;

  constructor() {
    inject(Title).setTitle('AGEEI - Charte');
    const meta = inject(Meta);
    const desc = "Règlements généraux et charte officielle de l'AGEEI.";
    meta.updateTag({ name: 'description', content: desc });
    meta.updateTag({ property: 'og:title', content: 'AGEEI - Charte' });
    meta.updateTag({ property: 'og:description', content: desc });
    meta.updateTag({ property: 'og:url', content: 'https://ageei.org/charte' });
    meta.updateTag({ property: 'og:image', content: 'https://ageei.org/assets/logo.png' });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.hasError = false;
    this.tocItems = [];
    this.activeSectionId = null;
    this.destroyObserver();
    forkJoin({
      charte: this.charteService.getCharte(),
      execs: this.contactService.getExecs(),
      comiteGroups: this.contactService.getComiteGroups(),
    }).subscribe({
      next: ({ charte, execs, comiteGroups }) => {
        // Sanitize the raw HTML first, then assign IDs in the already-safe output.
        // bypassSecurityTrustHtml is safe here because we sanitized before parsing.
        const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, charte) ?? '';
        const { html, tocItems } = this.parseCharte(sanitized);
        this.charte = this.sanitizer.bypassSecurityTrustHtml(html);
        this.tocItems = tocItems;
        this.execs = execs;
        this.comiteGroups = comiteGroups;
        this.isLoading = false;
        setTimeout(() => this.setupScrollSpy(), 0);
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
      },
    });
  }

  ngOnDestroy(): void {
    this.destroyObserver();
  }

  scrollToSection(id: string): void {
    this.activeSectionId = id;
    this.isTocMobileOpen = false;
    this.suppressObserverUntil = Date.now() + 1200;
    window.dispatchEvent(new CustomEvent('toc-scroll'));

    const el = document.getElementById(id);
    if (el) {
      const navbar = document.querySelector('#nav-container') as HTMLElement | null;
      const navbarHeight = navbar?.offsetHeight ?? 0;
      const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  private parseCharte(html: string): { html: string; tocItems: TocSection[] } {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const headings = Array.from(doc.querySelectorAll<HTMLHeadingElement>('h2, h3'));

    if (headings.length === 0) return { html, tocItems: [] };

    const idCounts = new Map<string, number>();
    for (const h of headings) {
      if (!h.id) {
        const base = this.slugify(h.textContent ?? '');
        const count = idCounts.get(base) ?? 0;
        idCounts.set(base, count + 1);
        h.id = count > 0 ? `${base}-${count}` : base;
      }
    }

    const tocItems: TocSection[] = [];
    let currentH2: TocSection | null = null;
    for (const h of headings) {
      const level = parseInt(h.tagName[1], 10);
      const section: TocSection = { id: h.id, text: h.textContent?.trim() ?? '', level, children: [] };
      if (level === 2) {
        tocItems.push(section);
        currentH2 = section;
      } else if (level === 3 && currentH2) {
        currentH2.children.push(section);
      }
    }

    return { html: doc.body.innerHTML, tocItems };
  }

  private setupScrollSpy(): void {
    this.destroyObserver();

    const headingIds = this.tocItems.flatMap((i) => [i.id, ...i.children.map((c) => c.id)]);
    const headings = headingIds.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0) return;

    this.ngZone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          const intersecting = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          if (intersecting.length > 0 && Date.now() >= this.suppressObserverUntil) {
            const id = (intersecting[0].target as HTMLElement).id;
            this.ngZone.run(() => {
              this.activeSectionId = id;
            });
          }
        },
        { rootMargin: '-15% 0px -75% 0px', threshold: 0 }
      );

      for (const h of headings) {
        this.observer!.observe(h);
      }
    });
  }

  private destroyObserver(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.preventDefault();
    const anchor = (event.target as HTMLElement).closest('a');
    const href = anchor?.getAttribute('href');
    if (href?.startsWith('#')) {
      document.getElementById(decodeURIComponent(href.slice(1)))?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
