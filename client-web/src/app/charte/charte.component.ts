import { Component, HostListener, OnInit, SecurityContext, inject } from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
import { ContactService } from '../contact/contact.service';
import { ComiteGroup, ExecInterface } from '../contact/exec.interface';
import { CharteService } from './charte.service';

@Component({
  selector: 'app-charte',
  templateUrl: './charte.component.html',
  styleUrls: ['./charte.component.scss'],
  standalone: false,
})
export class CharteComponent implements OnInit {
  private charteService = inject(CharteService);
  private contactService = inject(ContactService);
  private sanitizer = inject(DomSanitizer);

  charte: string = '';
  execs: ExecInterface[] = [];
  comiteGroups: ComiteGroup[] = [];
  isLoading = true;
  hasError = false;

  constructor() {
    inject(Title).setTitle('AGEEI - Charte');
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.hasError = false;
    forkJoin({
      charte: this.charteService.getCharte(),
      execs: this.contactService.getExecs(),
      comiteGroups: this.contactService.getComiteGroups(),
    }).subscribe({
      next: ({ charte, execs, comiteGroups }) => {
        this.charte = this.sanitizer.sanitize(SecurityContext.HTML, charte) ?? '';
        this.execs = execs;
        this.comiteGroups = comiteGroups;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
      },
    });
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
