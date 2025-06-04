import { Component, Inject, Input, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CheckinListComponent } from '../checkin-list/checkin-list.component'; // ajusta la ruta
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-checkin-modal',
  standalone: true,
  imports: [CommonModule, CheckinListComponent,MatIconModule],
  templateUrl: './checkin-modal.component.html',
  styleUrls: ['./checkin-modal.component.scss']
})
export class CheckinModalComponent {
selectedDate: Date | null = null;

  constructor(
    public dialogRef: MatDialogRef<CheckinModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { selectedDate?: Date } | null
  ) {
this.selectedDate = data?.selectedDate ?? null;
  }

  close() {
    this.dialogRef.close();
  }

}
