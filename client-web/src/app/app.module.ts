import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CharteModule } from './charte/charte.module';
import { HeaderComponent } from './shared/layout/header/header.component';
import { SharedModule } from './shared/shared.module';
import { AnciensExamensModule } from './anciens-examens/anciens-examens.module';
import { AccueilModule } from './accueil/accueil.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FaqModule } from './faq/faq.module';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [AppRoutingModule, BrowserModule, SharedModule, AnciensExamensModule, AccueilModule, CharteModule, FaqModule, BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
