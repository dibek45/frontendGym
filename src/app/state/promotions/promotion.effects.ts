import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PromotionService } from './promotion.service';
import { PromotionActions } from './promotion.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class PromotionEffects {
  constructor(
    private actions$: Actions,
    private promotionService: PromotionService
  ) {}

  // Effect to load promotion types and promotions
  loadTypePromotionAndPromotion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionActions.loadPromotionTypes), // Trigger when 'loadPromotionTypes' is dispatched
      mergeMap(() =>
        this.promotionService.getTypePromotionandPromotion().pipe(
          map((response) =>
            PromotionActions.loadPromotionTypesSuccess({
              promotionTypes: response.data.getTypePromotionandPromotion,
            })
          ),
          catchError((error) =>
            of(PromotionActions.loadPromotionTypesFailure({ error }))
          )
        )
      )
    )
  );
}
