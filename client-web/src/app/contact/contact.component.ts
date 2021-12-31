import { Component, OnInit } from '@angular/core';
import { Exec } from './exec';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  execs: Exec[];

  constructor() {
  }

  ngOnInit(): void {
    this.execs = [
      {
        position: 'président',
        fullname: 'Pierre-Olivier Brillant',
        email: 'president@ageei.org',
        picture: 'assets/contact/execs/president.jpg',
        github: 'PierreOlivierBrillant',
        linkedin: 'pierreolivier-brillant'
      },
      {
        position: 'secrétaire',
        fullname: 'Zachary Péloquin',
        email: 'secretaire@ageei.org',
        picture: 'assets/contact/execs/secretaire.jpg',
        github: 'ZacharyPeloquin',
        linkedin: 'zachary-peloquin-b3994b1ba'
      },
      {
        position: 'trésorier',
        fullname: 'Armand Brière',
        email: 'tresorier@ageei.org',
        picture: 'assets/contact/execs/tresorier.jpg',
        github: 'ArmandBriere',
        linkedin: 'armand-briere'
      },
      {
        position: 'vp-interne',
        fullname: 'Fanny Lavergne',
        email: 'interne@ageei.org',
        picture: 'assets/contact/execs/interne.jpg',
        github: 'lesGrandsBras',
        linkedin: 'fanny-lavergne-aa79442a'
      },
      {
        position: 'vp-loisirs',
        fullname: 'Simon Désormeaux',
        email: 'loisirs@ageei.org',
        picture: 'assets/contact/execs/loisirs.jpg',
        github: 'sdxsofteng',
        linkedin: 'simon-désormeaux-9326221b6'
      },
      {
        position: 'vp-techno',
        fullname: 'Lancelot Normand',
        email: 'techno@ageei.org',
        picture: 'assets/contact/execs/techo.jpg',
        github: 'lancelotnd',
        linkedin: 'lancelot-normand-456120122'
      },
    ]
  }
}
