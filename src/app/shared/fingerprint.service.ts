import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { NotificationService } from "./notification.service";
import { SpeechService } from "./speech.service";
import {MatDialog, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { FingerPrintComponent } from "../home/finger-print/finger-print.component";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { loadedHuella } from "../state/actions/huella.actions";
import {  selectItemsList } from "../state/selectors/huella.selectors";
import { huellaStateModel } from "../core/models/huella-state.interface";

@Injectable({
  providedIn: 'root'
})
export class FingerprintPersonaService {

  private socket: WebSocket;
  primera: boolean=true;
  texto: any;
  loading$: Observable<boolean> = new Observable();
  userId$: Observable<any> = new Observable(); // Cambia el tipo a string o null
  userId: number=0;
  constructor(private store: Store,private router: Router,
    public dialog: MatDialog,
    private _notification:NotificationService,
    private speechService: SpeechService) {
    this.socket = new WebSocket('ws://127.0.0.1:2015'); 

    this.socket.onopen = () => {
      console.log('WebSocket conectado');
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket cerrado:', event.reason);
    };

    this.socket.onerror = (error) => {
      console.error('Error de WebSocket:', error);
      console.log('El servicio del lector de huellas dactilares está inactivo.');
    };

    this.socket.onmessage = (event) => {
      try {
        console.log('Received data:', event.data);
        const data = JSON.parse(event.data); 

        if (data.type === 'Capture reader') {
          // Handle capture reader logic here
        } else {
          // Other data handling logic here
        }

        
        if (data.type === 'validate') {
          console.log('Tipo::', data.type);
          const state = data.payload[0].state;


          if (state === "failed 439") {
            this._notification.mostrarSnackbar("No registrado", 'error', "../assets/denegado.png");
            this.speechService.speak("No registrado");
            this.openDialog('200ms', '100ms', 'NO registrado',"Dar de alta usuario");  // Call openDialog

          } else if (state === "complete") {
            if (data.payload[0].available_days <= 0) {
              
              this._notification.mostrarSnackbar("Acceso no permitido", 'warning', "../assets/caution.png");
              this.speechService.speak("membresía no renovada");
              this.openDialog('200ms', '100ms', "Membrecia vencida","Desea renovar membrecia");  // Call openDialog
            } else {
              this._notification.mostrarSnackbar("Acceso", 'success', data.payload[0].img);
              this.speechService.speak("Accesso"+data.payload[0].name);
              console.log(data.payload[0])

            }
          }
        }

        if (data.type === "connection_status") {
          const status = data.payload.status;
          if (status === "connected") {
            console.log("Conexión exitosa con la base de datos PostgreSQL.");
          } else if (status === "failed") {
            console.log("No se pudo conectar a la base de datos PostgreSQL.");
          } else {
            console.log("Estado de conexión desconocido:", status);
          }
        } else {
          console.log("Tipo de mensaje desconocido:", data.type);
        }
      } catch (error) {
        console.error("Error al procesar el mensaje WebSocket:", error);
      }
    };
  }
  
    ngOnInit(){
      
  


    this.userId$.subscribe(id => {
      if (id) {
        
        this.userId=id.userId
        
      }
    });
    }
    
  
  
  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, titulo:string,texto:string): void {
    
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        titulo:titulo,
        texto: this.texto,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result=='si') {
        this.router.navigate(['home/user/new-user']);

      }
    });
  }


  public registerFingerprint( gymId: number,userId:number): Observable<void> {
//alert("USERID:"+userId)
    return new Observable<void>((observer) => {
      console.log("gymId:" + gymId);
      console.log(gymId);
      this.socket.send(JSON.stringify({
        type: 'register',
        userId: userId,
        gymId: gymId
      }));
  
      // Manejo de respuesta del servidor
      this.socket.onmessage = (event) => {
        try {
          console.log(JSON.parse(event.data))
          const data = JSON.parse(event.data);
          if (data.type === 'register_success') {
            observer.next();
            observer.complete();
          } else {
            observer.next();
            observer.complete();
          }
          this.store.dispatch(loadedHuella({id:data.payload[0].enrroller} ));

          if (data.type =='register' && data.payload[0].state=="Complete") {
  

          }
  
        } catch (e) {
          observer.error(e);
        }
      };
  
      this.socket.onerror = (error) => {
        observer.error(error);
      };
  
      this.socket.onclose = () => {
      };
    });
  }
  
 

  // Método para verificar la huella dactilar
  public verifyFingerprint(gymId:number): Observable<void> {
    return new Observable<void>((observer) => {
      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({
          type: 'validate',
          gymId:gymId,
          userId:0
        }));
        observer.next();
        observer.complete();
      } else {
        observer.error(new Error('WebSocket no está abierto.'));
      }
    });
  }

  
}
