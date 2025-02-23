import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plan } from './plan.model';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private graphqlUrl = 'http://localhost:3000/graphql'; // 🔹 Reemplázalo con tu API real

  constructor(private http: HttpClient) {}

  getPlansByGymId(gymId: number): Observable<{ data: { plansByGym: Plan[] } }> {
    return this.http.post<{ data: { plansByGym: Plan[] } }>(this.graphqlUrl, {
      query: `
        query GetPlansByGym($gymId: Int!) {
          plansByGym(gymId: $gymId) {  
            id
            name
            actived
            price
            createdAt
            updatedAt
            gymId
          }
        }
      `,
      variables: { gymId }
    });
  }
  
}
