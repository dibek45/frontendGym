import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SubareaTituloComponent } from 'src/app/shared/subarea-titulo/subarea-titulo.component';
import { CashRegisterActions } from 'src/app/state/point-of-sale/cash-register/cash-register.actions';
import { Casher, CashRegister } from 'src/app/state/point-of-sale/cash-register/cash-register.model';
import { selectAllCashRegisters } from 'src/app/state/point-of-sale/cash-register/cash-register.selectors';
import { loadCashiers } from 'src/app/state/point-of-sale/casher/cashier.actions';
import { selectAllCashiers } from 'src/app/state/point-of-sale/casher/cashier.selectors';
import { SearchCreateListComponent } from '../components/search-create-list/search-create-list.component';
import { CommonModule } from '@angular/common';
import { AddCasherComponent } from '../casher/shared/add-casher/add-casher.component';
import { AddCashRegisterComponent } from "./shared/add-cash-register/add-cash-register.component";
import { CardCasherComponent } from '../casher/shared/card-casher/card-casher.component';
import { CardCashregisterComponent } from './shared/card-cash-register-item/card-cash-register-item.component';

@Component({
  selector: 'app-cash-register',
  templateUrl: './cash-register.component.html',
  styleUrls: ['./cash-register.component.scss'],
  standalone:true,
  imports: [CommonModule, SearchCreateListComponent, SubareaTituloComponent,  AddCashRegisterComponent]
})
export class CashRegisterComponent {
  // Store data
  cashRegisters$: Observable<CashRegister[]>;
  cashers$: Observable<Casher[]>;

  // Vista tarjetas
  cashRegistersList: CashRegister[] = [];
  displayedColumns = ['cashierId', 'openingBalance', 'status', 'actions'];
  cardComponent = CardCashregisterComponent;

  // Modal y detalles
  isModalOpen = false;
  showDetails = false;
  selectedCashRegister: CashRegister | null = null;

  constructor(private store: Store) {
    this.cashRegisters$ = this.store.select(selectAllCashRegisters);
    this.cashers$ = this.store.select(selectAllCashiers);
  }

  ngOnInit(): void {
    this.loadCashRegisters();
    this.loadCashiers();

    this.cashRegisters$.subscribe(list => {
      this.cashRegistersList = list;
    });
  }

  loadCashRegisters(): void {
    this.store.dispatch(CashRegisterActions.loadCashRegisters());
  }

  loadCashiers(): void {
    this.store.dispatch(loadCashiers());
  }

  // Abrir modal
  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  handleModalClose(event?: {
    action: 'submit';
    data: {
      cashierId: number;
      cashierName: string;
      openingBalance: number;
    };
  }): void {
    if (event?.action === 'submit') {
      const { cashierId, cashierName, openingBalance } = event.data;
      this.addCashRegister(cashierId, cashierName, Number(openingBalance));
    }
    this.closeModal();
  }

  addCashRegister(cashierId: number, cashierName: string, openingBalance: number): void {
    const newCashRegister: CashRegister = {
      cashierId,
      openingBalance,
      gymId: 1
    };
    this.store.dispatch(CashRegisterActions.addCashRegister({ cashRegister: newCashRegister }));
  }

  // Acciones de tarjeta
  openDetails(cashRegister: CashRegister): void {
    this.selectedCashRegister = cashRegister;
    this.showDetails = true;
  }

  closeDetails(): void {
    this.selectedCashRegister = null;
    this.showDetails = false;
  }

  onDelete(cashRegister: CashRegister): void {
    console.log('Eliminar caja:', cashRegister);
    // Aquí podrías despachar acción para cerrar o eliminar caja
  }
}