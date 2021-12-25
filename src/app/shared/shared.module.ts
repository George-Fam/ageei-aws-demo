import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [CommonModule, RouterModule, FlexLayoutModule, HttpClientModule],
  exports: [CommonModule, RouterModule, FlexLayoutModule],
})
export class SharedModule {}
