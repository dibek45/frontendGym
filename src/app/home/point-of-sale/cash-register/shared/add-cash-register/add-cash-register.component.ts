import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Casher } from 'src/app/state/point-of-sale/cash-register/cash-register.model';

@Component({
  selector: 'app-add-cash-register',
  standalone: true,
  templateUrl: './add-cash-register.component.html',
  styleUrls: ['./add-cash-register.component.scss'],
  imports: [CommonModule],
})
export class AddCashRegisterComponent {
  @Input() cashiers$!: Observable<Casher[]>; // Recibe los cajeros como observable

  cashRegister = {
    cashierId: null,
    openingBalance: 0,
    status: 'open',
    openingTime: new Date().toISOString().slice(0, 10),
  };

  // Método para manejar cambios en los campos
  onInputChange(field: string, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    if (target) {
      this.cashRegister = { ...this.cashRegister, [field]: target.value };
    }
  }

  @Output() closeModal = new EventEmitter<{ action: 'submit'; data: { cashierId: number; cashierName: string; openingBalance: number } }>();

  onSubmit(): void {
    this.cashiers$.subscribe(cashiers => {
      const selectedCashier = cashiers.find(cashier => cashier.id === Number(this.cashRegister.cashierId));
      const modalData = {
        cashierId: selectedCashier?.id || 0, // Asigna 0 como valor predeterminado si no se encuentra el cajero
        cashierName: selectedCashier?.name || '',
        openingBalance: this.cashRegister.openingBalance,
      };
      this.closeModal.emit({ action: 'submit', data: modalData });
    });
  }
  
  
  onCancel(): void {
    this.closeModal.emit(); // Emite solo el cierre sin datos
  }
}
