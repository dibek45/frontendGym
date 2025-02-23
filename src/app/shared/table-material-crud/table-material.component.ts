import { Component, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit, Output, EventEmitter, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'src/shared/material-module/material-module.module';
import { SaleDetailModalComponent } from './modal/sale-detail-modal.component';
import { ProductsSaleModalDetailsComponent } from './modal/products-sale-modal-details.component';

@Component({
  selector: 'app-table-material-crud',
  standalone: true,
  templateUrl: './table-material.component.html',
  styleUrls: ['./table-material.component.scss'],
  imports: [CommonModule, MaterialModuleModule],
})
export class TableMaterialCrudComponent implements OnChanges, AfterViewInit {
  private dialog = inject(MatDialog);

  @Input() data: any[] = [];
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();

  @Output() elementSelected = new EventEmitter<any>();
  @Output() elementEdited = new EventEmitter<any>();
  @Output() elementDeleted = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dateColumns: string[] = ['createdAt', 'updatedAt', 'timestamp'];

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes && this.data && this.data.length > 0) {
      this.processData();
    } else {
      this.displayedColumns = ['id', 'actions']; // Si no hay datos, definir solo estas columnas
     this.displayedColumns = this.displayedColumns.filter(column => column !== 'gym');

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
      // 🔹 Generar columnas dinámicamente asegurando que `id` sea la primera y excluyendo `gym`
      const columns = Object.keys(this.data[0]).filter(col => col !== 'id' && col !== 'gym');
      this.displayedColumns = ['id', ...columns, 'actions'];
    } else {
      this.displayedColumns = ['id', 'actions'];
    }
  
    this.dataSource.data = this.data;
  }
  
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openDetailsModal(objectData: any, columnName: string): void {
    if (!objectData || typeof objectData !== 'object') {
      console.warn(`⚠ La columna ${columnName} no contiene un objeto válido.`);
      return;
    }
  
    if (columnName === 'details') {
      // 🔹 Si se selecciona "details", abrir el modal especializado
      this.dialog.open(ProductsSaleModalDetailsComponent, {
        width: '700px',
        data: { products: objectData }, // Pasamos los productos al modal
      });
    } else {
      // 🔹 Para otros objetos, abrir el modal estándar
      this.dialog.open(SaleDetailModalComponent, {
        width: '600px',
        data: { objectData: Array.isArray(objectData) ? objectData : [objectData], columnName },
      });
    }
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

  getCashRegisterName(cashRegister: any): string {
    if (!cashRegister || typeof cashRegister !== 'object') {
      return 'Sin nombre';
    }
    return cashRegister.name || 'Sin nombre';
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
