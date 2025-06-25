import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map, Observable } from 'rxjs';
import { environment } from 'src/environment.prod';
import { Promotion } from './promotion.model';
import localforage from 'localforage';
import { LocalEncryptedStorageService } from 'src/app/local/services/local-encrypted-storage.service';
import * as CryptoJS from 'crypto-js';
// promotion-type-with-promotions.model.ts
export interface PromotionTypeWithPromotions {
  id: number;
  name: string;
  description: string;
  promotions: {
    id: number;
    name: string;
    description: string;
    price: number;
    startDate: string;
    endDate: string;
    typePromotionId?: number;
    gymId?: number;
    updatedAt?: string;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  private readonly API_URL = environment.apiUrl; // Replace with your GraphQL API URL

  constructor(private http: HttpClient,  private localStorage: LocalEncryptedStorageService ) {}

  // Fetch promotion types and their promotions
  getTypePromotionandPromotion(): Observable<{
    data: {
      getTypePromotionandPromotion: {
        id: number;
        name: string;
        description: string;
        promotions: { id: number; name: string }[];
      }[];
    };
  }> {
    const query = {
      query: `
        query GetTypePromotionandPromotion {
          getTypePromotionandPromotion {
            id
            name
            description
            promotions {
            id
            name
            price
            description
            startDate
            endDate
            }
          }
        }
      `,
    };

    return this.http.post<{
      data: {
        getTypePromotionandPromotion: {
          id: number;
          name: string;
          description: string;
          promotions: { id: number; name: string }[];
        }[];
      };
    }>(this.API_URL, query);
  }
getPromotions2(gymId: number): Observable<Promotion[]> {
  const query = `
    query PromotionsByGym($gymId: Float!) {
      promotionsByGym(gymId: $gymId) {
        id
        name
        description
        price
        startDate
        endDate
        typePromotionId
        gymId
        updatedAt
      }
    }
  `;
  const variables = { gymId };
  return this.http.post<any>(this.API_URL, { query, variables }).pipe(
    map((res) => res.data.promotionsByGym as Promotion[])
  );
}



async getPromotionsWithCache(forceBackend = false): Promise<{
  data: any[]; // ← puedes luego tiparlo si lo deseas
  source: 'local' | 'backend';
}> {
  const encrypted = await localforage.getItem<string>('identity.json');
  if (!encrypted) return { data: [], source: 'local' };

  const identity = JSON.parse(
    CryptoJS.AES.decrypt(encrypted, 'clave-super-secreta').toString(CryptoJS.enc.Utf8)
  );

  const key = `user-${identity.userId}/gym-${identity.gymId}/promotions-with-types`;

  if (!forceBackend) {
    const cached = await localforage.getItem<string>(key);
    if (cached) {
      try {
        const decrypted = CryptoJS.AES.decrypt(cached, 'clave-super-secreta').toString(CryptoJS.enc.Utf8);
        console.log('📦 Promociones (con tipos) desde CACHE LOCAL');
        return { data: JSON.parse(decrypted), source: 'local' };
      } catch (err) {
        console.error('❌ Error al leer caché cifrada de promociones:', err);
      }
    }
  }

  try {
    const response = await firstValueFrom(this.getTypePromotionandPromotion());
    const data = response.data.getTypePromotionandPromotion;

    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), 'clave-super-secreta').toString();
    await localforage.setItem(key, encryptedData);
    await this.localStorage.saveVersion(identity.userId, identity.gymId, 'promotions', new Date().toISOString());

    console.log('🌐 Promociones con tipos cargadas desde BACKEND');
    return { data, source: 'backend' };
  } catch (err) {
    console.error('❌ Error al obtener promociones desde backend:', err);
    return { data: [], source: 'local' };
  }
}



  
}
