
export interface DetailProduct {
    id: number;
    name: string;
    price: number;
    img: string;
  }
  
  export interface DetailProductState {
    detailProduct: DetailProduct | null; // Información del producto actual
    loading: boolean;                    // Indica si se está cargando la información
    error: any;                          // Contiene la información del error si ocurre
  }