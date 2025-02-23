import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PermissionState } from './permission.state';

export const selectPermissionState = createFeatureSelector<PermissionState>('permissions');

export const selectAllPermissions = createSelector(selectPermissionState, (state) => state.permissions);
export const selectPermissionsLoading = createSelector(selectPermissionState, (state) => state.loading);
export const selectPermissionsError = createSelector(selectPermissionState, (state) => state.error);
