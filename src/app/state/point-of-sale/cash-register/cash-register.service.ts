import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CashRegister } from './cash-register.model';
import { CashMovement } from '../cash-movement/cash-movement.model';
import { Sale } from './sale.model';
import { CashRegisterActions } from './cash-register.actions';
import { Store } from '@ngrx/store';
import { selectAllCashRegisters } from './cash-register.selectors';

@Injectable({
  providedIn: 'root',
})
export class CashRegisterService {
  private graphqlEndpoint = 'http://localhost:3000/GRAPHQL'; // Cambia al endpoint de tu servidor GraphQL

  cashRegisters$: Observable<CashRegister[]>; // Observable para las cajas registradoras

  constructor(private http: HttpClient, private store: Store) {
    // Seleccionar cajas registradoras del estado
    this.cashRegisters$ = this.store.select(selectAllCashRegisters);
  }



  getCashRegistersByGym(gymId: number): Observable<any[]> {
    const query = `
      query GetMovementsByCashRegister($gymId: Int) {
        getAllCashRegisters(gymId: $gymId) {
          id
          cashierId
          openingBalance
          currentBalance
          movements {
            id
            amount
            type
          }
          status
          openingTime
          gym {
            id
            name
          }
          gymId
          cashier {
                    id
                    name
                  }
        }
          
      }
    `;

    const variables = { gymId };

    return this.http
      .post<{ data: { getAllCashRegisters: any[] } }>(this.graphqlEndpoint, {
        query,
        variables,
      })
      .pipe(
        map((response) => {
            console.log(response);
         return   response.data.getAllCashRegisters;
            
        }),
        catchError((error) => {
          console.error('Error al obtener las cajas registradoras:', error);
          return throwError(() => new Error('No se pudieron obtener las cajas registradoras.'));
        })
      );
  }
  // Obtener todas las cajas registradoras desde el backend GraphQL
  getMovementsByCashRegister(cashRegisterId: number): Observable<any> {
    const query = `
      query GetMovementsByCashRegister($getCashRegisterId: Float!) {
        getCashRegister(id: $getCashRegisterId) {
          id
          cashierId
          openingBalance
          currentBalance
          movements {
            id
            amount
            type
          }
        }
      }
    `;

    const variables = { getCashRegisterId: cashRegisterId };

    return this.http
      .post<{ data: { getCashRegister: any } }>(this.graphqlEndpoint, {
        query,
        variables,
      })
      .pipe(
        map((response) => response.data.getCashRegister),
        catchError((error) => {
          console.error('Error al obtener movimientos:', error);
          return throwError(() => new Error('No se pudo obtener los movimientos.'));
        })
      );
  }
  // Crear una nueva caja registradora
  createCashRegister(cashRegister: CashRegister): Observable<CashRegister> {
    const mutation = `
       mutation CreateCashRegister($input: CreateCashRegisterInput!) {
            createCashRegister(input: $input) {
             id
    cashierId
    openingBalance
    gym {
      id
      
    }
    currentBalance
    status
   cashierId
    cashier {
      name
    }
      }
    }
    `;

    return this.http
      .post<{ data: { createCashRegister: CashRegister } }>(this.graphqlEndpoint, {
        query: mutation,
        variables: {
          input: cashRegister,
        },
      })
      .pipe(map((response) => {
        console.log("response")

        console.log(response)
        return response.data.createCashRegister;
        
      }));
  }

  // Agregar una venta a una caja registradora
  addSale(cashRegisterId: number, sale: Sale): Observable<Sale> {
    const mutation = `
      mutation AddSale($cashRegisterId: Float!, $sale: SaleInput!) {
        addSale(cashRegisterId: $cashRegisterId, sale: $sale) {
          id
          totalAmount
          items {
            productId
            quantity
            price
          }
          date
        }
      }
    `;

    return this.http
      .post<{ data: { addSale: Sale } }>(this.graphqlEndpoint, {
        query: mutation,
        variables: {
          cashRegisterId,
          sale,
        },
      })
      .pipe(map((response) => response.data.addSale));
  }

  // Agregar un movimiento a una caja registradora
  addMovement(cashRegisterId: number, movement: CashMovement): Observable<CashMovement> {
    const mutation = `
      mutation AddMovement($cashRegisterId: Float!, $movement: MovementInput!) {
        addMovement(cashRegisterId: $cashRegisterId, movement: $movement) {
          id
          amount
          type
          concept
          movementDate
        }
      }
    `;

    return this.http
      .post<{ data: { addMovement: CashMovement } }>(this.graphqlEndpoint, {
        query: mutation,
        variables: {
          cashRegisterId,
          movement,
        },
      })
      .pipe(map((response) => response.data.addMovement));
  }

  // Cargar cajas registradoras y despachar al estado
  loadCashRegisters(): void {
    this.store.dispatch(CashRegisterActions['loadCashRegisters']());
  }
}
