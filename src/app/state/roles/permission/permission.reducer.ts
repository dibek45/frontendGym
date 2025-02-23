import { createReducer, on } from '@ngrx/store';
import * as PermissionActions from './permission.actions';
import { initialPermissionState, PermissionState } from './permission.state';

export const permissionReducer = createReducer(
  initialPermissionState,

  on(PermissionActions.loadPermissions, (state) => ({ ...state, loading: true })),
  on(PermissionActions.loadPermissionsSuccess, (state, { permissions }) => ({ ...state, loading: false, permissions })),
  on(PermissionActions.loadPermissionsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(PermissionActions.createPermissionSuccess, (state, { permission }) => ({
    ...state,
    permissions: [...state.permissions, permission],
  })),

  on(PermissionActions.deletePermissionSuccess, (state, { permissionId }) => ({
    ...state,
    permissions: state.permissions.filter((perm) => perm.id !== permissionId),
  }))
);
