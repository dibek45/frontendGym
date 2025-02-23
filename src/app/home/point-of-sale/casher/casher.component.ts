import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Casher, CashRegister } from 'src/app/state/point-of-sale/cash-register/cash-register.model';
import {addCashier,loadCashiers } from 'src/app/state/point-of-sale/casher/cashier.actions';
import { Cashier } from 'src/app/state/point-of-sale/casher/cashier.model';
import { selectAllCashiers } from 'src/app/state/point-of-sale/casher/cashier.selectors';

@Component({
  selector: 'app-casher',
  templateUrl: './casher.component.html',
  styleUrls: ['./casher.component.scss']
})
export class CasherComponent {
  cashers$: Observable<Casher[]>; // Observable para manejar el estado de las cajas registradoras

  constructor(private store: Store){
    this.cashers$ = this.store.select(selectAllCashiers);

  }

  ngOnInit(): void {
this.loadCashers();
  }

  isModalOpen = false; // Variable para controlar la visibilidad del modal

  
  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }


  handleModalClose(event?: {
    action: 'submit';
    data: {
      openingBalance: number;
      name: string;
      email: string;
      password: string;
      openingTime: string;
      status: string;
    };
  }): void {
    if (event?.action === 'submit') {
      console.log('Datos del Modal:', event.data);
  
      // Llama al método para agregar el cajero con los datos completos
      this.addCashier(
        event.data.name,
        event.data.email,
        event.data.password,

      );
    } else {
      console.log('Modal cerrado sin agregar datos.');
    }
    this.isModalOpen = false; // Cierra el modal
  }
  
  addCashier(
    name: string,
    email: string,
    password: string,
  ): void {
    // Crea un nuevo objeto conforme al modelo
    const newCasher: Cashier = {
      name: name,
      username: email,
      phone: '0',
      password: password,
      gymId: 1, // Cambia este valor según el gimnasio actual
    };
  
    // Despacha la acción para agregar el nuevo cajero
    this.store.dispatch(addCashier({ cashier: newCasher }));
  }
  
  
     // Método para cargar todas las cajas registradoras
     loadCashers(): void {
      this.store.dispatch(loadCashiers());
    }
}
