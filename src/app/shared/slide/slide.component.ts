import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss']
})
export class SlideComponent {
  constructor(private authService:AuthService, private router: Router,){

  }
  showMenu: boolean = false;

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }
  
  
  exit(){
    this.logout()
    this.router.navigate(['login']);

  }

  logout(): void {
    console.log('logout');
    localStorage.setItem('token', '');
    this.authService.currentUserSig.set(null);
  }

  user(): void {
    this.showMenu = false;
    this.router.navigate(['home/user/table']);
  }

  product(): void {
    this.showMenu = false;
    this.router.navigate(['home/product/table']);
  }

  cart(): void {
    this.showMenu = false;
    this.router.navigate(['home/product/cart']);
  }

  infraestructure(): void {
    this.showMenu = false;
    this.router.navigate(['home/product/infraestructure']);
  }

  settings(): void {
    this.showMenu = false;
    this.router.navigate(['home/camera-video']);
  }

  pointOfSale(): void {
    this.showMenu = false;
    this.router.navigate(['home/administration']);
  } 
  agenda(){
    this.showMenu = false;
    this.router.navigate(['home/agenda']);

  }
}
