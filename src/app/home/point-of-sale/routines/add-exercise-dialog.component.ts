import { DialogModule } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common'; // Importa CommonModule para usar *ngFor y *ngIf
import { FormsModule } from '@angular/forms'; // Para ngModel
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; // Para matInput

@Component({
  selector: 'app-add-exercise-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <h2 mat-dialog-title>Agregar Ejercicio</h2>
    <mat-dialog-content>
      <mat-form-field>
        <mat-label>Nombre del Ejercicio</mat-label>
        <input matInput placeholder="Ejemplo: Pull-ups" [(ngModel)]="exercise.name" name="name" />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Descripción</mat-label>
        <textarea
          matInput
          placeholder="Ejemplo: Realizar dominadas con agarre amplio"
          [(ngModel)]="exercise.description"
          name="description"
        ></textarea>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Enlace (Link)</mat-label>
        <input
          matInput
          placeholder="Ejemplo: https://example.com/ejercicio"
          [(ngModel)]="exercise.link"
          name="link"
        />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Ruta (Path)</mat-label>
        <input
          matInput
          placeholder="Ejemplo: /exercises/back/pull-ups"
          [(ngModel)]="exercise.path"
          name="path"
        />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-button color="primary" (click)="onSave()">Guardar</button>
    </mat-dialog-actions>
  `,
})
export class AddExerciseDialogComponent {
  exercise = { id: Date.now(), name: '', description: '', link: '', path: '' };

  constructor(public dialogRef: MatDialogRef<AddExerciseDialogComponent>) {}

  onSave() {
    this.dialogRef.close(this.exercise);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
