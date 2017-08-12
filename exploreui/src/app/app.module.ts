import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { MaterialModule } from './core/material.module';
// import { CoreModule } from './core/core.module';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { CoursesComponent } from './courses/courses.component';
import { ConceptsComponent } from './concepts/concepts.component';
import { ContentsComponent } from './contents/contents.component';
import { NavComponent } from './core/nav/nav.component';

const routes: Routes = [
   { path: 'courses', component: CoursesComponent },
   { path: 'concepts', component: ConceptsComponent },
   { path: 'contents', component: ContentsComponent },
   { path: '', redirectTo: 'courses', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    CoursesComponent,
    ConceptsComponent,
    ContentsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    // CoreModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
