import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
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
  isLoading = true;
  hasError = false;

  private contactService = inject(ContactService);

  constructor() {
    inject(Title).setTitle('AGEEI - Contact');
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.hasError = false;
    forkJoin({
      execs: this.contactService.getExecs(),
      groups: this.contactService.getComiteGroups(),
    }).subscribe({
      next: ({ execs, groups }) => {
        this.execs = execs;
        this.comiteGroups = groups;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
      },
    });
  }
}
