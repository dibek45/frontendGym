import { ChangeDetectorRef, Component , HostListener, OnInit } from '@angular/core';
import { last, map, Observable, take } from 'rxjs';
import { CartItemModel } from './cart-item.model';
import { CartService } from './cart.service';
import { Store } from '@ngrx/store';
import { selectCartItems, selectCartTotal } from 'src/app/state/selectors/cart.selectors';
import { calculateTotal, removeItemFromCart, updateCart } from 'src/app/state/actions/cart.actions';
import { AppState } from 'src/app/state/app.state';
import { UserService } from '../../user/user.service';
import { selectAllProducts } from 'src/app/state/selectors/product.selectors';
import { ProductModel } from 'src/app/core/models/product.interface';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';
import { DetailProduct } from 'src/app/core/models/detail-product.state';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
img:string=""
detailProduct$!: Observable<DetailProduct | null>;

  // Using store selectors to match the HTML template structure
  cartItemsRdx$: Observable<CartItemModel[]>;  // Observable for cart items
  cartTotalRdx$: Observable<number>;           // Observable for total price
  items: CartItemModel[]=[];
  miTotal:number=0;
  price: number=0;
  manualNumber: string='';
  showScanner: boolean=false;
  currentUrl: any;
  constructor(    private _notification:NotificationService,
      private _access:UserService,    private router: Router,
  
  private cartService: CartService, private store: Store<AppState>,    private cdr: ChangeDetectorRef
  ) {
    // Initialize observables with selectors
    this.cartItemsRdx$ = this.store.select(selectCartItems);
    this.cartTotalRdx$ = this.store.select(selectCartTotal);
    this.detailProduct$ = this.store.select(state => state.detail.detailProduct); // Obtiene el producto de detalle
    this.cartTotalRdx$.subscribe(res=>{
      this.miTotal=res;

    })
    this.cartItemsRdx$ = this.store.select(state => state.cart.items) as Observable<CartItemModel[]>;


   
  }

  ngOnInit(): void {
    // Calculate the total initially and whenever the cart changes
    this.store.dispatch(calculateTotal());
    this.cartService.actualizarImg();

  
  }

  // Function to remove a product from the cart
  removeFromCart(productId: number) {
    this.cartService.removeItem(productId); // Use the service to handle removal
  }

  // Function to clear the entire cart
  clearCart() {
    this.cartService.clearCart(); // Use the service to handle clearing the cart
  }


  async finish(){
   await  this.cartItemsRdx$.subscribe(cartItems => {
     this.items=cartItems
     console.log("CARRITO ******")
     console.log(cartItems)
    });
    this.cartService.onSubmit("efectivo", this.items);

      }



  showContextMenu: boolean = false;
  contextMenuPosition = { x: '0px', y: '0px' };
  selectedIndex: number = 0;

  
  // Lógica para mostrar el menú contextual
  
 
  showModal: boolean = false;

  openModal(event: MouseEvent, index: number) {
    event.preventDefault();
    this.showModal = true;
    this.selectedIndex = index;
  }

  closeModal() {
    this.showModal = false;
  }

  deleteItem(index: number) {
    this.removeFromCart(index)
    this.closeModal();
  }

  



   
    // Lista de planes disponibles (esto se puede obtener del Redux si es necesario)
availablePlans = [
  { id: 5001, name: 'Plan Mensual', price: 500 },
  { id: 5002, name: 'Plan Trimestral', price: 1400 },
  { id: 5003, name: 'Plan Anual', price: 5000 }
];

updateMembershipPlan(event: Event, index: number) {
  const selectElement = event.target as HTMLSelectElement;
  if (!selectElement?.value) return;

  const newPlanId = Number(selectElement.value);
  const selectedPlan = this.availablePlans.find(plan => plan.id === newPlanId);
  if (!selectedPlan) return;

  this.store.select('cart').pipe(take(1)).subscribe(cartState => {
    if (!cartState?.items || !cartState.items[index]?.product) return; // ✅ Validación sin quitar nada

    const updatedItems: CartItemModel[] = cartState.items.map((item, i) => {
      if (i !== index) return item as CartItemModel; // ✅ Mantiene los demás elementos sin cambios

      return {
        ...item,
        product: {
          ...item.product!, // ✅ Se usa `!` para indicar que `product` siempre existirá
          id: selectedPlan.id,
          name: selectedPlan.name,
          price: selectedPlan.price,
          available:  true, // ✅ Se mantiene la lógica original
          img:'',
          stock:0
        },
        total: selectedPlan.price
      };
    });

    this.store.dispatch(updateCart({ items: updatedItems }));
    this.store.dispatch(calculateTotal());
  });
}



// Cambiar la cantidad de productos normales en el carrito
updateQuantity(index: number, newQuantity: number) {
  this.store.select('cart').pipe(take(1)).subscribe(cartState => {
    if (!cartState?.items || !cartState.items[index]?.product) return; // ✅ Evitar errores de `null`

    const updatedItems: CartItemModel[] = cartState.items
      .map((item, i) => {
        if (i !== index) return item as CartItemModel; // ✅ Mantiene los demás elementos sin cambios

        if (newQuantity <= 0) return null; // ✅ Si la cantidad es 0, eliminar del carrito

        return {
          ...item,
          quantity: newQuantity,
          total: item.product.price * newQuantity,
          product: {
            ...item.product,
            available: true, // ✅ Mantener valores previos si existen
            img: '', // ✅ Mantener imagen
            stock: 0 // ✅ Mantener stock
          }
        };
      })
      .filter(item => item !== null) as CartItemModel[]; // ✅ Filtrar elementos eliminados

    this.store.dispatch(updateCart({ items: updatedItems }));
    this.store.dispatch(calculateTotal());
  });
}



  }
 

