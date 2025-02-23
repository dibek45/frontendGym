import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-category-modal',
  template: `
    <h2 mat-dialog-title>Agregar Nueva Categoría</h2>

    <mat-dialog-content>
      <form [formGroup]="categoryForm">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Nombre de la Categoría</mat-label>
          <input matInput formControlName="name" placeholder="Ejemplo: Deportes">
          <mat-error *ngIf="categoryForm.get('name')?.invalid && categoryForm.get('name')?.touched">
            El nombre de la categoría es obligatorio
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" [disabled]="categoryForm.invalid" (click)="onSave()">Guardar</button>
      <button mat-button (click)="onCancel()">Cancelar</button>

    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class AddCategoryModalComponent {
  categoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddCategoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSave(): void {
    if (this.categoryForm.valid) {
      this.dialogRef.close(this.categoryForm.value); // Envía los datos al componente principal
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // Cierra el modal sin hacer nada
  }
}
