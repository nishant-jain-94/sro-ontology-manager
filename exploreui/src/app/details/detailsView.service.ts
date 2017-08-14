import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map'
import { Configuration } from '../app.constants';
import { DetailsViewModel } from './detailsView.model';
import {Observable} from 'rxjs/Rx';


@Injectable()
export class DetailsViewService {

  constructor(private http: HttpClient) { }
  
  getDetails(type: string, id: string): Observable<any> {
    const url = `${Configuration.Server}/${type}/${id}/details`;
    return this.http.get(url);
  }

}
