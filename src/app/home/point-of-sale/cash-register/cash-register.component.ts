import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SubareaTituloComponent } from 'src/app/shared/subarea-titulo/subarea-titulo.component';
import { CashRegisterActions } from 'src/app/state/point-of-sale/cash-register/cash-register.actions';
import { Casher, CashRegister } from 'src/app/state/point-of-sale/cash-register/cash-register.model';
import { selectAllCashRegisters } from 'src/app/state/point-of-sale/cash-register/cash-register.selectors';
import { loadCashiers } from 'src/app/state/point-of-sale/casher/cashier.actions';
import { selectAllCashiers } from 'src/app/state/point-of-sale/casher/cashier.selectors';

@Component({
  selector: 'app-cash-register',
  templateUrl: './cash-register.component.html',
  styleUrls: ['./cash-register.component.scss'],
})
export class CashRegisterComponent {
  cashRegisters$: Observable<CashRegister[]>; // Observable para manejar el estado de las cajas registradoras
  isModalOpen = false; // Variable para controlar la visibilidad del modal
  cashers$: Observable<Casher[]>;

  
  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
  
  constructor(private store: Store){
    this.cashRegisters$ = this.store.select(selectAllCashRegisters);
    this.cashers$ = this.store.select(selectAllCashiers);

  }

  ngOnInit(): void {
    this.loadCashRegisters(); // Carga los registros al iniciar el componente
    this.loadCashiers();

  }

  loadCashiers(): void {
    this.store.dispatch(loadCashiers());
  }
  showDetails = false;

  openDetails() {
    this.showDetails = true;
  }

  closeDetails() {
    this.showDetails = false;
  }

 


   // Método para cargar todas las cajas registradoras
   loadCashRegisters(): void {
    this.store.dispatch(CashRegisterActions['loadCashRegisters']());
  }

  // Método para agregar una nueva caja registradora
  addCashRegister(cashierId:number,cashierName: string, openingBalance: number): void {
    // Encuentra la posición del cajero en el mock
   
  
    // Crea un nuevo objeto CashRegister
    const newCashRegister: CashRegister = {
      cashierId: cashierId,
      openingBalance:openingBalance,
     gymId:1
    };
  
    // Despacha la acción para agregar la nueva caja
    this.store.dispatch(
      CashRegisterActions['addCashRegister']({ cashRegister: newCashRegister })
    );
  }
  

  handleModalClose(event?: { action: 'submit'; data: { cashierId: number; cashierName: string; openingBalance: number } }): void {
    if (event?.action === 'submit') {
      console.log('Datos del Modal:', event.data);
      
      // Llama al método para agregar la caja, pasando también el `cashierId`
      this.addCashRegister(event.data.cashierId, event.data.cashierName, Number(event.data.openingBalance));
    } else {
      console.log('Modal cerrado sin agregar datos.');
    }
    this.isModalOpen = false; // Cierra el modal
  }
}  