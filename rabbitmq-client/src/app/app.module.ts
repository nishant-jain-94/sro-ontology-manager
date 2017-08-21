import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { MaterialModule } from './core/material.module';

import { AppComponent } from './app.component';
import { NavComponent } from './core/nav/nav.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { ConvertToIntegerPipe } from './core/convert-to-integer.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DashboardComponent,
    ConvertToIntegerPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
