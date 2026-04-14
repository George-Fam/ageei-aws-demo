import { NgModule } from '@angular/core';
import { AccueilComponent } from './accueil.component';
import { SharedModule } from '../shared/shared.module';
import { AccueilRoutingModule } from './accueil-routing.module';
import { NgOptimizedImage } from '@angular/common';

@NgModule({
  declarations: [AccueilComponent],
  imports: [SharedModule, AccueilRoutingModule, NgOptimizedImage],
})
export class AccueilModule {}
