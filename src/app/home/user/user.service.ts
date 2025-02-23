import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MemberModel } from 'src/app/core/models/member.interface';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'src/app/shared/notification.service';
import { SpeechService } from 'src/app/shared/speech.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private graphqlEndpoint = 'http://localhost:3000/graphql'; // Reemplaza con tu endpoint GraphQL

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
          name, 
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
}  