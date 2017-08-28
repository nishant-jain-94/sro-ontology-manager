import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Rx';
import { Config } from '../app.config';

@Component({
  selector: 'app-neo4j-dashboard',
  templateUrl: './neo4j-dashboard.component.html',
  styleUrls: ['./neo4j-dashboard.component.css']
})
export class Neo4jDashboardComponent implements OnInit {

  public socket;
  public neo4jHealthStatus: string;
  public nodeData: object;
  public relationshipData: object;

  constructor() {
    this.neo4jHealthStatus = 'No Connection';
    this.nodeData = { value: 0 };
    this.relationshipData = { value: 0 };
   }

  ngOnInit() {
    this.socket = io.connect(`${Config.WSServer}`);
    this.getNeo4jHealthStatus();
    this.getNeo4jData();
  }

  getNeo4jHealthStatus() {
    const eventSource = Observable.fromEvent(this.socket, 'neo4jHealthStatus');
    eventSource.subscribe((data: any) => {
      this.neo4jHealthStatus = data.status;
    });
  }

  getNeo4jData() {
    const eventSource = Observable.fromEvent(this.socket, 'neo4jData');
    eventSource.subscribe((data: any) => {
      this.nodeData = this.processNodeData(data).pop();
      this.relationshipData = this.processRelationshipData(data).pop();
    });
  }


  processNodeData(data) {

    const processedData = data.filter(function(x) {
      if ( x.name  === 'NumberOfNodeIdsInUse') {
        return x;
      }
    })
    .map(function(x) {
      if ( x.name  === 'NumberOfNodeIdsInUse' ) {
        x.name = 'Number of Nodes';
      }
      return x;
    });

    return processedData;

  }

  processRelationshipData(data) {

    const processedData = data.filter(function(x) {
      if ( x.name  === 'NumberOfRelationshipIdsInUse') {
        return x;
      }
    })
    .map(function(x) {
      if ( x.name  === 'NumberOfRelationshipIdsInUse' ) {
        x.name = 'Number of Relationships';
      }
      return x;
    });

    return processedData;

  }

}
