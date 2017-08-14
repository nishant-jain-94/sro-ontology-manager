import { TestBed, inject } from '@angular/core/testing';

import { DetailsViewService } from './detailsView.service';

describe('DetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DetailsViewService]
    });
  });

  it('should be created', inject([DetailsViewService], (service: DetailsViewService) => {
    expect(service).toBeTruthy();
  }));
});
