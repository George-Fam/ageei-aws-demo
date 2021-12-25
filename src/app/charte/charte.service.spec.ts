import { TestBed } from '@angular/core/testing';

import { CharteService } from './charte.service';

describe('CharteService', () => {
  let service: CharteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
