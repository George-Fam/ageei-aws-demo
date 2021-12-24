import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnciensExamensComponent } from './anciens-examens.component';

const routes: Routes = [
  {
    path: '',
    component: AnciensExamensComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnciensExamensRoutingModule {}
