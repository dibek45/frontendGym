import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { AppState } from '../state/app.state';
import { setUser } from 'src/app/state/user/user.actions';
import { UserInterface } from '../auth/user.interface';
import { jwtDecode } from 'jwt-decode';
import { FingerprintPersonaService } from '../shared/fingerprint.service';
import { environment } from 'src/environment.prod';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = 'david6393@hot';
  password: string = '12345678';
  hidePassword: boolean = true; 
  error: string | null = null;

  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private WebSocketService:FingerprintPersonaService,
 
  ) {}
  ngOnInit(): void {
    this.http.get('https://api.dibeksolutions.com/graphql').subscribe({
      next: (data) => {
        alert(JSON.stringify(data, null, 2));
      },
      error: (err) => {
        console.error('Error al obtener los usuarios:', err);
        alert('Error realupdate: ' + JSON.stringify(err, null, 2));
      }
    });
  }
  

   
  onSubmit(): void {
    console.log('🔹 Nombre de usuario:', this.username);
    console.log('🔹 Contraseña:', this.password);

    const graphqlQuery = {
      query: `
        mutation Login($password: String!, $email: String!) {
          login(password: $password, email: $email)
        }
      `,
      variables: {
        email: this.username,
        password: this.password
      }
    };
alert(environment.apiUrl)
    this.http.post<{ data: { login: string } }>(
      environment.apiUrl,

      graphqlQuery
    ).subscribe(
      (response) => {
        alert(JSON.stringify(response));

        if (!response?.data?.login) { // ✅ Ahora usamos "login" en lugar de "loginmember"
          console.error('❌ Invalid credentials');
          this.error = 'Invalid credentials. Please try again.';
          return;
        }

        console.log('✅ Token received:', response.data.login);

        // 🛠️ Decodificar el token para obtener gymId, id, roll, etc.
        let decodedToken: any;
        try {
          decodedToken = jwtDecode(response.data.login);
          console.log('🔍 Decoded Token:', decodedToken);
        } catch (error) {
          console.error('❌ Error decoding token:', error);
          this.error = 'Authentication error. Please try again later.';
          return;
        }

        // Extraemos gymId del token
        const gymId = decodedToken?.gymId || 0;

        const user: UserInterface = {
          id: decodedToken?.id || 0,
          email: this.username,
          username: this.username,
          gymId: gymId,
          roll: decodedToken?.roll || 0,
          token: response.data.login
        };

        // Dispatch Redux action para guardar el usuario en el estado
        this.store.dispatch(setUser(user));

        // Autenticamos al usuario
        this.authService.login(user, user.token);

        // 🔥 Navegamos a la página donde se listan los miembros
        this.router.navigate(['home/user/table']);
      },
      (error) => {
        alert(JSON.stringify(error));
        this.error = 'Authentication error. Please try again later.';
      }
    );
  }

  compareFingerprints(gymId:number): void {
  
    this.WebSocketService.verifyFingerprint(1).subscribe({
      next: () => {
        alert('Verificación de huellas en progreso...');
      },
      error: (error) => {
       alert( JSON.stringify(error));
      }
    });
  
  }
  
}
