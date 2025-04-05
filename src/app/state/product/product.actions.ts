import { createAction, createActionGroup, createSelector, props } from '@ngrx/store';
import { ProductModel } from 'src/app/core/models/product.interface';

export const loadProducts = createAction(
'[Load products]'
);

export const loadedProducts = createAction(
    '[Retrieved Products List]', props<{ products: ReadonlyArray<ProductModel> }>(),
);


export const setSearchProduct = createAction(
    '[Set search term]', props<{ searchProduct: string }>());
    export const loadProductsSuccess = createAction(
        '[Product] Load Products Success',
        props<{ products: ProductModel[] }>()
      );
      
      export const loadProductsFailure = createAction(
        '[Product] Load Products Failure',
        props<{ error: any }>()
      );
      
      export const addProduct = createAction(
        '[Product] Add Product',
        props<{ product: ProductModel }>()
      );
      
      export const addProductSuccess = createAction(
        '[Product] Add Product Success',
        props<{ product: ProductModel }>()
      );
      
      export const addProductFailure = createAction(
        '[Product] Add Product Failure',
        props<{ error: any }>()
      );
      
      export const updateProduct = createAction(
        '[Product] Update Product',
        props<{ product: ProductModel }>()
      );
      
      export const updateProductSuccess = createAction(
        '[Product] Update Product Success',
        props<{ product: ProductModel }>()
      );
      
      export const updateProductFailure = createAction(
        '[Product] Update Product Failure',
        props<{ error: any }>()
      );
      
      export const deleteProduct = createAction(
        '[Product] Delete Product',
        props<{ id: number }>()
      );
      
      export const deleteProductSuccess = createAction(
        '[Product] Delete Product Success',
        props<{ id: number }>()
      );
      
      export const deleteProductFailure = createAction(
        '[Product] Delete Product Failure',
        props<{ error: any }>()
      );

      export const searchProductByBarcode = createAction(
        '[Product] Search Product By Barcode',
        props<{ barcode: string }>()
      );
      
      // Acción de éxito al buscar producto por código de barras
      export const searchProductByBarcodeSuccess = createAction(
        '[Product] Search Product By Barcode Success',
        props<{ product: ProductModel }>()
      );
      
      // Acción de error al buscar producto por código de barras
      export const searchProductByBarcodeFailure = createAction(
        '[Product] Search Product By Barcode Failure',
        props<{ error: any }>()
      );
      export const setDetailProduct = createAction(
        '[Product] Set Detail Product',
        props<{ product: ProductModel }>()
      );
      
     // Acción para iniciar la carga del producto de detalle
      export const loadDetailProduct = createAction(
        '[Detail Product] Load Detail Product'
      );

      // Acción para manejar el error al cargar el producto de detalle
      export const loadDetailProductFailure = createAction(
        '[Detail Product] Load Detail Product Failure',
        props<{ error: any }>()
      );