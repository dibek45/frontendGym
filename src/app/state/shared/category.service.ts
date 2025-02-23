import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Category } from './category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/GRAPHQL'; // URL del endpoint GraphQL

  constructor(private http: HttpClient) {}

  /**
   * Obtener categorías filtradas por gymId (opcional)
   * @param gymId Identificador del gym (opcional)
   * @returns Observable de la lista de categorías
   */
  getCategories(gymId?: number): Observable<Category[]> {
    const query = `
      query GetAllCategories($gymId: Float) {
        getAllCategories(gymId: $gymId) {
          id
          name
          description
          gymId
        }
      }
    `;

    const variables = { gymId };

    // Extraer `getAllCategories` de la respuesta
    return this.http.post<{ data: { getAllCategories: Category[] } }>(this.apiUrl, {
      query,
      variables
    }).pipe(
      map(response => response.data.getAllCategories) // Aquí extraemos directamente las categorías
    );
  }

  /**
   * Agregar una nueva categoría
   * @param category Objeto de tipo Category
   * @returns Observable de la categoría creada
   */
  addCategory(category: Category, gymId: number, description: string): Observable<Category> {
    const mutation = `
      mutation CreateCategory($name: String!, $description: String!, $gymId: Float!) {
        createCategory(name: $name, description: $description, gymId: $gymId) {
          id
          name
          description
          gymId
        }
      }
    `;
  
    const variables = {
      name: category.name,
      description: description,
      gymId: gymId
    };
  
    return this.http.post<Category>(this.apiUrl+'/graphql', { query: mutation, variables });


  
  }
  
}
