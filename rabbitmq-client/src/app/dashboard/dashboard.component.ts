import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DashboardService]
})
export class DashboardComponent implements OnInit {

  public healthStatus: string;
  public queueCount: number;
  public consumerCount: number;
  public consumerUtilizationCollection: Array<any>;

  constructor(public dashboardService: DashboardService) {}

  ngOnInit() {
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
    this.dashboardService.getNoOfQueues().subscribe(result => {
      this.queueCount = result.json().count;
    });
  }

  getNoOfConsumers() {
    this.dashboardService.getNoOfConsumers().subscribe(result => {
      this.consumerCount = result.json().count;
    });
  }

  getConsumerUtilization() {
    this.dashboardService.getConsumerUtilization().subscribe(result => {
      this.consumerUtilizationCollection = result.json();
      console.log(this.consumerUtilizationCollection);
    });
  }
}
