import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { AppState } from './state/app.state';
import { Store } from '@ngrx/store';
import { setUser } from './state/actions/user.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLoginPage: boolean = false;

  constructor(private router: Router, private authService :AuthService,   private store: Store<AppState>,){

  }
  title = 'gym';


  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.isLoginPage = this.router.url === '/login';
    });
    
  
    // Verificar si ya hay un usuario en localStorage
    this.authService.checkUserFromLocalStorage();

    // Si el usuario está autenticado, lo podemos guardar en Redux
    const user:any = this.authService.currentUserSig();  // Obtiene el usuario del signal
    if (user) {
      this.store.dispatch(setUser( user ));
    }

    


  }
}
