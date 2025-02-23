import { createAction, props } from '@ngrx/store';
import { Role } from './rol.model';
import { Permission } from './permission/permission.model';

// Load Roles
export const loadRoles = createAction('[Role] Load Roles');
export const loadRolesSuccess = createAction(
    '[Role] Load Roles Success',
    props<{ roles: Role[], permissions: Permission[] }>() // ✅ Incluye permisos
    
  );export const loadRolesFailure = createAction('[Role] Load Roles Failure', props<{ error: string }>());

// Create Role
export const createRole = createAction('[Role] Create Role', props<{ role: Role }>());
export const createRoleSuccess = createAction('[Role] Create Role Success', props<{ role: Role }>());
export const createRoleFailure = createAction('[Role] Create Role Failure', props<{ error: string }>());

// Update Role ✅ Make sure these exist
export const updateRole = createAction('[Role] Update Role', props<{ role: Role }>());
export const updateRoleSuccess = createAction('[Role] Update Role Success', props<{ role: Role }>());
export const updateRoleFailure = createAction('[Role] Update Role Failure', props<{ error: string }>());

// Delete Role ✅ Make sure these exist
export const deleteRole = createAction('[Role] Delete Role', props<{ roleId: number }>());
export const deleteRoleSuccess = createAction('[Role] Delete Role Success', props<{ roleId: number }>());
export const deleteRoleFailure = createAction('[Role] Delete Role Failure', props<{ error: string }>());
