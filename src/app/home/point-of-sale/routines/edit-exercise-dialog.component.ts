import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-exercise-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title>Editar Ejercicio</h2>
    <mat-dialog-content>
      <mat-form-field>
        <mat-label>Nombre del Ejercicio</mat-label>
        <input
          matInput
          placeholder="Ejemplo: Pull-ups"
          [(ngModel)]="exercise.name"
          name="name"
        />
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
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class EditExerciseDialogComponent {
  exercise = { id: 0, name: '', description: '', link: '', path: '' };

  constructor(
    public dialogRef: MatDialogRef<EditExerciseDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { id: number; name: string; description: string; link: string; path: string }
  ) {
    // Inicializa el formulario con los datos del ejercicio recibido
    this.exercise = { ...data };
  }

  onSave() {
    this.dialogRef.close(this.exercise); // Devuelve los datos actualizados
  }

  onCancel() {
    this.dialogRef.close(); // Cierra sin hacer cambios
  }
}
