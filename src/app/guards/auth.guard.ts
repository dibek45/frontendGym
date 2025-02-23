import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;  // Si está autenticado, permite el acceso
    } else {
      this.router.navigate(['/login']);  // Si no está autenticado, redirige al login
      return false;  // Bloquea el acceso
    }
  }
}
