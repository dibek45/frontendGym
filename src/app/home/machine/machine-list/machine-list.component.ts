import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromMachines from '../../../state/machine/machine.selectors';
import * as MachineActions from '../../../state/machine/machine.actions';
import { AppState } from 'src/app/state/app.state';
import { MachineModel } from 'src/app/state/machine/machine.model';
import { QrModalComponent } from '../qr-modal/qr-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { selectMachineError, selectMachineLoading } from '../../../state/machine/machine.selectors';

@Component({
  selector: 'app-machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.scss']

})
export class MachineListComponent implements OnInit {
    machines$: Observable<MachineModel[]> | undefined;
    @Output() edit = new EventEmitter<MachineModel>();
    loading$ = this.store.select(selectMachineLoading);
    error$ = this.store.select(selectMachineError);
    openQr: { machineId: number | null; qrIndex: number | null } = {
      machineId: null,
      qrIndex: null,
    };
  constructor(private store: Store<AppState>,private dialog: MatDialog) {}

  ngOnInit(): void {
    this.store.dispatch(MachineActions.loadMachines({ gymId: 1 }));
    this.machines$ = this.store.select(fromMachines.selectAllMachines); // Selector
  }

  editMachine(machine: MachineModel) {
    console.log('Editando máquina', machine);
    this.edit.emit(machine);
  }
  

  deleteMachine(id: number) {
    if (confirm('¿Estás seguro de eliminar esta máquina?')) {
   //   this.store.dispatch(MachineActions.deleteMachine({ id }));
    }
  }



  openQrModal(qrCode: string): void {
    this.dialog.open(QrModalComponent, {
      width: '400px',
      data: { qrCode }
    });
  }
  

  isQrOpen(machineId: number, qrIndex: number): boolean {
    return this.openQr.machineId === machineId && this.openQr.qrIndex === qrIndex;
  }

  printQr(qrValue: string): void {
    const printWindow = window.open('', '_blank', 'width=400,height=400');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Imprimir Código QR</title></head>
          <body>
            <div style="text-align:center;">
              <h3>Código QR</h3>
              <img src="${this.generateQrDataUrl(qrValue)}" />
              <p>${qrValue}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
  
      // Espera 500ms antes de imprimir (puedes ajustar el tiempo)
      setTimeout(() => {
        printWindow.focus(); // <-- importante para que no se bloquee
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  }
  

  generateQrDataUrl(qrValue: string): string {
    // Esto es un truco temporal, luego podemos usar una librería que genere el data URL directamente
    // Aquí puedes integrar `qrcode` de npm o una librería que genere la imagen como data URL
    return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrValue)}&size=200x200`;
  }
}
