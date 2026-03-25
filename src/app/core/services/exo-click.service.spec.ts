import { TestBed } from '@angular/core/testing';

import { ExoClickService } from './exo-click.service';

describe('ExoClickService', () => {
  let service: ExoClickService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExoClickService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
