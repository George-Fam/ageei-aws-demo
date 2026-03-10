import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent implements AfterViewInit {
  menuOpened: boolean;

  constructor() {
    this.menuOpened = false;
  }

  router_links = [
    { name: 'Accueil', url: '/' },
    { name: 'FAQ', url: '/faq' },
    { name: 'Calendrier', url: '/calendrier' },
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
