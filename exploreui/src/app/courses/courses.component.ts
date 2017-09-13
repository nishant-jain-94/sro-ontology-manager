import { Component, OnInit } from '@angular/core';
import { CoursesViewModel } from './courses.model';
import { CoursesService } from './courses.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
  providers: [CoursesService]
})
export class CoursesComponent implements OnInit {
  coursesItems: Array<CoursesViewModel>;
  showProgress: Boolean = true;

  constructor(private courseService: CoursesService) {
  }

  ngOnInit() {
    this.courseService.getCourses().subscribe(courses => {
      this.coursesItems = courses;
      this.showProgress = false;
    });
  }

}
