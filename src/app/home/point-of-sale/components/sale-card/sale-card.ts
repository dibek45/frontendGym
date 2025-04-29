import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sale } from 'src/app/state/point-of-sale/sale/sale.model'; // Ajusta si tu modelo Sale está en otra carpeta
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sale-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './sale-card.component.html',
  styleUrls: ['./sale-card.component.scss']
})
export class SaleCardComponent {
  @Input() sale!: Sale;

  verDetalles() {
    console.log('Detalles de la venta', this.sale);
    // Aquí podrías abrir un modal o navegar a detalle
  }
}
