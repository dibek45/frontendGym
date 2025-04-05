import { Component } from '@angular/core';
import { MachineModel } from 'src/app/state/machine/machine.model';

@Component({
  selector: 'app-machine-container',
  templateUrl: './machine-container.component.html',
  styleUrls: ['./machine-container.component.scss']

})
export class MachineContainerComponent {

  showForm = false; // true si se está agregando/editando
  machineToEdit: MachineModel | null = null;
  selectedMachine: MachineModel | null = null;

  constructor() {}

  
  onAddMachine() {
    this.selectedMachine = null;
    this.showForm = true;
  }
  
  onEditMachine(machine: MachineModel) {
    this.selectedMachine = machine;
    this.showForm = true;
  }
  
  onCloseForm() {
    this.showForm = false;
  }
  
}
