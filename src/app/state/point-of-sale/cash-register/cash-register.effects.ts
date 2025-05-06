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
      tap(() => console.log('Intercepted: Add CashRegister')), // Log para depuración
      mergeMap(({ cashRegister }) =>
        this.cashRegisterService.createCashRegister(cashRegister).pipe(
          tap((newCashRegister) => console.log('Service Response:', newCashRegister)), // Log del servicio
          map((newCashRegister) =>
            CashRegisterActions['addCashRegisterSuccess']({ cashRegister: newCashRegister })
          ),
          catchError((error) => {
            console.error('Error in Effect:', error);
            return of(CashRegisterActions['addCashRegisterFailure']({ error }));
          })
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

