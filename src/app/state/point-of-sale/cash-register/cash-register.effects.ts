import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CashRegisterService } from './cash-register.service';
import { CashRegisterActions } from './cash-register.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

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


  // Efecto para cargar cajas registradoras
  loadCashRegisters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CashRegisterActions['loadCashRegisters']),
      mergeMap(() =>
        this.cashRegisterService.getCashRegistersByGym(1).pipe(
          map((cashRegisters) =>
            CashRegisterActions['loadCashRegistersSuccess']({ cashRegisters }) // Aquí es cashRegisters
          ),
          catchError((error) =>
            of(CashRegisterActions['loadCashRegistersFailure']({ error }))
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

