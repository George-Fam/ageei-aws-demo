import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
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
    const titleService = inject(Title);
    titleService.setTitle('AGEEI - Contact');
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
