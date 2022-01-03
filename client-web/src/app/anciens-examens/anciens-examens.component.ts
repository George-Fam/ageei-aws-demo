import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-anciens-examens',
  templateUrl: './anciens-examens.component.html',
  styleUrls: ['./anciens-examens.component.scss'],
})
export class AnciensExamensComponent {
  searchValue: string;
  courseForm = new FormControl();
  yearForm = new FormControl();
  teacherForm = new FormControl();
  attributeForm = new FormControl();

  courseList = [
    'INF1120',
    'INF1070',
    'INF2120',
    'INF2171',
    'INF5171',
    'INF3135',
    'INF3105',
    'INF3173',
    'INF3080',
    'ECO1110',
    'INF2050',
  ];

  yearList = ['2015', '2016', '2017', '2018', '2019', '2020', '2021'];

  teacherList = ['Jean Privat', 'Paul Vahé-Cicek', 'Mélanie Lord', 'Johnny', 'Éric Beaudry'];

  attributeList = ['Intra', 'Final', 'Quiz'];

  constructor() {}
}
