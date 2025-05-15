import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { LocalEncryptedStorageService } from '../local/services/local-encrypted-storage.service';
import { Subject } from 'rxjs';
import {  CashRegister } from '../state/point-of-sale/cash-register/cash-register.model';

import { MemberModel } from '../core/models/member.interface';
import { ProductModel } from '../core/models/product.interface';
import { ExpenseModel } from '../home/point-of-sale/expenses/expenses.component';
import { SaleModel } from '../state/point-of-sale/cash-register/sale.model';
import { Routine } from '../state/point-of-sale/routines/routines.model';
import { MachineModel } from '../state/machine/machine.model';
import { Sale } from '../state/point-of-sale/sale/sale.model';
import { Casher } from '../state/point-of-sale/casher/cashier.model';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private gymId: number | null = null;
  cashRegisterUpdated$ = new Subject<CashRegister>();
  memberUpdated$ = new Subject<MemberModel>();
  productUpdated$ = new Subject<ProductModel>();
  public expenseUpdated$ = new Subject<ExpenseModel>();
  public casherUpdated$ = new Subject<Casher>();
  public routineUpdated$ = new Subject<Routine>();
  public machineUpdated$ = new Subject<MachineModel>();
public saleUpdated$ = new Subject<Sale>(); // 👈 Importa desde sale/sale.model


  constructor(private localStorage: LocalEncryptedStorageService) {
    this.socket = io('wss://api.dibeksolutions.com', {
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('🟢 Conectado al servidor WebSocket');
      this.loadGymId(); // ✅ Cargar gymId desde identidad
    });

    this.socket.on('pong', (data) => {
      console.log('📨 Respuesta del servidor:', data);
    });

    
  }



  sendPing(msg: string) {
    this.socket.emit('ping', msg);
  }

  joinGymRoom(gymId: number) {
    this.socket.emit('joinGym', gymId);
    console.log(`📥 Solicitando unión a la sala: gym-${gymId}`);
  }

  onCashRegisterUpdate(callback: (data: any) => void) {
    this.socket.on('cashRegisterUpdated', callback);
  }


  onMemberUpdate(callback: (data: MemberModel) => void) {
  this.socket.on('memberUpdated', (data) => {
        console.log('📡 Evento memberUpdated recibido:', data); // <- este debe salir

    this.memberUpdated$.next(data); // si quieres usar .subscribe()
    callback(data); // si usas directo como en cashRegister
     });
  }

onProductUpdate(callback: (data: ProductModel) => void) {
  this.socket.on('productUpdated', (data) => {
    console.log('📡 Evento productUpdated recibido:', data);
    this.productUpdated$.next(data);
    callback(data);
  });
}






  async loadGymId() {
    const identity = await this.localStorage.loadIdentity();
    if (identity?.gymId) {
      this.gymId = identity.gymId;
      console.log('🏋️‍♂️ ID de gimnasio detectado en socket:', this.gymId);
    }
  }

 
}
