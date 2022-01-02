import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-funny-window',
  templateUrl: './funny-window.component.html',
  styleUrls: ['./funny-window.component.scss']
})
export class FunnyWindowComponent {

  @Input()
  windowTitle: string;
  
  constructor() { }

}
