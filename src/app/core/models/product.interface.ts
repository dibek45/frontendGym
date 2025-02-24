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
  idClienteTOMembership?: number; // ✅ Se asegura de que esta propiedad existe


}

