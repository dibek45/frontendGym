import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-last-checkin-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './last-checkin-modal.component.ts.component.html',
  styleUrl: './last-checkin-modal.component.ts.component.scss'
})
export class LastCheckinModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
