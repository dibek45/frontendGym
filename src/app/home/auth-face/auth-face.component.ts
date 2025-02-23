import { Component, OnInit } from '@angular/core';
import { BluetoothService } from './ble.service'; // Asegúrate de que la ruta sea correcta
import { HttpClient } from '@angular/common/http';
import { SpeechService } from '../../shared/speech.service'; // Ajusta la ruta si es necesario
import { FingerprintPersonaService } from 'src/app/shared/fingerprint.service';


interface Response {
  names: any[];
}
@Component({
  selector: 'app-auth-face',
  templateUrl: './auth-face.component.html',
  styleUrls: ['./auth-face.component.scss']
})
export class AuthFaceComponent implements OnInit {
  isConnected: boolean = false;
  showContent: boolean = false; // Nueva bandera para mostrar/ocultar contenido
  showSplash = false;
  numberPart: string="";
  noConocido:string="no hay"

  constructor(private speechService: SpeechService, private bluetoothService: BluetoothService, private http: HttpClient) {}

  ngOnInit() {
    this.showConfirmation();
  }

  ngAfterViewInit() {
    
  }
  showConfirmation() {
    const message = '¿Deseas activar el Bluetooth?';
    const result = window.confirm(message);
    
    if (result) {
      this.conectar();
      console.log('Usuario confirmado.');
    } else {
      console.log('Usuario cancelado.');
      this.showContent=true;
    }
  }

  async conectar() {
    await this.bluetoothService.connect();
    this.isConnected = this.bluetoothService.isConnected;
    this.showContent = true; // Muestra el contenido después de la conexión
  }

  async encenderApagar(value: number) {
    await this.bluetoothService.writeValue(value);
  }

  async desconectar() {
    await this.bluetoothService.disconnect();
    this.isConnected = this.bluetoothService.isConnected;
    this.showContent = false; // Oculta el contenido si se desconecta
  }

  toggleConnection() {
    if (this.isConnected) {
      this.desconectar();
    } else {
      this.conectar();
    }
  }

  async handleFaceDetected(name: string) {
    this.bluetoothService.encenderApagar(1);
  }



  uploadImage(base64Image: string) {
    const jsonPayload = {
      image: base64Image
    };
  
    this.http.post<Response>('http://127.0.0.1:5000/process_image_base64', jsonPayload, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe((response: Response) => {
      console.log('Upload successful', response);
  
      // Acceso al primer objeto en el array `names`
      if (response.names && response.names.length > 0) {
        const nameObject = response.names[0];
  
        // Extraer nombre y número
        const extractedData = this.extractNameAndNumber(nameObject.name);
  
        console.log('Nombre:', extractedData.name); // "David velazquez"
        console.log('Número:', extractedData.number); // "372"
        this.noConocido="conocido";
      } else {
        console.log('No names found in the response.');
        this.noConocido="no reconocido";
        this.onSpeech("Acceso denegado")

      } 
  
    }, error => {
      console.error('Upload error', error);
    });
  }
  

  base64received(image: string): void {
    this.showSplash = true;
    

    setTimeout(() => {
      this.uploadImage(image);
      this.showSplash = false;

    }, 3000); // Tiempo en milisegundos (3 segundos en este ejemplo)
}

 extractNameAndNumber(inputString: string): { name: string, number: string } {
  // Dividir la cadena en partes usando el guion bajo como delimitador
  const parts = inputString.split('_');
  
  // El nombre está en todas las partes menos la última
  const namePart = parts.slice(0, -1).join(' '); // Unir las partes con espacios
  // El número está en la última parte
   this.numberPart = parts[parts.length - 1];
  //alert(namePart)
  //alert(numberPart)
  this.onSpeech("Acceso correcto, Bienvenido "+namePart);
  setTimeout(() => {
    this.bluetoothService.encenderApagar(1);

  }, 3000); // Tiempo en milisegundos (3 segundos en este ejemplo)
  

  return {
    name: namePart,
    number: this.numberPart
  };
}


onSpeech(texto: string) {
  const message = ` ${texto}`;
  this.speechService.speak(message);
}



}



