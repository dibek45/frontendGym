import { Injectable, signal } from '@angular/core';
import { UserInterface } from './user.interface';
import { SharedService } from '../shared/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private sharedService: SharedService){

  }
  // Signal para gestionar el usuario actual
  currentUserSig = signal<UserInterface | undefined | null>(undefined);

  // Método para verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    this.sharedService.setLoginStatus(true);

    return token !== null && token !== '';  // Devuelve true solo si el token no es null ni una cadena vacía
  }
  // Método para iniciar sesión (aquí podrías agregar la llamada a la API)
  login(user: UserInterface, token: string): void {
    localStorage.setItem('user', JSON.stringify(user));  // Guardar usuario como JSON

    localStorage.setItem('token', token);
    console.log("EL USUARIO DEL TOKEN");
    console.log(user)

    this.currentUserSig.set(user); // Actualiza el signal con el usuario
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('user');

    localStorage.removeItem('token'); // Elimina el token del localStorage
    this.currentUserSig.set(null); // Resetea el usuario a null
  }

  // Método para obtener el token (opcional, si lo necesitas en otras partes)
  getUserFromLocalStorage(): UserInterface | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;  // Devuelve el usuario parseado desde JSON o null si no existe
  }

  // Método para recuperar el usuario y verificar si está en localStorage al iniciar
  checkUserFromLocalStorage(): void {
    const user = this.getUserFromLocalStorage();
    if (user) {
      this.currentUserSig.set(user);  // Actualiza el signal con el usuario si existe
    }
  }


 
}
