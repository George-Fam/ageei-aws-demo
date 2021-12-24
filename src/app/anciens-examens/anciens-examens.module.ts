import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnciensExamensComponent } from './anciens-examens.component';
import { SharedModule } from '../shared/shared.module';
import { AnciensExamensRoutingModule } from './anciens-examens-routing.module';

@NgModule({
  declarations: [AnciensExamensComponent],
  imports: [SharedModule, AnciensExamensRoutingModule],
})
export class AnciensExamensModule {}
