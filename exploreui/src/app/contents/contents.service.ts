import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Configuration } from '../app.constants';

@Injectable()
export class ContentsService {

  constructor(private http: HttpClient) { }

  getContents(): Observable<any> {
    const url = `${Configuration.Server}/contents`;
    return this.http.get(url);
  }

}
