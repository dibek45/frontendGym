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
 
  constructor(private router: Router) {
    
    console.log('🟢 Subscribing to cashRegisterUpdated...');

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
        },
        error: (err: any) => {
          console.error('❌ Subscription error:', err);
          alert('Subscription error: ' + err.message);
        },
      });
  }

  route(route:string){
    this.router.navigate([route]);
  }

}