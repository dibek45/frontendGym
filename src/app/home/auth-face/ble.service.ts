// bluetooth.service.ts
import { Injectable } from '@angular/core';
declare const navigator: any;

interface BluetoothDevice {
  gatt: BluetoothRemoteGATTServer | null;
}

interface BluetoothRemoteGATTServer {
  connect(): Promise<BluetoothRemoteGATTServer>;
  disconnect(): void;
  getPrimaryService(serviceId: string): Promise<BluetoothRemoteGATTService>;
}

interface BluetoothRemoteGATTService {
  getCharacteristic(characteristicId: string): Promise<BluetoothRemoteGATTCharacteristic>;
}

interface BluetoothRemoteGATTCharacteristic {
  writeValue(value: Uint8Array): Promise<void>;
}

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {
  private device: BluetoothDevice | null = null;
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;
  public isConnected = false;

  async connect(): Promise<void> {
    try {
      console.log('Solicitando dispositivo Bluetooth...');
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: 'ESP32' }],
        optionalServices: ['19b10000-e8f2-537e-4f6c-d104768a1214']
      });

      if (!device) {
        throw new Error('No se seleccionó ningún dispositivo.');
      }

      console.log('Conectando al servidor GATT...');
      const server = await device.gatt.connect();

      if (!server) {
        throw new Error('No se pudo conectar al servidor GATT.');
      }

      console.log('Obteniendo servicio primario...');
      const service = await server.getPrimaryService('19b10000-e8f2-537e-4f6c-d104768a1214');

      if (!service) {
        throw new Error('No se encontró el servicio.');
      }

      console.log('Obteniendo característica...');
      this.characteristic = await service.getCharacteristic('19b10002-e8f2-537e-4f6c-d104768a1214');

      if (!this.characteristic) {
        throw new Error('No se encontró la característica.');
      }

      console.log('Dispositivo conectado y característica lista para usar.');
      this.isConnected = true;

    } catch (error) {
      console.error('Error en la conexión:', error);
      this.isConnected = false;
    }
  }

  async writeValue(value: number): Promise<void> {
    try {
      if (!this.characteristic) {
        throw new Error('No hay dispositivo conectado. Conecta primero.');
      }

      const data = new Uint8Array([value]);
      console.log('Enviando comando de encendido...');
      await this.characteristic.writeValue(data);
      console.log('Comando de encendido enviado correctamente.');

    } catch (error) {
      console.error('Error al enviar datos:', error);
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.device && this.device.gatt) {
        console.log('Desconectando del dispositivo Bluetooth...');
        this.device.gatt.disconnect();
        this.isConnected = false;
        console.log('Desconectado del dispositivo Bluetooth.');
      } else {
        console.log('No hay dispositivo conectado para desconectar.');
      }
    } catch (error) {
      console.error('Error al desconectar:', error);
    }
  }

  async encenderApagar(value: number) {
    try {
      if (!this.characteristic) {
        throw new Error('No hay dispositivo conectado. Conecta primero.');
      }

      const data = new Uint8Array([value]); // Valor para encender
      console.log('Enviando comando de encendido...');
      await this.characteristic.writeValue(data);
      console.log('Comando de encendido enviado correctamente.');

    } catch (error) {
      console.error('Error al encender:', error);
    }
  }
}
