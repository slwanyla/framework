import { TestBed } from '@angular/core/testing';

import { FirebaselistenerService } from './firebaselistener.service';

describe('FirebaselistenerService', () => {
  let service: FirebaselistenerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaselistenerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
