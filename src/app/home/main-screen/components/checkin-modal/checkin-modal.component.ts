import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
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
  constructor(public dialogRef: MatDialogRef<CheckinModalComponent>) {}

  close() {
    this.dialogRef.close();
  }
}
