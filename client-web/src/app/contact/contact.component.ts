import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ExecInterface } from './exec.interface';
import { execsConst } from './execs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: false,
})
export class ContactComponent implements OnInit {
  execs: ExecInterface[];
  questions = ['Une question ?', 'Un commentaire ?', 'Une opinion constructive ?'];

  constructor() {
    const titleService = inject(Title);

    titleService.setTitle('AGEEI - Contact');
  }

  ngOnInit(): void {
    this.execs = execsConst;
  }
}
