import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { NgxTypedJsModule } from 'ngx-typed-js';
import { FunnyWindowComponent } from './layout/funny-window/funny-window.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ErrorStateComponent } from './layout/error-state/error-state.component';
import { LoadingStateComponent } from './layout/loading-state/loading-state.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCardModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    NgxTypedJsModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCardModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    NgxTypedJsModule,
    FunnyWindowComponent,
    ErrorStateComponent,
    LoadingStateComponent,
  ],
  declarations: [FunnyWindowComponent, ErrorStateComponent, LoadingStateComponent],
})
export class SharedModule {}
