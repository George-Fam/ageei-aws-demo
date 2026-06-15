import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SponsorPdfRedirectComponent } from './sponsor-pdf-redirect.component';

const routes: Routes = [
  { path: 'en', component: SponsorPdfRedirectComponent, data: { lang: 'en' } },
  { path: 'fr', component: SponsorPdfRedirectComponent, data: { lang: 'fr' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SponsorsRoutingModule {}
