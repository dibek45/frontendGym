export interface ProductModel{
  id: number;
  name: string;
  created_at?:string;
  available: boolean;
  img:string;
  stock: number; 
  price:number;
  categoriaId?:string;
  barcode?:string,
  gymId?:number
  isMembership?: boolean; // ✅ Se asegura de que esta propiedad existe

}

export interface CartProductModel{
  id: number;
  name: string;
  categoriaId?:string;
  price:number;
  barcode?:string;

}