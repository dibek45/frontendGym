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
import { SocketService } from './socket.service';
import { LocalEncryptedStorageService } from '../local/services/local-encrypted-storage.service';
import { PrinterService } from '../printer.service';
import { CartService } from '../state/point-of-sale/cart/cart.service';
  import QRCode from 'qrcode'; // Asegúrate de tener esto en tu imports

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = 'david@gmail.com';
  password: string = '12345678';
  hidePassword: boolean = true; 
  error: string | null = null;

  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private WebSocketService: FingerprintPersonaService,
    private localStorage: LocalEncryptedStorageService, // ✅ Inyectado
     private printerService: PrinterService,
         private cartService: CartService,
  ) {}

  async ngOnInit(): Promise<void> {
    alert("ONinit")
await this.printerService.connectToPrinter();

await this.printerService.printQRAndNombre(
  'https://ejemplo.com/cliente/123',
  'grande', // o 'chico'
  'Juan Pérez'
);

  //  alert(window.innerWidth);
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

    this.http.post<{ data: { login: string } }>(
      environment.apiUrl,
      graphqlQuery
    ).subscribe(
      async (response) => {
        if (!response?.data?.login) {
          console.error('❌ Invalid credentials');
          this.error = 'Invalid credentials. Please try again.';
          return;
        }

        console.log('✅ Token received:', response.data.login);

        // Decodificar el token
        let decodedToken: any;
        try {
          decodedToken = jwtDecode(response.data.login);
          console.log('🔍 Decoded Token:', decodedToken);
        } catch (error) {
          console.error('❌ Error decoding token:', error);
          this.error = 'Authentication error. Please try again later.';
          return;
        }

        const gymId = decodedToken?.gymId || 0;

        const user: UserInterface = {
          id: decodedToken?.id || 0,
          email: this.username,
          username: this.username,
          gymId: gymId,
          roll: decodedToken?.roll || 0,
          token: response.data.login
        };

        // ✅ Guardar en Redux
        this.store.dispatch(setUser(user));
// ✅ Guardar encriptado local
await this.localStorage.saveIdentity({
  userId: user.id,
  gymId: user.gymId,
  username: user.username
});

// ✅ Confirmación visual
alert(`🟢 Identity guardado:\nUsuario: ${user.username}\nGym ID: ${user.gymId}`);


        // ✅ Autenticación interna
        this.authService.login(user, user.token);

        // ✅ Navegación
        this.router.navigate(['home/main-screen']);
      },
      (error) => {
        alert(JSON.stringify(error));
        this.error = 'Authentication error. Please try again later.';
      }
    );
  }

  compareFingerprints(gymId: number): void {
    this.WebSocketService.verifyFingerprint(1).subscribe({
      next: () => {
        alert('Verificación de huellas en progreso...');
      },
      error: (error) => {
        alert(JSON.stringify(error));
      }
    });
  }

  async imprimirQrFake() {
    alert("aqui")
    const gymName = 'Mi Gym Ficticio';
    const clientName = 'Juan Pérez';
    const membershipDuration = '1 mes';
    const renewalDate = new Date().toLocaleDateString();
  
    const qrContenido = `https://tiempo.com.mx/m/${clientName.replace(' ', '_')}`;
  
    try {
      const base64QR = await QRCode.toDataURL(qrContenido, { width: 200 });
      this.cartService.img = base64QR;
  
      // 👇 Conexión a la impresora ANTES de imprimir
      await this.printerService.connectToPrinter();
  
      // 👇 Imprimir con QR
      await this.printerService.printTicketWithQR(
        gymName,
        clientName,
        membershipDuration,
        renewalDate
      );
    } catch (err) {
      console.error('❌ Error durante impresión con QR:', err);
    }
  }

  // login.component.ts
async onPrintQR() {
  const gymName = 'Mi Gym Ficticio';
  const clientName = 'Juan Pérez';
  const membershipDuration = '1 mes';
  const renewalDate = new Date().toLocaleDateString();
  const qrContenido = `https://tiempo.com.mx/m/${clientName.replace(' ', '_')}`;

  try {
    const base64QR = await QRCode.toDataURL(qrContenido, { width: 200 });
    this.cartService.img = base64QR;

    await this.printerService.connectToPrinter(); // ✅ ahora sí con gesto de usuario
    await this.printerService.printTicketWithQR(
      gymName,
      clientName,
      membershipDuration,
      renewalDate
    );
  } catch (err) {
    console.error('❌ Error durante impresión con QR:', err);
  }
}

}
