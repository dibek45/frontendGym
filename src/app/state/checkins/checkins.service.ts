import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CheckinModel } from './checkins.model';
import { environment } from 'src/environment.prod';
import { firstValueFrom } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import localforage from 'localforage';
import { LocalEncryptedStorageService } from 'src/app/local/services/local-encrypted-storage.service';

@Injectable({ providedIn: 'root' })
export class CheckinService {
  private graphqlEndpoint = environment.apiUrl;
  private encryptionKey = 'clave-super-secreta';

  constructor(
    private http: HttpClient,
    private localStorage: LocalEncryptedStorageService
  ) {}

  async getCheckinsWithCache(forceBackend = false): Promise<CheckinModel[]> {
    const encrypted = await localforage.getItem<string>('identity.json');
    if (!encrypted) return [];

    const identity = JSON.parse(
      CryptoJS.AES.decrypt(encrypted, this.encryptionKey).toString(CryptoJS.enc.Utf8)
    );

    const key = `user-${identity.userId}/gym-${identity.gymId}/checkins`;

    if (!forceBackend) {
      const cached = await localforage.getItem<string>(key);
      if (cached) {
        try {
          const decrypted = CryptoJS.AES.decrypt(cached, this.encryptionKey).toString(CryptoJS.enc.Utf8);
          return JSON.parse(decrypted);
        } catch (err) {
          console.error('❌ Error al leer caché de checkins:', err);
        }
      }
    }

    try {
      const checkins = await this.fetchCheckins(identity.gymId);
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(checkins), this.encryptionKey).toString();
      await localforage.setItem(key, encryptedData);
      await this.localStorage.saveVersion(identity.userId, identity.gymId, 'checkins', new Date().toISOString());
      return checkins;
    } catch (err) {
      console.error('❌ Error al obtener checkins desde el backend:', err);
      return [];
    }
  }

  private async fetchCheckins(gymId: number): Promise<CheckinModel[]> {
    const query = `
      query CheckinsByGym($gymId: Int!) {
        checkinsByGym(gymId: $gymId) {
          id
          memberId
          gymId
          timestamp
          createdBy
          createdAt
          updatedAt
          isSynced
          syncError
          tempId
        }
      }
    `;

    const variables = { gymId };
    const result = await firstValueFrom(
      this.http.post<any>(this.graphqlEndpoint, { query, variables })
    );

    return result.data.checkinsByGym;
  }

  async createCheckin(checkin: CheckinModel): Promise<CheckinModel> {
    const mutation = `
      mutation CreateCheckin($createCheckin: CreateCheckinInput!) {
        createCheckin(createCheckin: $createCheckin) {
          id
          memberId
          gymId
          timestamp
          createdBy
          createdAt
          updatedAt
          isSynced
          syncError
          tempId
        }
      }
    `;

    const variables = {
      createCheckin: {
        memberId: checkin.memberId,
        gymId: checkin.gymId,
        timestamp: checkin.timestamp,
        createdBy: checkin.createdBy,
        tempId: checkin.tempId
      }
    };

    try {
      const response = await firstValueFrom(
        this.http.post<any>(this.graphqlEndpoint, {
          query: mutation,
          variables
        })
      );

      if (!response.data || !response.data.createCheckin) {
        throw new Error('No se pudo crear la asistencia');
      }

      return response.data.createCheckin;
    } catch (err) {
      console.error('❌ Error en createCheckin:', err);
      throw err;
    }
  }
}
