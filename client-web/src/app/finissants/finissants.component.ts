import { Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { FinissantCohorte } from './finissants.interface';
import { FinissantsService } from './finissants.service';

@Component({
  selector: 'app-finissants',
  templateUrl: './finissants.component.html',
  styleUrls: ['./finissants.component.scss'],
  standalone: false,
})
export class FinissantsComponent implements OnInit {
  cohortes: FinissantCohorte[] = [];
  isLoading = true;
  hasError = false;

  private finissantsService = inject(FinissantsService);

  constructor() {
    inject(Title).setTitle('AGEEI - Finissants');
    const desc = "Mosaïques et souvenirs des cohortes finissantes en informatique de l'UQAM.";
    const meta = inject(Meta);
    meta.updateTag({ name: 'description', content: desc });
    meta.updateTag({ property: 'og:title', content: 'AGEEI — Finissants' });
    meta.updateTag({ property: 'og:description', content: desc });
    meta.updateTag({ property: 'og:url', content: 'https://ageei.org/finissants' });
    meta.updateTag({ property: 'og:image', content: 'https://ageei.org/assets/logo.png' });
  }

  ngOnInit(): void {
    this.loadCohortes();
  }

  loadCohortes(): void {
    this.isLoading = true;
    this.hasError = false;
    this.finissantsService.getCohortes().subscribe({
      next: (cohortes) => {
        this.cohortes = cohortes;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
      },
    });
  }
}
