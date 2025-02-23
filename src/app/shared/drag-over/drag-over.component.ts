import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-drag-over',
  templateUrl: './drag-over.component.html',
  styleUrls: ['./drag-over.component.scss'],
  standalone:true,
  imports:[CommonModule,MatIconModule]
})
export class DragOverComponent {

  @Output() imageDropped = new EventEmitter<string | ArrayBuffer | null>(); // Emite la imagen en Base64 o URL

  isDragging = false;

  constructor() {}

  // Cuando el archivo se arrastra sobre el área
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true; // Cambia el estado de "arrastrando"
  }

  // Cuando el archivo se sale del área de arrastre
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false; // Cambia el estado de "no arrastrando"
  }

  // Cuando el archivo se suelta dentro del área
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false; // Se ha soltado el archivo, entonces quitamos el estado de "arrastrando"

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0]; // Tomar solo el primer archivo
      this.convertFileToBase64(file); // Convertir la imagen a Base64
    }
  }

  // Convierte el archivo a Base64 y emite el resultado
  private convertFileToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageDropped.emit(reader.result); // Emite la imagen en Base64
    };
    reader.readAsDataURL(file);
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageDropped.emit(reader.result); // Emite la imagen en Base64
      };
      reader.readAsDataURL(file); // Convierte el archivo a Base64
    }
  }
}
