import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import localforage from 'localforage';

@Injectable({
  providedIn: 'root'
})
export class LocalEncryptedStorageService {
  private encryptionKey = 'clave-super-secreta'; // cámbiala y hazla dinámica si quieres

  private getPath(userId: number, gymId: number, table: string): string {
    return `user-${userId}/gym-${gymId}/${table}`;
  }

  async save<T>(userId: number, gymId: number, table: string, data: T): Promise<void> {
    const stringified = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(stringified, this.encryptionKey).toString();
    const path = this.getPath(userId, gymId, table);
    await localforage.setItem(path, encrypted);
  }

  async load<T>(userId: number, gymId: number, table: string): Promise<T | null> {
    const path = this.getPath(userId, gymId, table);
    const encrypted = await localforage.getItem<string>(path);
    if (!encrypted) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, this.encryptionKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (e) {
      console.error('Error al desencriptar', e);
      return null;
    }
  }

  async remove(userId: number, gymId: number, table: string): Promise<void> {
    const path = this.getPath(userId, gymId, table);
    await localforage.removeItem(path);
  }

  async clearAll(): Promise<void> {
    await localforage.clear();
  }

  private identityPath = 'identity.json';

async saveIdentity(data: { userId: number; gymId: number; username: string }): Promise<void> {
  const stringified = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(stringified, this.encryptionKey).toString();
  await localforage.setItem(this.identityPath, encrypted);
}

async loadIdentity(): Promise<{ userId: number; gymId: number; username: string } | null> {
  const encrypted = await localforage.getItem<string>(this.identityPath);
  if (!encrypted) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, this.encryptionKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (e) {
    console.error('Error al leer identity.json', e);
    return null;
  }
}

}
