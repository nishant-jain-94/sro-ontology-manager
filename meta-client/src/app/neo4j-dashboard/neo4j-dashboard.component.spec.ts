import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Neo4jDashboardComponent } from './neo4j-dashboard.component';

describe('Neo4jDashboardComponent', () => {
  let component: Neo4jDashboardComponent;
  let fixture: ComponentFixture<Neo4jDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Neo4jDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Neo4jDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
