import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sale-detail-modal',
  standalone: true,
  imports: [MatDialogModule, MatTableModule, MatButtonModule],
  providers: [DatePipe], // 👈 Se agrega para poder usar el pipe 'date'

  templateUrl: './sale-detail-modal.component.html',
})
export class SaleDetailModalComponent {
  dialogRef = inject(MatDialogRef<SaleDetailModalComponent>);
  data = inject(MAT_DIALOG_DATA);

  closeModal(): void {
    this.dialogRef.close();
  }
}
