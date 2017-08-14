import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Configuration } from '../app.constants';


@Injectable()
export class ConceptsService {

  constructor(private http: HttpClient) { }

  getConcepts(): Observable<any> {
    const url = `${Configuration.Server}/concepts`;
    return this.http.get(url);
  }

}
