import { createSelector, createFeatureSelector } from '@ngrx/store';
import { RoleState } from './rol.state';

// Select the feature state
export const selectRoleState = createFeatureSelector<RoleState>('roles');

// Ensure the state is defined before accessing 'roles'
export const selectAllRoles = createSelector(
  selectRoleState,
  (state) => state?.roles ?? [] // ✅ Fix: Prevents undefined errors
);

export const selectAllPermisos = createSelector(
  selectRoleState,
  (state) => state?.permissions // ✅ Fix: Prevents undefined errors
);

export const selectRolesLoading = createSelector(
  selectRoleState,
  (state) => state?.loading ?? false
);

export const selectRolesError = createSelector(
  selectRoleState,
  (state) => state?.error ?? null
);
