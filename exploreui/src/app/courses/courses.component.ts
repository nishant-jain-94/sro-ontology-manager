import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  coursesItems: any;

  constructor() {
    this.coursesItems = [
      {
        courseTitle: 'Course Title',
        courseDescription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non diam
        sed neque scelerisque porta vitae facilisis eros.
         Sed sed erat fringilla, dignissim velit quis,
        porttitor lacus. Morbi lacinia nisl ut tincidunt pharetra. Nam congue commodo neque, nec vulputate neque auctor eget.
        Sed ac erat ac velit rhoncus dictum.`,
      },
      {
        courseTitle: 'Course Title',
        courseDescription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non diam
        sed neque scelerisque porta vitae facilisis eros.
         Sed sed erat fringilla, dignissim velit quis,
        porttitor lacus. Morbi lacinia nisl ut tincidunt pharetra. Nam congue commodo neque, nec vulputate neque auctor eget.
        Sed ac erat ac velit rhoncus dictum.`,
      },
      {
        courseTitle: 'Course Title',
        courseDescription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non diam
        sed neque scelerisque porta vitae facilisis eros.
         Sed sed erat fringilla, dignissim velit quis,
        porttitor lacus. Morbi lacinia nisl ut tincidunt pharetra. Nam congue commodo neque, nec vulputate neque auctor eget.
        Sed ac erat ac velit rhoncus dictum.`,
      },
      {
        courseTitle: 'Course Title',
        courseDescription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non diam
        sed neque scelerisque porta vitae facilisis eros.
         Sed sed erat fringilla, dignissim velit quis,
        porttitor lacus. Morbi lacinia nisl ut tincidunt pharetra. Nam congue commodo neque, nec vulputate neque auctor eget.
        Sed ac erat ac velit rhoncus dictum.`,
      },
      {
        courseTitle: 'Course Title',
        courseDescription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non diam
        sed neque scelerisque porta vitae facilisis eros.
         Sed sed erat fringilla, dignissim velit quis,
        porttitor lacus. Morbi lacinia nisl ut tincidunt pharetra. Nam congue commodo neque, nec vulputate neque auctor eget.
        Sed ac erat ac velit rhoncus dictum.`,
      },
      {
        courseTitle: 'Course Title',
        courseDescription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non diam
        sed neque scelerisque porta vitae facilisis eros.
         Sed sed erat fringilla, dignissim velit quis,
        porttitor lacus. Morbi lacinia nisl ut tincidunt pharetra. Nam congue commodo neque, nec vulputate neque auctor eget.
        Sed ac erat ac velit rhoncus dictum.`,
      },
      {
        courseTitle: 'Course Title',
        courseDescription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non diam
        sed neque scelerisque porta vitae facilisis eros.
         Sed sed erat fringilla, dignissim velit quis,
        porttitor lacus. Morbi lacinia nisl ut tincidunt pharetra. Nam congue commodo neque, nec vulputate neque auctor eget.
        Sed ac erat ac velit rhoncus dictum.`,
      },
      {
        courseTitle: 'Course Title',
        courseDescription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non diam
        sed neque scelerisque porta vitae facilisis eros.
         Sed sed erat fringilla, dignissim velit quis,
        porttitor lacus. Morbi lacinia nisl ut tincidunt pharetra. Nam congue commodo neque, nec vulputate neque auctor eget.
        Sed ac erat ac velit rhoncus dictum.`,
      },
      {
        courseTitle: 'Course Title',
        courseDescription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non diam
        sed neque scelerisque porta vitae facilisis eros.
         Sed sed erat fringilla, dignissim velit quis,
        porttitor lacus. Morbi lacinia nisl ut tincidunt pharetra. Nam congue commodo neque, nec vulputate neque auctor eget.
        Sed ac erat ac velit rhoncus dictum.`,
      },
      {
        courseTitle: 'Course Title',
        courseDescription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non diam
        sed neque scelerisque porta vitae facilisis eros.
         Sed sed erat fringilla, dignissim velit quis,
        porttitor lacus. Morbi lacinia nisl ut tincidunt pharetra. Nam congue commodo neque, nec vulputate neque auctor eget.
        Sed ac erat ac velit rhoncus dictum.`,
      },
      {
        courseTitle: 'Course Title',
        courseDescription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non diam
        sed neque scelerisque porta vitae facilisis eros.
         Sed sed erat fringilla, dignissim velit quis,
        porttitor lacus. Morbi lacinia nisl ut tincidunt pharetra. Nam congue commodo neque, nec vulputate neque auctor eget.
        Sed ac erat ac velit rhoncus dictum.`,
      },
      {
        courseTitle: 'Course Title',
        courseDescription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non diam
        sed neque scelerisque porta vitae facilisis eros.
         Sed sed erat fringilla, dignissim velit quis,
        porttitor lacus. Morbi lacinia nisl ut tincidunt pharetra. Nam congue commodo neque, nec vulputate neque auctor eget.
        Sed ac erat ac velit rhoncus dictum.`,
      },
      {
        courseTitle: 'Course Title',
        courseDescription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non diam
        sed neque scelerisque porta vitae facilisis eros.
         Sed sed erat fringilla, dignissim velit quis,
        porttitor lacus. Morbi lacinia nisl ut tincidunt pharetra. Nam congue commodo neque, nec vulputate neque auctor eget.
        Sed ac erat ac velit rhoncus dictum.`,
      },
      {
        courseTitle: 'Course Title',
        courseDescription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non diam
        sed neque scelerisque porta vitae facilisis eros.
         Sed sed erat fringilla, dignissim velit quis,
        porttitor lacus. Morbi lacinia nisl ut tincidunt pharetra. Nam congue commodo neque, nec vulputate neque auctor eget.
        Sed ac erat ac velit rhoncus dictum.`,
      },
      {
        courseTitle: 'Course Title',
        courseDescription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non diam
        sed neque scelerisque porta vitae facilisis eros.
         Sed sed erat fringilla, dignissim velit quis,
        porttitor lacus. Morbi lacinia nisl ut tincidunt pharetra. Nam congue commodo neque, nec vulputate neque auctor eget.
        Sed ac erat ac velit rhoncus dictum.`,
      }
    ];
   }

  ngOnInit() {
  }

}
