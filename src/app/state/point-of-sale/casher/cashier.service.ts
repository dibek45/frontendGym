import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Casher } from './cashier.model';
import { environment } from 'src/environment.prod';
import localforage from 'localforage';
import * as CryptoJS from 'crypto-js';
import { LocalEncryptedStorageService } from 'src/app/local/services/local-encrypted-storage.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { loadCashiers } from './cashier.actions';
import { Store } from '@ngrx/store';

export interface CreateCasherInput {
  name: string;
  userId: number;
  gymId: number;
}


@Injectable({
  providedIn: 'root',
})
export class CashierService {
  private graphqlEndpoint = environment.apiUrl; // Cambia al endpoint de tu servidor GraphQL

  constructor(private http: HttpClient, 
    private localStorage: LocalEncryptedStorageService,
    private store: Store,
  private notificationService:NotificationService) {}

  // Crear un nuevo cajero
  createCashier(cashier: Casher): Observable<Casher> {
const mutation = `
  mutation CreateCashier($createCashierInput: CreateCashierDto!) {
    createCashier(createCashierInput: $createCashierInput) {
     id
      name
      username
      phone
      email
      userId
      gymId
      createdAt
      updatedAt

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
    userId: cashier.userId, // si lo agregaste correctamente en el backend
  },
};


    return this.http
  .post<{ data: { createCashier: Casher } | null; errors?: any }>(this.graphqlEndpoint, {
    query: mutation,
    variables,
  })
  .pipe(
    map((response) => {
      console.log('🟡 Respuesta del backend:', response); // 👈 Asegúrate de ver qué viene realmente

      if (!response.data || !response.data.createCashier) {
        console.error('❌ Error al crear el cajero:', response.errors ?? response);
        throw new Error('❌ No se pudo crear el cajero.');
      }

      return response.data.createCashier;
    }),
    catchError((error) => {
      console.error('❌ Error al crear cajero:', error);
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
console.log("cragando desde backend")
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
    await this.localStorage.saveVersion(identity.userId, identity.gymId, 'cashiers', new Date().toISOString());

    console.log('💾 Cajeros guardados en caché local');
    return backendList;
  } catch (err) {
    console.error('❌ Error al obtener cajeros desde el backend:', err);
    return [];
  }
}


async getOrCreateCashierForAdmin(): Promise<Casher> {
  const identity = await this.localStorage.loadIdentity();
  if (!identity) throw new Error('❌ No hay usuario autenticado');

  const allCashiers = await this.getCashiersWithCache(); // desde caché o backend
  let cashier = allCashiers.find(c => c.userId === identity.userId);

  if (!cashier) {
    // Paso 1: Confirmación
    const confirmed = await this.notificationService.mostrarConfirmacionCaja("¿Deseas crear tu cajero?");
    if (!confirmed) throw new Error('⛔ Cancelado por el usuario');

    // Paso 2: Preparar datos del cajero
    const cashierData: Partial<Casher> = {
      name: identity.username,
      username: identity.username,
      phone: '0000000000',
      password: 'admin123',
      gymId: identity.gymId,
      userId:identity.userId
    };

    // Agregar userId solo si es válido
    if (identity.userId > 0) {
      cashierData.userId = identity.userId;
    }
    

    // Paso 3: Crear cajero
    try {
      cashier = await this.createCashier(cashierData as Casher).toPromise();
    } catch (error) {
      console.error('❌ Error al crear cajero:', error);
      throw new Error('❌ No se pudo crear el cajero.');
    }
console.log("cajero creado:+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
console.log(cashier)
    // Paso 4: Actualizar caché/estado
   await this.getCashiersWithCache(true);

  }

  if (!cashier) {
    throw new Error('❌ No se pudo obtener o crear el cajero.');
  }

  return cashier;
}


}
