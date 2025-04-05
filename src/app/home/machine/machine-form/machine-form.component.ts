import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { MachineModel, QRModel } from 'src/app/state/machine/machine.model';
import * as MachineActions from '../../../state/machine/machine.actions';

@Component({
  selector: 'app-machine-form',
  templateUrl: './machine-form.component.html',
  styleUrls: ['./machine-form.component.scss']
})
export class MachineFormComponent implements OnInit {
  @Input() machine: MachineModel | null = null;
  newQrForm: FormGroup | null = null;
  machinePanelExpanded = true; // se muestra abierto por defecto
  slots = [0, 1, 2, 3];

  machineForm!: FormGroup;
  @Output() formClosed = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  
  private initForm(): void {
    this.machineForm = this.fb.group({
      id: [this.machine?.id || null],
      name: [this.machine?.name || '', Validators.required],
      description: [this.machine?.description || ''],
      qrCodes: this.fb.array([])
    });
  
    // Si viene con QRs desde backend, los agregamos
    if (this.machine?.qrs?.length) {
      this.machine.qrs.forEach(qr => {
        this.qrCodes.push(this.fb.group({
          name: [qr.name, Validators.required],
          code: [qr.code, Validators.required]
        }));
      });
    }
  }
  
  

  
  addQrCode(): void {
    if (this.qrCodes.length >= 4) {
      alert('Máximo 4 códigos QR permitidos');
      return;
    }
  
    this.qrCodes.push(this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required]
    }));
  
    // Mostrar el nuevo form (último index agregado)
  }
  
  removeQrCode(index: number): void {
    if (this.qrCodes.length <= 1) {
      alert('Debes tener al menos un código QR');
      return;
    }
  
    this.qrCodes.removeAt(index);
  }
  onSubmit(): void {
    if (this.machineForm.invalid) {
      this.machineForm.markAllAsTouched();
      return;
    }
  
    const formValue = this.machineForm.value;
    const machineData: MachineModel = {
      id: formValue.id,
      name: formValue.name,
      description: formValue.description,
      gymId: 1,
      qrs: formValue.qrCodes.map((qr: any) => ({
        name: qr.name,
        code: qr.code
      }))
    };
  
    if (this.machine) {
      this.store.dispatch(MachineActions.updateMachine({ machine: machineData }));
    } else {
      this.store.dispatch(MachineActions.createMachine({ machine: machineData }));
    }
  
    this.closeForm(); // 👈 Ya estás haciendo esto
  }
  
  
  closeForm(): void {
    this.formClosed.emit();
  }
  

  get qrCodes(): FormArray {
    return this.machineForm.get('qrCodes') as FormArray;
  }
  
  getQrFormGroup(index: number): FormGroup {
    return this.qrCodes.at(index) as FormGroup;
  }


startNewQr(): void {
  if (!this.newQrForm && this.qrCodes.length < 4) {
    this.newQrForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required]
    });
  }
}

confirmNewQr(): void {
  if (this.newQrForm?.valid) {
    this.qrCodes.push(this.newQrForm);
    this.newQrForm = null;
  } else {
    this.newQrForm?.markAllAsTouched();
  }
}

cancelNewQr(): void {
  this.newQrForm = null;
}


preventAutoScroll(event: any) {
  // Evita scroll automático al expandir
  event?.target?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
}

}
