import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProductModel } from 'src/app/core/models/product.interface';
import { CartService } from 'src/app/home/product/cart/cart.service';
import { setDetailProduct } from 'src/app/state/actions/product.actions';
import { AppState } from 'src/app/state/app.state';

@Component({
  selector: 'app-card-product',
  templateUrl: './card-product.component.html',
  styleUrls: ['./card-product.component.scss'],
  standalone:true,
  imports:[CommonModule]
})
export class CardProductComponent {
  @Input() element: ProductModel; // Asegúrate de tener esta entrada

  showModal: boolean = false;
constructor(private cartService: CartService, private store:Store<AppState>,){
  this.element={id: 0,
    name: "",
    created_at: "",
    available: false, 
  img:"",
stock:0,
price:0}
}


 

// Función para ver detalles

addToCart(product: ProductModel) {
  this.cartService.openAddToCartModal(product);
  this.store.dispatch(setDetailProduct({ product: product })); // Despachar la acción
  

}



}
