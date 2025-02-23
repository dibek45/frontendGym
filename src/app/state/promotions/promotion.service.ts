import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  private readonly API_URL = 'http://localhost:3000/graphql'; // Replace with your GraphQL API URL

  constructor(private http: HttpClient) {}

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
}
