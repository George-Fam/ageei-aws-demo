import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ExecInterface } from './exec.interface';
import { execsConst } from './execs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  execs: ExecInterface[];
  questions = ['Une question ?', 'Un commentaire ?', 'Une opinion constructive ?'];

  constructor(titleService: Title) {
    titleService.setTitle('AGEEI - Contact');
  }

  ngOnInit(): void {
    this.execs = execsConst;
  }
}
