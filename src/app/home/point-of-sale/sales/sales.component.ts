import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Sale } from 'src/app/state/point-of-sale/sale/sale.model';
import { selectFilteredSales } from 'src/app/state/point-of-sale/sale/sale.selectors';
import { loadSales, resetFilters, setCashierId, setCashRegisterId, setEndDate, setSearchTerm, setStartDate } from 'src/app/state/point-of-sale/sale/sale.actions';
import { MatDialog } from '@angular/material/dialog';
import { SaleDetailModalComponent } from 'src/app/shared/table-material-crud/modal/sale-detail-modal.component';
import { CommonModule } from '@angular/common';
import { SummaryWeeklyComponent } from '../components/earnings-summary/summary-weekly.component';
import { CtnCreateSearchComponent } from '../components/components/ctn-create-search/ctn-create-search.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { SearchCreateListComponent } from '../components/search-create-list/search-create-list.component';
import { SaleCardComponent } from '../components/sale-card/sale-card';

@Component({
  selector: 'app-sales',
  styleUrls: ['./sales.component.scss'],
  templateUrl: './sales.component.html',
  standalone: true,
  imports: [ CommonModule,
    FormsModule,              
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    SummaryWeeklyComponent,CtnCreateSearchComponent,SaleCardComponent],
})
export class SalesComponent {

  private dialog = inject(MatDialog);
  cardComponent = SaleCardComponent; // ✅ aquí defines el componente que se mostrará como card

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

  // 🔵 Nuevo
  showActivityList = false;
  startOfWeek = new Date();
  salesSummary: { date: string, amount: number, tickets: number }[] = [];

  constructor(private store: Store) {
    this.sales$ = this.store.select(selectFilteredSales);
  }

  ngOnInit() {
    this.store.dispatch(loadSales({ gymId: 1 }));
  
    this.sales$.subscribe((sales) => {
      const resumen: { [key: string]: { amount: number, tickets: number } } = {};
  
      sales.forEach(sale => {
        const saleDate = new Date(sale.saleDate); // 🔵 CORRECTO: convertir
        const dateOnly = saleDate.toISOString().split('T')[0]; // 🔵 yyyy-MM-dd
  
        if (!resumen[dateOnly]) {
          resumen[dateOnly] = { amount: 0, tickets: 0 };
        }
        resumen[dateOnly].amount += sale.totalAmount;
        resumen[dateOnly].tickets += 1;
      });
  
      this.salesSummary = Object.keys(resumen).map(date => ({
        date,
        amount: resumen[date].amount,
        tickets: resumen[date].tickets
      }));
  
      console.log('Resumen de ventas por día:', this.salesSummary); // 🔥
    });
  }
  

  handleSeeActivity() {
    this.showActivityList = true;
  }

  handleBackToSummary() {
    this.showActivityList = false;
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

      (window as any).pdfMake.createPdf(documentDefinition).download('Reporte-Ventas.pdf');
    });
  }

  openSaleDetailModal(sale: any): void {
    this.dialog.open(SaleDetailModalComponent, {
      width: '600px',
      data: { sale }
    });
  }

  onCreateClick() {
    console.log('Crear nueva venta');
  }

  onSearch(searchValue: string) {
    this.store.dispatch(setSearchTerm({ searchTerm: searchValue }));
  }
  onEdit(item: any) {
    console.log('Editar:', item);
  }
  
  onDelete(item: any) {
    console.log('Eliminar:', item);
  }
  
}
