import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-expense',
  standalone: true,
  imports: [

    CommonModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule
  ],
  templateUrl: './modal-expense.component.html',
  styleUrls: ['./modal-expense.component.scss']
})
export class ModalExpenseComponent {
save() {
throw new Error('Method not implemented.');
}

  monto = 0;
  fecha = new Date();
  descripcion = '';

categorias = [
  { nombre: 'Servicios', icon: 'bolt' },           // luz, agua, etc.
  { nombre: 'Publicidad', icon: 'campaign' },      // anuncios, redes, marketing
  { nombre: 'Mantenimiento', icon: 'build' },      // reparaciones, ajustes
  { nombre: 'Recibos', icon: 'receipt_long' }      // facturas, pagos
];


categoriaSeleccionada = this.categorias[0]; // ← ya no da error


  constructor(private dialogRef: MatDialogRef<ModalExpenseComponent>) {}

  selectCategoria(categoria: any) {
    this.categoriaSeleccionada = categoria;
  }

  close() {
    this.dialogRef.close();
  }
}
