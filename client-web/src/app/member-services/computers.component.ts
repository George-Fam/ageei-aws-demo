import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-computers',
  templateUrl: './computers.component.html',
  styleUrls: ['./member-services.scss'],
  standalone: false,
})
export class ComputersComponent {
  constructor() {
    inject(Title).setTitle('AGEEI - Ordinateurs CLIC-OPEQ');
    inject(Meta).updateTag({
      name: 'description',
      content: 'Portables remis à neuf à prix solidaire et accompagnement informatique pour les membres de l’AGEEI.',
    });
  }
}
