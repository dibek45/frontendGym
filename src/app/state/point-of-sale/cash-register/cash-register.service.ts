import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CashRegister } from './cash-register.model';
import { CashMovement } from '../cash-movement/cash-movement.model';
import { SaleModel } from './sale.model';
import { CashRegisterActions } from './cash-register.actions';
import { Store } from '@ngrx/store';
import { selectAllCashRegisters } from './cash-register.selectors';
import { environment } from 'src/environment.prod';
import localforage from 'localforage';
import * as CryptoJS from 'crypto-js';
import { LocalEncryptedStorageService } from 'src/app/local/services/local-encrypted-storage.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { CashierService } from '../casher/cashier.service';
type CreateCashRegisterResult =
  | { cashRegister: CashRegister }
  | { error: 'negative_balance' | 'already_open' | 'max_reached' };

@Injectable({
  providedIn: 'root',
})
export class CashRegisterService {
  
  private graphqlEndpoint = environment.apiUrl; // Cambia al endpoint de tu servidor GraphQL

  cashRegisters$: Observable<CashRegister[]>; // Observable para las cajas registradoras

  constructor(
    private casherService:CashierService,
    private notificationService:NotificationService,
    private http: HttpClient, private store: Store,      private _notification:NotificationService,
    private localStorage: LocalEncryptedStorageService // 👈 aquí lo inyectas
  ) {
    // Seleccionar cajas registradoras del estado
    this.cashRegisters$ = this.store.select(selectAllCashRegisters);
     localforage.removeItem('user-david@gmail.com/gym-1/cashRegisters');

  }
  


  async getCashRegistersWithCache(forceBackend = false): Promise<CashRegister[]> {
    console.log('🔁 getCashRegistersWithCache llamado', { forceBackend });
  
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
      console.log('✅ Identity desencriptado:', identity);
    } catch (err) {
      console.error('❌ Error al desencriptar identity.json:', err);
      return [];
    }
  
    const key = `user-${identity.userId}/gym-${identity.gymId}/cashRegisters`;
    console.log('🔑 Clave de caché:', key);
  
    if (!forceBackend) {
      const cached = await localforage.getItem<string>(key);
      if (cached) {
        try {
          const decrypted = CryptoJS.AES.decrypt(cached, 'clave-super-secreta').toString(CryptoJS.enc.Utf8);
          const parsed = JSON.parse(decrypted);
          console.log('📂 Cajas cargadas desde caché local:', parsed);
          return parsed;
        } catch (err) {
          console.error('❌ Error al leer desde caché:', err);
        }
      } else {
        console.log('📭 No se encontró caché local, irá al backend...');
      }
    } else {
      console.log('⚠️ Forzando carga desde backend...');
    }
  
    // Si no hay caché o se fuerza la recarga
    try {
      const list = (await this.getCashRegistersByGym(identity.gymId).toPromise()) ?? [];
      console.log('☁️ Cajas desde backend:', list);
      const fixedList = list.map(item => ({
        ...item,
        updatedAt: new Date(item.updatedAt ?? 0).toISOString()
      }));
      await this.localStorage.saveTableToLocalCache(identity.userId, identity.gymId, 'cashRegisters', fixedList);

      console.log('💾 Guardado en caché:', key);
      
  
      return list ?? []; // o ya devuelves [] correctamente

    } catch (err) {
      console.error('❌ Error al obtener cajas desde backend:', err);
      return [];
    }
  }
  
  
  
getCashRegistersByGym(gymId: number): Observable<CashRegister[]> {
  const query = `
    query GetCashRegisters($gymId: Int!) {
      getAllCashRegisters(gymId: $gymId) {
        id
        cashierId
        openingBalance
        currentBalance
        status
        openingTime
        gymId
        cashier {
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
        updatedAt
      }
    }
  `;

  const variables = { gymId:1 };

  return this.http
    .post<{ data?: { getAllCashRegisters?: CashRegister[] }, errors?: any }>(
      this.graphqlEndpoint,
      { query, variables }
    )
    .pipe(
      map((response) => {
        if (response.errors) {
          console.error('❌ Error de GraphQL:', response.errors);
          throw new Error('Error en la consulta de cajas.');
        }
        return response?.data?.getAllCashRegisters ?? [];
      }),
      catchError((err) => {
        console.error('❌ Error HTTP o de red:', err);
        return throwError(() => err);
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
  const { updatedAt, ...input } = cashRegister; // 🔥 Quitamos updatedAt porque no lo acepta GraphQL

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
        cashier {
          name
        }
      }
    }
  `;

  return this.http
    .post<{ data: { createCashRegister: CashRegister } | null; errors?: any }>(this.graphqlEndpoint, {
      query: mutation,
      variables: { input },
    })
    .pipe(
      map((response) => {
        if (!response.data || !response.data.createCashRegister) {
          console.error('❌ Error al crear la caja:', response.errors ?? response);
          throw new Error('❌ No se pudo crear la caja. Verifica los datos enviados.');
        }
        return response.data.createCashRegister;
      }),
      catchError((err) => {
        console.error('❌ Error en GraphQL o red:', err);
        return throwError(() => err);
      })
    );
}



  // Agregar una venta a una caja registradora
  addSale(cashRegisterId: number, sale: SaleModel): Observable<SaleModel> {
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
      .post<{ data: { addSale: SaleModel } }>(this.graphqlEndpoint, {
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

/*
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
  */
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
  

async createCashRegisterIfValid(cashRegister: CashRegister): Promise<CreateCashRegisterResult> {
  const existing = await this.getCashRegistersWithCache();
const openByCashier = existing.find(c => c.cashierId === cashRegister.cashierId && c.status === 'open');
  const openByGym = existing.filter(c => c.gymId === cashRegister.gymId && c.status === 'open');

  if (cashRegister.openingBalance < 0) {
    this.notificationService.mostrarErrorCreacionCaja('negative_balance');
    return { error: 'negative_balance' };
  }

  if (openByCashier) {
    this.notificationService.mostrarErrorCreacionCaja('already_open');
    return { error: 'already_open' };
  }

  if (openByGym.length >= 4) {
    this.notificationService.mostrarErrorCreacionCaja('max_reached');
    return { error: 'max_reached' };
  }

  const result = await this.createCashRegister(cashRegister).toPromise();
  if (!result) throw new Error('❌ No se pudo crear la caja registradora.');

  return { cashRegister: result };
}



async getCajaActiva(): Promise<{ id: number } | null> {
  const identity = await this.localStorage.loadIdentity();
  if (!identity) return null;

  const key = `user-${identity.userId}/gym-${identity.gymId}/cashRegisters`;
  const cajasEncrypted = await localforage.getItem<string>(key);
  if (!cajasEncrypted) return null;

  const cajas = JSON.parse(
    CryptoJS.AES.decrypt(cajasEncrypted, 'clave-super-secreta').toString(CryptoJS.enc.Utf8)
  );

  const cajaActiva = cajas.find((c: any) => c.status === 'open' && c.cashier?.userId === identity.userId);
  return cajaActiva || null;
}




async crearCajaParaUsuarioActualSiNoExiste(): Promise<void> {
  const identity = await this.localStorage.loadIdentity();
  if (!identity) return;

  const cajaActiva = await this.getCajaActiva();
  if (cajaActiva) {
    console.log('✅ Ya existe una caja activa con ID:', cajaActiva.id);
    return;
  }

  // Paso 1: Confirmación para abrir caja
  const confirmado = await this.notificationService.mostrarConfirmacionCaja('¿Deseas abrir una caja?');
  if (!confirmado) return;

  // Paso 2: ¿Para ti o para otro cajero?
  const paraAdmin = await this.notificationService.mostrarConfirmacionCaja('¿Deseas abrirla para ti mismo?');
  if (!paraAdmin) {
    this.notificationService.mostrarSnackbar('🛠️ Abrir para otro cajero aún no implementado', 'info');
    return;
  }

  // Paso 3: Obtener cajero (crear si no existe)
  const cashier = await this.casherService.getOrCreateCashierForAdmin();
  const cashierId = cashier.id!;
  
  // Paso 4: Crear nueva caja
  const nuevaCaja: CashRegister = {
    cashierId,
    openingBalance: 20,
    gymId: identity.gymId,
    updatedAt: Date.now()
  };

  const result = await this.createCashRegisterIfValid(nuevaCaja);
  if ('error' in result) {
    console.warn('❌ Error al crear la caja:', result.error);
    return;
  }

  // ✅ Forzar recarga de cajas desde backend para evitar que getCajaActiva falle
  await this.getCashRegistersWithCache(true);

  // 🔄 También puedes actualizar NgRx si lo usas
  this.loadCashRegisters();

  console.log('✅ Caja creada con ID:', result.cashRegister.id);
}


// cash-register.service.ts
async updateBalanceAfterSale(cashRegisterId: number): Promise<void> {
  console.log('🔁 updateBalanceAfterSale iniciado para ID:', cashRegisterId);

  const identity = await this.localStorage.loadIdentity();
  if (!identity) {
    console.warn('❌ No se pudo cargar la identidad');
    return;
  }

  // 🔄 Obtenemos las cajas más recientes desde backend
  const cashRegisters = await this.getCashRegistersFromBackend();

  // 💾 Guardamos los datos actualizados en caché local
  await this.localStorage.saveTableToLocalCache(
    identity.userId,
    identity.gymId,
    'cashRegisters',
    cashRegisters
  );

  await this.localStorage.saveVersion(
    Number(identity.userId),
    Number(identity.gymId),
    'cashRegisters',
    new Date().toISOString()
  );

  // 📦 Actualizamos el store (NgRx)
  this.store.dispatch(CashRegisterActions.loadCashRegistersSuccess({ cashRegisters }));

  console.log('✅ Caja actualizada desde backend y sincronizada localmente');
}

async getCashRegistersFromBackend(): Promise<CashRegister[]> {
  const identity = await this.localStorage.loadIdentity();
  if (!identity) return [];

  try {
    const list = await this.getCashRegistersByGym(identity.gymId).toPromise();
    return list ?? [];
  } catch (err) {
    console.error('❌ Error al obtener cajas desde backend:', err);
    return [];
  }
}

}
