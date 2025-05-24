import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProductModel } from 'src/app/core/models/product.interface';
import { CartService } from 'src/app/state/point-of-sale/cart/cart.service';
import { setDetailProduct } from 'src/app/state/product/product.actions';
import { AppState } from 'src/app/state/app.state';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-card-product',
  templateUrl: './card-product.component.html',
  styleUrls: ['./card-product.component.scss'],
  standalone:true,
  imports:[CommonModule,MatIconModule,
    MatIconModule,
    MatButtonModule,
  MatMenuModule]
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


 

getStockColor(stock: number): string {
  if (stock < 5) return 'orange';
  if (stock < 20) return 'green';
  return 'blue';
}

vender(product: ProductModel) {
  this.cartService.openAddToCartModal(product);
  this.store.dispatch(setDetailProduct({ product: product })); // Despachar la acción
  


}

editar(item: any) {
  console.log('Editar', item);
  // lógica para editar
}

eliminar(item: any) {
  console.log('Eliminar', item);
  // lógica para eliminar
}

}
