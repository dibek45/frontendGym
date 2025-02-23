import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root', // Esto asegura que el servicio esté disponible globalmente
})
export class MenuService {
  private menuselectedSubject = new BehaviorSubject<string>('Menu');
  menuselected$ = this.menuselectedSubject.asObservable();

  setMenuselected(value: string) {
    this.menuselectedSubject.next(value);
  }

  getMenuselected(): string {
    return this.menuselectedSubject.value;
  }
}
