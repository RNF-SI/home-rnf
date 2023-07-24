import { TestBed } from '@angular/core/testing';

import { LazyDialogLoader } from './lazy-dialog-loader.service';

describe('LazyDialogLoaderService', () => {
  let service: LazyDialogLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LazyDialogLoader);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
