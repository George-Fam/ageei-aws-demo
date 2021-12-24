import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CharteComponent } from './charte.component';

const routes: Routes = [
  {
    path: '',
    component: CharteComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CharteRoutingModule {}
