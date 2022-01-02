import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Exec } from './exec';
import { execsConst } from './execs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  execs: Exec[];

  constructor(titleService: Title) {
    titleService.setTitle('AGEEI - Contact');
  }

  ngOnInit(): void {
    this.execs = execsConst;
  }
}
