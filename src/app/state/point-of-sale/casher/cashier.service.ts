import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Cashier } from './cashier.model';

@Injectable({
  providedIn: 'root',
})
export class CashierService {
  private graphqlEndpoint = 'http://localhost:3000/graphql'; // Cambia al endpoint de tu servidor GraphQL

  constructor(private http: HttpClient) {}

  // Crear un nuevo cajero
  createCashier(cashier: Cashier): Observable<Cashier> {
    const mutation = `
      mutation CreateCashier($createCashierInput: CreateCashierDto!) {
        createCashier(createCashierInput: $createCashierInput) {
          id
          name
        }
      }
    `;

    const variables = {
      createCashierInput: {
        name: cashier.name,
        username: cashier.username,
        password: cashier.password,
        phone: cashier.phone,
        gymId: cashier.gymId,
      },
    };

    return this.http
    .post<{ data: { createCashier: Cashier } }>(this.graphqlEndpoint, {
      query: mutation,
      variables,
    })
    .pipe(
      map((response) => {
        console.log('Respuesta del backend:', response); // Agrega esta línea
        return response.data.createCashier;
      }),
      catchError((error) => {
        console.error('Error al crear cajero:', error);
        return throwError(() => new Error('No se pudo crear el cajero.'));
      })
    );
  
  }

  getAllCashiers(gymId: number): Observable<Cashier[]> {
    const query = `
      query Cashier($gymId: Int!) {
  cashiers(gymId: $gymId) {
    id
    name
    username
    email
    phone
    gymId
  }
}
    `;

    const variables = { gymId };

    return this.http
      .post<{ data: { cashier: Cashier[] } }>(this.graphqlEndpoint, {
        query,
        variables,
      })
      .pipe(
        map((response:any) =>{
            console.log(response)
            return response.data.cashiers
            }),
        catchError((error) => {
          console.error('Error al obtener los cajeros:', error);
          return throwError(() => new Error('No se pudieron obtener los cajeros.'));
        })
      );
  }
}
