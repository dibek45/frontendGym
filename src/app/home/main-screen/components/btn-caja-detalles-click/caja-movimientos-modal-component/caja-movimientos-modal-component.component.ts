import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-caja-movimientos-modal-component',
  standalone: true,
  imports: [CommonModule,MatIconModule],
  templateUrl: './caja-movimientos-modal-component.component.html',
  styleUrl: './caja-movimientos-modal-component.component.scss'
})
export class CajaMovimientosModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { movimientos: any[] },
  public dialogRef: MatDialogRef<CajaMovimientosModalComponent>
) {}

}
