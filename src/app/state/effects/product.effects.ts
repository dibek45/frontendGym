import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, exhaustMap, catchError, withLatestFrom } from 'rxjs/operators';
import { ProductService } from 'src/app/home/product/product.service';
import * as ProductActions from 'src/app/state/actions/product.actions';
import { selectAllProducts } from '../selectors/product.selectors';
import { AppState } from '../app.state';
import { Store } from '@ngrx/store';
import { ProductModel } from 'src/app/core/models/product.interface';


@Injectable()
export class ProductEffects {

constructor(private actions$: Actions,private _product: ProductService,private store: Store<AppState>) {}


  loadProducts$ = createEffect(() => this.actions$.pipe(
    ofType('[Load products]'),
    exhaustMap(() => this._product.getData(1)
      .pipe(
        map(products => ({ type: '[Retrieved Products List]', products:products })),
        catchError(() => EMPTY)
      ))
    )
  );

  
  // Effect para agregar un producto
  addProduct$ = createEffect(() => 
    this.actions$.pipe(
      ofType(ProductActions.addProduct), // Detecta la acción de agregar producto
      exhaustMap(action => 
        this._product.createProduct(action.product).pipe( // Llama al servicio para crear el producto
          map(newProduct => ProductActions.addProductSuccess({ product: newProduct })), // Despacha la acción de éxito
          catchError((error) => {
            console.error('Error al agregar producto:', error); // Mostrar error en consola
            return of(ProductActions.addProductFailure({ error })); // Despacha la acción de error
          })
        )
      )
    )
  );

  

  /*
  // Effect para actualizar un producto
  updateProduct$ = createEffect(() => 
    this.actions$.pipe(
      ofType(ProductActions.updateProduct), // Detecta la acción de actualizar producto
      exhaustMap(action => 
        this._product.updateProduct(action.product).pipe( // Llama al servicio para actualizar el producto
          map(updatedProduct => ProductActions.updateProductSuccess({ product: updatedProduct })), // Despacha la acción de éxito
          catchError((error) => {
            console.error('Error al actualizar producto:', error); // Mostrar error en consola
            return of(ProductActions.updateProductFailure({ error })); // Despacha la acción de error
          })
        )
      )
    )
  );
*/
  /*
  // Effect para eliminar un producto
  deleteProduct$ = createEffect(() => 
    this.actions$.pipe(
      ofType(ProductActions.deleteProduct), // Detecta la acción de eliminar producto
      exhaustMap(action => 
        this._product.deleteProduct(action.id).pipe( // Llama al servicio para eliminar el producto
          map(() => ProductActions.deleteProductSuccess({ id: action.id })), // Despacha la acción de éxito
          catchError((error) => {
            console.error('Error al eliminar producto:', error); // Mostrar error en consola
            return of(ProductActions.deleteProductFailure({ error })); // Despacha la acción de error
          })
        )
      )
    )
  );
*/


  // Efecto para buscar producto por código de barras en el store
  searchProductByBarcode$ = createEffect(() => 
    this.actions$.pipe(
      ofType(ProductActions.searchProductByBarcode), // Detectar la acción para buscar por código de barras
      withLatestFrom(this.store.select(selectAllProducts)), // Obtener la lista de productos del store
      map(([action, products]) => {
        const product = products?.find((p: ProductModel) => p.barcode === action.barcode);
        if (product) {
          return ProductActions.searchProductByBarcodeSuccess({ product }); // Despachar acción de éxito
        } else {
          return ProductActions.searchProductByBarcodeFailure({ error: 'Producto no encontrado' }); // Despachar acción de error
        }
      }),
      catchError((error) => of(ProductActions.searchProductByBarcodeFailure({ error }))) // Capturar errores
    )
  );

 
}