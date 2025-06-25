import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PromotionService } from './promotion.service';
import { PromotionActions } from './promotion.actions';
import { catchError, from, map, mergeMap, of, switchMap, tap } from 'rxjs';

@Injectable()
export class PromotionEffects {
  constructor(
    private actions$: Actions,
    private promotionService: PromotionService
  ) {}

loadPromotions$ = createEffect(() =>
  this.actions$.pipe(
    ofType(PromotionActions.loadPromotions),
    switchMap(() =>
      from(this.promotionService.getPromotionsWithCache()).pipe(
        tap(({ source }) => {
          if (source === 'backend') {
            alert('🌐 Promociones cargadas desde BACKEND');
          } else {
            console.log('📦 Promociones cargadas desde CACHE LOCAL');
          }
        }),
        map(({ data }) =>
PromotionActions.loadPromotionTypesSuccess({ promotionTypes: data }) // ✅
        ),
        catchError(error =>
          of(PromotionActions.loadPromotionTypesFailure({ error }))
        )
      )
    )
  )
);



}
