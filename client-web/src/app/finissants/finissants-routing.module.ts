import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinissantsComponent } from './finissants.component';

const routes: Routes = [
  {
    path: '',
    component: FinissantsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinissantsRoutingModule {}
