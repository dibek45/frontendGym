import { createAction, props } from '@ngrx/store';
import { Permission } from './permission.model';

// Load Permissions
export const loadPermissions = createAction('[Permission] Load Permissions');
export const loadPermissionsSuccess = createAction('[Permission] Load Permissions Success', props<{ permissions: Permission[] }>());
export const loadPermissionsFailure = createAction('[Permission] Load Permissions Failure', props<{ error: string }>());

// Create Permission
export const createPermission = createAction('[Permission] Create Permission', props<{ permission: Permission }>());
export const createPermissionSuccess = createAction('[Permission] Create Permission Success', props<{ permission: Permission }>());
export const createPermissionFailure = createAction('[Permission] Create Permission Failure', props<{ error: string }>());

// Update Permission
export const updatePermission = createAction('[Permission] Update Permission', props<{ permission: Permission }>());
export const updatePermissionSuccess = createAction('[Permission] Update Permission Success', props<{ permission: Permission }>());
export const updatePermissionFailure = createAction('[Permission] Update Permission Failure', props<{ error: string }>());

// Delete Permission
export const deletePermission = createAction('[Permission] Delete Permission', props<{ permissionId: number }>());
export const deletePermissionSuccess = createAction('[Permission] Delete Permission Success', props<{ permissionId: number }>());
export const deletePermissionFailure = createAction('[Permission] Delete Permission Failure', props<{ error: string }>());
