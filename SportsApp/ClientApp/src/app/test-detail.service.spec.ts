import { TestBed, inject } from '@angular/core/testing';

import { TestDetailService } from './test-detail.service';

describe('TestDetailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestDetailService]
    });
  });

  it('should be created', inject([TestDetailService], (service: TestDetailService) => {
    expect(service).toBeTruthy();
  }));
});
