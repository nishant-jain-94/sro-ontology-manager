import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailsViewModel } from './detailsView.model';
import { DetailsViewService } from './detailsView.service';

@Component({
  selector: 'app-details',
  templateUrl: './detailsView.component.html',
  styleUrls: ['./detailsView.component.css'],
  providers: [DetailsViewService]
})
export class DetailsViewComponent implements OnInit {
  details: any;

  constructor(private route: ActivatedRoute, public detailService: DetailsViewService) {
    this.details = {};
    this.details.entityType = route.snapshot.params['type'];
    this.details.entityId = route.snapshot.params['id'];
  }

  getDetails(entityType, entityId) {
    this.details.entityType = entityType;
    this.details.entityId = entityId;
    this.detailService.getDetails(entityType, entityId).subscribe(data => {
        this.details.entityName = data.entityName;
        this.details.groups = data.relatedGroups;
        console.log(this.details.groups);
    });
  }

  ngOnInit() {
    this.route.params.subscribe(data => this.getDetails(data.type, data.id));
  }
}
