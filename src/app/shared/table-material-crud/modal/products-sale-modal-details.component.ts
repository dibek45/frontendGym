import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-products-sale-modal-details',
  templateUrl: './products-sale-modal-details.component.html',
  standalone:true,
  imports:[    MatTableModule, // 🔹 Asegúrate de importar esto
  ]
})
export class ProductsSaleModalDetailsComponent {
  // 🔹 Definir las columnas que se mostrarán en la tabla
  displayedColumns: string[] = ['id', 'name', 'quantity', 'unitPrice', 'totalPrice'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProductsSaleModalDetailsComponent> // 🔹 Inyectamos MatDialogRef
  ) {}

  closeModal(): void {
    this.dialogRef.close(); // 🔹 Cierra el modal manualmente
  }
}
