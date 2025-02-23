import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PermissionService } from '../permission/permission.service';
import * as PermissionActions from './permission.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class PermissionEffects {
  constructor(private actions$: Actions, private permissionService: PermissionService) {}

  loadPermissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PermissionActions.loadPermissions),
      mergeMap(() =>
        this.permissionService.getPermissions().pipe(
          map((permissions) => PermissionActions.loadPermissionsSuccess({ permissions })),
          catchError((error) => of(PermissionActions.loadPermissionsFailure({ error })))
        )
      )
    )
  );
}
