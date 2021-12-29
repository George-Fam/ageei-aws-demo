import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    let prevScrollpos = window.pageYOffset;
    window.onscroll = () => {
      const currentScrollPos = window.pageYOffset;
      const container = document.getElementById('nav-container');
      if (container) {
        if (prevScrollpos > currentScrollPos) {
          container.style.top = '0';
        } else {
          container.style.top = '-130px';
        }
        prevScrollpos = currentScrollPos;
      }
    };
  }
}
