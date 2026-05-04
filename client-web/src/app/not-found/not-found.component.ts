import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  standalone: false,
})
export class NotFoundComponent {
  constructor() {
    inject(Title).setTitle('AGEEI - Page introuvable');
  }
}
