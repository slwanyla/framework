import { TestBed } from '@angular/core/testing';

import { FirebaseLocationService } from './firebase-location.service';

describe('FirebaseLocationService', () => {
  let service: FirebaseLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
