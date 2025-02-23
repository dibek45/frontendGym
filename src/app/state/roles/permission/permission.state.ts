import { Permission } from './permission.model';

export interface PermissionState {
  permissions: Permission[];
  loading: boolean;
  error: string | null;
}

export const initialPermissionState: PermissionState = {
  permissions: [],
  loading: false,
  error: null,
};
