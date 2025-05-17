import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CashRegisterService } from './cash-register.service';
import { CashRegisterActions } from './cash-register.actions';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';

@Injectable()
export class CashRegisterEffects {
  constructor(private actions$: Actions, private cashRegisterService: CashRegisterService) {}

addCashRegister$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CashRegisterActions['addCashRegister']),
    mergeMap(({ cashRegister }) =>
      from(this.cashRegisterService.createCashRegisterIfValid(cashRegister)).pipe(
        map((result) => {
          if ('error' in result) {
            return CashRegisterActions['addCashRegisterFailure']({
              error: result.error === 'already_open'
                ? 'Este cajero ya tiene una caja abierta.'
                : result.error === 'max_reached'
                ? 'Este gimnasio ya tiene 4 cajas abiertas.'
                : 'El balance inicial no puede ser negativo.',
            });
          }

          return CashRegisterActions['addCashRegisterSuccess']({
            cashRegister: result.cashRegister,
          });
        }),
        catchError((error) =>
          of(CashRegisterActions['addCashRegisterFailure']({ error: error.message }))
        )
      )
    )
  )
);




  loadCashRegisters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CashRegisterActions.loadCashRegisters),
      tap(() => console.log('[Effect] loadCashRegisters triggered')),
      switchMap(() =>
        from(this.cashRegisterService.getCashRegistersWithCache()).pipe(
          tap(data => console.log('✅ Result from getCashRegistersWithCache:', data)),
          map((cashRegisters) => {
            console.log('✅ Cajas cargadas con efecto:', cashRegisters);
            return CashRegisterActions.loadCashRegistersSuccess({ cashRegisters });
          }),
          
          
          catchError((error) =>
            of(CashRegisterActions.loadCashRegistersFailure({ error: error.message }))
          )
        )
      )
    )
  );
  

  


  addMovement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CashRegisterActions['addMovement']),
      mergeMap(({ cashRegisterId, movement }) =>
        this.cashRegisterService.addMovement(cashRegisterId, movement).pipe(
          map((updatedMovement) =>
            CashRegisterActions['addMovementSuccess']({
              cashRegisterId,
              movement: updatedMovement,
            })
          ),
          catchError((error) =>
            of(CashRegisterActions['addMovementFailure']({ error }))
          )
        )
      )
    )
  );
  
  addSale$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CashRegisterActions['addSale']),
      mergeMap(({ cashRegisterId, sale }) =>
        this.cashRegisterService.addSale(cashRegisterId, sale).pipe(
          map((updatedSale) =>
            CashRegisterActions['addSaleSuccess']({
              cashRegisterId,
              sale: updatedSale,
            })
          ),
          catchError((error) =>
            of(CashRegisterActions['addCashRegisterFailure']({ error }))
          )
        )
      )
    )
  );
  
}

