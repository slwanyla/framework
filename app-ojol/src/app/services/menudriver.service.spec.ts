import { TestBed } from '@angular/core/testing';

import { MenudriverService } from './menudriver.service';

describe('MenudriverService', () => {
  let service: MenudriverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenudriverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
