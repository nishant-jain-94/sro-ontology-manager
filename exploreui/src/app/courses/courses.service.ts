import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Configuration } from '../app.constants';
import { Observable } from 'rxjs'

@Injectable()
export class CoursesService {

  constructor(private http: HttpClient) { }

  getCourses(): Observable<any> {
    const url = `${Configuration.Server}/courses`;
    console.log(url);
    return this.http.get(url);
  }

}
