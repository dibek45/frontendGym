import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environment.prod';
import * as CryptoJS from 'crypto-js';
import localforage from 'localforage';
import { LocalEncryptedStorageService } from 'src/app/local/services/local-encrypted-storage.service';
@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = environment.apiUrl; // URL de la API GraphQL

  constructor(private http: HttpClient,
        private localStorage: LocalEncryptedStorageService,
    
  ) {}

  getSales(gymId: number): Observable<any> {
    const query = `
query GetSales($gymId: Float!) {
  getSales(gymId: $gymId) {
    cashRegister {
      id
      cashier {
        id
        name
      }
    }
  details {
      id
      quantity
      isMembership
      unitPrice
      totalPrice 
      membershipName
      product {
        id
        name
        price
      }
    }
   
      id
    paymentMethod
    saleDate
    totalAmount
  }
}
    `;

    return this.http.post<any>(this.apiUrl, { query, variables: { gymId } }).pipe(
      map(response => {
        console.log('📌 Ventas recibidas de la API:', response.data.getSales);
        return response.data.getSales || [];
      }),
      catchError(error => {
        console.error('❌ Error en la consulta de ventas:', error);
        return [];
      })
    );
  }
  // 🔹 Crear nueva venta (incluyendo `gymId`)
  createSale(saleData: any): Observable<any> {
    const mutation = `
      mutation CreateSale($saleInput: SaleInput!) {
        createSale(saleInput: $saleInput) {
          id
          gymId
          saleDate
          totalAmount
        }
      }
    `;

    const body = { query: mutation, variables: { saleInput: saleData } };

    return this.http.post<{ data: { createSale: any } }>(this.apiUrl, body).pipe(
      map(response => response.data.createSale)
    );
  }

  // 🔹 Actualizar una venta (asegurando `gymId`)
  updateSale(saleId: number, gymId: number, saleData: any): Observable<any> {
    const mutation = `
      mutation UpdateSale($saleId: Int!, $gymId: Int!, $saleInput: SaleInput!) {
        updateSale(id: $saleId, gymId: $gymId, saleInput: $saleInput) {
          id
          gymId
          saleDate
          totalAmount
        }
      }
    `;

    const body = { query: mutation, variables: { saleId, gymId, saleInput: saleData } };

    return this.http.post<{ data: { updateSale: any } }>(this.apiUrl, body).pipe(
      map(response => response.data.updateSale)
    );
  }

  // 🔹 Eliminar una venta
  deleteSale(saleId: number, gymId: number): Observable<any> {
    const mutation = `
      mutation DeleteSale($saleId: Int!, $gymId: Int!) {
        deleteSale(id: $saleId, gymId: $gymId) {
          success
        }
      }
    `;

    const body = { query: mutation, variables: { saleId, gymId } };

    return this.http.post<{ data: { deleteSale: { success: boolean } } }>(this.apiUrl, body).pipe(
      map(response => response.data.deleteSale.success)
    );
  }

  async getSalesWithCache(forceBackend = false): Promise<any[]> {
  const encrypted = await localforage.getItem<string>('identity.json');
  if (!encrypted) return [];

  const identity = JSON.parse(
    CryptoJS.AES.decrypt(encrypted, 'clave-super-secreta').toString(CryptoJS.enc.Utf8)
  );

  const key = `user-${identity.userId}/gym-${identity.gymId}/sales`;

  if (!forceBackend) {
    const cached = await localforage.getItem<string>(key);
    if (cached) {
      try {
        const decrypted = CryptoJS.AES.decrypt(cached, 'clave-super-secreta').toString(CryptoJS.enc.Utf8);
        return JSON.parse(decrypted);
      } catch (err) {
        console.error('❌ Error al leer caché de ventas:', err);
      }
    }
  }

  try {
    const result = await this.getSales(identity.gymId).toPromise(); // 👈 usa el observable existente
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(result), 'clave-super-secreta').toString();
    await localforage.setItem(key, encryptedData);

    await this.localStorage.saveVersion(
    identity.userId,
    identity.gymId,
    'sales',
    new Date().toISOString()
  );
    return result;
  } catch (err) {
    console.error('❌ Error al obtener ventas desde el backend:', err);
    return [];
  }
}

}
