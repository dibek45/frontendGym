// Actions
// src/app/store/actions/roles.actions.ts

// src/app/store/actions/permissions.actions.ts

// Reducers
// src/app/store/reducers/roles.reducer.ts

// src/app/store/reducers/permissions.reducer.ts

// src/app/store/reducers/index.ts

// Selectors
// src/app/store/selectors/roles.selectors.ts

// src/app/store/selectors/permissions.selectors.ts

// Effects
// src/app/store/effects/roles.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as RoleActions from '../roles/rol.actions';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { RoleService } from './rol.service';

@Injectable()
export class RoleEffects {
  constructor(private actions$: Actions, private roleService: RoleService) {}
  loadRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoleActions.loadRoles),
      switchMap(() =>
        this.roleService.getRolesAndPermissions().pipe(
          map(response => {
            console.log('✅ Respuesta de la API:', response);
            
            const roles = response.data.rolesnew?.roles || [];
            const permissions = response.data.rolesnew?.allPermissions || [];
            console.log(permissions)
            return RoleActions.loadRolesSuccess({ roles, permissions });
          }),
          catchError(error => {
            console.error('❌ Error en la API:', error);
            return of(RoleActions.loadRolesFailure({ error: error.message }));
          })
        )
      )
    )
  );
  
  
  
  createRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoleActions.createRole),
      mergeMap(({ role }) =>
        this.roleService.createRole(role).pipe(
          map((response) => RoleActions.createRoleSuccess({ role: response.data.createRole })),
          catchError((error) => of(RoleActions.createRoleFailure({ error: error.message })))
        )
      )
    )
  );

  updateRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoleActions.updateRole),
      mergeMap(({ role }) =>
        this.roleService.updateRole(role.id, role).pipe(
          map((response) => RoleActions.updateRoleSuccess({ role: response.data.updateRole })),
          catchError((error) => of(RoleActions.updateRoleFailure({ error: error.message })))
        )
      )
    )
  );

  deleteRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoleActions.deleteRole),
      mergeMap(({ roleId }) =>
        this.roleService.deleteRole(roleId).pipe(
          map(() => RoleActions.deleteRoleSuccess({ roleId })),
          catchError((error) => of(RoleActions.deleteRoleFailure({ error: error.message })))
        )
      )
    )
  );
}

// src/app/store/effects/permissions.effects.ts

// Resolvers
// src/app/store/resolvers/roles.resolver.ts

// src/app/store/resolvers/permissions.resolver.ts

// Store Module
// src/app/store/store.module.ts
