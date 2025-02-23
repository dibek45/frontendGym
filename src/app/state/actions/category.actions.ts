import { createAction, props } from '@ngrx/store';
import { Category } from '../shared/category.model';

// Acción para cargar categorías

export const loadCategories = createAction(
    '[Category] Load Categories',
    props<{ gymId: number }>() // 👈 Asegura que la acción reciba 'gymId' como parámetro
  );
// Acción para cargar categorías exitosamente
export const loadCategoriesSuccess = createAction(
  '[Category] Load Categories Success',
  
  props<{ categories: Category[] }>()
);

// Acción para manejar errores
export const loadCategoriesFailure = createAction(
  '[Category] Load Categories Failure',
  props<{ error: any }>()
);
export const addCategory = createAction(
  '[Category] Add Category',
  props<{ category: Category; gymId: number }>()
);
  // Acción para agregar una categoría exitosamente
  export const addCategorySuccess = createAction(
    '[Category] Add Category Success',
    props<{ category: Category }>()
  );
  
  // Acción para manejar errores al agregar una categoría
  export const addCategoryFailure = createAction(
    '[Category] Add Category Failure',
    props<{ error: any }>()
  );