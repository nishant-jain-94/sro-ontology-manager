import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MdToolbarModule,
  MdCardModule,
  MdIconModule
} from '@angular/material';

@NgModule({
  imports: [
    MdToolbarModule,
    MdCardModule,
    MdIconModule
  ],
  declarations: [],
  exports: [
    MdToolbarModule,
    MdIconModule,
    MdCardModule
   ]
})
export class MaterialModule { }
