import { DetailProduct } from "src/app/state/product/product.reducer";
import { ProductModel } from "./product.interface";

export interface ProductState{
    loading:boolean;
    products: ReadonlyArray<ProductModel>
    searchProduct:string;

}


