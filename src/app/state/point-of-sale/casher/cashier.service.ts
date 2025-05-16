import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Casher } from './cashier.model';
import { environment } from 'src/environment.prod';
import localforage from 'localforage';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root',
})
export class CashierService {
  private graphqlEndpoint = environment.apiUrl; // Cambia al endpoint de tu servidor GraphQL

  constructor(private http: HttpClient) {}

  // Crear un nuevo cajero
  createCashier(cashier: Casher): Observable<Casher> {
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
    .post<{ data: { createCashier: Casher } }>(this.graphqlEndpoint, {
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

 getData(gymId: number): Observable<Casher[]> {
  const query = `
    query Cashier($gymId: Int!) {
      cashiers(gymId: $gymId) {
        id
        name
        username
        email
        phone
        gymId
        createdAt
        updatedAt
      }
    }
  `;

  const variables = { gymId };

  return this.http
    .post<{ data: { cashiers: Casher[] } }>(this.graphqlEndpoint, {
      query,
      variables,
    })
    .pipe(
      map((response: any) => response.data.cashiers),
      catchError((error) => {
        console.error('Error al obtener los cajeros:', error);
        return throwError(() => new Error('No se pudieron obtener los cajeros.'));
      })
    );
}


async getCashiersWithCache(forceBackend = false): Promise<Casher[]> {
  const encrypted = await localforage.getItem<string>('identity.json');
  if (!encrypted) {
    console.warn('❌ No hay identity.json');
    return [];
  }

  let identity: any;
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, 'clave-super-secreta');
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    identity = JSON.parse(decrypted);
  } catch (err) {
    console.error('❌ Error al desencriptar identity.json:', err);
    return [];
  }

  const key = `user-${identity.userId}/gym-${identity.gymId}/cashiers`;

  if (!forceBackend) {
    const cached = await localforage.getItem<string>(key);
    if (cached) {
      try {
        const decrypted = CryptoJS.AES.decrypt(cached, 'clave-super-secreta').toString(CryptoJS.enc.Utf8);
        const parsed = JSON.parse(decrypted);
        console.log('📂 Cajeros desde caché local:', parsed);
        return parsed;
      } catch (err) {
        console.error('❌ Error al leer caché de cajeros:', err);
      }
    }
  }

  try {
    const backendList = await firstValueFrom(this.getData(identity.gymId));
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(backendList), 'clave-super-secreta').toString();
    await localforage.setItem(key, encryptedData);
    console.log('🌐 Cajeros cargados desde backend:', backendList);
    console.log('💾 Cajeros guardados en caché local');
    return backendList;
  } catch (err) {
    console.error('❌ Error al obtener cajeros desde el backend:', err);
    return [];
  }
}
}
