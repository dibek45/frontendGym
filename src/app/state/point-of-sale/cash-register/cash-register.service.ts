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
import { environment } from 'src/environment.prod';
import localforage from 'localforage';
import * as CryptoJS from 'crypto-js';
import { LocalEncryptedStorageService } from 'src/app/local/services/local-encrypted-storage.service';

@Injectable({
  providedIn: 'root',
})
export class CashRegisterService {
  private graphqlEndpoint = environment.apiUrl; // Cambia al endpoint de tu servidor GraphQL

  cashRegisters$: Observable<CashRegister[]>; // Observable para las cajas registradoras

  constructor(private http: HttpClient, private store: Store,  private localStorage: LocalEncryptedStorageService // 👈 aquí lo inyectas
  ) {
    // Seleccionar cajas registradoras del estado
    this.cashRegisters$ = this.store.select(selectAllCashRegisters);
     localforage.removeItem('user-david@gmail.com/gym-1/cashRegisters');

  }
  



  
  
  
  getCashRegistersByGym(gymId: number): Observable<CashRegister[]> {
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
            updatedAt
        }
      }
    `;
  
    const variables = { gymId };
  
    return this.http
      .post<{ data?: { getAllCashRegisters?: CashRegister[] } }>(this.graphqlEndpoint, {
        query,
        variables,
      })
      .pipe(
        map((response) => {
          const list: CashRegister[] = response?.data?.getAllCashRegisters ?? [];
          console.log('🔍 Desde GraphQL:', list); // <-- Asegura que sí hay datos
          return list;
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
          updatedAt
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


  async syncCashRegistersIfNeeded(): Promise<CashRegister[]> {
    const encrypted = await localforage.getItem<string>('identity.json');
    if (!encrypted) return [];
  
    const identity = JSON.parse(
      CryptoJS.AES.decrypt(encrypted, 'clave-super-secreta').toString(CryptoJS.enc.Utf8)
    );
  
    const key = `user-${identity.userId}/gym-${identity.gymId}/cashRegisters`;
    const cachedStr = await localforage.getItem<string>(key);
    let local: CashRegister[] = [];
  
    if (cachedStr) {
      try {
        const decrypted = CryptoJS.AES.decrypt(cachedStr, 'clave-super-secreta').toString(CryptoJS.enc.Utf8);
        local = JSON.parse(decrypted) ?? [];
      } catch {
        local = [];
      }
    }
  
    const remote = await this.getCashRegistersByGym(identity.gymId).toPromise() ?? [];
  
    const localLatest = local.length
      ? local.reduce((acc, cur) => (acc.openingTime && cur.openingTime && cur.openingTime > acc.openingTime ? cur : acc))
      : undefined;
  
    const remoteLatest = remote.length
      ? remote.reduce((acc, cur) => (acc.openingTime && cur.openingTime && cur.openingTime > acc.openingTime ? cur : acc))
      : undefined;
  
    const isRemoteNewer =
      !localLatest || !localLatest.openingTime ||
      (remoteLatest?.openingTime && remoteLatest.openingTime > localLatest.openingTime);
  
    const isLengthDifferent = remote.length !== local.length;
  
    if (isRemoteNewer || isLengthDifferent) {
      const encryptedRemote = CryptoJS.AES.encrypt(JSON.stringify(remote), 'clave-super-secreta').toString();
      await localforage.setItem(key, encryptedRemote);
      console.log('🔄 Se actualizó la caché desde backend');
      return remote;
    }
  
    console.log('✅ Datos locales ya están actualizados');
    return local;
  }
  
  async eliminarCajaLocalPorId(id: number) {
    const identity = await this.localStorage.loadIdentity();
    if (!identity) {
      alert('❌ No hay identity.json cargado');
      return;
    }
  
    const list = await this.localStorage.loadTableFromLocalCache<CashRegister>(
      identity.userId,
      identity.gymId,
      'cashRegisters'
    );
  
    if (!list) {
      alert('⚠️ No hay cajas locales');
      return;
    }
  
    const actualizada = list.filter(caja => caja.id !== id);
    await this.localStorage.saveTableToLocalCache(
      identity.userId,
      identity.gymId,
      'cashRegisters',
      actualizada
    );
  
    alert(`🗑️ Caja con ID ${id} eliminada de localForage`);
  }
  
}
