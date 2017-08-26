import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModule } from './core/material.module';

import { AppComponent } from './app.component';
import { NavComponent } from './core/nav/nav.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { ConvertToIntegerPipe } from './core/convert-to-integer.pipe';
import { Neo4jDashboardComponent } from './neo4j-dashboard/neo4j-dashboard.component';

const appRoutes: Routes = [
  { path: 'dashboard/rabbitmq', component: DashboardComponent },
  { path: 'dashboard/neo4j', component: Neo4jDashboardComponent },
  { path: '', redirectTo: '/dashboard/rabbitmq', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DashboardComponent,
    ConvertToIntegerPipe,
    Neo4jDashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpModule,
    RouterModule.forRoot( appRoutes )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
