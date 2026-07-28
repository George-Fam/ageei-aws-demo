import { Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Club } from './clubs.interface';
import { ClubsService } from './clubs.service';

@Component({
  selector: 'app-clubs',
  templateUrl: './clubs.component.html',
  styleUrls: ['./clubs.component.scss'],
  standalone: false,
})
export class ClubsComponent implements OnInit {
  clubs: Club[] = [];
  isLoading = true;
  hasError = false;

  private clubsService = inject(ClubsService);

  constructor() {
    inject(Title).setTitle('AGEEI - Clubs');
    const desc = "Clubs étudiants, initiatives et espaces de projet de la communauté informatique de l'UQAM.";
    const meta = inject(Meta);
    meta.updateTag({ name: 'description', content: desc });
    meta.updateTag({ property: 'og:title', content: 'AGEEI — Clubs étudiants' });
    meta.updateTag({ property: 'og:description', content: desc });
    meta.updateTag({ property: 'og:url', content: 'https://ageei.org/clubs' });
    meta.updateTag({ property: 'og:image', content: 'https://ageei.org/assets/logo.png' });
  }

  ngOnInit(): void {
    this.loadClubs();
  }

  loadClubs(): void {
    this.isLoading = true;
    this.hasError = false;
    this.clubsService.getClubs().subscribe({
      next: (clubs) => {
        this.clubs = clubs;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
      },
    });
  }
}
