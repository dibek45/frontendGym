import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { NotificationService } from "./notification.service";
import { SpeechService } from "./speech.service";
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { loadedHuella } from "../state/actions/huella.actions";

@Injectable({
  providedIn: 'root'
})
export class FingerprintPersonaService {

  private socket: WebSocket | null = null;
  private reconnectInterval = 5000;

  // 🔔 Subject para notificar que una huella ha sido registrada con éxito
  private huellaRegistradaSubject = new Subject<void>();
  public huellaRegistrada$ = this.huellaRegistradaSubject.asObservable();

  // 🧮 Contador de capturas de huellas
  private contadorHuella: number = 0;

  // 🔔 Subject para notificar el progreso de capturas (1, 2, 3, 4)
  private contadorHuellaSubject = new Subject<number>();
  public contadorHuella$ = this.contadorHuellaSubject.asObservable();

  constructor(
    private store: Store,
    private router: Router,
    public dialog: MatDialog,
    private _notification: NotificationService,
    private speechService: SpeechService
  ) {
   // this.setupWebSocket();
  }

  private setupWebSocket(): void {
    if (this.socket) {
      this.socket.close();
    }

    this.socket = new WebSocket('ws://127.0.0.1:2015');

    this.socket.onopen = () => {
      console.log("✅ WebSocket conectado correctamente.");
    };

    this.socket.onerror = (error) => {
      console.error("❌ Error de WebSocket:", error);
    };

    this.socket.onclose = () => {
      console.warn("⚠ WebSocket cerrado. Intentando reconectar en 5 segundos...");
      setTimeout(() => this.setupWebSocket(), this.reconnectInterval);
    };

    this.socket.onmessage = (event) => {
      try {
        console.log('📩 Mensaje recibido:', event.data);
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'validate':
            this.handleValidateResponse(data);
            break;

          case 'register_success':
            console.log("✅ Registro exitoso desde WebSocket:", data);
            this.store.dispatch(loadedHuella({ id: data.payload[0].enrroller }));
            this.huellaRegistradaSubject.next();
            break;

          case 'register':
            this.handleRegisterResponse(data);
            break;

          case "connection_status":
            if (data.payload.status === "connected") {
              console.log("✅ Conexión a DB exitosa");
            } else {
              console.log("❌ No se pudo conectar a la base de datos.");
            }
            break;

          default:
            console.log("⚠ Tipo de mensaje desconocido:", data.type);
            break;
        }

      } catch (error) {
        console.error("❌ Error al procesar el mensaje WebSocket:", error);
      }
    };
  }

  /**
   * 📌 Manejar los mensajes 'register' y actualizar el progreso de huellas.
   */
  private handleRegisterResponse(data: any): void {
    console.log("🔔 Mensaje tipo 'register' recibido:", data);

    const payload = data.payload[0];
    const state = payload.state;
    const enrroller = parseInt(payload.enrroller); // Asegúrate que es número

    if (state === "procces") {
      const totalCaptures = 4;
      const currentCapture = totalCaptures - enrroller;

      this.contadorHuella = currentCapture;
      console.log(`🆙 Progreso de huellas: ${this.contadorHuella} / ${totalCaptures}`);

      // Emitimos el contador actualizado a los componentes
      this.contadorHuellaSubject.next(this.contadorHuella);
    }

    if (state === "complete") {
      this.contadorHuella = 4;
      console.log("🎉 Registro completo. Total huellas: 4 / 4");

      this.contadorHuellaSubject.next(this.contadorHuella);
      // Aquí podrías lanzar un evento para habilitar el siguiente paso
    }
  }

  private handleValidateResponse(data: any) {
    console.log('🔍 Validación de huella recibida:', data);

    const state = data.payload[0].state;

    if (state === "failed 439") {
      this._notification.mostrarSnackbar("No registrado", 'error', "../assets/denegado.png");
      this.speechService.speak("No registrado");
      this.openDialog('200ms', '100ms', 'NO registrado', "Dar de alta usuario");

    } else if (state === "complete") {
      if (data.payload[0].available_days <= 0) {
        this._notification.mostrarSnackbar("Acceso no permitido", 'warning', "../assets/caution.png");
        this.speechService.speak("Membresía no renovada");
        this.openDialog('200ms', '100ms', "Membresía vencida", "¿Desea renovar membresía?");
      } else {
        this._notification.mostrarSnackbar("Acceso", 'success', data.payload[0].img);
        this.speechService.speak("Acceso permitido a " + data.payload[0].name);
      }
    }
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, titulo: string, texto: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { titulo, texto }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'si') {
        this.router.navigate(['home/user/new-user']);
      }
    });
  }

  public registerFingerprint(gymId: number, userId: number): Observable<void> {
    return new Observable<void>((observer) => {
      console.log("📡 Intentando registrar huella...");
      console.log("Estado actual del WebSocket:", this.socket?.readyState);

      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        console.error("🚫 WebSocket no está abierto. No se enviará la solicitud.");
        observer.error(new Error("🚫 WebSocket no está abierto."));
        return;
      }

      console.log("✅ WebSocket está abierto. Enviando solicitud...");
      this.socket.send(JSON.stringify({ type: 'register', userId, gymId }));

      observer.next();
      observer.complete();
    });
  }

  public verifyFingerprint(gymId: number): Observable<void> {
    return new Observable<void>((observer) => {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        console.warn("⚠ WebSocket aún está conectando. Esperando...");
        this.waitForOpenWebSocket(() => {
          this.sendFingerprintRequest(observer, gymId);
        });
      } else {
        this.sendFingerprintRequest(observer, gymId);
      }
    });
  }

  private waitForOpenWebSocket(callback: () => void): void {
    const checkInterval = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        clearInterval(checkInterval);
        callback();
      }
    }, 500);
  }

  private sendFingerprintRequest(observer: any, gymId: number) {
    console.log("✅ Enviando solicitud de verificación...");
    this.socket!.send(JSON.stringify({ type: 'validate', gymId, userId: 0 }));
    observer.next();
    observer.complete();
  }

}
