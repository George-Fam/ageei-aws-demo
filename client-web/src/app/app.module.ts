import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgOptimizedImage, registerLocaleData } from '@angular/common';
import localeFrCa from '@angular/common/locales/fr-CA';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CharteModule } from './charte/charte.module';
import { HeaderComponent } from './shared/layout/header/header.component';
import { SharedModule } from './shared/shared.module';
import { AccueilModule } from './accueil/accueil.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FaqModule } from './faq/faq.module';
import { HttpErrorInterceptor } from './core/interceptors/http-error.interceptor';

registerLocaleData(localeFrCa);

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    SharedModule,
    AccueilModule,
    CharteModule,
    FaqModule,
    BrowserAnimationsModule,
    NgOptimizedImage,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-CA' },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
