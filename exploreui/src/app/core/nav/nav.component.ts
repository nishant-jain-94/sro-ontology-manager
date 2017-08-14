import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  showShadow: boolean;

  constructor() { }

  ngOnInit() {
  }

  @HostListener("window:scroll")
  onScroll() {
    if(window.scrollY)
      this.showShadow = true;
    else
      this.showShadow = false;
  }

}
