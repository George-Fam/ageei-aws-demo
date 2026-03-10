import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-funny-window',
  templateUrl: './funny-window.component.html',
  styleUrls: ['./funny-window.component.scss'],
  standalone: false,
})
export class FunnyWindowComponent {
  @Input()
  windowTitle: string;

  @Input()
  dot_count?: number = 3;

  dot_count_array: Array<number>;

  constructor() {
    this.dot_count_array = Array(this.dot_count);
  }
}
