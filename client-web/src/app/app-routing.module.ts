import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    data: { preload: true },
    loadChildren: () => import('./accueil/accueil.module').then((m) => m.AccueilModule),
  },
  {
    path: 'calendrier',
    loadChildren: () => import('./timeline/timeline.module').then((m) => m.TimelineModule),
  },
  {
    path: 'charte',
    loadChildren: () => import('./charte/charte.module').then((m) => m.CharteModule),
  },
  {
    path: 'contact',
    loadChildren: () => import('./contact/contact.module').then((m) => m.ContactModule),
  },
  {
    path: 'faq',
    loadChildren: () => import('./faq/faq.module').then((m) => m.FaqModule),
  },
  { path: '**', pathMatch: 'full', redirectTo: '' }, // catch any unfound routes and redirect to home page
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
