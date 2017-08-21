import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Rx';

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

  constructor(public dashboardService: DashboardService) {}

  ngOnInit() {
    this.socket = io.connect('http://localhost:3000');
    this.getNodeHealthStatus();
    this.getNoOfQueues();
    this.getNoOfConsumers();
    this.getConsumerUtilization();
  }


  getNodeHealthStatus() {
    this.dashboardService.getNodeHealthStatus().subscribe(status => {
      this.healthStatus = status.json().status;
    });
  }

  getNoOfQueues() {
   // const socket = io('http://localhost:3000');
    // this.dashboardService.getNoOfQueues().subscribe(result => {
    //   this.queueCount = result.json().count;
    // });
    const eventSource = Observable.fromEvent(this.socket, 'queues');
    eventSource.subscribe((data: any) => {
      this.queueCount = data.count;
      console.log('The socket is calling', this.queueCount);
    });
  }

  getNoOfConsumers() {
    this.dashboardService.getNoOfConsumers().subscribe(result => {
      this.consumerCount = result.json().count;
    });
  }

  getConsumerUtilization() {
    // this.dashboardService.getConsumerUtilization().subscribe(result => {
    //   this.consumerUtilizationCollection = result.json();
    //   console.log(this.consumerUtilizationCollection);
    // });

    const eventSource = Observable.fromEvent(this.socket, 'consumerUtilization');
    eventSource.subscribe((data: any) => {
      console.log('Hello' + data);
      this.consumerUtilizationCollection = data;
    });
  }
}
