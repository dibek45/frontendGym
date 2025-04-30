import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MachineModel } from 'src/app/state/machine/machine.model';
import { selectAllMachines } from 'src/app/state/machine/machine.selectors';
import * as MachineActions from 'src/app/state/machine/machine.actions';
import { CardMachineComponent } from '../../point-of-sale/components/card-machine-component/card-machine-component.component';

@Component({
  selector: 'app-machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.scss']
})
export class MachineListComponent {
onAddQr($event: Event) {
throw new Error('Method not implemented.');
}
  data: MachineModel[] = [];

  machines$: Observable<MachineModel[]>;
  displayedColumns: string[] = ['name', 'description', 'qrs', 'actions'];
  cardComponent = CardMachineComponent;

  constructor(private store: Store) {
    this.machines$ = this.store.select(selectAllMachines);
  }

  ngOnInit(): void {
    this.loadMachines();

    this.machines$.subscribe((machines) => {
      this.data = machines;
    });
  }

  loadMachines(): void {
    this.store.dispatch(MachineActions.loadMachines({ gymId: 1 }));
  }

  openModal(): void {
    console.log('Abrir modal para crear máquina');
  }

  onEdit(machine: MachineModel): void {
    console.log('Editar:', machine);
  }

  onDelete(machine: MachineModel): void {
    console.log('Eliminar:', machine);
  }
}
