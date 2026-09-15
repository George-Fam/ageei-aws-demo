import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: false,
})
export class FooterComponent {
  readonly essentialLinks = [
    { name: 'Nous joindre', url: '/contact' },
    { name: 'Documents', url: '/documents' },
    { name: 'Charte', url: '/charte' },
    { name: 'Commandites', url: '/sponsors/fr' },
  ];

  readonly socialLinks = [
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/ageei',
      icon: 'assets/contact/facebook.png',
    },
    {
      name: 'GitLab',
      href: 'https://gitlab.com/ageei',
      icon: 'assets/contact/gitlab.svg',
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/company/ageeiuqam/',
      icon: 'assets/contact/linkedin.png',
    },
    {
      name: 'Discord',
      href: 'https://discord.gg/atZwYECQ8D',
      icon: 'assets/contact/discord.svg',
    },
  ];
}
