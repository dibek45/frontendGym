import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-casher',
  templateUrl: './add-casher.component.html',
  styleUrls: ['./add-casher.component.scss'],
  standalone:true,
  imports: [CommonModule],

})
export class AddCasherComponent {

  

  cashRegister = {
    openingBalance: 0,
    status: 'actived',
    name: '',
    email:"",
    password:"",
    openingTime: new Date().toISOString().slice(0, 10),
  };

  // Método para manejar cambios en los campos
  onInputChange(field: string, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    if (target) {
      this.cashRegister = { ...this.cashRegister, [field]: target.value };
    }
  }

  @Output() closeModal = new EventEmitter<{
    action: 'submit';
    data: {
      openingBalance: number;
      name: string;
      email: string;
      password: string;
      openingTime: string;
      status: string;
    };
  }>();
  
  onSubmit(): void {
    const modalData = {
      openingBalance: this.cashRegister.openingBalance,
      name: this.cashRegister.name,
      email: this.cashRegister.email,
      password: this.cashRegister.password,
      openingTime: this.cashRegister.openingTime,
      status: this.cashRegister.status,
    };
  
    this.closeModal.emit({ action: 'submit', data: modalData });
  }
  
  onCancel(): void {
    this.closeModal.emit(); // Emite solo el cierre sin datos
  }
}


