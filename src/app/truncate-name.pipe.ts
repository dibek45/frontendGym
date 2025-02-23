import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateName',
  standalone: true
})
export class TruncateNamePipe implements PipeTransform {
  transform(value: string | undefined, maxLength: number = 10): string {
    if (!value || value.trim() === '') {
      return 'Sin apellido'; // Caso: Vacío o solo espacios
    }
    const words = value.trim().split(' '); // Divide el string en palabras
    if (words.length === 1) {
      return `${value} Sin apellido`; // Caso: Solo una palabra
    }
    if (value.length > maxLength) {
      return value.substring(0, maxLength) + '...'; // Caso: Truncar
    }
    return value; // Caso: Dentro del límite
  }
}
