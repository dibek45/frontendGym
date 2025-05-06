import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NormalizedCacheObject } from '@apollo/client/cache';
import { ApolloClient } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { gql } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { provideApollo } from 'apollo-angular';
import { createApollo } from 'src/app/apollo.config';
@Component({
  selector: 'app-main-screen',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss'],
  providers: [
    provideApollo(() => createApollo(inject(HttpLink))),
  ],

})
export class MainScreenComponent {
 
constructor(private router: Router, private apollo: Apollo) {

  console.log(this.apollo.client.link);

  console.log("**********************************")
  this.apollo.subscribe({
    query: gql`
      subscription OnCashRegisterUpdated($gymId: Int!) {
        cashRegisterUpdated(gymId: $gymId) {
          id
          currentBalance
        }
      }
    `,
    variables: { gymId: 1 }, // ← usa el gymId real si es dinámico
  }).subscribe({
    next: (response: any) => {
      console.log('📡 Suscripción recibida:', response);
      // Aquí puedes despachar a Redux o actualizar algo si quieres
    },
    error: (err:any) => {
      console.error('❌ Error en suscripción:', err);
    }
  });
}

  route(route:string){
    this.router.navigate([route]);
  }
}


