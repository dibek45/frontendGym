interface BluetoothDevice {
    gatt?: BluetoothRemoteGATTServer;
  }
  
  interface BluetoothRemoteGATTServer {
    connected: BluetoothRemoteGATTServer | null;
    connect(): Promise<BluetoothRemoteGATTServer>;
    getPrimaryService(serviceUUID: string | number): Promise<BluetoothRemoteGATTService>;
  }
  
  interface BluetoothRemoteGATTService {
    getCharacteristic(characteristicUUID: string | number): Promise<BluetoothRemoteGATTCharacteristic>;
  }
  
  interface BluetoothRemoteGATTCharacteristic {
    writeValue(value: BufferSource): Promise<void>;
  }
  
  interface Bluetooth {
    requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>;
  }
  
  interface RequestDeviceOptions {
    filters?: Array<{ services: Array<string> }>;
    acceptAllDevices?: boolean;
    optionalServices?: Array<string>;
  }
  
  interface Navigator {
    bluetooth: Bluetooth;
  }
  interface BluetoothDevice {
    name?: string;
  }
  