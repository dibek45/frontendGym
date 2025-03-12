import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { CartItemModel } from './cart-item.model';
import { CartService } from '../../../state/point-of-sale/cart/cart.service';
import { Store } from '@ngrx/store';
import { selectCartItems, selectCartTotal } from 'src/app/state/point-of-sale/cart/cart.selectors';
import { calculateTotal, removeItemFromCart, updateCart } from 'src/app/state/point-of-sale/cart/cart.actions';
import { AppState } from 'src/app/state/app.state';
import { MemberService } from '../../../state/member/member.service';
import { selectPlansByGymId } from 'src/app/state/plan/plan.selectors';
import { DetailProduct } from 'src/app/core/models/detail-product.state';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  // Observables del carrito
  cartItemsRdx$: Observable<CartItemModel[]>;
  cartTotalRdx$: Observable<number>;
  detailProduct$!: Observable<DetailProduct | null>;

  // Otros
  items: CartItemModel[] = [];
  miTotal: number = 0;
  manualNumber: string = '';
  showScanner: boolean = false;
  currentUrl: any;

  // Modal contextual (menú/contextual)
  showContextMenu: boolean = false;
  contextMenuPosition = { x: '0px', y: '0px' };
  selectedIndex: number = 0;
  showModal: boolean = false;

  // Lista de planes disponibles
  availablePlans: any[] = [];

  constructor(
    private cartService: CartService,
    private store: Store<AppState>,
  ) {
    // 1) Inicializamos los selectores
    this.cartItemsRdx$ = this.store.select(selectCartItems);
    this.cartTotalRdx$ = this.store.select(selectCartTotal);
    this.detailProduct$ = this.store.select(state => state.detail.detailProduct);

    // 2) Tomamos el total en una variable local
    this.cartTotalRdx$.subscribe(total => {
      this.miTotal = total;
    });
  }

  ngOnInit(): void {
    // 3) Obtenemos los planes filtrados por gymId (ejemplo: 1)
    this.store.select(selectPlansByGymId(1))
      .pipe(take(1))
      .subscribe(plans => {
        this.availablePlans = plans;
      });

    // 4) Calculamos el total al iniciar y cuando cambie el carrito
    this.store.dispatch(calculateTotal());

    // (Si tu cartService actualiza alguna imagen, lo dejamos)
    this.cartService.actualizarImg();
  }

  // Eliminar un producto del carrito, recibiendo el productId
  removeFromCart(productId: number) {
    // Usa tu servicio o directamente la acción NgRx
    this.cartService.removeItem(productId);
  }

  // Vaciar por completo el carrito
  clearCart() {
    this.cartService.clearCart();
  }

  // Finalizar venta (ejemplo con “efectivo”)
  finish() {
    this.cartItemsRdx$.pipe(take(1)).subscribe(cartItems => {
      this.items = cartItems;
      console.log('CARRITO ******', cartItems);
      this.cartService.onSubmit('efectivo', this.items);
    });
  }

  // Modal para confirmar eliminación
  openModal(event: MouseEvent, index: number) {
    event.preventDefault();
    this.showModal = true;
    this.selectedIndex = index;
  }

  closeModal() {
    this.showModal = false;
  }

  // Borrar ítem tras confirmar en el modal
  deleteItem(index: number) {
    // 1) Obtenemos el item correspondiente al index
    this.cartItemsRdx$.pipe(take(1)).subscribe(cartItems => {
      const selectedItem = cartItems[index];
      if (selectedItem) {
        // 2) Eliminamos mediante productId
        this.removeFromCart(selectedItem.product.id);
      }
    });
    // 3) Cerramos el modal
    this.closeModal();
  }

  // Cambiar plan de membresía en el carrito
  updateMembershipPlan(event: Event, index: number) {
    const selectElement = event.target as HTMLSelectElement;
    if (!selectElement?.value) return;

    const newPlanId = Number(selectElement.value);
    const selectedPlan = this.availablePlans.find(plan => plan.id === newPlanId);
    if (!selectedPlan) return;

    this.store.select('cart').pipe(take(1)).subscribe(cartState => {
      if (!cartState?.items || !cartState.items[index]?.product) return;

      const updatedItems: CartItemModel[] = cartState.items.map((item, i) => {
        if (i !== index) return item;

        return {
          ...item,
          product: {
            ...item.product,
            id: 8888,           // Cambia el ID a uno genérico
            name: selectedPlan.name,
            price: selectedPlan.price,
            available: true,
            img: '',
            stock: 0,
            isMembership: true,  
            planID:0
          },
          total: selectedPlan.price
        };
      });

      this.store.dispatch(updateCart({ items: updatedItems }));
      this.store.dispatch(calculateTotal());
    });
  }

  // Cambiar la cantidad de productos “normales” (no membresías)
  updateQuantity(index: number, newQuantity: number) {
    this.store.select('cart').pipe(take(1)).subscribe(cartState => {
      if (!cartState?.items || !cartState.items[index]?.product) return;

      const updatedItems: CartItemModel[] = cartState.items
        .map((item, i) => {
          if (i !== index) return item; // Mantiene los demás elementos

          // Si la cantidad nueva es 0 o menor, devolvemos null para eliminar
          if (newQuantity <= 0) return null;

          return {
            ...item,
            quantity: newQuantity,
            total: item.product.price * newQuantity,
            product: {
              ...item.product,
              available: true,
              img: '',
              stock: 0,
              isMembership:false
            }
          };
        })
        // Filtra ítems que son null (significa que hay que eliminarlos)
        .filter(item => item !== null) as CartItemModel[];

      this.store.dispatch(updateCart({ items: updatedItems }));
      this.store.dispatch(calculateTotal());
    });
  }
}
