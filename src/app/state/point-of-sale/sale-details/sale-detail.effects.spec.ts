import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { SaleDetailEffects } from './sale-detail.effects';

describe('SaleDetailEffects', () => {
  let actions$: Observable<any>;
  let effects: SaleDetailEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SaleDetailEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(SaleDetailEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
