import { Component, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit, Output, EventEmitter, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModuleModule } from 'src/shared/material-module/material-module.module';
import { SaleDetailModalComponent } from './modal/sale-detail-modal.component';

@Component({
  selector: 'app-table-material-crud',
  standalone: true,
  templateUrl: './table-material.component.html',
  styleUrls: ['./table-material.component.scss'],
  imports: [CommonModule, MaterialModuleModule],
  providers: [DatePipe] // 👈 Se agrega para poder usar el pipe 'date'

})
export class TableMaterialCrudComponent implements OnChanges, AfterViewInit {
  private dialog = inject(MatDialog);

  @Input() data: any[] = [];
  dataSource = new MatTableDataSource<any>();

  @Output() elementSelected = new EventEmitter<any>();
  @Output() elementEdited = new EventEmitter<any>();
  @Output() elementDeleted = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dateColumns: string[] = ['createdAt', 'updatedAt', 'timestamp'];

  displayedColumns: string[] = [
    'id',
    'cashRegisterId',
    'cashierName',
    'paymentMethod',
    'saleDate',
    'totalAmount',
    'details', // 👈 Botón para abrir el modal con los detalles
    'actions'  // 👈 Manteniendo la columna de editar/eliminar
  ];
  
 

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes && this.data && this.data.length > 0) {
      this.processData();
    } else {
      this.displayedColumns = ['id', 'actions']; // 🔹 Si no hay datos, solo mostrar ID y Acciones
    }
  }

  ngAfterViewInit(): void {
    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  processData(): void {
    if (this.data.length > 0) {
      // 🔹 Transformar datos antes de asignarlos a la tabla
      this.dataSource.data = this.data.map(sale => ({
        ...sale,
        cashRegisterId: sale.cashRegister?.id ?? 'N/A', // 🔹 ID de la caja
        cashierName: sale.cashRegister?.cashier?.name ?? 'N/A', // 🔹 Nombre del cajero
      }));
    } else {
      this.displayedColumns = ['id', 'actions'];
    }
  }
  
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openSaleDetailModal(sale: any): void {
    this.dialog.open(SaleDetailModalComponent, {
      width: '600px',
      data: {
        sale: sale
      }
    });
  }

  isObject(value: any): boolean {
    return typeof value === 'object' && value !== null;
  }

  editItem(row: any): void {
    this.elementEdited.emit(row);
  }

  deleteItem(row: any): void {
    this.elementDeleted.emit(row);
  }

  getDisplayValue(value: any): string {
    if (!value) {
      return '';
    }
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return ''; // Para details, solo mostrar "Productos"
      }
      if (value.cashier) {
        return ''; // Para cashRegister, solo mostrar "Caja"
      }
      return 'Detalles'; // Para otros objetos, solo mostrar "Detalles"
    }
    return value;
  }
}
