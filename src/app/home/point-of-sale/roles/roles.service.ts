import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = 'http://localhost:3000/graphql'; // Ajusta la URL según el backend

  constructor(private http: HttpClient) {}

  getRoles(): Observable<any> {
    return this.http.post(this.apiUrl, {
      query: `query { roles { id name permissions { id name } } }`
    });
  }

  createRole(name: string): Observable<any> {
    return this.http.post(this.apiUrl, {
      query: `mutation { createRole(createRoleInput: { name: "${name}" }) { id name } }`
    });
  }

  updateRole(id: number, name: string): Observable<any> {
    return this.http.post(this.apiUrl, {
      query: `mutation { updateRole(updateRoleInput: { id: ${id}, name: "${name}" }) { id name } }`
    });
  }

  deleteRole(id: number): Observable<any> {
    return this.http.post(this.apiUrl, {
      query: `mutation { deleteRole(id: ${id}) }`
    });
  }
}
