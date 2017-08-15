import { Component, OnInit } from '@angular/core';
import { ContentsService } from './contents.service';

@Component({
  selector: 'app-contents',
  templateUrl: './contents.component.html',
  styleUrls: ['./contents.component.css'],
  providers: [ContentsService]
})
export class ContentsComponent implements OnInit {
  contents: any;

  constructor(private contentService: ContentsService) { }

  ngOnInit() {
    this.contentService.getContents().subscribe(contents => {
      this.contents = contents;
    });
  }

}
