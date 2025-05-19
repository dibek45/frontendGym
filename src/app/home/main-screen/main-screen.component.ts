import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NormalizedCacheObject } from '@apollo/client/cache';
import { ApolloClient } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { createApollo } from 'src/app/apollo.config';
import { gql } from '@apollo/client/core';
import { SyncService } from 'src/app/local/services/sync.service';
import { SocketService } from 'src/app/login/socket.service';
import { CashRegister } from 'src/app/state/point-of-sale/cash-register/cash-register.model';
import { LocalEncryptedStorageService } from 'src/app/local/services/local-encrypted-storage.service';
import { CashRegisterSyncService } from 'src/app/local/tables-sync/cash-register-sync.service';
import { MemberSyncService } from 'src/app/local/tables-sync/member-sync.service';
import { ProductSyncService } from 'src/app/local/tables-sync/product-sync.service';
import { CashierSyncService } from 'src/app/local/tables-sync/cashier-sync.service';
import { Store } from '@ngrx/store';
import { CashRegisterActions } from 'src/app/state/point-of-sale/cash-register/cash-register.actions';
import { CashRegisterService } from 'src/app/state/point-of-sale/cash-register/cash-register.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SmartSearchComponent } from 'src/app/shared/search/smart-search/smart-search.component';

const CASH_REGISTER_SUBSCRIPTION = gql`
  subscription Subscription($gymId: Int!) {
    cashRegisterUpdated(gymId: $gymId) {
      id
    }
  }
`;

@Component({
  selector: 'app-main-screen',
  standalone: true,
  imports: [CommonModule,MatIconModule,HttpClientModule,   CommonModule,
    MatDialogModule],
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss'],


})
export class MainScreenComponent {
 

  public currentBalance: number = 0;


  constructor(private router: Router, private syncService:SyncService,   
     private socketService: SocketService,
        private localStorage: LocalEncryptedStorageService,
       private cashRegisterSyncService: CashRegisterSyncService,
       private memberSyncService:MemberSyncService,
       private productSyncService:ProductSyncService,
       private cashierSyncService: CashierSyncService,
       private store:Store,
       private cashRegisterService:CashRegisterService,
       private dialog: MatDialog

  ) {
    
 
  }


  ngOnInit(): void {

  this.socketService.joinGymRoom(1); // ✅ Se une a sala
  this.listenToCashRegisterUpdates();    // ✅ Escucha evento y guarda
  this.listenProductUpdates();
  this.listenToCashRegisterDeletes();
  

this.listenUserUpdates();
this.syncService.syncAllTablesOnStartup(); // 🔁 esto sincroniza cashRegisters, members, etc.
this.cashRegisterService.getCashRegistersWithCache().then(cajas => {
  this.store.dispatch(CashRegisterActions.loadCashRegistersSuccess({ cashRegisters: cajas }));
  console.log('✅ Cajas despachadas a Redux en el arranque:', cajas);
});

 this.localStorage.loadIdentity().then(identity => {
    if (!identity) return;

    const { userId, gymId } = identity;

    this.localStorage.loadTableFromLocalCache<CashRegister>(userId, gymId, 'cashRegisters')
      .then(cajas => {
        console.log('📦 Cajas locales cargadas en ngOnInit:', cajas || []);
      });
  });

  this.localStorage.loadIdentity().then(identity => {
  if (!identity) return;

  const { userId, gymId } = identity;

  this.localStorage.loadTableFromLocalCache<CashRegister>(userId, gymId, 'cashRegisters')
    .then(cajas => {
      console.log('📦 Cajas locales cargadas en ngOnInit:', cajas || []);

      const cajaAbierta = (cajas || []).find(c => c.status === 'open');
      this.currentBalance = cajaAbierta?.currentBalance || 0;
    });
});

this.traerCaja()

  }


  traerCaja(){
    this.localStorage.loadIdentity().then(identity => {
  if (!identity) return;

  const { userId, gymId } = identity;

  this.localStorage.loadTableFromLocalCache<CashRegister>(userId, gymId, 'cashRegisters')
    .then(cajas => {
      console.log('📦 Cajas locales cargadas en ngOnInit:', cajas || []);

      const cajaAbierta = (cajas || []).find(c => c.status === 'open');
      this.currentBalance = cajaAbierta?.currentBalance || 0;
    });
});

  }
listenUserUpdates(){
  this.socketService.onMemberUpdate((member) => {
  console.log('📡 Evento recibido: memberUpdated', member);
  this.memberSyncService.handleRemoteUpdate(member); // si ya usas esto
});

}

listenToCashRegisterDeletes() {
  this.socketService.onCashRegisterDeleted((payload) => {
    console.log('🗑️ Evento recibido: cashRegisterDeleted', payload);
    this.cashRegisterSyncService.removeFromLocal(payload.id);
  });
}

listenProductUpdates(){
  this.socketService.onProductUpdate((product) => {
  this.productSyncService.handleRemoteUpdate(product);
});
}


listenToCashRegisterUpdates() {
  this.socketService.onCashRegisterUpdate(async (updatedCashRegister) => {
    console.log('📡 Evento recibido: cashRegisterUpdated', updatedCashRegister);

    // Sincroniza y guarda en caché
    await this.cashRegisterSyncService.handleRemoteUpdate(updatedCashRegister);

    // Carga el caché actualizado
    const identity = await this.localStorage.loadIdentity();
    if (!identity) return;

    const { userId, gymId } = identity;

    const updatedList = await this.localStorage.loadTableFromLocalCache<CashRegister>(
      userId,
      gymId,
      'cashRegisters'
    ) || [];

    // ✅ Muestra en consola las cajas locales
    console.log("777777777777777777777777777777777777");
    console.log('📦 Cajas locales desde caché:', updatedList);
this.currentBalance = updatedList.find(c => c.status === 'open')?.currentBalance || 0;

    // Actualiza el store de Redux
    this.store.dispatch(
      CashRegisterActions.loadCashRegistersSuccess({ cashRegisters: updatedList })
    );

    console.log('✅ Cajas locales actualizadas en Redux después de socket');
  });
}



listenCashierUpdates() {
  this.socketService.onCashierUpdate((cashier) => {
    this.cashierSyncService.handleRemoteUpdate(cashier);
  });
}
  route(route:string){
    this.router.navigate([route]);
  }

abrirRenovacion() {
    this.dialog.open(SmartSearchComponent, {
    width: '100vw',
    height: '100vh',
    maxWidth: '100vw',
    panelClass: 'full-screen-dialog',
    data: { modo: 'miembro' }   // 👈 aquí está el truco
  }).afterClosed().subscribe(res => {
    if (res) {
    //  this.procesarRenovacion(res);
    }
  });
}


  renovar(membresia: any) {
    console.log('Renovando a:', membresia);
    // lógica de renovación
  }

  abrirBusquedaGeneral(tipo: 'membresia' | 'rutina' | 'nota') {
  const dialogRef = this.dialog.open(SmartSearchComponent, {
    width: '100vw',
    height: '100vh',
    maxWidth: '100vw',
    panelClass: 'full-screen-dialog',
    data: { type: tipo }
  });

  dialogRef.afterClosed().subscribe(resultado => {
    if (resultado) {
      console.log('Seleccionado:', resultado);
      // Aquí haces lo que corresponda según el tipo
    }
  });
}

 openSearchModal() {
    this.dialog.open(SmartSearchComponent, {
      width: '100%',
      maxWidth: '100%',
      height: '100vh',
      panelClass: 'full-screen-modal',
      data: { modo: 'general' } // o 'miembro', según tu uso
    });
  }
}