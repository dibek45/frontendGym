import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardCashComponent } from "./shared/card-cash/card-cash.component";

import { CartService } from '../cart.service';

@Component({
  selector: 'app-right-section',
  templateUrl: './right-section.component.html',
  styleUrls: ['./right-section.component.scss'],
  standalone:true,
  imports: [CardCashComponent]
})
export class RightSectionComponent {
  @Input() totalImput!: number; // Recibe los cajeros como observable
  @Input() price: number=0; // Recibe los cajeros como observable
  @Input() name: string=""; // Recibe los cajeros como observable

  @Output() finishSale = new EventEmitter<void>(); // 🔥 Nuevo Output para activar `finish()`

constructor(private cartService: CartService, ){

}
  clearCart() {
    this.cartService.clearCart(); // Use the service to handle clearing the cart
  }

  finish() {
    this.finishSale.emit(); // 🔥 Emitir el evento para que el padre (cart.component.ts) lo capture
  }
}
