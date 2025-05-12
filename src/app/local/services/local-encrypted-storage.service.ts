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

private getVersionPath(userId: number, gymId: number): string {
  return `user-${userId}/gym-${gymId}/versions`;
}

async saveVersion(userId: number, gymId: number, table: string, updatedAt: string): Promise<void> {
  const path = this.getVersionPath(userId, gymId);
  const encrypted = await localforage.getItem<string>(path);
  let versions: Record<string, string> = {};

  if (encrypted) {
    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, this.encryptionKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      versions = JSON.parse(decrypted);
    } catch (e) {
      console.error('❌ Error desencriptando versions:', e);
    }
  }

  versions[table] = updatedAt;

  const stringified = JSON.stringify(versions);
  const reEncrypted = CryptoJS.AES.encrypt(stringified, this.encryptionKey).toString();
  await localforage.setItem(path, reEncrypted);
}



async saveTableToLocalCache<T extends { updatedAt: string | number | undefined }>(
  userId: number,
  gymId: number,
  table: string,
  list: T[]
): Promise<void> {
  if (!list || list.length === 0) return;

  // Convertir todos los updatedAt a ISO string
  const fixedList = list.map(item => ({
    ...item,
    updatedAt: new Date(item.updatedAt ?? 0).toISOString()
  }));

  const path = `user-${userId}/gym-${gymId}/${table}`;
  const json = JSON.stringify(fixedList);
  const encrypted = CryptoJS.AES.encrypt(json, this.encryptionKey).toString();
  await localforage.setItem(path, encrypted);
  console.log(`💾 Datos de ${table} guardados en ${path}`);

  const latest = fixedList.reduce((a, b) =>
    new Date(b.updatedAt) > new Date(a.updatedAt) ? b : a
  );

  await this.saveVersion(userId, gymId, table, latest.updatedAt);
  console.log(`📌 Versión de ${table} actualizada:`, latest.updatedAt);
}

async loadTableFromLocalCache<T>(
  userId: number,
  gymId: number,
  table: string
): Promise<T[] | null> {
  const path = `user-${userId}/gym-${gymId}/${table}`;
  const encrypted = await localforage.getItem<string>(path);

  if (!encrypted) {
    console.warn(`📭 No se encontró datos en local para ${table}`);
    return null;
  }

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, this.encryptionKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    const list = JSON.parse(decrypted);
    console.log(`📥 Datos desencriptados de ${table}:`, list);
    return list;
  } catch (error) {
    console.error(`❌ Error al desencriptar ${table}:`, error);
    return null;
  }
}


async isRemoteVersionNewer(
  userId: number,
  gymId: number,
  table: string,
  remoteUpdatedAt: string
): Promise<boolean> {
  const path = `user-${userId}/gym-${gymId}/versions`;
  const encrypted = await localforage.getItem<string>(path);

  if (!encrypted) {
    // No hay versiones guardadas, entonces sí necesita sincronizar
    return true;
  }

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, this.encryptionKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    const versions = JSON.parse(decrypted);

    const localVersion = versions[table];

    if (!localVersion) {
      // No hay versión para esta tabla en local
      return true;
    }

    return new Date(remoteUpdatedAt) > new Date(localVersion);
  } catch (error) {
    console.error(`❌ Error al comparar versiones de ${table}:`, error);
    // Si falla la comparación, forzamos sincronización
    return true;
  }
}
async clearTableAndVersion(userId: number, gymId: number, table: string) {
  const key = `user-${userId}/gym-${gymId}/${table}`;
  const versionKey = `user-${userId}/gym-${gymId}/versions`;

  await localforage.removeItem(key);
  const encryptedVersions = await localforage.getItem<string>(versionKey);
  if (encryptedVersions) {
    const bytes = CryptoJS.AES.decrypt(encryptedVersions, 'clave-super-secreta');
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    const versions = JSON.parse(decrypted);
    delete versions[table];

    const updatedEncrypted = CryptoJS.AES.encrypt(JSON.stringify(versions), 'clave-super-secreta').toString();
    await localforage.setItem(versionKey, updatedEncrypted);
  }
}




async shouldSyncTable(
  userId: number,
  gymId: number,
  table: string,
  remoteUpdatedAt: string
): Promise<boolean> {
  const versionKey = `user-${userId}/gym-${gymId}/versions`;
  const encrypted = await localforage.getItem<string>(versionKey);

  if (!encrypted) return true;

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, this.encryptionKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    const versions = JSON.parse(decrypted);

    const local = versions?.[table];
if (!local) return true;

const remoteTime = new Date(remoteUpdatedAt).getTime();
const localTime = new Date(local).getTime();
const diff = remoteTime - localTime;

console.log(`🕒 Diferencia entre versiones: ${diff} ms`);

return diff > 3000; // Solo sincroniza si hay más de 3 segundos de diferencia
  } catch (err) {
    console.warn('⚠️ Error leyendo versiones locales:', err);
    return true;
  }
}


async getVersion(userId: number, gymId: number, table: string): Promise<string | null> {
  const versionKey = `user-${userId}/gym-${gymId}/versions`;
  const encrypted = await localforage.getItem<string>(versionKey);
  if (!encrypted) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, this.encryptionKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    const versions = JSON.parse(decrypted);
    return versions[table] ?? null;
  } catch (e) {
    console.error('❌ Error leyendo versión local:', e);
    return null;
  }
}

}
