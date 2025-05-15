import { ChangeDetectorRef, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Casher } from 'src/app/state/point-of-sale/casher/cashier.model';
import { addCashier, loadCashiers } from 'src/app/state/point-of-sale/casher/cashier.actions';
import { selectAllCashiers } from 'src/app/state/point-of-sale/casher/cashier.selectors';
import { CardCasherComponent } from './shared/card-casher/card-casher.component';
import { AddCasherComponent } from './shared/add-casher/add-casher.component';
import { SearchCreateListComponent } from '../components/search-create-list/search-create-list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-casher',
  templateUrl: './casher.component.html',
  standalone:true,
  imports:[ 
    CommonModule,
    AddCasherComponent,
    SearchCreateListComponent,],
  styleUrls: ['./casher.component.scss']
})
export class CasherComponent {
  cashers$: Observable<Casher[]>;
  data: Casher[] = [];
  displayedColumns: string[] = ['name', 'username', 'status', 'actions'];
  cardComponent = CardCasherComponent;

  isModalOpen = false;

  constructor(private store: Store,private cdr: ChangeDetectorRef) {
    this.cashers$ = this.store.select(selectAllCashiers);
  }
  ngOnInit(): void {
    this.loadCashers();
  
    this.cashers$.subscribe(cashiers => {
      this.data = cashiers;
      console.log('🟢 Datos en tarjetas:', this.data);
      this.cdr.detectChanges(); // 👈 fuerza que Angular vuelva a pintar las tarjetas
    });
  }


  loadCashers(): void {
    this.store.dispatch(loadCashiers());
  }

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
      this.addCashier(
        event.data.name,
        event.data.email,
        event.data.password,
      );
    }
    this.isModalOpen = false;
  }

  addCashier(name: string, email: string, password: string): void {
    const newCasher: Casher = {
      name: name,
      username: email,
      phone: '0',
      password: password,
      gymId: 1,
    };
    this.store.dispatch(addCashier({ cashier: newCasher }));
  }

  onEdit(cashier: Casher): void {
    console.log('Editar:', cashier);
  }

  onDelete(cashier: Casher): void {
    console.log('Eliminar:', cashier);
  }
}
