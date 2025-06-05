import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { LocalEncryptedStorageService } from '../local/services/local-encrypted-storage.service';
import { Subject } from 'rxjs';
import {  CashRegister } from '../state/point-of-sale/cash-register/cash-register.model';

import { MemberModel } from '../core/models/member.interface';
import { ProductModel } from '../core/models/product.interface';
import { SaleModel } from '../state/point-of-sale/cash-register/sale.model';
import { Routine } from '../state/point-of-sale/routines/routines.model';
import { MachineModel } from '../state/machine/machine.model';
import { Sale } from '../state/point-of-sale/sale/sale.model';
import { Casher } from '../state/point-of-sale/casher/cashier.model';
import { ExpenseModel } from '../state/expense/expense.model';
import { ExpenseSyncService } from '../local/tables-sync/expense-sync.service';
import { CheckinModel } from '../state/checkins/checkins.model';
import { SaleSyncService } from '../local/tables-sync/sale-sync.service';
import { CheckinSyncService } from '../local/tables-sync/checkin-sync.service';
import { CashRegisterSyncService } from '../local/tables-sync/cash-register-sync.service';

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
    public cashierUpdated$ = new Subject<Casher>();
    public checkinUpdated$ = new Subject<CheckinModel>(); // importa CheckinModel

public saleUpdated$ = new Subject<Sale>(); // 👈 Importa desde sale/sale.model


  constructor(private localStorage: LocalEncryptedStorageService,
    private expenseSyncService:ExpenseSyncService,
      private salesSyncService: SaleSyncService,
        private checkinSyncService: CheckinSyncService,
        private cashRegisterSyncService:CashRegisterSyncService
 

) {
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
this.onSaleUpdate(); 
this.onCheckinUpdate(); 
this.onExpenseUpdate(); // ✅ Agrega esta línea



    
  }



  sendPing(msg: string) {
    this.socket.emit('ping', msg);
  }

  joinGymRoom(gymId: number) {
    this.socket.emit('joinGym', gymId);
    console.log(`📥 Solicitando unión a la sala: gym-${gymId}`);
  }
onCashRegisterUpdate(callback: (data: CashRegister) => void) {
  this.socket.on('cashRegisterUpdated', (data: CashRegister) => {
    console.log('📡 Evento cashRegisterUpdated recibido:', data);
    callback(data);
  });
}








onCheckinUpdate() {
  this.socket.on('checkinUpdated', (data: CheckinModel) => {
    alert("chekin socket")
    console.log('📡 Evento checkinUpdated recibido:', data);
    this.checkinUpdated$.next(data);

        this.checkinSyncService.handleRemoteUpdate(data); // 👈 esto faltaba

  });
}
onCashRegisterDeleted(callback: (data: { id: number }) => void) {
  this.socket.on('cashRegisterDeleted', callback);
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

onCashierUpdate(callback: (data: Casher) => void) {
    this.socket.on('cashierUpdated', (data) => {
      console.log('📡 Evento cashierUpdated recibido:', data);
      this.cashierUpdated$.next(data);
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

onExpenseUpdate() {
  this.socket.on('expenseUpdated', (data: ExpenseModel) => {
    console.log('📡 Evento expenseUpdated recibido:', data);
    this.expenseUpdated$.next(data);

    // 🔥 Actualiza caché local + store de Redux
    this.expenseSyncService.handleRemoteUpdate(data);
  });
}

onSaleUpdate() {
  this.socket.on('saleUpdated', (data: Sale) => {
    alert('📡 Evento saleUpdated recibido:'+data);
    this.saleUpdated$.next(data);

        this.salesSyncService.handleRemoteUpdate(data); // 👈 esto es lo que faltaba

  });
}

}
