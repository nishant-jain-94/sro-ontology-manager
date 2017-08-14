import {
  MdButtonModule,
  MdToolbarModule,
  MdCardModule,
  MdDialogModule,
  MdTabsModule
} from '@angular/material';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    MdButtonModule,
    MdCardModule,
    MdToolbarModule,
    MdTabsModule,
    MdDialogModule
  ],
  exports: [
    MdButtonModule,
    MdCardModule,
    MdToolbarModule,
    MdDialogModule,
    MdTabsModule
  ]
})
export class MaterialModule { }
