import { createReducer, on } from '@ngrx/store';
import * as CategoryActions from '../actions/category.actions';
import { Category } from '../shared/category.model';

export interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: any;
}

export const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

export const categoryReducer = createReducer(
  initialState,
  // Acción para iniciar la carga de categorías
  on(CategoryActions.loadCategories, (state) => ({
    ...state,
    loading: true,
  })),
  on(CategoryActions.loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    categories,
    loading: false,
  })),
  on(CategoryActions.loadCategoriesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  // Acción para agregar una categoría
  on(CategoryActions.addCategory, (state) => ({
    ...state,
    loading: true,
  })),
  on(CategoryActions.addCategorySuccess, (state, { category }) => ({
    ...state,
    categories: [...state.categories, category],
    loading: false,
  })),
  on(CategoryActions.addCategoryFailure, (state, { error }) => {
    console.log('❌ Error capturado en el reducer addCategoryFailure:', error);
    return {
      ...state,
      loading: false,
      error
    };
  })
);
