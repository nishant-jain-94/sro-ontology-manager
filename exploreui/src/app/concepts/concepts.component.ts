import { Component, OnInit } from '@angular/core';
import { ConceptsService } from './concepts.service';

@Component({
  selector: 'app-concepts',
  templateUrl: './concepts.component.html',
  styleUrls: ['./concepts.component.css'],
  providers: [ConceptsService]
})
export class ConceptsComponent implements OnInit {
  concepts: any;
  showProgress: boolean = true;

  constructor(private conceptService: ConceptsService) { }

  ngOnInit() {
    this.conceptService.getConcepts().subscribe(concepts => {
      this.concepts = concepts
      this.showProgress = false;
    });
  }

}
