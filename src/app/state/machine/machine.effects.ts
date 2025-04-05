import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as MachineActions from './machine.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MachineService } from './machine.service';

@Injectable()
export class MachineEffects {

  constructor(
    private actions$: Actions,
    private machineService: MachineService
  ) {}

  loadMachines$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MachineActions.loadMachines),
      tap(({ gymId }) => console.log('[Effect] loadMachines DISPATCHED with gymId:', gymId)),
      mergeMap(({ gymId }) =>
        this.machineService.getMachinesByGym(gymId).pipe(
          tap(machines => console.log('[Effect] getMachinesByGym RESPONSE:', machines)),
          map(machines => MachineActions.loadMachinesSuccess({ machines })),
          catchError(error => {
            console.error('[Effect] loadMachines ERROR:', error);
            return of(MachineActions.loadMachinesFailure({ error }));
          })
        )
      )
    )
  );

  createMachine$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MachineActions.createMachine),
      tap(({ machine }) => console.log('[Effect] createMachine DISPATCHED:', machine)),
      mergeMap(({ machine }) =>
        this.machineService.createMachine(machine).pipe(
          tap(createdMachine => console.log('[Effect] createMachine RESPONSE:', createdMachine)),
          map(createdMachine => MachineActions.createMachineSuccess({ machine: createdMachine })),
          catchError(error => {
            console.error('[Effect] createMachine ERROR:', error);
            return of(MachineActions.createMachineFailure({ error }));
          })
        )
      )
    )
  );


  updateMachine$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MachineActions.updateMachine),
      mergeMap(({ machine }) =>
        this.machineService.updateMachine(machine).pipe(
          map((updatedMachine) =>
            MachineActions.updateMachineSuccess({ machine: updatedMachine })
          ),
          catchError((error) =>
            of(MachineActions.updateMachineFailure({ error }))
          )
        )
      )
    )
  );
  
}
