import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MaterialModuleModule } from 'src/shared/material-module/material-module.module';

@Component({
  selector: 'app-table-material',
  standalone: true,
  templateUrl: './table-material.component.html',
  styleUrls: ['./table-material.component.scss'],
  imports: [CommonModule, MaterialModuleModule],
})
export class TableMaterialComponent implements OnChanges, AfterViewInit {
  @Input() data: any[] = []; // Datos recibidos desde el componente padre
  displayedColumns: string[] = []; // Columnas dinámicas
  dataSource = new MatTableDataSource<any>(); // Fuente de datos para la tabla
  @Output() elementSelected = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Referencia al paginador
  @ViewChild(MatSort) sort!: MatSort; // Referencia al ordenamiento

  // Lista de columnas que contienen fechas
  dateColumns: string[] = ['createdAt', 'updatedAt', 'timestamp'];

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes && this.data.length > 0) {
      // Convertir id a número si es necesario
      this.data = this.data.map(item => ({
        ...item,
        id: typeof item.id === 'string' ? parseInt(item.id, 10) : item.id,
      }));

      // Generar columnas dinámicamente basadas en las claves del primer objeto
      this.displayedColumns = Object.keys(this.data[0]);
      this.displayedColumns.push('actions'); // Agregar columna de acciones
      this.dataSource.data = this.data;

      // Vincular paginador y ordenamiento al dataSource
      if (this.paginator && this.sort) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    }
  }

  ngAfterViewInit(): void {
    // Vincular MatPaginator y MatSort después de que la vista esté inicializada
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Configurar ordenamiento para fechas
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (this.dateColumns.includes(property)) {
        return new Date(item[property]).getTime(); // Ordenar fechas como números
      }
      return item[property];
    };
  }

  isDate(value: any): boolean {
    return typeof value === 'string' && !isNaN(Date.parse(value));
  }

  itemSelected(row: any): void {
    this.elementSelected.emit(row)
  }
}
