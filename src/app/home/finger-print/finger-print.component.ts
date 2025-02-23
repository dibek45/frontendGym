import { Component } from '@angular/core';
////import { CookieService } from 'ngx-cookie-service';
//import { SocketProviderConnect } from 'src/shared/soket.service';
declare const navigator: any;
import { ChangeDetectorRef } from '@angular/core';
import { SpeechService } from '../../shared/speech.service'; // Ajusta la ruta si es necesario


interface BluetoothDevice {
  gatt: BluetoothRemoteGATTServer | null;
  // Añadir otras propiedades necesarias
}

interface BluetoothRemoteGATTServer {
  connect(): Promise<BluetoothRemoteGATTServer>;
  disconnect(): void;
  getPrimaryService(serviceId: string): Promise<BluetoothRemoteGATTService>;
  // Añadir otras propiedades necesarias
}

interface BluetoothRemoteGATTService {
  getCharacteristic(characteristicId: string): Promise<BluetoothRemoteGATTCharacteristic>;
  // Añadir otras propiedades necesarias
}

interface BluetoothRemoteGATTCharacteristic {
  // Añadir propiedades necesarias
}

@Component({
  selector: 'app-finger-print',
  templateUrl: './finger-print.component.html',
  styleUrls: ['./finger-print.component.scss'],
})

export class FingerPrintComponent {

  device: BluetoothDevice | null = null;

  variable: any = {
    res: {
      img: 'ruta/a/tu/imagen.png'
    }
  };

  isConnected: boolean = false;
  private characteristic:any | null = null;
  title = 'socket-front-client';
  user:any;
  user_id:any;
  msg:any;
  input_message:any;
  show_message:any;
  messages=[];

  constructor(private speechService: SpeechService,
   /// protected socketService: SocketProviderConnect,
    private cdr: ChangeDetectorRef){
    
   // socketService.outEven.subscribe((res) => { //escuchar
    //   this.variable=res.res;
    //   this.onSpeech("Acceso correcto, Bienvenido "+this.variable.name)
    // console.log(this.variable);
    // this.encenderApagar(1);

  //});
  }

  ngOnInit() {

    try{
    }catch(e){
      this.show_message = null
    }

    
  }

//   // Función para cambiar el valor de variable
//   cambiarVariable(valor: string) {
//     this.variable = valor;
//   }
//  // // sendData = (event: any) => {
//     this.socketService.emitEvent('messageToServer', {
//       message: "ANGULAR"
//     });
//   }
  

//   // async conectar() {
//   //   try {
//   //     console.log('Solicitando dispositivo Bluetooth...');
//   //     const device = await navigator.bluetooth.requestDevice({
//   //       filters: [{ name: 'ESP32' }],
//   //       optionalServices: ['19b10000-e8f2-537e-4f6c-d104768a1214']
//   //     });

//   //     if (!device) {
//   //       throw new Error('No se seleccionó ningún dispositivo.');
//   //     }

//   //     console.log('Conectando al servidor GATT...');
//   //     const server = await device.gatt.connect();

//   //     if (!server) {
//   //       throw new Error('No se pudo conectar al servidor GATT.');
//   //     }

//   //     console.log('Obteniendo servicio primario...');
//   //     const service = await server.getPrimaryService('19b10000-e8f2-537e-4f6c-d104768a1214');

//   //     if (!service) {
//   //       throw new Error('No se encontró el servicio.');
//   //     }

//   //     console.log('Obteniendo característica...');
//   //     this.characteristic = await service.getCharacteristic('19b10002-e8f2-537e-4f6c-d104768a1214');

//   //     if (!this.characteristic) {
//   //       throw new Error('No se encontró la característica.');
//   //     }

//   //     console.log('Dispositivo conectado y característica lista para usar.');
//   //     this.isConnected = true; // Actualiza el estado de conexión
//   //     this.cdr.detectChanges(); // Forzar la detección de cambios
//   //     const texto = "Conexion establecida Bluetooth";
//   // this.onSpeech(texto);

//   //   } catch (error) {
//   //     console.error('Error en la conexión:', error);
//   //     this.isConnected = false; // Actualiza el estado de conexión
//   //   }
//   // }
  
//   ///async encenderApagar(value: number) {
//     //try {
//       if (!this.characteristic) {
//         throw new Error('No hay dispositivo conectado. Conecta primero.');
//       }

//       const data = new Uint8Array([value]); // Valor para encender
//       console.log('Enviando comando de encendido...');
//       await this.characteristic.writeValue(data);
//       console.log('Comando de encendido enviado correctamente.');

//    // } catch (error) {
//       console.error('Error al encender:', error);
//     //}
//   // }

//   toggleConnection() {
//     if (this.isConnected) {
//       this.desconectar();
//     } else {
//       this.conectar();
//     }
//   }
 

//   async desconectar() {
//     try {
//       if (this.device && this.device.gatt) {
//         console.log('Desconectando del dispositivo Bluetooth...');
//         this.device.gatt.disconnect(); // Intenta desconectar el dispositivo
//         this.isConnected = false;
//         console.log('Desconectado del dispositivo Bluetooth.');
//       } else {
//         console.log('No hay dispositivo conectado para desconectar.');
//       }
//     } catch (error) {
//       console.error('Error al desconectar:', error);
//     }
//   }



//   onSpeech(texto: string) {
//     const message = ` ${texto}`;
//     this.speechService.speak(message);
//   }
// }
}