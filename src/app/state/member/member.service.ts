import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MemberModel } from 'src/app/core/models/member.interface';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'src/app/shared/notification.service';
import { SpeechService } from 'src/app/shared/speech.service';
import { environment } from 'src/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private graphqlEndpoint =       environment.apiUrl
  ; // Reemplaza con tu endpoint GraphQL

  constructor(private http: HttpClient, 
    private _notification:NotificationService,
    private speechService: SpeechService
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
      this.http.post<any>('http://localhost:3000/graphql', {
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



}  