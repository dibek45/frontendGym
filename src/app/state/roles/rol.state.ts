import { Role } from './rol.model';
import { Permission } from './permission/permission.model';

export interface RoleState {
  roles: Role[];
  permissions: Permission[]; // ✅ Rename `permission` to `permissions`
  loading: boolean;
  error: string | null;
}

export const initialRoleState: RoleState = {
  roles: [],
  permissions: [], // ✅ Ensure it's initialized as an empty array
  loading: false,
  error: null,
};
