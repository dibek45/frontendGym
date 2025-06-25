import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MachineModel } from './machine.model';
import { environment } from 'src/environment.prod';
import localforage from 'localforage';
import { LocalEncryptedStorageService } from 'src/app/local/services/local-encrypted-storage.service';
import * as CryptoJS from 'crypto-js'; // Asegúrate de tener este import

@Injectable({ providedIn: 'root' })
export class MachineService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient,
        private localStorage: LocalEncryptedStorageService
    
  ) {}

  getMachinesByGym(gymId: number): Observable<MachineModel[]> {
    const query = `
      query {
        machinesByGym(gymId: ${gymId}) {
          id
          name
          gymId
          qrs {
            id
            code
          }
        }
      }
    `;
    return this.http.post<any>(this.apiUrl, { query }).pipe(
      map(response => response.data.machinesByGym)
    );
  }

  createMachine(machine: MachineModel): Observable<MachineModel> {
    const mutation = `
      mutation {
        createMachine(createMachine: {
          name: "${machine.name}",
          gymId: ${machine.gymId}
        }) {
          id
          name
          gymId
          qrs {
            id
            code
          }
        }
      }
    `;
    return this.http.post<any>(this.apiUrl, { query: mutation }).pipe(
      map(response => response.data.createMachine)
    );
  }

  updateMachine(machine: MachineModel): Observable<MachineModel> {
    const query = `
      mutation UpdateMachine($updateMachineInput: UpdateMachineInput!) {
        updateMachine(updateMachineInput: $updateMachineInput) {
          id
          name
          description
          gymId
          isActive
          qrs {
            id
            code
            machineId
          }
        }
      }
    `;

    return this.http
      .post<any>(this.apiUrl, {
        query,
        variables: {
          updateMachineInput: machine,
        },
      })
      .pipe(map((result) => result.data.updateMachine));
  }

  deleteMachine(id: number): Observable<boolean> {
    const query = `
      mutation DeleteMachine($id: Int!) {
        deleteMachine(id: $id)
      }
    `;

    return this.http
      .post<any>(this.apiUrl, {
        query,
        variables: { id },
      })
      .pipe(map((result) => result.data.deleteMachine));
  }


async getMachinesWithCache(forceBackend = false): Promise<{ data: MachineModel[]; source: 'local' | 'backend' }> {
  const encrypted = await localforage.getItem<string>('identity.json');
  if (!encrypted) return { data: [], source: 'local' };

  const identity = JSON.parse(
    CryptoJS.AES.decrypt(encrypted, 'clave-super-secreta').toString(CryptoJS.enc.Utf8)
  );
  const key = `user-${identity.userId}/gym-${identity.gymId}/machines`;

  if (!forceBackend) {
    const cached = await localforage.getItem<string>(key);
    if (cached) {
      try {
        const decrypted = CryptoJS.AES.decrypt(cached, 'clave-super-secreta').toString(CryptoJS.enc.Utf8);
        console.log('📦 Máquinas cargadas desde CACHE LOCAL');
        return { data: JSON.parse(decrypted), source: 'local' };
      } catch (err) {
        console.error('❌ Error al leer caché de máquinas:', err);
      }
    }
  }

  try {
    const machines = await firstValueFrom(this.getMachinesByGym(identity.gymId));
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(machines), 'clave-super-secreta').toString();
    await localforage.setItem(key, encryptedData);
    await this.localStorage.saveVersion(identity.userId, identity.gymId, 'machines', new Date().toISOString());

    console.log('🌐 Máquinas cargadas desde BACKEND');
    return { data: machines, source: 'backend' };
  } catch (err) {
    console.error('❌ Error al obtener máquinas desde backend:', err);
    return { data: [], source: 'local' };
  }
}
}
