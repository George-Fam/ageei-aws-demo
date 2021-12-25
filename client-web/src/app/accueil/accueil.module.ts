import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccueilComponent } from './accueil.component';
import { SharedModule } from '../shared/shared.module';
import { AccueilRoutingModule } from './accueil-routing.module';

@NgModule({
  declarations: [AccueilComponent],
  imports: [SharedModule, AccueilRoutingModule],
})
export class AccueilModule {}
