import { Component, OnInit, NgZone } from '@angular/core';
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

  constructor(private route:ActivatedRoute, public detailService:DetailsViewService, private zone:NgZone) {
    this.details = {};
    this.details.entityType = route.snapshot.params['type'];
    this.details.entityId = route.snapshot.params['id'];
  }

  ngOnInit() {
    this.detailService.getDetails(this.details.entityType, this.details.entityId).subscribe(data => {
        console.log(data);
        this.details.entityName = data.entityName;
        this.details.groups = data.relatedGroups;        
    });
  }
}
