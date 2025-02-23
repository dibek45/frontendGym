import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductModel } from 'src/app/core/models/product.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';
import { loadProducts, setSearchProduct } from 'src/app/state/actions/product.actions';
import { selectFilteredProducts, selectLoading } from 'src/app/state/selectors/product.selectors';
import { CartService } from '../cart/cart.service';
import { ProductFormService } from 'src/app/shared/product.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss']
})
export class ProductTableComponent implements OnInit {
  loading$: Observable<boolean> = new Observable();
  products$: Observable<ProductModel[]> = new Observable();
  searchTerm: string = "";
  selectedView: string = 'card';  // Alternar entre tabla, tarjetas y carrito
  products: ProductModel[] = [];  // Lista de productos
  selectedProduct: ProductModel | undefined;
  currentQuantity: number =0;
  showModal: boolean=false;

  constructor(private service: ProductFormService,private store: Store<AppState>,  private cartService: CartService,   
     private router: Router, private _notification:NotificationService,) {}

  ngOnInit(): void {
    this.store.dispatch(loadProducts());  // Cargar productos desde el store
    this.loading$ = this.store.select(selectLoading);  // Estado de carga

    // Usar el operador `map` para convertir el array readonly en uno mutable
    this.products$ = this.store.select(selectFilteredProducts).pipe(
      map(products => products.slice())  
    );

    // Asignar productos a la variable mutable `products`
    this.products$.subscribe((products) => {
      console.log("Products de table")
      console.log(this.products)
      this.products = products;  
    });
  }

  // Aplicar filtro a la tabla
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.store.dispatch(setSearchProduct({ searchProduct: filterValue }));  // Filtrar productos
  }

  // Función para agregar un producto al carrito
  addToCart(product: ProductModel) {
    this.selectedProduct = product;
    this.currentQuantity = 1; // Restablecer la cantidad a 1 cada vez que se abre el modal
    this.showModal = true; // Mostrar el modal
  }

  
  // Cambiar entre vistas de tabla, tarjetas y carrito
  toggleView(view: string) {
    this.selectedView = view;
  }



  
onCreate() {
 this.service.initializeFormGroup();
  this.router.navigate(['home/product/new-product']);
}

closeModal() {
    this.showModal = false;
  }

  // Método para aumentar la cantidad
  increaseQuantity() {
    this.currentQuantity++;
  }

  // Método para disminuir la cantidad, pero no permite que sea menor a 1
  decreaseQuantity() {
    if (this.currentQuantity > 1) {
      this.currentQuantity--;
    }
  }

  // Confirmar la cantidad y agregar el producto al carrito
  confirmAddToCart() {
    if (this.selectedProduct) {
      this.cartService.addItem(this.selectedProduct, this.currentQuantity); // Llamar al servicio del carrito
      this.showNotification(this.selectedProduct, this.currentQuantity);
      this.closeModal(); // Cerrar el modal
    }
  }

  // Mostrar la notificación personalizada
  showNotification(product: ProductModel, cantidad: number) {
    this._notification.showProductAddToCart(
      product.name,
      `Cantidad: ${cantidad}`,
      product.img,
      'success'
    );
  }
}
