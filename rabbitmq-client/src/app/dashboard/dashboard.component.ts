import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Rx';
import { Config } from '../app.config';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DashboardService]
})
export class DashboardComponent implements OnInit {

  public socket;
  public healthStatus: string;
  public queueCount: number;
  public consumerCount: number;
  public consumerUtilizationCollection: Array<any>;

  constructor(public dashboardService: DashboardService) {
    this.queueCount = 0;
    this.healthStatus = 'No Connection';
    this.consumerCount = 0;
  }

  ngOnInit() {
    this.socket = io.connect(`${Config.WSServer}`);
    this.getNodeHealthStatus();
    this.getNoOfQueues();
    this.getNoOfConsumers();
    this.getConsumerUtilization();
  }


  getNodeHealthStatus() {
    const eventSource = Observable.fromEvent(this.socket, 'healthStatus');
    eventSource.subscribe((data: any) => {
      this.healthStatus = data.status;
    });
  }

  getNoOfQueues() {
    const eventSource = Observable.fromEvent(this.socket, 'queues');
    eventSource.subscribe((data: any) => {
      this.queueCount = data.count;
    });
  }

  getNoOfConsumers() {
    const eventSource = Observable.fromEvent(this.socket, 'consumers');
    eventSource.subscribe((data: any) => {
      this.consumerCount = data.count;
    });
  }

  getConsumerUtilization() {
    const eventSource = Observable.fromEvent(this.socket, 'consumerUtilization');
    eventSource.subscribe((data: any) => {
      this.consumerUtilizationCollection = data;
    });
  }

}
