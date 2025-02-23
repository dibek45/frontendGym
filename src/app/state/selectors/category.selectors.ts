import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CategoryState } from '../reducers/category.reducer';

export const selectCategoryState = createFeatureSelector<CategoryState>('category');

export const selectCategories = createSelector(
  selectCategoryState,
  (state) => state.categories
);

export const selectCategoryError = createSelector(
  selectCategoryState,
  (state) => state.error
);
