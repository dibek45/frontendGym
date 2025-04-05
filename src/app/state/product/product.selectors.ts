import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { ProductState} from 'src/app/core/models/product.state';
import { DetailProductState } from 'src/app/core/models/detail-product.state';
 

export const SelectFeature = (state:AppState)=>state.products;

    

export const selectItemsList = createSelector(
    SelectFeature,
    (state:ProductState) => state.products
  );

  export const selectDetailProductState = (state: AppState) => state.detail;

// Seleccionar la propiedad detailProduct del estado
export const selectDetailProduct = createSelector(
  selectDetailProductState,
  (state: DetailProductState) => state.detailProduct
);
export const selectLoading = createSelector(
    SelectFeature,
    (state:ProductState) => state.loading
  );
export const searchProduct = createSelector(
  SelectFeature,
  (state: ProductState) => state.searchProduct
);
export const selectAllProducts = createSelector(
  SelectFeature, // Aquí seleccionamos la porción del estado de productos
  (state: ProductState) => state.products // Devolvemos la lista de productos
);
  export const selectFilteredProducts = createSelector(
    selectItemsList,
    searchProduct,
    (products, searchProduct) => {
      if (!searchProduct) {
        console.log(products)

        return products; // Si no hay término de búsqueda, devuelve todos los miembros sin filtrar.
      }
  
      const lowersearchProduct = searchProduct.toLowerCase();
  
      return products.filter(product => product.name.toLowerCase().includes(lowersearchProduct));
    }


    
  );
  