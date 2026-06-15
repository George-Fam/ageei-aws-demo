import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sponsor-pdf-redirect',
  template: '',
  standalone: false,
})
export class SponsorPdfRedirectComponent implements OnInit {
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const lang = this.route.snapshot.data['lang'] === 'en' ? 'en' : 'fr';
    window.location.replace(`/sponsor-package/package-${lang}.html`);
  }
}
