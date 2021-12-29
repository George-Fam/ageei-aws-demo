import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-funny-window',
  templateUrl: './funny-window.component.html',
  styleUrls: ['./funny-window.component.scss']
})
export class FunnyWindowComponent implements OnInit {

  @Input()
  content: string;

  @Input()
  isImage: boolean;

  @Input()
  width: string;
  
  constructor() { }

  ngOnInit(): void {
    if(this.content == null) {
      throw new Error("Content not defined");
    }
  }

}
