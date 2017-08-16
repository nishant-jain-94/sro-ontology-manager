import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class DashboardService {
  public headers: Headers;

  constructor(public http: Http) {
    this.headers = new Headers({
      'Content-Type': 'application/json'
    });
   }

  getNodeHealthStatus() {
    const url = `http://localhost:3000/healthStatus`;
    return this.http.get(url, {headers: this.headers});
  }

  getNoOfQueues() {
    const url = `http://localhost:3000/noOfQueues`;
    return this.http.get(url, {headers: this.headers});
  }

  getNoOfConsumers() {
    const url = `http://localhost:3000/noOfConsumers`;
    return this.http.get(url, {headers: this.headers});
  }

  getConsumerUtilization() {
    const url = `http://localhost:3000/consumerUtilisation`;
    return this.http.get(url, {headers: this.headers});
  }
}
