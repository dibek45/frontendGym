import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as CategoryActions from '../actions/category.actions';
import { CategoryService } from '../shared/category.service';

@Injectable()
export class CategoryEffects {
  constructor(private actions$: Actions, private categoryService: CategoryService) {}

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.loadCategories),
      mergeMap(() =>
        this.categoryService.getCategories().pipe(
          map((categories) =>
            CategoryActions.loadCategoriesSuccess({ categories })
          ),
          catchError((error) =>
            of(CategoryActions.loadCategoriesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  addCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.addCategory),
      mergeMap(({ category }) => {
        console.log('📢 Intentando crear la categoría:', category);
        return this.categoryService.addCategory(category, 1, "").pipe(
          map((newCategory: any) => {
            const createdCategory = newCategory.data.createCategory; // Accede al objeto correcto
            console.log('✅ Categoría creada con éxito:', createdCategory);
            return CategoryActions.addCategorySuccess({ category: createdCategory });
          }),
      
          catchError((error) => {
            console.log('❌ Error en la acción addCategoryFailure:', error);
            return of(CategoryActions.addCategoryFailure({ error }));
          })
        );
      })
    )
  );
  
}
