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
  imports: [MatIconModule,HttpClientModule],
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss'],


})
export class MainScreenComponent {
 
  constructor(private router: Router, private syncService:SyncService,   
     private socketService: SocketService,
        private localStorage: LocalEncryptedStorageService,
       private cashRegisterSyncService: CashRegisterSyncService,
       private memberSyncService:MemberSyncService,
       private productSyncService:ProductSyncService
  ) {
    
 
  }


  ngOnInit(): void {
  alert("subscrito 4.0")

  this.socketService.joinGymRoom(1); // ✅ Se une a sala
  this.listenToCashRegisterUpdates();    // ✅ Escucha evento y guarda
  this.listenProductUpdates();

this.listenUserUpdates();
this.syncService.syncAllTablesOnStartup(); // 🔁 esto sincroniza cashRegisters, members, etc.

  }

listenUserUpdates(){
  this.socketService.onMemberUpdate((member) => {
  console.log('📡 Evento recibido: memberUpdated', member);
  this.memberSyncService.handleRemoteUpdate(member); // si ya usas esto
});

}


listenProductUpdates(){
  this.socketService.onProductUpdate((product) => {
  this.productSyncService.handleRemoteUpdate(product);
});
}
listenToCashRegisterUpdates() {
  this.socketService.onCashRegisterUpdate(async (updatedCashRegister) => {
   console.log('📡 Evento recibido: cashRegisterUpdated'+updatedCashRegister);
  this.cashRegisterSyncService.handleRemoteUpdate(updatedCashRegister);

  
  });
}
  route(route:string){
    this.router.navigate([route]);
  }

}