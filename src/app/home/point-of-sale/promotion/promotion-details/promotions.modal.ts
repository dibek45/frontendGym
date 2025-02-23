import { DialogModule } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common'; // For *ngFor and *ngIf
import { FormsModule } from '@angular/forms'; // For ngModel
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; // For matInput

@Component({
  selector: 'app-add-promotion-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ promotion.id ? 'Edit Promotion' : 'Add Promotion' }}</h2>
    <mat-dialog-content>
      <mat-form-field>
        <mat-label>Name</mat-label>
        <input
          matInput
          placeholder="Enter promotion name"
          [(ngModel)]="promotion.name"
          name="name"
          required
        />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Description</mat-label>
        <textarea
          matInput
          placeholder="Enter promotion description"
          [(ngModel)]="promotion.description"
          name="description"
          required
        ></textarea>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Price</mat-label>
        <input
          matInput
          type="number"
          placeholder="Enter promotion price"
          [(ngModel)]="promotion.price"
          name="price"
          required
        />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Start Date</mat-label>
        <input
          matInput
          type="date"
          [(ngModel)]="promotion.startDate"
          name="startDate"
          required
        />
      </mat-form-field>

      <mat-form-field>
        <mat-label>End Date</mat-label>
        <input
          matInput
          type="date"
          [(ngModel)]="promotion.endDate"
          name="endDate"
        />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Image URL</mat-label>
        <input
          matInput
          placeholder="Enter image URL for promotion"
          [(ngModel)]="promotion.img"
          name="img"
        />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button
        mat-button
        color="primary"
        (click)="onSave()"
        [disabled]="!promotion.name || !promotion.price || !promotion.startDate"
      >
        Save
      </button>
    </mat-dialog-actions>
  `,
})
export class AddPromotionComponent {
  promotion = {
    id: null, // Set to `null` for new promotions; for edits, populate with existing ID
    name: '',
    description: '',
    price: null,
    startDate: '',
    endDate: '',
    img: '',
  };

  constructor(public dialogRef: MatDialogRef<AddPromotionComponent>) {}

  onSave() {
    // Close dialog and return the promotion data
    this.dialogRef.close(this.promotion);
  }

  onCancel() {
    // Close dialog without returning data
    this.dialogRef.close();
  }
}
