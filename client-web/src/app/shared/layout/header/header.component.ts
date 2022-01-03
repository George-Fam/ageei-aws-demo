import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewInit {
  constructor() {}

  router_links = [
    { name: 'Accueil', url: '/' },
    { name: 'FAQ', url: '/faq' },
    { name: 'Charte', url: '/charte' },
    { name: 'Contact', url: '/contact' },
  ];

  ngAfterViewInit(): void {
    // Hide menu on scroll
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
