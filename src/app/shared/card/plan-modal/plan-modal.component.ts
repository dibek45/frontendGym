import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Plan } from 'src/app/state/plan/plan.model';
import { NotificationService } from '../../notification.service';
import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { addItemToCart, calculateTotal } from 'src/app/state/point-of-sale/cart/cart.actions';
import { CartItemModel } from 'src/app/home/product/cart/cart-item.model';
import { setDetailProduct } from 'src/app/state/product/product.actions';
import { CartService } from 'src/app/state/point-of-sale/cart/cart.service';

@Component({
  selector: 'app-plan-modal',
  templateUrl: './plan-modal.component.html',
  standalone: true, // ✅ Componente standalone
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
  ]
})

  export class PlanModalComponent {
    selectedPlan: Plan | null = null; // Ahora almacena un objeto Plan
    plans: Plan[];
   userId:number=0;

    constructor(
      private notificationService: NotificationService,
      private store: Store<AppState>,
       private cartService: CartService, 

      public dialogRef: MatDialogRef<PlanModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { plans: Plan[],userId:number }
    ) {
      this.plans = data.plans;
      this.userId=data.userId
    }
  
    close(): void {
      this.dialogRef.close();
    }
  
    cobrar(): void {
      if (this.selectedPlan) {
        this.dialogRef.close({ action: 'cobrar', plan: this.selectedPlan,userId:this.userId });
      }
    }
  
   

    agregarAlCarrito() {
      if (!this.selectedPlan) return; // Asegurar que haya un plan seleccionado
    
      const gymMembership: CartItemModel = {
        product: {
          id: Number(this.selectedPlan.id),
          name: this.selectedPlan.name,
          price: this.selectedPlan.price,
          img: 'assets/membership.png',
          available: true,
          stock: 9999,
          isMembership: true,
          idClienteTOMembership: this.userId
        },
        quantity: 1,
        total: this.selectedPlan.price
      };
    
      console.log("📌 Intentando agregar producto al carrito:", gymMembership);
    
      // Verificar si la membresía ya está en el carrito antes de agregarla
      this.store.select('cart').pipe(take(1)).subscribe(cartState => {
        console.log("📌 Estado actual del carrito:", cartState.items);
    
        const exists = cartState.items.some(item => item.product.id === gymMembership.product.id);
        if (!exists) {
          console.log("✅ Producto NO está en el carrito, agregando...");
    
          this.store.dispatch(addItemToCart({ item: gymMembership }));
          this.store.dispatch(calculateTotal());
    
          console.log("📌 Producto agregado con éxito a Redux:", gymMembership);
    
          // 🔥 Actualizar el producto en right-section
          this.store.dispatch(setDetailProduct({ product: gymMembership.product }));
    
          // 🔥 FORZAR QUE LA NOTIFICACIÓN SE MUESTRE SIEMPRE
          setTimeout(() => {
            console.log("📌 Mostrando notificación de agregado al carrito...");
            this.notificationService.showProductAddToCart(
              gymMembership.product.name,
              '',
              gymMembership.product.img,
              'success'
            );
          }, 100);
    
          // 🔥 Cerrar el modal con un pequeño delay para permitir actualizar Redux
          setTimeout(() => {
            console.log("📌 Cerrando modal...");
            this.dialogRef.close();
          }, 200);
        } else {
          console.log("⚠️ El producto YA está en el carrito, cerrando modal.");
          this.dialogRef.close(); // Cerrar inmediatamente si ya estaba en el carrito
        }
      });
    }
    
    
    
  }