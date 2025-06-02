import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { ExpenseModel } from 'src/app/state/expense/expense.model';

@Component({
  selector: 'app-gastos-del-dia-modal',
  standalone: true,
  imports: [
        CommonModule,

    MatDialogModule,
    MatListModule,
MatButtonModule       
  ],
  templateUrl: './gastos-del-dia-modal.component.html',
  styleUrl: './gastos-del-dia-modal.component.scss'
})
export class GastosDelDiaModalComponent {

    total: number = 0;

constructor(
    @Inject(MAT_DIALOG_DATA) public data: { gastos: ExpenseModel[] },
    public dialogRef: MatDialogRef<GastosDelDiaModalComponent>
  ) {
    if (data.gastos?.length) {
      this.total = data.gastos.reduce((acc, g) => acc + g.amount, 0);
    }
  }

  cerrar() {
    this.dialogRef.close();
  }


  get tieneGastos(): boolean {
  return Array.isArray(this.data?.gastos) && this.data.gastos.length > 0;
}

}
