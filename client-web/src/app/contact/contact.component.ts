import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ComiteGroup, ExecInterface } from './exec.interface';
import { ContactService } from './contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: false,
})
export class ContactComponent implements OnInit {
  execs: ExecInterface[] = [];
  comiteGroups: ComiteGroup[] = [];
  questions = ['Une question ?', 'Un commentaire ?', 'Une opinion constructive ?'];

  private contactService = inject(ContactService);

  constructor() {
    inject(Title).setTitle('AGEEI - Contact');
    const meta = inject(Meta);
    const desc = "Contactez le comité exécutif de l'AGEEI et consultez les membres étudiants.";
    meta.updateTag({ name: 'description', content: desc });
    meta.updateTag({ property: 'og:title', content: 'AGEEI - Contact' });
    meta.updateTag({ property: 'og:description', content: desc });
    meta.updateTag({ property: 'og:url', content: 'https://ageei.org/contact' });
    meta.updateTag({ property: 'og:image', content: 'https://ageei.org/assets/logo.png' });
  }

  ngOnInit(): void {
    this.contactService.getExecs().subscribe((execs) => {
      this.execs = execs;
    });
    this.contactService.getComiteGroups().subscribe((groups) => {
      this.comiteGroups = groups;
    });
  }
}
