import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { CartItemModel } from './cart-item.model';
import { ProductModel } from 'src/app/core/models/product.interface';
import { 
  addItemToCart, 
  calculateTotal, 
  clearCart, 
  removeItemFromCart, 
  updateItemQuantity 
} from 'src/app/state/actions/cart.actions';
import { selectCartItems, selectCartTotal } from 'src/app/state/selectors/cart.selectors';
import { HttpClient } from '@angular/common/http';
import { selectUser } from 'src/app/state/selectors/user.selectors';
import { AppState } from 'src/app/state/app.state';
import { NotificationService } from 'src/app/shared/notification.service';
import { PrinterService } from 'src/app/printer.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems$: Observable<CartItemModel[]>;
  total$: Observable<number>;
  gymIdFromStore: number = 0; 
  customerName: string = 'David Velazquez Hernandez'; // Nombre del cliente
  membershipType: string = '3 meses';                // Tipo de membresía
  saleDate: string = new Date().toLocaleDateString(); // Fecha de la venta
  gymName: string = 'TU GymName Fit'; 
  img: string="";
  price: number=0;

  constructor(    private store: Store<AppState>,      private printerService: PrinterService
    ,public notificationService: NotificationService,

    private http: HttpClient,
  ) {
    this.cartItems$ = this.store.select(selectCartItems);
    this.total$ = this.store.select(selectCartTotal);
  }


  ngOnInit() {

    
  }
  async openAddToCartModal(product: ProductModel) {
    const quantity = await this.createModal(product);
    if (quantity && quantity > 0) {
      this.addItem(product, quantity);
      this.notificationService.showProductAddToCart(
        product.name,
       '',
       product.img,
       'success',
 
     );    }
  }
  createModal(product: ProductModel): Promise<number> {
    return new Promise((resolve) => {
      // Crear contenedor del modal
      const modalContainer = document.createElement('div');
      modalContainer.id = 'quantity-modal';
      modalContainer.classList.add('modal');

      // Contenido del modal
      modalContainer.innerHTML = `
        <div class="modal-content">
          <h2>Seleccionar Cantidad</h2>
          <div class="product-name">${product.name}</div>
          <div class="quantity-controller">
            <button id="decrease-button">-</button>
            <span id="quantity-display">1</span>
            <button id="increase-button">+</button>
          </div>
          <div class="modal-actions">
            <button id="cancel-button">Cancelar</button>
            <button id="confirm-button">Confirmar</button>

          </div>
        </div>
      `;

      document.body.appendChild(modalContainer);
      const modal = document.getElementById('quantity-modal')!;
      const quantityDisplay = document.getElementById('quantity-display')!;
      const increaseButton = document.getElementById('increase-button')!;
      const decreaseButton = document.getElementById('decrease-button')!;
      const confirmButton = document.getElementById('confirm-button')!;
      const cancelButton = document.getElementById('cancel-button')!;
      
      let currentQuantity = 1;

      // 🔥 Lógica de los botones para aumentar y disminuir la cantidad
      increaseButton.onclick = () => {
        currentQuantity++;
        quantityDisplay.innerText = `${currentQuantity}`;
      };

      decreaseButton.onclick = () => {
        if (currentQuantity > 1) {
          currentQuantity--;
          quantityDisplay.innerText = `${currentQuantity}`;
        }
      };

      // 🔥 Confirmar la cantidad
      confirmButton.onclick = () => {
        modal.remove();
        resolve(currentQuantity);
      };

      // 🔥 Cancelar y cerrar el modal
      cancelButton.onclick = () => {
        modal.remove();
        resolve(0);
      };
    });
  }



  // ✅ Simulación de una función para abrir el modal de selección de cantidad
  selectQuantity(product: ProductModel): Promise<number> {
    return new Promise((resolve) => {
      let quantity = 1; // Cantidad por defecto
      // Simulador del modal (reemplaza esto con tu lógica de modal real)
      setTimeout(() => {
        const userQuantity = prompt(`Selecciona la cantidad para ${product.name}`, '1');
        const selectedQuantity = parseInt(userQuantity || '1', 10);
        resolve(selectedQuantity > 0 ? selectedQuantity : 1);
      }, 1000);
    });
  }

  // ✅ Agregar producto al carrito
  addItem(product: ProductModel, quantity: number) {
    const item: CartItemModel = {
      product,
      quantity,
      total: product.price * quantity
    };
    
    this.store.dispatch(addItemToCart({ item }));
    this.store.dispatch(calculateTotal());
  }

  // ✅ Eliminar producto del carrito
  removeItem(productId: number) {
    this.store.dispatch(removeItemFromCart({ productId }));
    this.store.dispatch(calculateTotal());
  }

  // ✅ Actualizar la cantidad de un producto
  updateQuantity(productId: number, quantity: number) {
    this.store.dispatch(updateItemQuantity({ productId, quantity }));
    this.store.dispatch(calculateTotal());
  }

  // ✅ Vaciar el carrito
  clearCart() {
    this.store.dispatch(clearCart());
    this.store.dispatch(calculateTotal());
  }

  // ✅ Obtener los productos del carrito como observable
  getCartItems(): Observable<CartItemModel[]> {
    return this.cartItems$;
  }

  // ✅ Obtener el total del carrito como observable
  getTotal(): Observable<number> {
    return this.total$;
  }

  // ✅ Registrar la venta y enviar a la API

 



  actualizarImg() {
    this.cartItems$.pipe(
      take(1)
    ).subscribe(cartItems => {
      console.log('Se ha recibido el carrito de compras:', cartItems);
    
      if (cartItems.length > 0) {     
        const lastItem = cartItems[cartItems.length - 1]; // Obtiene el último elemento del array
        this.price = lastItem.product.price;
        this.img = lastItem.product.img; // Extrae la imagen del último elemento
        console.log('Último elemento del carrito:', lastItem);
        if (lastItem.product.img) {
          console.log('La imagen está presente:', lastItem.product.img);
        } else {
          console.log('No hay imagen disponible para este producto.');
        }
      } else {
        console.log("El carrito está vacío.");
      }
    });
  }

  
  getImg(): string {
    return this.img;
  }

  // ✅ Método para obtener el precio actual
  getPrice(): number {
    return this.price;
  }


  addGymMembership() {
    const gymMembership: CartItemModel = {
      product: {
        id: 999, // ID único para la mensualidad
        name: 'Mensualidad Gym',
        price: 500, // Precio de la mensualidad
        img: 'assets/images/membership.png', // Imagen opcional
        available: true, // La mensualidad siempre está disponible
        stock: 9999 // Puedes asignar un número alto, ya que no hay un stock físico
      },
      quantity: 1,
      total: 500
    };
  
    this.cartItems$.pipe(take(1)).subscribe(items => {
      const exists = items.some(item => item.product.id === gymMembership.product.id);
      
      if (!exists) {
        this.store.dispatch(addItemToCart({ item: gymMembership }));
        setTimeout(() => {
          this.store.dispatch(calculateTotal());
          this.notificationService.showProductAddToCart(
            'Mensualidad Gym',
            '',
            gymMembership.product.img,
            'success'
          );
        }, 100);
      }
    });
  }
  
  















  // ✅ Simulación de una función para abrir el modal de selección de cantidad





  // ✅ Registrar la venta y enviar a la API
  async onSubmit(paymentMethod: string, cart: CartItemModel[]) {
    const formattedCart = cart.map(item => ({
      productId: Number(item.product.id),  
      name: item.product.name,  
      costo: item.product.price,  
      quantity: item.quantity,
      isMembership:true,
      idClienteTOMembership: Number(item.product.idClienteTOMembership)

    }));
  
    const graphqlQuery = `
      mutation CreateSale($gymId: Float!, $paymentMethod: String!, $cart: [CartItemInput!]!) {
        createSale(gymId: $gymId, paymentMethod: $paymentMethod, cart: $cart) {
          id
          paymentMethod
          totalAmount
        }
      }
    `;
  
    await this.http.post<{ data: { createSale: { id: string, paymentMethod: string, totalAmount: number } } }>(
      'http://localhost:3000/graphql', 
      {
        query: graphqlQuery,
        variables: {
          "gymId": 1,
          "paymentMethod": paymentMethod,
          "cart": formattedCart
        }
      }
    ).subscribe({
      next: (response) => {
        console.log(response)
        const { id, paymentMethod, totalAmount } = response.data.createSale;
        this.notificationService.mostrarSnackbar(':: Venta registrada correctamente', 'success');
        this.printTicket(formattedCart, totalAmount);
      },
      error: (error) => {
        console.error('GraphQL Error:', error);
      }
    });
  }
  
  // ✅ Imprimir el ticket
  async printTicket(cart: any, totalAmount: number) {
    const gym = "TU GymName Fit";
    const customerName = "David Velazquez Hernandez"; 
    const saleDate = new Date().toLocaleDateString();
    
    await this.printerService.connectToPrinter();
    await this.printerService.generateticketCarrito(gym, customerName, saleDate, cart, totalAmount);
    this.clearCart();
  }
}

  
  
  

