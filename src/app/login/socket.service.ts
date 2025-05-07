import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('wss://api.dibeksolutions.com', {
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('🟢 Conectado al servidor WebSocket');
    });

    this.socket.on('pong', (data) => {
      console.log('📨 Respuesta del servidor:', data);
    });
  }

  sendPing(msg: string) {
    this.socket.emit('ping', msg);
  }
}
