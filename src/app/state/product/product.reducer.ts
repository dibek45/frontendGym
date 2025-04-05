import { Action, createReducer, on } from '@ngrx/store';
import { loadProducts, loadedProducts, setSearchProduct,addProduct, addProductSuccess, addProductFailure, searchProductByBarcodeSuccess, setDetailProduct, loadDetailProduct, loadDetailProductFailure } from './product.actions';
import { ProductState } from 'src/app/core/models/product.state';
import { DetailProductState } from 'src/app/core/models/detail-product.state';

export const InitialState: ProductState={loading:false,products:[],searchProduct:''};
export interface DetailProduct {
  price: number;
  img: string;
}


export const ProductReducer = createReducer(
    InitialState,
    on(loadProducts, (state) => {
        return {...state, loading:true}
    }),
    on(loadedProducts, (state, a) => {
        return {...state, loading:false,products:a.products}
    }),
    on(setSearchProduct, (state, { searchProduct }) => {
        return { ...state, searchProduct };
      }),
  
    on(addProduct, (state) => ({
        ...state,
        loading: true
      })),
    
    on(addProductSuccess, (state, { product }) => ({
        ...state,
        products: [...state.products, product], // 🚀 Agregar el nuevo producto al estado
        loading: false
      })),
    
    on(addProductFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false
      })),

      on(searchProductByBarcodeSuccess, (state, { product }) => ({
        ...state,
        loading: false,
        selectedProduct: product
      })),
     
  );



  
  export const initialState: DetailProductState = {
    detailProduct: null,  // No hay detalle de producto inicialmente
    loading: false,       // No hay carga en proceso al inicio
    error: null           // No hay errores al inicio
  };
  
  export const detailProductReducer = createReducer(
    initialState,
  
    // Acción para establecer el detailProduct (producto detallado)
    on(setDetailProduct, (state, { product }) => ({
      ...state,
      detailProduct: product, // Asignar el producto recibido como detailProduct
      loading: false,         // Detiene la carga
      error: null             // Limpia cualquier error previo
    })),
  
    // Acción para cargar el detailProduct (se usa para indicar que está cargando)
    on(loadDetailProduct, (state) => ({
      ...state,
      loading: true,          // Indicar que se está cargando la información
      error: null             // Limpia cualquier error previo
    })),
  
    // Acción para manejar errores al intentar cargar el detailProduct
    on(loadDetailProductFailure, (state, { error }) => ({
      ...state,
      loading: false,         // La carga se detiene
      error                    // Se asigna el error al estado
    }))
  );
  
 