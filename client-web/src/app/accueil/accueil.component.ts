import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss'],
  standalone: false,
})
export class AccueilComponent {
  constructor() {
    const titleService = inject(Title);

    titleService.setTitle('AGEEI - Accueil');
  }
}
