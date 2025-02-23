import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'src/shared/material-module/material-module.module';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-sale-detail-modal',
  standalone: true,
  templateUrl: './sale-detail-modal.component.html',
  imports: [CommonModule, MaterialModuleModule],
})
export class SaleDetailModalComponent {
  displayedColumns: string[] = ['property', 'value'];
  dataSource = new MatTableDataSource<any>();

  constructor(
    public dialogRef: MatDialogRef<SaleDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { objectData: any[]; columnName: string }
  ) {
    // 🔥 Convertir objeto en un array de clave-valor para mostrarlo en una tabla
    this.dataSource.data = data.objectData.map(obj => 
      Object.entries(obj).map(([key, value]) => ({ property: key, value }))
    ).flat();
  }

  close(): void {
    this.dialogRef.close();
  }

  isObject(value: any): boolean {
    return value && typeof value === 'object' && !Array.isArray(value);
  }
}
