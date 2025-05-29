import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ExpenseModel } from 'src/app/state/expense/expense.model';
import { CashRegisterService } from 'src/app/state/point-of-sale/cash-register/cash-register.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { LocalEncryptedStorageService } from 'src/app/local/services/local-encrypted-storage.service';
import { ExpenseService } from 'src/app/state/expense/expense.service';

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


  constructor(private dialogRef: MatDialogRef<ModalExpenseComponent>,
      private cashRegisterService: CashRegisterService,
  private notificationService: NotificationService,
  private localStorage: LocalEncryptedStorageService,
    private expenseService: ExpenseService,

  ) {}

  selectCategoria(categoria: any) {
    this.categoriaSeleccionada = categoria;
  }

  close() {
    this.dialogRef.close();
  }


  async save() {
  if (!this.monto || !this.fecha || !this.descripcion || !this.categoriaSeleccionada) {
    this.notificationService.mostrarSnackbar('⚠️ Completa todos los campos', 'warning');
    return;
  }

  try {
    const identity = await this.localStorage.loadIdentity();
    if (!identity) throw new Error('❌ No hay identidad cargada');

    const caja = await this.cashRegisterService.getCajaActiva();
    if (!caja) throw new Error('❌ No hay caja activa abierta');

    const expense: ExpenseModel = {
      amount: this.monto,
      description: this.descripcion,
      expenseDate: this.fecha.toISOString(),
      category: this.categoriaSeleccionada.nombre,
      paymentMethod: 'cash', // o el que elijas
      createdBy:identity.userId,
      cashierId: caja.id,
      gymId: identity.gymId,
      tempId: Date.now().toString(), // opcional
      isSynced: false,
      syncError: false
    };

    // 👇 Crear gasto y actualizar balance
    await this.expenseService.createExpense(expense);

    this.notificationService.mostrarSnackbar('✅ Gasto registrado',"success");
    this.dialogRef.close  (true); // <- si usas MatDialog

  } catch (error) {
    console.error(error);
    this.notificationService.mostrarSnackbar('❌ Error al guardar el gasto', 'error');
  }
}

}
