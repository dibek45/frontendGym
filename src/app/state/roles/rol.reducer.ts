import { createReducer, on } from '@ngrx/store';
import * as RoleActions from './rol.actions';
import { initialRoleState, RoleState } from './rol.state';
import { Permission } from './permission/permission.model';

const _roleReducer = createReducer(
  initialRoleState,

  on(RoleActions.loadRoles, (state) => ({ ...state, loading: true })),

  on(RoleActions.loadRolesSuccess, (state, { roles, permissions }) => {
    // ✅ Group permissions by category
    const groupedPermissions = permissions.reduce((acc, permission) => {
      const category = permission.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(permission);
      return acc;
    }, {} as { [category: string]: Permission[] });

    console.log('🔄 Reducer - Received permissions:', permissions);
    console.log('📌 Reducer - Grouped permissions:', groupedPermissions);

    return {
      ...state,
      roles,
      groupedPermissions, // ✅ Ensure this matches `rol.state.ts`
      loading: false,
      error: null,
    };
  }),

  on(RoleActions.loadRolesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(RoleActions.createRoleSuccess, (state, { role }) => ({
    ...state,
    roles: [...state.roles, role],
  })),

  on(RoleActions.updateRoleSuccess, (state, { role }) => ({
    ...state,
    roles: state.roles.map((r) => (r.id === role.id ? role : r)),
  })),

  on(RoleActions.deleteRoleSuccess, (state, { roleId }) => ({
    ...state,
    roles: state.roles.filter((r) => r.id !== roleId),
  }))
);

export function roleReducer(state: RoleState | undefined, action: any) {
  return _roleReducer(state, action);
}
