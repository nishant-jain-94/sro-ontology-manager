import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './core/material.module';
// import { CoreModule } from './core/core.module';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { CoursesComponent } from './courses/courses.component';
import { ConceptsComponent } from './concepts/concepts.component';
import { ContentsComponent } from './contents/contents.component';
import { NavComponent } from './core/nav/nav.component';
import { DetailsViewComponent } from './details/detailsView.component';
import { EncodeUriComponentPipe } from './encode-uri-component.pipe';

const routes: Routes = [
   { path: 'courses', component: CoursesComponent,
     children: [
      { path: ':courseTitle', redirectTo: '/courses/:courseTitle/details', pathMatch: 'full' }
     ]
   },
   { path: 'concepts', component: ConceptsComponent,
     children: [
      { path: ':conceptId', redirectTo: '/concepts/:conceptId/details', pathMatch: 'full' }
     ]
   },
   { path: 'contents', component: ContentsComponent,
     children: [
      { path: ':contentId', redirectTo: '/contents/:contentId/details', pathMatch: 'full' }
     ]
   },
   { path: ':type/:id/details', component: DetailsViewComponent },
   { path: '', redirectTo: 'courses', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    CoursesComponent,
    ConceptsComponent,
    ContentsComponent,
    DetailsViewComponent,
    EncodeUriComponentPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
