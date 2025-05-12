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
import { apolloClient } from './subscription-client';
import { SyncService } from 'src/app/local/services/sync.service';
import { SocketService } from 'src/app/login/socket.service';
import { CashRegister } from 'src/app/state/point-of-sale/cash-register/cash-register.model';
import { LocalEncryptedStorageService } from 'src/app/local/services/local-encrypted-storage.service';

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
        private localStorage: LocalEncryptedStorageService
  ) {
    
 
  }


  ngOnInit(): void {
alert("subscrito 3.0")

  this.socketService.joinGymRoom(1); // ✅ Se une a sala
  this.listenToCashRegisterUpdates();    // ✅ Escucha evento y guarda
/*
    apolloClient
      .subscribe({
        query: CASH_REGISTER_SUBSCRIPTION,
        variables: {
          gymId: 1,
        },
      })
      .subscribe({
        next: (res: any) => {
          console.log('✅ Subscription fired:', res);
          alert('Caja actualizada: ' + JSON.stringify(res.data));
            this.syncService.syncTableIfNeeded('cashRegisters');

        },
        error: (err: any) => {
          console.error('❌ Subscription error:', err);
          alert('Subscription error: ' + err.message);
        },
      });
*/

this.syncService.syncTableIfNeeded('cashRegisters');

  }


listenToCashRegisterUpdates() {
  this.socketService.onCashRegisterUpdate(async (updatedCashRegister) => {
   alert('📡 Evento recibido: cashRegisterUpdated');

  
  });
}
  route(route:string){
    this.router.navigate([route]);
  }

}