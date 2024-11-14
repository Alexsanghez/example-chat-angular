import { TestBed } from '@angular/core/testing';

import { RealtimeDBService } from './realtime-db.service';

describe('RealtimeDBService', () => {
  let service: RealtimeDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealtimeDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
