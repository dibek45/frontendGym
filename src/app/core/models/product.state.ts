import { DetailProduct } from "src/app/state/reducers/product.reducer";
import { ProductModel } from "./product.interface";

export interface ProductState{
    loading:boolean;
    products: ReadonlyArray<ProductModel>
    searchProduct:string;

}


