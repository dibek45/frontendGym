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
import { addItemToCart, calculateTotal } from 'src/app/state/actions/cart.actions';
import { CartItemModel } from 'src/app/home/product/cart/cart-item.model';
import { setDetailProduct } from 'src/app/state/actions/product.actions';

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
          id: Number(this.selectedPlan.id)
,          name: this.selectedPlan.name,
          price: this.selectedPlan.price,
          img: 'assets/membership.png',
          available: true,
          stock: 9999,
          isMembership:true,
          idClienteTOMembership:this.userId

        },
        quantity: 1,
        total: this.selectedPlan.price
      };
    
      // Verificar si la mensualidad ya está en el carrito antes de agregarla
      this.store.select('cart').pipe(take(1)).subscribe(cartState => {
        const exists = cartState.items.some(item => item.product.id === gymMembership.product.id);
        if (!exists) {
          this.store.dispatch(addItemToCart({ item: gymMembership }));
          this.store.dispatch(calculateTotal());
    
          // 🔥 Actualizar el producto en right-section
          this.store.dispatch(setDetailProduct({ product: gymMembership.product }));
    
          // 🔥 FORZAR QUE LA NOTIFICACIÓN SE MUESTRE SIEMPRE
          setTimeout(() => {
          //  this.notificationService.clear(); // 🔥 Reiniciar cualquier notificación previa
            this.notificationService.showProductAddToCart(
              gymMembership.product.name,
              '',
              gymMembership.product.img,
              'success'
            );
          }, 100);
    
          // 🔥 Cerrar el modal con un pequeño delay para permitir actualizar Redux
          setTimeout(() => {
            this.dialogRef.close();
          }, 200);
        } else {
          this.dialogRef.close(); // Cerrar inmediatamente si ya estaba en el carrito
        }
      });
    }
    
    
  }