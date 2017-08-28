import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MdToolbarModule,
  MdCardModule,
  MdIconModule,
  MdProgressSpinnerModule
} from '@angular/material';

@NgModule({
  imports: [
    MdToolbarModule,
    MdCardModule,
    MdIconModule,
    MdProgressSpinnerModule
  ],
  declarations: [],
  exports: [
    MdToolbarModule,
    MdIconModule,
    MdCardModule,
    MdProgressSpinnerModule
   ]
})
export class MaterialModule { }
