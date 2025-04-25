import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Sale } from 'src/app/state/point-of-sale/sale/sale.model';
import {  selectFilteredSales } from 'src/app/state/point-of-sale/sale/sale.selectors';
import { SalesService } from 'src/app/state/point-of-sale/sale/sales.service';
import { loadSales, resetFilters, setCashierId, setCashRegisterId, setEndDate, setSearchTerm, setStartDate } from 'src/app/state/point-of-sale/sale/sale.actions';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { SaleDetailModalComponent } from 'src/app/shared/table-material-crud/modal/sale-detail-modal.component';
import { MatDialog } from '@angular/material/dialog';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-sales',
  styleUrls: ['./sales.component.scss'],
  templateUrl: './sales.component.html',
})
export class SalesComponent {

  private dialog = inject(MatDialog);

  sales$: Observable<Sale[]>;
  selectedCashRegisterId: number | null = null;
  selectedCashierId: number | null = null;
  startDate: string | null = null;
  endDate: string | null = null;
  displayedColumns: string[] = [
    'id',
    'cashRegisterId',
    'cashier',
    'paymentMethod',
    'saleDate',
    'total',
    'details',
    'actions'
  ];
  

  cashRegisters = [
    { id: 168, name: 'Caja 168' },
    { id: 179, name: 'Caja 179' }
  ];
  cashiers: { id: number; name: string }[] = [];

  constructor(private store: Store) {
    this.sales$ = this.store.select(selectFilteredSales);
  }


  ngOnInit() {
    console.log(`📌inicia metodo onInit}`);
    this.store.dispatch(loadSales({ gymId: 1 })); // 🔹 Ahora pasamos el gymId
  }
  onStartDateChange(event: any) {
    this.startDate = event.value ? event.value.toISOString().split('T')[0] : null;
    this.store.dispatch(setStartDate({ startDate: this.startDate }));
  }

  onEndDateChange(event: any) {
    this.endDate = event.value ? event.value.toISOString().split('T')[0] : null;
    this.store.dispatch(setEndDate({ endDate: this.endDate }));
  }

  onCashRegisterChange(event: any) {
    this.selectedCashRegisterId = event.value;
    this.store.dispatch(setCashRegisterId({ cashRegisterId: this.selectedCashRegisterId }));

    // Filtrar cajeros según la caja seleccionada
    this.sales$.subscribe(sales => {
      const cashiersInSelectedRegister = sales
        .filter(sale => sale.cashRegister?.id === this.selectedCashRegisterId)
        .map(sale => sale.cashRegister?.cashier)
        .filter((cashier, index, self) => cashier && self.findIndex(c => c?.id === cashier?.id) === index);

      this.cashiers = cashiersInSelectedRegister as { id: number; name: string }[];
    });
  }

  onCashierChange(event: any) {
    this.selectedCashierId = event.value;
    this.store.dispatch(setCashierId({ cashierId: this.selectedCashierId }));
  }

  resetFilters() {
    this.selectedCashRegisterId = null;
    this.selectedCashierId = null;
    this.startDate = null;
    this.endDate = null;
    this.cashiers = [];

    this.store.dispatch(resetFilters());
  }

  generateReport() {
    this.sales$.subscribe((sales) => {
      if (!sales || sales.length === 0) {
        alert('No hay ventas para generar el reporte.');
        return;
      }

      const reportData = sales.map((sale, index) => [
        index + 1,
        sale.saleDate,
        sale.totalAmount,
        sale.paymentMethod ?? 'N/A',
        sale.cashRegister?.cashier.name ?? 'Sin cajero'
      ]);

      const documentDefinition = {
        content: [
          { text: 'Reporte de Ventas', style: 'header' },
          { text: `Fecha: ${new Date().toLocaleDateString()}`, alignment: 'right' },
          { text: '\n' },
          {
            table: {
              headerRows: 1,
              widths: ['auto', '*', 'auto', 'auto', '*'],
              body: [
                ['#', 'Fecha', 'Total ($)', 'Método de Pago', 'Cajero'],
                ...reportData
              ]
            }
          }
        ],
        styles: {
          header: { fontSize: 18, bold: true, alignment: 'center' },
        }
      };

      pdfMake.createPdf(documentDefinition).download('Reporte-Ventas.pdf');
    });
  }

   openSaleDetailModal(sale: any): void {
    console.log(sale)
      this.dialog.open(SaleDetailModalComponent, {
        width: '600px',
        data: {
          sale: sale
        }
      });
    }

    onCreateClick() {
      console.log('Crear nueva venta');
      // O abrir un modal, o navegar a una ruta nueva
    }
    onSearch(searchValue: string) {
      this.store.dispatch(setSearchTerm({ searchTerm: searchValue }));
    }  
}
