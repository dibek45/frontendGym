import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MemberModel } from 'src/app/core/models/member.interface';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'src/app/shared/notification.service';
import { SpeechService } from 'src/app/shared/speech.service';
import { environment } from 'src/environment.prod';
import { FormControl, FormGroup, Validators } from '@angular/forms';


import localforage from 'localforage';
import * as CryptoJS from 'crypto-js';
import { LocalEncryptedStorageService } from 'src/app/local/services/local-encrypted-storage.service'; // asegúrate que esté inyectado

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  
    private graphqlEndpoint = environment.apiUrl;
  private encryptionKey = 'clave-super-secreta';

  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    fullName: new FormControl('John Doe', Validators.required),
    email: new FormControl('johndoe@example.com', Validators.email),
    mobile: new FormControl('12345678', [Validators.required, Validators.minLength(8)]),
    city: new FormControl(''),
    gender: new FormControl('1'),
    department: new FormControl('basic'),
    birthDate: new FormControl('2000-01-01'),
    isPermanent: new FormControl(false)
  });
  ; // Reemplaza con tu endpoint GraphQL


  initializeFormGroup() {
    this.form.setValue({
      $key: null,
      fullName: 'John Doe',
      email: 'johndoe@example.com',
      mobile: '12345678',
      city: '',
      gender: '1',
      department: 'basic',
      birthDate: '2000-01-01',
      isPermanent: false
    });
  }
  constructor(private http: HttpClient, 
    private _notification:NotificationService,
    private speechService: SpeechService,
    private localStorage: LocalEncryptedStorageService // ✅ asegúrate que esté inyectado

  )
    { 
  }


  getData(gymId: number): Observable<MemberModel[]> {
    const query = `
      query Query($gymId: Float!) {
        usersByGymId(gymId: $gymId) {
          id
          gymId
          name
          available_days
          img

        }
      }
    `;
    const variables = { gymId };
    return this.http.post<any>(this.graphqlEndpoint, { query, variables })
      .pipe(
        map(result => result.data.usersByGymId as MemberModel[])
      );
  }

  getUserByCode(gymId: number, userId?: number): Observable<MemberModel> {
    const query = `
      query userTOCheck_gymId_userId($gymId: Float!, $userId: Float) {
        userTOCheck_gymId_userId(gymId: $gymId, userId: $userId) {
          id
          name
          img
        }
      }
    `;
  
    // Prepara las variables
    const variables: any = { gymId }; // Inicializa solo con `gymId`
    if (userId !== undefined) {
      variables.userId = userId; // Solo agrega `userId` si está definido
    }
  
    // Realiza la petición
    return this.http.post<any>(this.graphqlEndpoint, { query, variables })
      .pipe(
        map(result => result.data.userTOCheck_gymId_userId as MemberModel)  // Asigna la respuesta al modelo esperado
      );
  }
  getUserByCodeQrMovil(code: string): Observable<MemberModel> {
    const query = `
      query getUserByCodeQr($code: String!) {
        userByQRCode(code: $code) {
          id
          name
          img
        }
      }
    `;
  
    // Prepara las variables
    const variables = { code }; // Ahora utiliza el código QR como único parámetro
  
    // Realiza la petición
    return this.http.post<any>(this.graphqlEndpoint, { query, variables })
      .pipe(
        map(result => result.data.userByQRCode as MemberModel) // Asigna la respuesta al modelo esperado
      );
  }
  
  
  getMemberDetail(gymId: number, memberId: number): Observable<MemberModel> {
    return this.http.get<MemberModel>(`/api/gym/${gymId}/members/${memberId}`);
  }



  // member.service.ts (just showing the new method)
updateDays(memberId: number, days: number) {
  const gqlQuery = `
    mutation Mutation($updateAvailableDaysInput: UpdateAvailableDaysDto!) {
      updateAvailableDays(updateAvailableDaysInput: $updateAvailableDaysInput) {
        id
        available_days
      }
    }
  `;
  const variables = {
    updateAvailableDaysInput: {
      id: memberId,
      available_days: days
    }
  };

  return this.http.post<any>('YOUR_GRAPHQL_ENDPOINT', {
    query: gqlQuery,
    variables
  }).pipe(
    map(res => res?.data?.updateAvailableDays?.available_days)
  );
}


async createMemberAsync(member: MemberModel): Promise<MemberModel> {
  const graphqlQuery = `
    mutation CreateUser($createUser: CreateUser!) {
      createUser(createUser: $createUser) {
        id
        name
        actived
        huella
        img
        gymId
        available_days
        username
      }
    }
  `;

  const userPayload = {
    name: member.name,
    actived: member.actived,
    available_days: member.available_days,
    img: member.img,
    gymId: member.gymId,
    huella: member.huella ?? '',
    username: member.username
  };

  console.log('🚀 Payload enviado al backend', userPayload);

  try {
    const response: any = await firstValueFrom(
      this.http.post<any>(environment.apiUrl, {
        query: graphqlQuery,
        variables: { createUser: userPayload }
      })
    );

    console.log('✅ Response directa:', response);

    if (!response.data || !response.data.createUser) {
      throw new Error('No se pudo crear el usuario en backend');
    }

    return response.data.createUser;

  } catch (err) {
    console.error('❌ Error directo:', err);
    throw err;
  }
}


insertEmployee(employee: any) {
  const mutation = `
    mutation CreateUser($createUser: CreateUser!) {
      createUser(createUser: $createUser) {
        id
        name
        email
        img
        actived
        username
        createdAt
        updatedAt
      }
    }
  `;

  const variables = {
    createUser: {
      name: employee.fullName,
      username: employee.email, // puedes cambiarlo si tienes un campo específico
      img: employee.img || null,
      huella: employee.huella || null,
      actived: employee.isPermanent ?? false,
      available_days: null,
      gymId: null,
      password: '123456' // puedes hacerlo dinámico
    }
  };

  return this.http.post('https://api.dibeksolutions.com/graphql', {
    query: mutation,
    variables
  });
}

 async getMembersWithCache(forceBackend = false): Promise<MemberModel[]> {
    const encrypted = await localforage.getItem<string>('identity.json');
    if (!encrypted) {
      console.warn('❌ No hay identity.json');
      return [];
    }

    let identity: any;
    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, this.encryptionKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      identity = JSON.parse(decrypted);
    } catch (err) {
      console.error('❌ Error al desencriptar identity.json:', err);
      return [];
    }

    const key = `user-${identity.userId}/gym-${identity.gymId}/members`;

    if (!forceBackend) {
      const cached = await localforage.getItem<string>(key);
      if (cached) {
        try {
          const decrypted = CryptoJS.AES.decrypt(cached, this.encryptionKey).toString(CryptoJS.enc.Utf8);
          const parsed = JSON.parse(decrypted);
          console.log('📂 Usuarios cargados desde caché local:', parsed);
          return parsed;
        } catch (err) {
          console.error('❌ Error al leer caché de miembros:', err);
        }
      }
    }

    // Si no hay caché o se forza recarga
    try {
      const backendList = await firstValueFrom(this.getData(identity.gymId));
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(backendList), this.encryptionKey).toString();
      await localforage.setItem(key, encryptedData);
      console.log('💾 Usuarios guardados en caché local');
      return backendList;
    } catch (err) {
      console.error('❌ Error al obtener usuarios desde el backend:', err);
      return [];
    }
  }

  async syncMembersIfNeeded(): Promise<MemberModel[]> {
  const encrypted = await localforage.getItem<string>('identity.json');
  if (!encrypted) return [];

  const identity = JSON.parse(
    CryptoJS.AES.decrypt(encrypted, 'clave-super-secreta').toString(CryptoJS.enc.Utf8)
  );

  const key = `user-${identity.userId}/gym-${identity.gymId}/members`;
  const cachedStr = await localforage.getItem<string>(key);
  let local: MemberModel[] = [];

  if (cachedStr) {
    try {
      const decrypted = CryptoJS.AES.decrypt(cachedStr, 'clave-super-secreta').toString(CryptoJS.enc.Utf8);
      local = JSON.parse(decrypted) ?? [];
    } catch {
      local = [];
    }
  }

  const remote = await firstValueFrom(this.getData(identity.gymId)) ?? [];

  const localLatest = local.length
    ? local.reduce((acc, cur) =>
        acc.updatedAt && cur.updatedAt && cur.updatedAt > acc.updatedAt ? cur : acc
      )
    : undefined;

  const remoteLatest = remote.length
    ? remote.reduce((acc, cur) =>
        acc.updatedAt && cur.updatedAt && cur.updatedAt > acc.updatedAt ? cur : acc
      )
    : undefined;

  const isRemoteNewer =
    !localLatest || !localLatest.updatedAt ||
    (remoteLatest?.updatedAt && remoteLatest.updatedAt > localLatest.updatedAt);

  const isLengthDifferent = remote.length !== local.length;

  if (isRemoteNewer || isLengthDifferent) {
    const encryptedRemote = CryptoJS.AES.encrypt(JSON.stringify(remote), 'clave-super-secreta').toString();
    await localforage.setItem(key, encryptedRemote);
    console.log('🔄 Se actualizó la caché de miembros desde backend');
    return remote;
  }

  console.log('✅ Miembros locales actualizados');
  return local;
}


}  