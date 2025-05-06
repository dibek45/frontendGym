// src/app/services/encryption.service.ts
import { Injectable } from '@angular/core';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';

@Injectable({ providedIn: 'root' })
export class EncryptionService {
  private secretKey = 'clave-super-secreta'; // puedes cambiarla por usuario

  encrypt<T>(data: T): string {
    const raw = JSON.stringify(data);
    return AES.encrypt(raw, this.secretKey).toString();
  }

  decrypt<T>(encrypted: string): T {
    const bytes = AES.decrypt(encrypted, this.secretKey);
    const decrypted = bytes.toString(Utf8);
    return JSON.parse(decrypted) as T;
  }
}
