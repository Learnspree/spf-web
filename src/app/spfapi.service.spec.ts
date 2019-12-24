import { TestBed } from '@angular/core/testing';

import { SpfapiService } from './spfapi.service';

describe('SpfapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpfapiService = TestBed.get(SpfapiService);
    expect(service).toBeTruthy();
  });
});
