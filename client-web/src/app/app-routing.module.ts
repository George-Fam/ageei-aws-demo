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
  {
    path: 'documents',
    loadChildren: () => import('./documents/documents.module').then((m) => m.DocumentsModule),
  },
  {
    path: 'clubs',
    loadChildren: () => import('./clubs/clubs.module').then((m) => m.ClubsModule),
  },
  {
    path: 'finissants',
    loadChildren: () => import('./finissants/finissants.module').then((m) => m.FinissantsModule),
  },
  {
    path: 'posts',
    loadChildren: () => import('./posts/posts.module').then((m) => m.PostsModule),
  },
  {
    path: 'sponsors',
    loadChildren: () => import('./sponsors/sponsors.module').then((m) => m.SponsorsModule),
  },
  {
    path: '',
    loadChildren: () => import('./member-services/member-services.module').then((m) => m.MemberServicesModule),
  },
  { path: '**', loadChildren: () => import('./not-found/not-found.module').then((m) => m.NotFoundModule) },
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
