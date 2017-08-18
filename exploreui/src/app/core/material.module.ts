import {
  MdButtonModule,
  MdToolbarModule,
  MdCardModule,
  MdDialogModule,
  MdTabsModule,
  MdProgressBarModule
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
    MdProgressBarModule,
    MdDialogModule
  ],
  exports: [
    MdButtonModule,
    MdCardModule,
    MdToolbarModule,
    MdDialogModule,
    MdTabsModule,
    MdProgressBarModule
  ]
})
export class MaterialModule { }
