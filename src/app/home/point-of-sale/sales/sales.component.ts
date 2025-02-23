import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadSales } from 'src/app/state/point-of-sale/sale/sale.actions';
import { selectAllSales } from 'src/app/state/point-of-sale/sale/sale.selectors';
import { SalesService } from 'src/app/state/point-of-sale/sale/sales.service';

export interface SaleModel {
  id: number;
  totalAmount: number;
  paymentMethod: string;
  saleDate: string;
  cashierId: number | null;
}

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent {
  constructor(private store: Store, private saleService: SalesService) {}
  gymId = 1; // 🔹 ID del gimnasio actual
  sales$ = this.store.select(selectAllSales);
  data: any[] = [];


  ngOnInit() {
    console.log(`📌 Dispatching loadSales para gymId: ${this.gymId}`);
    this.store.dispatch(loadSales({ gymId: this.gymId })); // 🔹 Cargar ventas del gimnasio actual

    // 🔹 Suscribirse a Redux para actualizar la tabla automáticamente
    this.sales$.subscribe(sales => {
      console.log('📌 Ventas en Redux:', sales);
      this.data = sales; // 🔹 Pasamos las ventas a la tabla
    });
  }
}


