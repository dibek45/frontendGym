// src/app/home/point-of-sale/components/sale-card/sale-card.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sale } from 'src/app/state/point-of-sale/sale/sale.model'; // 🔵 Asegúrate de tener Sale

@Component({
  selector: 'app-sale-card',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="sale-card">
    <p><strong>Total:</strong> {{ sale.totalAmount | currency:'MXN':'symbol' }}</p>
    <p><strong>Fecha:</strong> {{ sale.saleDate | date:'short' }}</p>
    <p><strong>Cajero:</strong> {{ sale.cashRegister?.cashier?.name || 'N/A' }}</p>
    <p><strong>Método de pago:</strong> {{ sale.paymentMethod || 'N/A' }}</p>
  </div>
  `,
  styleUrls: ['./sale-card.component.scss']
})
export class SaleCardComponent {
  @Input() sale!: Sale;
}
